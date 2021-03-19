import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/Models/roles';
import { AuthServiceModule  } from "../../../../shared/auth-service/auth-service.module";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})

export class NavMenuComponent implements OnInit {
  classproperty: boolean = true;

  constructor(    
    private  _authService:  AuthServiceModule
    ) { }
  panelOpenState = false;
  ngOnInit(): void {
   
  }
  get isAuthorized() {
   
    return this._authService.isAuthorized();
  }
  get isAdmin() {
   
    return this._authService.hasRole(Role.Admin);
  }
  get isDistributor() {
    
    return this._authService.hasRole(Role.Distributor);
  }
 
}
