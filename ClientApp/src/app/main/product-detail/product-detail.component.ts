import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { SharedService } from 'src/app/shared.service';
import { AppConstants } from 'src/shared/app.constants';
import { NotificationService } from 'src/shared/common/notification/notification.service';
import { CategoryDto, CategoryServiceProxy, DropDownDto, ProductDto, ProductServiceProxy, UserDto, UserServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { SweetAlertModule } from 'src/shared/sweet-alert/sweet-alert.module';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productDto: ProductDto;
  productForm: FormGroup;
  productId$: number;
  lblProductName: string;
  lblPrice: number;
  lblDesc: string;
  lblCategory: string;
  lblId: number;
  categoryDto: CategoryDto;
  imageRes: string[] = [];
  imageDeleteFrom: FormGroup;
  imageurls = [];
  base64String: string;
  name: string;
  imagePath: string;
  dropDownDto: DropDownDto[] = [];
  parentCategory: DropDownDto[] = [];
  filteredCategory: Observable<DropDownDto[]>;
  filtereddistributor: Observable<DropDownDto[]>;
  myThumbnail:string;
  myFullresImage:string;
  mainImg:string;
  zoomImage:string;
  constructor(private _alertService: SweetAlertModule,
    private router: Router,
    private http: HttpClient,
    private _productService: ProductServiceProxy,
    private _categoryService: CategoryServiceProxy,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _userService: UserServiceProxy,
    private activatedRoute: ActivatedRoute,
    private _spinner: NgxSpinnerService,
    private _sharedService:SharedService,
    private notificationService:NotificationService) { }

  ngOnInit(): void {
    this._spinner.show();
    this.productDto = new ProductDto();
    const category = new CategoryDto();
    this.loadCategory(category);
    this.GetParentCategory();
    this._spinner.hide();
    const user = new UserDto();
    

    this.myThumbnail="https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg";
    this.myFullresImage="https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg";
    this.activatedRoute.params.subscribe(params => {
      this.productId$ = params.id;

      if (this.productId$ != 0) {
        this._productService.getById(this.productId$)
          .subscribe((result) => {
            this.loadProduct(result.jsonObj);
          })
      }
    });

  }
  loadCategory(_category: CategoryDto, fromService: boolean = false) {
    // debugger;
    if (!_category) {
      // this.goBack('');
    }
    this.categoryDto = _category;
    this.initDropDown();
    if (fromService) {
      this.cdr.detectChanges();
    }
  }
  loadProduct(_product: ProductDto, fromService: boolean = false) {
    // debugger;
    if (!_product) {
      // this.goBack('');
    }
    //#region image load (edit)
    debugger;
    var filesAmount = _product.fileName.length;
    for (let i = 0; i < filesAmount; i++) {
      // debugger;

      this.imageurls.push({ base64String: _product.fileName, });
      this.imageRes.push(_product.fileName[i]);
      this.mainImg= this.imageRes[0];
      console.log( this.mainImg);

    }

    //#endregion
    this.productDto = _product;
    this.lblProductName = this.productDto.productName;
    this.lblDesc = this.productDto.producDescription;
    this.lblPrice = this.productDto.price;
    this.lblId = this.productDto.id;
    this.GetParentCategory(_product.categoryId);
    this.initDropDown();
    if (fromService) {
      this.cdr.detectChanges();
    }
  }
  private _filter(name: string): DropDownDto[] {
    // debugger;
    const filterValue = name.toLowerCase();
    // this.checkCategory(name);
    return this.parentCategory.filter(option => option.label.toLowerCase().includes(filterValue));
  }
  GetParentCategory(id?) {
    // debugger;
    this._categoryService.categoryDropDown(id).subscribe(result => {
      this.dropDownDto = result;
      // debugger;
      if (id != null || id != undefined || id != 0) {

        this.dropDownDto.forEach(data => {
          this.parentCategory = new Array();
          this.parentCategory.push(data);

          this.filteredCategory = this.productForm.controls.parentCategory.valueChanges.pipe(
            startWith({} as DropDownDto),
            map((category) => (category && typeof category === "object" ? category.label : category)),
            map((desc: string) => (desc ? this._filter(desc) : this.parentCategory.slice())),
            tap(() => this.productForm.controls.parentCategory.setValue(this.parentCategory[0].label))
          );
          this.lblCategory = this.parentCategory[0].label;

        });
      }
    });

  }
  createForm() {
    // debugger;
    this.productForm = new FormGroup({
      productName: new FormControl({}),
      price: new FormControl({}),
      description: new FormControl({}),
      parentCategoryId: new FormControl({}),
      productImage: new FormControl({}),
    })
    debugger
    this.productForm = this._formBuilder.group({

      id: [this.productDto.id],
      parentCategoryId: [this.productDto.categoryId],
      price: [this.productDto.price],
      productName: [this.productDto.productName],
      parentCategory: [""],
      description: [this.productDto.producDescription],
      productImage: [this.productDto.fileName]
    });
  }
  private initDropDown() {
    this.createForm();
  }
  //#region  Owl carousal
  // customOptions: OwlOptions = {
  //   loop: false,
  //   autoplay: true,
  //   dots: false,
  //   autoHeight: true,
  //   autoWidth: true,
  //   responsive: {
  //     0: {
  //       items: 4,
  //     },
  //     600: {
  //       items: 4,
  //     },
  //     1000: {
  //       items: 4,
  //     }
  //   }
  // }
  //#endregion

 
  addToCart(productId: any) {
    if(productId!=0 || productId!=undefined){

      this._sharedService.cartInsertion(productId);
    }
    else{
      this.notificationService.error(AppConstants.ErrorMesg,"error");
    }
  }
  changeImage(img:any){
      this.mainImg=img;
  }  
}
