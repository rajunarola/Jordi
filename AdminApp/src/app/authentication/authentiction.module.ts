import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AuthenticationRoutes } from './authentication.routing';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        RouterModule.forChild(AuthenticationRoutes),
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MaterialModule
    ]
})

export class AuthenticationModule { }

