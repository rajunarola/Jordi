import { Routes } from "@angular/router";
import { ConfirmEmailComponent } from "./confirm-email/confirm-email.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";



export const AuthenticationRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: "register", 
                component: RegisterComponent
            },
            {
                path: "login",
                component: LoginComponent
            },
            {
                path: "confirm-email/:email/:accessToken",
                component: ConfirmEmailComponent,
            },
            {
                path: "forget-password",
                component: ForgetPasswordComponent,
            },
            {
                path: "reset-password/:accessToken",
                component: ResetPasswordComponent
            }
        ]
    }
];
