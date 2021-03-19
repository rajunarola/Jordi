import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppConstants } from 'src/shared/app.constants';
import { NotificationService } from 'src/shared/common/notification/notification.service';
import { CartDto, CartServiceProxy, CategoryList } from 'src/shared/service-proxies/service-proxies';

@Injectable()
export class SharedService {

    sidecategoryList = new BehaviorSubject<CategoryList[]>(null);
    currentsidecategory = this.sidecategoryList.asObservable();
    cartCount: BehaviorSubject<number>;
    simpleObservable = new Subject();
    simpleObservable$ = this.simpleObservable.asObservable();

    constructor(
        private _cartService: CartServiceProxy,
        private notificationService: NotificationService,
        private _spinner: NgxSpinnerService,
        private router: Router
    ) {
        this.cartCount = new BehaviorSubject<number>(0);
    }
    public renturnUrl: any;
    cartData: CartDto;
    productId: any;
    isLogout: boolean;
    userId = Number(localStorage.getItem("CurrenUserId"));
    categoryId;
    categoryName;


    changeCategoryList(list: CategoryList[]) {
        this.sidecategoryList.next(list);
    }
    addCartdata(productId: any, userId: number): any {
        this.cartData = new CartDto();

        if (productId != 0) {
            this.cartData.userId = userId;
            this.cartData.productId = productId;
            this.cartData.quantity = 1;
            this._cartService.save(this.cartData).subscribe(response => {
                if (response.status == 1) {
                    //  this.router.navigate([this.renturnUrl]);
                    this.notificationService.success(response.message, "success");
                    this._spinner.hide();
                    this.router.navigate([this.renturnUrl]);
                    return true;
                } else {
                    this.notificationService.error(AppConstants.ErrorMesg, "error");
                    return false;
                }

            });
        } else {
            this.notificationService.error(AppConstants.ErrorMesg, "error");
            return false;
        }

    }

    cartInsertion(productId: any) {
        this.cartData = new CartDto();
        this._spinner.show();
        this.renturnUrl = AppConstants.cartRedirection;
        this.cartData.userId = Number(localStorage.getItem("CurrenUserId"));
        this.cartData.productId = productId;
        this.cartData.quantity = 1;

        if (this.cartData.userId == 0) {
            this.productId = productId;
            this.router.navigate(['../auth/login']);
            this._spinner.hide();
        } else {
            this.addCartdata(productId, this.cartData.userId);
        }
    }
    set setCartCount(count: number) {
        this.cartCount.next(count);
    }
    // get getCartCount(): Observable<number> {
    //     debugger;
    //     return this.cartCount.asObservable();
    // }

    addCount(count:any) {
        debugger;
        this.simpleObservable.next(count);
        localStorage.setItem("cart",count);
      }
      removeCount(count:any) {
        
        this.simpleObservable.next(count);
      }
    getCount(){
      return this.simpleObservable.asObservable();
    }

    totalProductCount(count:any) {
        debugger;
        this.simpleObservable.next(count);
       
      }
    getProductCount(){
        return this.simpleObservable.asObservable();
    }

}