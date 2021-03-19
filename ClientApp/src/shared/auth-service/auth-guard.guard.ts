import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router,Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
//export class AuthGuardGuard implements CanActivate {
  export class AuthGuardGuard implements CanActivate, CanLoad {
  

//arti
constructor(
  private router: Router
) { }
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
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
 
}
