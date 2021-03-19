import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Role } from '../../app/Models/roles';
import { AuthServiceModule  } from "./auth-service.module";
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
@Injectable()
export class AuthGuardModule implements CanActivate, CanLoad  { 
  constructor(
    private router: Router,
    private authService: AuthServiceModule
 ) { }

 //arti
 canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // next: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot): boolean {

      if(localStorage.getItem('Email')!=null && localStorage.getItem('Password')!=null )  
          return true;
      
      else{
      this.router.navigate(['../auth/login']);   
      return false;
      }
  }
  //arti end 
  
// canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
   
//     if (!this.authService.isAuthorized()) {
       
//         this.router.navigate(['login']);
//         return false;
//     }
//     const roles = route.data.roles as Role[];
//     if (roles && !roles.some(r => this.authService.hasRole(r))) {
       
//         this.router.navigate(['error', 'not-found']);
//         return false;
//     }
//     return true;
// }
canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
   
    if (!this.authService.isAuthorized()) {
        return false;
    }
    const roles = route.data && route.data.roles as Role[];
    if (roles && !roles.some(r => this.authService.hasRole(r))) {
       
        return false;
    }
    return true;
}
}
