import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/Models/UserModel';
import { Role } from 'src/app/Models/Role';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AuthServiceModule { 
  public user: User;
  public currentRole:Role;
    isAuthorized() {
      if(Role.User==localStorage.getItem("CurrentRole"))
      {        
          this.user={ role: Role.User }
      }    
      
        return !!this.user;
    }
    hasRole(role: Role) {
        return this.isAuthorized() && this.user.role === role;
    }
    AssignRole(role: Role) {
     
      this.user = { role: role };
    }
    logout() {
      this.user = null;
    }
 }
