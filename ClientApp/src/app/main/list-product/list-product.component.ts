import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/shared.service';
import { AuthServiceModule } from 'src/shared/auth-service/auth-service.module';
import { NotificationService } from 'src/shared/common/notification/notification.service';
import { CartServiceProxy, CategoryServiceProxy, ProductServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { SweetAlertModule } from 'src/shared/sweet-alert/sweet-alert.module';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {
$categoryId:number;
tempStr:string;
urlStr:string;

  constructor( private router: Router,
    private authService: AuthServiceModule,
    private _productService: ProductServiceProxy,
    private _alertService: SweetAlertModule,
    private _spinner: NgxSpinnerService,
    private _sharedService: SharedService,
    private modalService: NgbModal,
    private _categoryServiceproxy: CategoryServiceProxy,
    private _cartService: CartServiceProxy,
    private cookieService: CookieService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {  
   
    this.$categoryId=Number(localStorage.getItem("categoryId"));
    this.getProduct(this.$categoryId);
  }
  getProduct(categoryId:number){

  }

}
