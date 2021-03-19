import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { CategoryComponent } from './category/category.component';
import { MainRoutes } from './main.routing';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavMenuComponent } from './layout/nav-menu/nav-menu.component';
import { MainComponent } from './main.component.';
import { MaterialModule } from 'src/app/material/material.module';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DistributorComponent } from './distributor/distributor.component';
import { UserComponent } from './user/user.component';
import { SweetAlertModule } from 'src/shared/sweet-alert/sweet-alert.module';
import { ProductComponent } from '../main/DistributorArea/product/product.component';
import { AddUpdateProductComponent } from '../main/DistributorArea/add-update-product/add-update-product.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
 import { NgxSpinnerModule } from "ngx-spinner";  
 import { MatTableExporterModule } from 'mat-table-exporter';

@NgModule({
    declarations: [
        CategoryComponent,
        HeaderComponent,
        FooterComponent,
        NavMenuComponent,
        MainComponent,
        DashboardComponent,
        DistributorComponent,
        UserComponent,
        ProductComponent,
        AddUpdateProductComponent,
        ManageProductComponent 

    ],
   
    imports: [
        RouterModule.forChild(MainRoutes),
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        SweetAlertModule,
       NgxSpinnerModule,
       MatTableExporterModule
        
    ],
    bootstrap: [MainComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class MainModule { }

