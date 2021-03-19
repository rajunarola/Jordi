import { Routes } from "@angular/router";
import { HomeComponent } from "./main/home/home.component";

export const AppRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: '/main/home',
                pathMatch: 'full'
              },
            {
                
                path: 'main',
                loadChildren: () => import('./main/main.module').then(m => m.MainModule)
            },
            {   
                path: 'auth',
                loadChildren: () => import('./Authentication/authentication.module').then(m => m.AuthenticationModule)
            },
            {
                
                path: 'user-dashboard',
                loadChildren: () => import('./user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule),
                data: {title: 'Dashboard'} //arti
            },
            {
                path: '**', 
                component: HomeComponent
            } 
        ]
    }
];