import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecurityContext } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { ProductServiceProxy, UserServiceProxy, CategoryServiceProxy, CommonDto, CommonSpParameterInputDto, DropDownDto, CategoryDto, UserDto, ProductDto } from 'src/shared/service-proxies/service-proxies';
import { SweetAlertModule } from 'src/shared/sweet-alert/sweet-alert.module';
import swal from 'sweetalert2';
import { AppConstants } from 'src/shared/app.constants';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  hasFormErrors = false;
  productForm: FormGroup;
  dropDownDto: DropDownDto[] = [];
  parentCategory: DropDownDto[] = [];
  filteredCategory: Observable<DropDownDto[]>;
  filtereddistributor: Observable<DropDownDto[]>;
  categoryDto: CategoryDto;
  productDto: ProductDto;
  distributor: DropDownDto[] = [];
  userDto: UserDto;
  filesData: any[] = [];
  isImageError: boolean;
  imageRes: string[] = [];
  imageDeleteFrom: FormGroup;
  imageurls = [];
  base64String: string;
  name: string;
  imagePath: string;
  productId$: number;
  str: string;
  lblProductName: string;
  lblPrice: number;
  lblDesc: string;
  lblCategory: string;
  lblId: number;


  constructor(private _alertService: SweetAlertModule,
    private router: Router,
    private http: HttpClient,
    private _productService: ProductServiceProxy,
    private _categoryService: CategoryServiceProxy,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _userService: UserServiceProxy,
    private activatedRoute: ActivatedRoute,
    private _spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this._spinner.show();
    this.productDto = new ProductDto();
    const category = new CategoryDto();
    this.loadCategory(category);
    this.GetParentCategory();
    this._spinner.hide();
    const user = new UserDto();
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
  //#region Category Dropdown
  onCategorySelect(id) {
    // // debugger;
    this.productForm.controls["parentCategoryId"].setValue(id);
  }

  listProduct() {
    this.router.navigate(['/user-dashboard/list-product']);
  }
  private _filter(name: string): DropDownDto[] {
    // // debugger;
    const filterValue = name.toLowerCase();
    // this.checkCategory(name);
    return this.parentCategory.filter(option => option.label.toLowerCase().includes(filterValue));
  }
  loadCategory(_category: CategoryDto, fromService: boolean = false) {
    // // debugger;
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
    // // debugger;
    if (!_product) {
      // this.goBack('');
    }
    //#region image load (edit)
    var filesAmount = _product.fileName.length;
    for (let i = 0; i < filesAmount; i++) {
      // // debugger;

      this.imageurls.push({ base64String: _product.fileName, });
      this.imageRes.push(_product.fileName[i]);
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
  GetParentCategory(id?) {
    // // debugger;
    this._categoryService.categoryDropDown(id).subscribe(result => {
      this.dropDownDto = result;
      // // debugger;
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
  //#endregion
  createForm() {
    // // debugger;
    this.productForm = new FormGroup({
      productName: new FormControl({}),
      price: new FormControl({}),
      description: new FormControl({}),
      parentCategoryId: new FormControl({}),
      productImage: new FormControl({}),
    })
    this.productForm = this._formBuilder.group({

      id: [this.productDto.id],
      parentCategoryId: [this.productDto.categoryId, [Validators.required]],
      price: [this.productDto.price, [Validators.required, Validators.pattern("^[0-9.]+")]],
      productName: [this.productDto.productName, [Validators.required, Validators.pattern("^[a-zA-Z0-9 ]+")]],
      parentCategory: [""],
      description: [this.productDto.producDescription, [Validators.required, , Validators.maxLength(300)]],
      productImage: [this.productDto.fileName, [Validators.required]]
    });
  }
  private initDropDown() {
    this.createForm();
  }
  //#region  file Upload

  onSelectFile(event) {
    // // debugger;
    if (event.target.files[0].type == "image/jpeg" || event.target.files[0].type == "image/png") {
      this.isImageError = false;
      if (event.target.files && event.target.files[0]) {
        // // debugger
        this.productForm.controls.productImage.setErrors(null);


        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.imageurls.push({ base64String: event.target.result, });
            this.imageRes.push(event.target.result);
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }

    }
  }

  //#endregion

  editProduct(id: any) {
    this.router.navigate(['/user-dashboard/add-update-product', id]);
  }

  //#region  Owl carousal
  customOptions: OwlOptions = {
    loop: false,
    autoplay: true,
    dots: true,
    autoHeight: true,
    autoWidth: true,
    nav: true,
    touchDrag: true,
    pullDrag: true,
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
      }
    }
  }
  //#endregion
}
