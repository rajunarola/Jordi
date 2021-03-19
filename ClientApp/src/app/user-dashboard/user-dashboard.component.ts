import { Component, OnInit } from '@angular/core';
import { AuthServiceModule } from 'src/shared/auth-service/auth-service.module';
import { Role } from '../Models/Role';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  constructor(private  _authService:  AuthServiceModule) { 
    
  }

  ngOnInit(): void {
  }
  get isAuthorized() {
   
    return this._authService.isAuthorized();
  }
  get isUser() {
    return this._authService.hasRole(Role.User);
  }
  
 
}
