import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddUpdateProductComponent } from './product/add-update-product/add-update-product.component';
import { ListProductComponent } from './product/list-product/list-product.component';
import { RouterModule } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlertModule } from 'src/shared/sweet-alert/sweet-alert.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewProductComponent } from './product/view-product/view-product.component';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [
     DashboardComponent,
      AddUpdateProductComponent,
      ListProductComponent,
      ViewProductComponent,
      
    
      ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SweetAlertModule,
    NgxPaginationModule,
    CarouselModule,
    RouterModule.forChild(UserDashboardRoutingModule)

  ],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA],
})


export class UserDashboardModule {


 }
