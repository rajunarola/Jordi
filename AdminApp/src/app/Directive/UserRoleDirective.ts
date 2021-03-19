import { Directive, NgModule, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthServiceModule } from 'src/shared/auth-service/auth-service.module';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
@Directive({ selector: '[appUser]'})

export class UserRoleDirective implements OnInit {
  constructor(
      private templateRef: TemplateRef<any>,
      private authService: AuthServiceModule,
      private viewContainer: ViewContainerRef
  ) { }

  ngOnInit() {
   
      const hasAccess = this.authService.isAuthorized();

      if (hasAccess) {
       

          this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
       

          this.viewContainer.clear();
      }
  }
}
