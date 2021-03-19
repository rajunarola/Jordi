import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from 'src/shared/auth-service/auth-guard.guard';
import { HomeComponent } from '../main/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddUpdateProductComponent } from './product/add-update-product/add-update-product.component';
import { ListProductComponent } from './product/list-product/list-product.component';
import { ViewProductComponent } from './product/view-product/view-product.component';
import { UserDashboardComponent } from './user-dashboard.component';

//const routes: Routes = [];
debugger;

export const  UserDashboardRoutingModule:Routes = [
{
  
  path: '',
        children: [
            // {
            //     path: "home",
            //     canActivate: [AuthGuardGuard],
            //     component: HomeComponent
            // },
            // {
            //     path: "about-us",
            //     canActivate: [AuthGuardGuard],
            //     component: AboutUsComponent
            // },
            {
                path: "dashboard",
                canActivate: [AuthGuardGuard],
                component: DashboardComponent,
                data: {title: 'Dashboard'} //arti
            },
            {
                path: "list-product",
                canActivate: [AuthGuardGuard],
                component: ListProductComponent,
                data: {title: 'My Product'} //arti
            },
            {
                path: "add-update-product/:id",
                canActivate: [AuthGuardGuard],
                component: AddUpdateProductComponent,
                data: {title: 'Add Product'} //arti
            },
            {
                path: "view-product/:id",
                canActivate: [AuthGuardGuard],
                component: ViewProductComponent,
                data: {title: 'View Product'} //arti
            }
        ]

}

];
  
 
