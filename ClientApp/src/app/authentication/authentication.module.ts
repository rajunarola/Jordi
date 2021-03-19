import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { AuthenticationRoutes } from './authentication.routing';
import { LoginComponent } from './login/login.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
 import { CustomCommonModule } from '../../shared/common/common.module';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    ConfirmEmailComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    CustomCommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})

export class AuthenticationModule { }
