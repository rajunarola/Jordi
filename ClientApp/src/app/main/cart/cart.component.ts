import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import { SharedService } from 'src/app/shared.service';
import { AppConstants } from 'src/shared/app.constants';
import { AuthServiceModule } from 'src/shared/auth-service/auth-service.module';
import { NotificationService } from 'src/shared/common/notification/notification.service';
import { CartServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  CartItemCount: number;
  CartProductData: any[] = [];
  totalPrice: number = 0;

  constructor(
    private _cartService: CartServiceProxy,
    private _spinner: NgxSpinnerService,
    private _sharedService: SharedService,
    private authService: AuthServiceModule,
    private notificationService: NotificationService,

  ) { }

  ngOnInit(): void {
    
    if (this.authService.isAuthorized()) {
    
      this._spinner.show();
      let userName = document.getElementsByClassName("mat-button-wrapper");
      if (localStorage.getItem('LoginUserName') != null) {
        userName[0].textContent = AppConstants.HelloMesg + localStorage.getItem('LoginUserName');
        this.cartItem();
        this._spinner.hide();
      }
    }  
  }
  cartItem() {
  
   let userId=Number(localStorage.getItem("CurrenUserId"));
    this._cartService.getCartItem(userId).subscribe(response => {
     
      this.CartProductData = response.jsonObj;
      this.CartItemCount = response.totalCount;
     this._sharedService.addCount(this.CartItemCount);
     debugger;
    //  this._sharedService.setCartCount =this.CartItemCount;
      
      //localStorage.setItem("cart",this.CartItemCount.toString());


          if(response.status==1){     
        if(this.CartItemCount!=0){        
        this.getTotal(this.CartProductData);
        
      }
    }
      else{
          //set total to 0        
          this.totalPrice=0;                
        }    
    });
  
}
  getTotal(cartData: any) {
    debugger;
    let tempPrice=0;
    
    if(cartData!=null)
    {
      cartData.forEach(element => {
        tempPrice += Number(element.totalCount);
        this.totalPrice=tempPrice;
      });
    }
    else{
      //for display empty cart
      this.CartItemCount=0
    }
  }

  qtyChange(row: any, currentValue: any) {
  
    this._cartService.editCartItem(row.id, currentValue).subscribe(response => {
      if (response.status == 1 && response.isSuccess == true) {

        this.notificationService.success(response.message, "success");
        this.cartItem();
      }
    });
  }

  removeCartItem(cartid: any) {
    debugger;
    this._cartService.delete(cartid).subscribe(response => {
      if (response.status == 1 && response.isSuccess == true) {
        this.notificationService.success(response.message, "success");      
        this.cartItem();
      }
    });
  }

}
