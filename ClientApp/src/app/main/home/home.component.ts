import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { SharedService } from "src/app/shared.service";
import { AuthServiceModule } from "src/shared/auth-service/auth-service.module";
import {
  CategoryList,
  CategoryServiceProxy,
  ProductServiceProxy,
  SPInput,
  CartDto,
  CartServiceProxy
} from "src/shared/service-proxies/service-proxies";
import { SweetAlertModule } from "src/shared/sweet-alert/sweet-alert.module";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OwlOptions } from "ngx-owl-carousel-o";
import { CookieService } from 'ngx-cookie-service';
import { Utils } from 'src/shared/common/Utils/Utils';
import { CartDetail } from 'src/app/Models/UserModel';
import { AppConstants } from "src/shared/app.constants";
import { IfStmt } from "@angular/compiler";
import { NotificationService } from "src/shared/common/notification/notification.service";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html"
})

export class HomeComponent implements OnInit {

  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
    previousLabel: "<<",
    nextLabel: ">>",
    screenReaderPaginationLabel: "Pagination",
    screenReaderPageLabel: "page",
    screenReaderCurrentLabel: `You're on page`,
  };
  config: any;
  input: SPInput;
  res: any[] = [];
  totalCount: number;
  totalLength: number = 10;
  categoryList: CategoryList[] = [];

  sliderData: any[] = [];
  records: any;
  cartData: CartDto;
  productIdList: CartDetail[] = [];
  cartDetail: CartDetail;
  constructor(
    private router: Router,
    private authService: AuthServiceModule,
    private _productService: ProductServiceProxy,
    private _alertService: SweetAlertModule,
    private _spinner: NgxSpinnerService,
    private _sharedService: SharedService,
    private modalService: NgbModal,
    private _categoryServiceproxy: CategoryServiceProxy,
    private _cartService: CartServiceProxy,
    private cookieService: CookieService,
    private notificationService: NotificationService

  ) {
    this.config = {
      itemsPerPage: 6,
      currentPage: 1,
      totalItems: this.res.length,
    };
  }

  customOptions: OwlOptions = {
    loop: false,
    autoplay: true,
    dots: true,
    autoHeight: true,
    autoWidth: true,
    touchDrag: true,
    pullDrag: true,
    nav: true,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  };

  customOptionsBelow: OwlOptions = {
    loop: false,
    autoplay: true,
    dots: true,
    autoHeight: true,
    autoWidth: true,
    nav: true,
    margin: 30,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 4,
      },
      1000: {
        items: 4,
      },
    },
  };

  ngOnInit(): void {
    this.cartData = new CartDto();
    this.getSliderData(3);
    //for name display
    if (this.authService.isAuthorized()) {
      let userName = document.getElementsByClassName("mat-button-wrapper");
      if (localStorage.getItem("LoginUserName") != null)
        userName[0].textContent =
          AppConstants.HelloMesg + localStorage.getItem("LoginUserName");
    } 
    this.res = this.getProducts("", "asc", 0, 5, "productName");
    this._sharedService.currentsidecategory.subscribe((result) => {
     
      this.records = result;
    });
    this.categoryListData();
  }

  onPageChange(event) {
    this.config.currentPage = event;
  }

  getProducts(filter, sortDirection, pageIndex, pageSize, sortColumn): any {
    this._spinner.show();
    this.input = new SPInput();
    this.input.filter = filter;
    this.input.pageNo = pageIndex;
    this.input.maxResultCount = pageSize;
    this.input.sorting = sortDirection;
    this.input.sortColumn = sortColumn;
    var userId = Number(localStorage.getItem("CurrenUserId"));
    this._productService
      .getAllProductList(userId, this.input)
      .subscribe((result) => {
        this.res = result.jsonObj.data;
        this._spinner.hide();
        return result.jsonObj;
      });
  }

  itemclick(event: any): void {
    var categoryName = event.args.innerText;
    categoryName.split("(")[0].trim();
    this.goToProduct(categoryName, event.args.id);
  }

  goToProduct(categoryName: string, categoryId: number) {
    categoryName = categoryName.replace(/ /g, "-");   
     this._sharedService.categoryId = categoryId;
     this._sharedService.categoryName = categoryName;
     localStorage.setItem("categoryId",categoryId.toString());
     this.router.navigate([ '/main/' + categoryName + '/list-product']);
  }

  getAdapter(source: any): any {
    // create data adapter and perform data
    return new jqx.dataAdapter(source, { autoBind: true });
  }

  categoryListData() {
    this._spinner.show();
    this._categoryServiceproxy.getCategoryForSideBar().subscribe((response) => {
      this.categoryList = response.jsonObj;
      var source = {
        datatype: "json",
        datafields: [
          { name: "id" },
          { name: "parentCategoryId" },
          { name: "categoryName" },
        ],
        id: "id",
        localdata: this.categoryList,
      };
      this.records = this.getAdapter(source).getRecordsHierarchy(
        "id",
        "parentCategoryId",
        "items",
        [{ name: "categoryName", map: "label" }]
      );
      this._sharedService.changeCategoryList(this.records);
      this._spinner.hide();
    });
  }

  productDetial(id) {
    this._spinner.show();
    this.router.navigate(["../../main/product-detail", id]);
    this._spinner.hide();
  }

  getSliderData(n: any) {
    this._spinner.show();
    this._productService.getLastNProduct(n).subscribe((result) => {
      this.sliderData = result.jsonObj;
     // console.log(this.sliderData);
      this._spinner.hide();
    });
  }
  
  addToCart(productId: any) {
    if(productId!=0 || productId!=undefined){

      this._sharedService.cartInsertion(productId);
    }
    else{
      this.notificationService.error(AppConstants.ErrorMesg,"error");
    }
  }
 

}
