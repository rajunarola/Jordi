import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
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
@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.css']
})
export class AddUpdateProductComponent implements OnInit {
  hasFormErrors = false;
  productForm: FormGroup;
  dropDownDto: DropDownDto[] = [];
  parentCategory: DropDownDto[] = [];
  filteredCategory: Observable<DropDownDto[]>;
  filtereddistributor: Observable<DropDownDto[]>;
  categoryDto: CategoryDto;
  productDto: ProductDto;
  distributor: DropDownDto[] = [];
  userList: UserDto[] = [];
  userDto: UserDto;
  errorCategory: boolean;
  isExist: boolean;
  filesData: any[] = [];
  isImageError: boolean=false;
  imageRes: string[] = [];
  imageDeleteFrom: FormGroup;
  imageurls = [];
  base64String: string;
  name: string;
  imagePath: string;
  productId$: number;
  str: string;

  //productResponse:any;
  product_validation_messages = {
    'productName': [
      { type: 'required', message: 'Product Name is required' },
      { type: 'pattern', message: 'Product Name must contain only numbers and letters' },
      { type: 'maxlength', message: 'Product Name cannot be more than 100 characters long' },

    ],
    'price': [
      { type: 'required', message: 'Price is required' },
      { type: 'pattern', message: 'Price must contain only numbers' },
      { type: 'maxlength', message: 'Enter Valid input for price' },

    ],
    'description': [
      { type: 'required', message: 'Description is required' },
      { type: 'pattern', message: 'Description must contain only numbers' },
      { type: 'maxlength', message: 'Description cannot be more than 300 characters long' },
    ],
    'productImage': [
      { type: 'required', message: 'Image is required' }
    ],


  }

  constructor(private _alertService: SweetAlertModule,
    private router: Router,
    private http: HttpClient,
    private _productService: ProductServiceProxy,
    private _categoryService: CategoryServiceProxy,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _userService: UserServiceProxy,
    private activatedRoute: ActivatedRoute,
    private _spinner:NgxSpinnerService



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
            //this.GetParentCategory();
          });   
        
      }
      else{
        debugger;
        this.imageurls=[];
        this.imageRes=[];
        
        this.productForm = this._formBuilder.group({

          id: [""],
          parentCategoryId: ["", [Validators.required]],
          price: ["", [Validators.required, Validators.pattern("^[0-9.]+"),Validators.minLength(0),Validators.maxLength(8)]],
          productName: ["", [Validators.required, Validators.pattern("^[a-zA-Z0-9 ]+"),Validators.maxLength(100)]],
          parentCategory: [""],
          description: ["", [Validators.required, , Validators.maxLength(300)]],
          productImage: ["", [Validators.required]]
        
        });
      } 
    });   

  }
  //#region Category Dropdown
  onCategorySelect(id) {
    debugger;
    this.productForm.controls["parentCategoryId"].setValue(id);
  }

  //suggestion
  private GetFilteredParentCategory() {
    debugger;
    this.filteredCategory = this.productForm.controls.parentCategory.valueChanges.pipe(
      startWith({} as DropDownDto),
      map((category) => (category && typeof category === "object" ? category.label : category)),
      map((desc: string) => (desc ? this._filter(desc) : this.parentCategory.slice()))

    );
  }

  private _filter(name: string): DropDownDto[] {
    debugger;
    const filterValue = name.toLowerCase();
    this.checkCategory(name);
    return this.parentCategory.filter(option => option.label.toLowerCase().includes(filterValue));
  }
  loadCategory(_category: CategoryDto, fromService: boolean = false) {
    debugger;
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
    debugger;
    if (!_product) {
      // this.goBack('');
    }
    //#region image load (edit)
    var filesAmount = _product.fileName.length;
    for (let i = 0; i < filesAmount; i++) {
      debugger;

      this.imageurls.push({ base64String: _product.fileName, });
      this.imageRes.push(_product.fileName[i]);
    }

    //#endregion
    this.productDto = _product;
    this.GetParentCategory(_product.categoryId);
    this.initDropDown();
    if (fromService) {
      this.cdr.detectChanges();
    }
  }
  GetParentCategory(id?) {
    debugger;
    this._categoryService.categoryDropDown(id).subscribe(result => {
      this.dropDownDto = result;
      debugger;
      if (id == null || id == undefined || id == 0) {
        this.parentCategory = new Array();
        this.dropDownDto.forEach(data => {
          this.parentCategory.push(data);
          this.GetFilteredParentCategory();
        });
        //  this.productForm.controls.parentCategory.reset();
      }
      else {
        // this.categoryForm.controls.parentCategory.disable();
        this.dropDownDto.forEach(data => {
          this.parentCategory = new Array();
          this.parentCategory.push(data);
debugger;
          this.filteredCategory = this.productForm.controls.parentCategory.valueChanges.pipe(
            startWith({} as DropDownDto),
            map((category) => (category && typeof category === "object" ? category.label : category)),
            map((desc: string) => (desc ? this._filter(desc) : this.parentCategory.slice())),
            tap(() => this.productForm.controls.parentCategory.setValue(this.parentCategory[0].label))
          );

        });
      }
    });

  }
  //#endregion


  createForm() {
    debugger;
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
      price: [this.productDto.price, [Validators.required, Validators.pattern("^[0-9.]+"),Validators.minLength(0),Validators.maxLength(10)]],
      productName: [this.productDto.productName, [Validators.required, Validators.pattern("^[a-zA-Z0-9 ]+"),Validators.maxLength(100)]],
      parentCategory: [""],
      description: [this.productDto.producDescription, [Validators.required, , Validators.maxLength(300)]],
      productImage: [this.productDto.fileName, [Validators.required]]
    });
  }
  private initDropDown() {
    this.createForm();
  }
  OnSubmit() {

    this.hasFormErrors = false;
    const controls = this.productForm.controls;
    /** check form */
    if (this.productForm.invalid) {
      debugger;
      if(this.productForm.controls.parentCategoryId.status=="INVALID"){

        this.isExist = true;
      }else{
        this.isExist = false;
      }
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.hasFormErrors = true;

      return;
    }


    let editProductData = this.prepareProduct();
     if(editProductData.fileName.length!=0){

       this.addUpdateProduct(editProductData);
      }
      else{
       
          // debugger;
          // if (editProductData.fileName.length==0) {
          //   debugger;
          //   this.productForm.controls.productImage.setValidators([Validators.required]);
          // } else {
          //   this.productForm.controls.productImage.setValidators(null);
          // }
          // this.productForm.controls.productImage.updateValueAndValidity();
     
        //this.productForm.controls['productImage'].setValue(this.product_validation_messages.productImage);
      }
    // this.productForm.controls.productImage.setErrors(Validators.required);
    //this.productForm.get('productImage').hasError(Validators.required.toString());
    return;
  }

  private prepareProduct(): ProductDto {
    debugger;

    const controls = this.productForm.controls;
    const productResponse = new ProductDto();
    productResponse.id = Number((this.productId$ == 0) ? 0 : this.productId$);
    productResponse.distributorId = null;
    productResponse.userId = Number(localStorage.getItem("CurrenUserId"));
    productResponse.isActive = false;
    productResponse.isDelete = false;
    productResponse.productName = controls.productName.value;
    productResponse.producDescription = controls.description.value;
    productResponse.categoryId = controls.parentCategoryId.value;
    productResponse.price = Number(controls.price.value);
    productResponse.productUserId = Number(localStorage.getItem("CurrenUserId"));
    productResponse.fileName = this.imageRes;
    this.isExist = false;
    return productResponse;
  }
  addUpdateProduct(_input: ProductDto) {
    debugger;
    this._spinner.show();
    var str: string;
    this._productService.save(_input).subscribe(res => {
      if (_input.id == 0) {
        str = AppConstants.product + ' ' + AppConstants.addedSuccessfully;
      }
      else {
        str = AppConstants.product + ' ' + AppConstants.editedSuccessfully;

      }
      this._spinner.hide();
      swal.fire({
        title: AppConstants.product,
        text: str,
        icon: 'success',

        confirmButtonText: 'Ok',
      })
        .then((result) => {

          if (result.value) {
            this.router.navigate(['../user-dashboard/list-product']);

          } else {
            return false;
          }
        })
    });
  }

  checkCategory(categoryName: string): boolean {
    debugger;
    //let resultData:DropDownDto[];
    let resultData = this.parentCategory.filter(option => option.label.toLowerCase().includes(categoryName.toLowerCase()));

    if (resultData.length > 0) {

      this.isExist = false;
    }
    else {
      this.isExist = true;
    }

    return this.isExist;
  }
  //#region  file Upload


  removeImageEdit(i, imagepath) {
    debugger;
    this.imageDeleteFrom.value.id = i;
    this.imageDeleteFrom.value.ImagePath = imagepath;
  }

  removeImage(i) {
    debugger;
    this.imageurls.splice(i, 1);
    this.imageRes.splice(i, 1);
    //this.productForm.controls.productImage.setValidators([Validators.required]);
   // this.productForm.controls.productImage.updateValueAndValidity();

  }
  onSelectFile(event) {
    debugger;
    if (event.target.files[0].type == "image/jpeg" || event.target.files[0].type == "image/png") {
      this.isImageError = false;
      if (event.target.files && event.target.files[0]) {
        debugger
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

    } else {
      this.isImageError = true;
      //this.productForm.controls.productImage.setErrors(this.product_validation_messages.productImage.);

    }
  }
  flag: number = 0;
  categoryLoad(event) {  
    debugger;
    if (this.flag == 0) {
      this.GetParentCategory();     
      this.flag++;
    }
  }
  //#endregion

}