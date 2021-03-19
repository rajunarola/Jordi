import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceModule } from 'src/shared/auth-service/auth-service.module';
import { Role } from './Models/roles';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AdminApp';
  constructor(private router: Router, private authService: AuthServiceModule) { }
  // get isAuthorized() {
  //   debugger;
  //   return this.authService.isAuthorized();
  // }
  // get isAdmin() {
  //   debugger;
  //   return this.authService.hasRole(Role.Admin);
  // }
  // logout() {
  //   debugger;
  //   this.authService.logout();
  //   this.router.navigate(['login']);
  // }
}
