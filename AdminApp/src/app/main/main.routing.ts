import { Routes } from "@angular/router";
import { CategoryComponent } from './category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main.component.';
import { DistributorComponent  } from "./distributor/distributor.component";
import { UserComponent  } from "./user/user.component";
import { ProductComponent } from '../main/DistributorArea/product/product.component';
import { AddUpdateProductComponent } from '../main/DistributorArea/add-update-product/add-update-product.component';
import { AuthGuardModule } from '../../../src/shared/auth-service/auth-guard.module';
import { Role } from '../Models/roles';
import { ManageProductComponent } from './manage-product/manage-product.component';


export const MainRoutes: Routes = [
    {
        path: '',
        component:MainComponent,
        children: [
            {
                path:'',
                canActivate: [AuthGuardModule],
                component:DashboardComponent
            },
            {
                path: "category",
                canActivate: [AuthGuardModule],
                component: CategoryComponent
            },
            {
                path: "manage-product",
                canActivate: [AuthGuardModule],
                component: ManageProductComponent
            },
            {
                path: "DistributorArea/product",
                 canActivate: [AuthGuardModule],
                component: ProductComponent
            },          
            {
                path: "distributor",
                canActivate: [AuthGuardModule],
                component: DistributorComponent
            },
            {
                path: "user",
                canActivate: [AuthGuardModule],
                component: UserComponent
            },           
            {
                path:"add-product/:id",
                canActivate: [AuthGuardModule],
                component:AddUpdateProductComponent
            },
            {
                path:"dashboard",
                canActivate: [AuthGuardModule],
                component:DashboardComponent
            },
            {
                path: 'DistributorArea',
                canLoad: [AuthGuardModule],
                canActivate: [AuthGuardModule],
                data: {
                  roles: [
                    Role.Distributor,
                  ]
                },
                loadChildren: () => import('./DistributorArea/product/product.component').then(m => m.ProductComponent)
              },
        ]
    }
];

