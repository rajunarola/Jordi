import { Routes } from "@angular/router";
import { AboutUsComponent } from "./about-us/about-us.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { HomeComponent } from "./home/home.component";
import {AuthGuardGuard  } from '../../../src/shared/auth-service/auth-guard.guard';
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { ListProductComponent } from "./list-product/list-product.component";
import { CartComponent } from './cart/cart.component';


export const MainRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: "home",
                component: HomeComponent,
                data: {title: 'home'} //arti
            },
            {
                path: "about-us",               
                component: AboutUsComponent,
                 data: {title: 'About Us'} //arti
            },
            {
                path: "contact-us",               
                component: ContactUsComponent,
                data: {title: 'Contact US'} //arti
            },
            {
                path: "product-detail/:id",
               // canActivate: [AuthGuardGuard],
                component: ProductDetailComponent,
                data: {title: 'Product Detail'} //arti
            },
            {
                path: ":category/list-product",
                canActivate: [AuthGuardGuard],
                component: ListProductComponent,
                data: {title: 'List Product'} //arti
            },
            {
                path: "cart",
                canActivate: [AuthGuardGuard],
                component: CartComponent,
                data: {title: 'Cart'} //arti
            }
            // {
            //     path: "add-update-product/:id",
            //     canActivate: [AuthGuardGuard],
            //     component: AddUpdateProductComponent
            // }

        ]
    }
];
