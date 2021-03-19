import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainRoutes } from './main.routing';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { NgxSpinnerModule } from "ngx-spinner";  
import { SweetAlertModule } from 'src/shared/sweet-alert/sweet-alert.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import{ jqxMenuModule} from 'jqwidgets-ng/jqxmenu';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ListProductComponent } from './list-product/list-product.component';           
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CartComponent } from './cart/cart.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { BrowserModule , Title} from '@angular/platform-browser';  

@NgModule({
  declarations: [
    HomeComponent,
    AboutUsComponent,
    ContactUsComponent,    
    ProductDetailComponent,
    ListProductComponent,
    CartComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SweetAlertModule,
    MaterialModule,
    NgxPaginationModule,
    jqxMenuModule,
    CarouselModule,
    NgxImageZoomModule,
    RouterModule.forChild(MainRoutes)
  ],
  providers: [Title] //Arti
})

export class MainModule { }
