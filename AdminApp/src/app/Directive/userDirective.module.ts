import { Directive, Input, NgModule, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthServiceModule } from 'src/shared/auth-service/auth-service.module';
import { Role } from '../Models/roles';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
@Directive({ selector: '[appUserRole]'})

export class UserDirectiveModule implements OnInit {
  constructor(
      private templateRef: TemplateRef<any>,
      private authService: AuthServiceModule,
      private viewContainer: ViewContainerRef
  ) { }
  userRoles: Role[];
  @Input() 
  set appUserRole(roles: Role[]) {
   

      if (!roles || !roles.length) {
          throw new Error('Roles value is empty or missed');
      }
      this.userRoles = roles;
  }
  ngOnInit() {
   
      let hasAccess = false;
      if (this.authService.isAuthorized() && this.userRoles) {
          hasAccess = this.userRoles.some(r => this.authService.hasRole(r));
      }
      if (hasAccess) {
          this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
          this.viewContainer.clear();
      }
  }
}
