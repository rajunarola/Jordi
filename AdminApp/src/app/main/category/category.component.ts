import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, Input, Output, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultValueAccessor, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { CategoryDto, CategoryServiceProxy, CommonDto, CommonSpParameterInputDto, DropDownDto } from 'src/shared/service-proxies/service-proxies';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { NotificationService } from 'src/shared/Notification/notification.service';
import { AppConstants } from 'src/shared/app.constant';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { SweetAlertModule } from 'src/shared/sweet-alert/sweet-alert.module';
import swal from 'sweetalert2';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Role } from 'src/app/Models/roles';
import { CustomValidation } from 'src/app/Directive/Validation';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
 
export class CategoryComponent implements OnInit, AfterViewInit {
  Role = Role;
  hasFormErrors = false;
  categoryForm: FormGroup;
  categoryDto: CategoryDto;
  ManageCategory: CommonDto;
  dropDownDto: DropDownDto[] = [];
  parentCategory: DropDownDto[] = [];
  filteredCategory: Observable<DropDownDto[]>;
  totalLength: number = 10;
  categoryId$: number;
  //#region datatable
  displayedColumns: string[] = ['CategoryName', 'IsActive', 'Id'];
  dataSource: CategoryDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') inputSearch: ElementRef;
  @ViewChild('closebutton') closebutton;
 visible:boolean;

  //#endregion
  category_validation_messages = {
    'categoryName': [
      { type: 'required', message: 'Category name is required' },
      { type: 'pattern', message: 'Category name must contain only numbers and letters' },
      { type: 'validCategoryName', message: 'Your categoryName has already been taken' }
    ],
    'parentCategory': [
      { type: 'required', message: 'Parent category is required' },
      { type: 'pattern', message: 'Enter a valid parent category' }
    ]
  }
  constructor(
    private _categoryServceProxy: CategoryServiceProxy,
    private router: Router,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private _alertService: SweetAlertModule,
    private _spinner:NgxSpinnerService

  ) { }
  panelOpenState = false;
  closeResult: string;


  ngOnInit(): void {
    //for datatable
    this.dataSource = new CategoryDataSource(this._categoryServceProxy,this._spinner);
    this.dataSource.getCategories('', 'asc', 0, 5);
    this.dataSource.lengthSubject.subscribe(res => {
      this.totalLength = res;
    });




    this.categoryDto = new CategoryDto();
    const category = new CategoryDto();
    this.loadCategory(category);
    this.GetParentCategory();
    //}
  }
  ngAfterViewInit(): void {

    // server-side search
    fromEvent(this.inputSearch.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadCategoryPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadCategoryPage())
      )
      .subscribe();
  }
  loadCategoryPage() {
    this.dataSource.getCategories(
      this.inputSearch.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }
  delete(id: any) {
    this.ManageCategory = new CommonDto();
    this.ManageCategory.id = id;
    this.ManageCategory.userId = Number(localStorage.getItem("CurrenUserId"));

    swal.fire({
      title: AppConstants.DeleteMesg,
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    })
      .then((result) => {

        if (result.value) {
          this._categoryServceProxy.delete(this.ManageCategory).subscribe(res => {
            this._alertService.alertWithSuccess(AppConstants.deleteTitle, AppConstants.Category + " " + AppConstants.deletedSuccessfully);
            this.loadCategoryPage();
          });
        } else if (result.dismiss === swal.DismissReason.cancel) {
          return false;
        }
      })
    return false;

  }
  edit(content: any, id: any) {

    this._categoryServceProxy.getById(id)
      .subscribe((result) => {
        this.loadCategory(result);
        this.GetParentCategory(id);
      });
    this.open(content);

  }
  
  //#region Insertion code

  open(content) {
   
    debugger;
    //Insertion time enable Autocomplte and reset the form 
    //this.categoryForm.reset();

    this.categoryForm.controls.parentCategory.enable();
    //Load Autocomplte on Add Category modal popup
    this.categoryDto = new CategoryDto();
    const category = new CategoryDto();
    this.loadCategory(category);
    this.GetParentCategory();
    let modelRef= this.modalService.open(content,{backdrop:'static'});
    modelRef.result.then((result) => {



      if (result == "save") {

      this.hasFormErrors = false;
        const controls = this.categoryForm.controls;
        this.categoryForm.controls.parentCategory.enable();
        let CategoryData = this.prepareCategory();
    
        /** check form */
        if (this.categoryForm.invalid) {
          Object.keys(controls).forEach(controlName =>
            controls[controlName].markAsTouched()
          );

          this.hasFormErrors = true;
          return;
        }
       

        return;
     }
     else {
       return false;
      }

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  closeModal(categoryName:any){
    debugger;
   // let isSuccess;
    this._categoryServceProxy.checkCategory(categoryName).subscribe((res) => {
      if(res.status==1) { 
        this.visible=false;
      //  isSuccess = true; 
        this.addUpdateCategory( this.prepareCategory());
        this.modalService.dismissAll();
      }
      else if (res.status == 0) {
       // isSuccess = false;
        this.hasFormErrors = true;
this.visible=true;
        //this.notificationService.success(AppConstants.Category +  " " + AppConstants.CategoryExist, "");
      } 
    });
    

    
    // if(isSuccess==true ){
      
    
    // }
    // else{
    //   // this.modalService.open(content,{backdrop:'static'});
     
    // }
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  createForm() {
//var temp= new CustomValidation(this._categoryServceProxy);
    this.categoryForm = new FormGroup({
      categoryName: new FormControl({}),
      displayOrder: new FormControl({}),
      parentCategoryId: new FormControl({}),
      isSpecial: new FormControl({}),
    })
    this.categoryForm = this._formBuilder.group({

      id: [this.categoryDto.id],
      parentCategoryId: [this.categoryDto.parentCategoryId],    
      categoryName: [this.categoryDto.categoryName, [Validators.required, Validators.pattern("^(?![0-9]*$)[a-zA-Z0-9]+$")]],

      displayOrder: [this.categoryDto.displayOrder],
      parentCategory: ["", Validators.pattern('^[A-Za-z> }]*$')],
      isSpecial: [this.categoryDto.isSpecial]
    });
  }

  loadCategory(_category: CategoryDto, fromService: boolean = false) {

    if (!_category) {
      // this.goBack('');
    }
    this.categoryDto = _category;
    this.initCategory();
    if (fromService) {
      this.cdr.detectChanges();
    }
  }
  private initCategory() {
    this.createForm();
  }

  GetParentCategory(id?) {


    this._categoryServceProxy.categoryDropDown(id).subscribe(result => {
      this.dropDownDto = result;
      debugger;
      if (id == null || id == undefined || id == 0) {
        this.parentCategory = new Array();
        this.dropDownDto.forEach(data => {
          this.parentCategory.push(data);
          this.GetFilteredParentCategory();
        });
        this.categoryForm.controls.parentCategory.reset();


      }
      else {
        this.categoryForm.controls.parentCategory.disable();
        this.dropDownDto.forEach(data => {
          this.parentCategory = new Array();
          this.parentCategory.push(data);

          this.filteredCategory = this.categoryForm.controls.parentCategory.valueChanges.pipe(
            startWith({} as DropDownDto),
            map((category) => (category && typeof category === "object" ? category.label : category)),
            map((desc: string) => (desc ? this._filter(desc) : this.parentCategory.slice())),
            tap(() => this.categoryForm.controls.parentCategory.setValue(this.parentCategory[0].label))
          );

        });
      }

    });

  }

  //suggestion
  private GetFilteredParentCategory() {

    this.filteredCategory = this.categoryForm.controls.parentCategory.valueChanges.pipe(
      startWith({} as DropDownDto),
      map((category) => (category && typeof category === "object" ? category.label : category)),
      map((desc: string) => (desc ? this._filter(desc) : this.parentCategory.slice()))

    );
  }

  private _filter(name: string): DropDownDto[] {
    const filterValue = name.toLowerCase();
    return this.parentCategory.filter(option => option.label.toLowerCase().includes(filterValue));
  }



  OnSubmit() {
    debugger;
    this.hasFormErrors = false;
    const controls = this.categoryForm.controls;
    /** check form */
    if (this.categoryForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    } debugger;

    let CategoryData = this.prepareCategory();
    this.addUpdateCategory(CategoryData);


    return;
  }

  private prepareCategory(): CategoryDto {

    const controls = this.categoryForm.controls;
    const categoryResponse = new CategoryDto();
    // categoryResponse.id = (this.categoryId$ == 0) ? 0 : this.categoryId$;
    categoryResponse.id = (this.categoryDto.id == undefined) ? 0 : this.categoryDto.id;
    categoryResponse.categoryName = controls.categoryName.value;
    //  categoryResponse.displayOrder = parseInt(controls.displayOrder.value);
    categoryResponse.displayOrder = 1;
    categoryResponse.isSpecial = (controls.isSpecial.value != null && controls.isSpecial.value != "") ? (Boolean(controls.isSpecial.value)) : false;
    categoryResponse.parentCategoryId = controls.parentCategoryId.value;
    categoryResponse.isActive = true;
    categoryResponse.isDelete = false;
    categoryResponse.userId = Number(localStorage.getItem("CurrenUserId"));
    return categoryResponse;
  }

  addUpdateCategory(_input: CategoryDto) {
    this._spinner.show();
    this._categoryServceProxy.save(_input).subscribe(() => {
      //      this.categoryForm.reset();
      this.notificationService.success("Category " + (_input.id != 0 ? AppConstants.editedSuccessfully : AppConstants.addedSuccessfully), "");
      this._spinner.hide();
      this.loadCategoryPage();
    });
  }

  onSelect(id) {

    this.categoryForm.controls["parentCategoryId"].setValue(id);
  }
  //#region datatable 

  onRowClicked(row) {
    //console.log(row);
  }
  toggle(id: any, activeStatus: boolean) {

    this.ManageCategory = new CommonDto();
    this.ManageCategory.id = id;
    this.ManageCategory.isActive = !activeStatus;
    this._categoryServceProxy.activeDeactiveCategory(this.ManageCategory).subscribe(res => {

      this._alertService.alertWithSuccess("Category ", (!activeStatus ? "Actived " : "Deactived ") + "successfully");
      this.loadCategoryPage();
    });
  }

  //#endregion






}
@Component({
  template: ''
})
export class CategoryDataSource implements DataSource<CategoryDto> {
  private CategorySubject = new BehaviorSubject<any>([]);
  public lengthSubject = new BehaviorSubject<any>(0);
  public length$ = this.lengthSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  input: CommonSpParameterInputDto;
  res: any[] = [];
  totalCount: number;
  constructor(private _categoryServceProxy: CategoryServiceProxy, private _spinner:NgxSpinnerService) { }

  connect(collectionViewer: CollectionViewer): Observable<CategoryDto[]> {
    return this.CategorySubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.CategorySubject.complete();
    this.loadingSubject.complete();
    this.lengthSubject.complete();
  }
  getCategories(filter, sortDirection, pageIndex, pageSize) {
 
    this.input = new CommonSpParameterInputDto();
    this.input.filter = filter;
    this.input.pageNo = pageIndex;
    this.input.maxResultCount = pageSize;
    this.input.sorting = sortDirection;
    this.loadingSubject.next(true);

    //return new Observable(observer => {
    this._categoryServceProxy.getAll(this.input).subscribe(result => {

      this.res = result.jsonObj.data;
      this.totalCount = result.jsonObj.dataCount;
      this.CategorySubject.next(this.res)
      this.loadingSubject.next(false);
      this.lengthSubject.next(this.totalCount);
   
      return result.jsonObj;

    });
  }

  loadAllCategories(filter = '',
    sortDirection = 'asc', pageIndex = 0, pageSize = 5) {
    this.loadingSubject.next(false);

    this.getCategories(filter, sortDirection,
      pageIndex, pageSize);
    this.CategorySubject.next(this.res)

  }
}

//#endregion

