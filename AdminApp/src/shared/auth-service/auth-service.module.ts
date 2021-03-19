import { NgModule,Injectable, ɵConsole } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Role } from '../../app/Models/roles';
import { User } from 'src/app/Models/UserModel';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
@Injectable()
export class AuthServiceModule {
  
  public user: User;
  public currentRole:Role;
    isAuthorized() {
     
      if(Role.Admin==localStorage.getItem("CurrentRole"))
      {
        
          this.user={ role: Role.Admin }
      }
      else if (Role.Distributor==localStorage.getItem("CurrentRole")){
        this.user={ role: Role.Distributor }

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
