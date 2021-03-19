import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountServiceProxy, CartServiceProxy, CategoryList, CategoryServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { NotificationService } from 'src/shared/common/notification/notification.service';
import { SharedService } from 'src/app/shared.service';
import { AuthServiceModule } from 'src/shared/auth-service/auth-service.module';
import { AppConstants } from 'src/shared/app.constants';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {
  cartCount: number;
  CartItemCount: number;
  CartProductData: any[] = [];
  categoryDropdwonList: CategoryList[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _accountServiceProxy: AccountServiceProxy,
    private notificationService: NotificationService,
    private _sharedService: SharedService,
    private authService: AuthServiceModule,
    private _categoryServiceproxy:CategoryServiceProxy,
    private _cartService:CartServiceProxy) { }
  ngOnInit() {
    this.categoryDropdown();
    this.cartItem();
    if (this.authService.isAuthorized()) {
      let loginLbl = document.getElementsByClassName("user_name_sec")[0];
      loginLbl.classList.replace("user_name_sec", "user_name_sec_active");

      let userName = document.getElementsByClassName("mat-button-wrapper");
      if (localStorage.getItem('LoginUserName') != null) {
        userName[0].textContent = AppConstants.HelloMesg + localStorage.getItem('LoginUserName');

      }     
     
      let login = document.getElementsByClassName("login_button")[0];
      login.classList.replace("login_button", "user_name_sec");
    }
    else {
      let login = document.getElementsByClassName("nav-link")[0];
      login.classList.add("nav-link");
      login.classList.add("login_button");
    }
    debugger;
  }
  Logout() {

    this._accountServiceProxy.logout().subscribe(res => {
      if (!res.isSuccess) {
        this.notificationService.error(res.message, "error");
      } else {
        this._sharedService.isLogout = true;

        localStorage.removeItem('Email');
        localStorage.removeItem('Password');
        localStorage.removeItem('LoginUserName');
        localStorage.removeItem('CurrenUserId');
        this.router.navigate(['../auth/login']);
        //#region hide show login btn

        let body = document.getElementsByClassName('user_name_sec')[0];
        body.classList.remove("user_name_sec");

        let helloLbl = document.getElementsByClassName('user_name_sec_active')[0];
        helloLbl.classList.remove("user_name_sec_active");
        helloLbl.classList.add("user_name_sec");

        let loginLbl = document.getElementById('loginbtn');
        loginLbl.classList.add("login_button");

        //#endregion
      }
    });

  }
  productRedirect() {
    this.router.navigate(['../main/product']);
  }

  goToCart() {
    this.router.navigate(['../main/cart']);
  }
  categoryDropdown(){
    this._categoryServiceproxy.getParentCategory().subscribe((response) => {
      this.categoryDropdwonList = response.jsonObj;
      console.log(  this.categoryDropdwonList);
    });
   }
   cartItem() {
  
    let userId=Number(localStorage.getItem("CurrenUserId"));
     this._cartService.getCartItem(userId).subscribe(response => {
      
       this.CartProductData = response.jsonObj;
       this.CartItemCount = response.totalCount;
      this._sharedService.addCount(this.CartItemCount);
    
     });
  this._sharedService.getCount().subscribe(value=>{
    this.cartCount=Number(value);
   });
 }
 serchProduct(categoryId:any){
if(categoryId!=0)
{
//search by product name
}
else
{
//search by category 
}
 }
}
