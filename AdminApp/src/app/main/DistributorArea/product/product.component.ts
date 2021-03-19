import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Role } from 'src/app/Models/roles';
import { SPInput, ProductDto, ProductServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AuthServiceModule  } from "../../../../shared/auth-service/auth-service.module";
import swal from 'sweetalert2';
import { AppConstants } from 'src/shared/app.constant';
import { SweetAlertModule } from 'src/shared/sweet-alert/sweet-alert.module';
import { NgxSpinnerService } from "ngx-spinner";  

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit , DataSource<ProductDto>{
  
  private ProductSubject = new BehaviorSubject<any>([]);
  public lengthSubject = new BehaviorSubject<any>(0);
  public length$ = this.lengthSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  input: SPInput;
  res: any[] = [];
  totalCount: number;
  totalLength: number = 10;
  categoryId$: number;
  //#region datatable
  displayedColumns: string[] = ['ImageName','ProductName','ProductDescription','Price','CategoryName', 'IsActive', 'Id'];
  dataSource: ProductComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') inputSearch: ElementRef;
  @ViewChild('closebutton') closebutton;
 visible:boolean;

  //#endregion
  constructor
  (private router: Router,
    private authService:AuthServiceModule,
    private _productService:ProductServiceProxy,
    private _alertService:SweetAlertModule,
    private _spinner:NgxSpinnerService
    ) { }
  connect(collectionViewer: CollectionViewer): Observable<ProductDto[] | readonly ProductDto[]> {
    return this.ProductSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    
    this.ProductSubject.complete();
    this.loadingSubject.complete();
    this.lengthSubject.complete(); 
   }
   getProducts(filter, sortDirection, pageIndex, pageSize,sortColumn) {
   // this._spinner.show();
     debugger;
    this.input = new SPInput();
    this.input.filter = filter;
    this.input.pageNo = pageIndex;
    this.input.maxResultCount = pageSize;
    this.input.sorting = sortDirection;
    this.input.sortColumn=sortColumn;
    this.loadingSubject.next(true);
    var userId=Number(localStorage.getItem("CurrenUserId"));
    //return new Observable(observer => {
    this._productService.getAll(userId,false,this.input).subscribe(result => {
debugger;
      this.res = result.jsonObj.data;
      this.totalCount = result.totalCount;
      this.ProductSubject.next(this.res)
      this.loadingSubject.next(false);
      this.lengthSubject.next(this.totalCount);
     // this._spinner.hide();
      
      return result.jsonObj;
      
    });
   
  }

  loadAllProducts(filter = '',
    sortDirection = 'asc', pageIndex = 0, pageSize = 5,sortColumn='productName') {
      
    this.loadingSubject.next(false);

    this.dataSource.getProducts(filter, sortDirection,
      pageIndex, pageSize,sortColumn);
    this.ProductSubject.next(this.res)

  }

  userRoles: Role[];

  ngOnInit(): void {
   

    //for datatable
   this.dataSource = new ProductComponent(this.router,this.authService,this._productService,this._alertService,this._spinner)
  this.dataSource.getProducts('', 'asc', 0, 5,'productName');
    this.dataSource.lengthSubject.subscribe(res => {
      
      this.totalLength = res;
    });
    }
    ngAfterViewInit(): void {
debugger;
      // server-side search
      fromEvent(this.inputSearch.nativeElement, 'keyup')
        .pipe(
          debounceTime(150),
          distinctUntilChanged(),
          tap(() => {
            debugger;
            this.paginator.pageIndex = 0;
            this.loadProductPage();
          })
        )
        .subscribe();
  debugger;
      // reset the paginator after sorting
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
 
  debugger;
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadProductPage())
        )
        .subscribe();
    }
    loadProductPage() {
      debugger;
      this.dataSource.getProducts(
        this.inputSearch.nativeElement.value,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.sort.active);
    }
  createProduct() {
    this._spinner.show();
    this.router.navigate(['../main/add-product/0']);
    this._spinner.hide();
}
delete(id: any) {
 
  var UserId = Number(localStorage.getItem("CurrenUserId"));

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
        this._productService.delete(id,UserId).subscribe(res => {
          this._alertService.alertWithSuccess(AppConstants.deleteTitle, AppConstants.product + " " + AppConstants.deletedSuccessfully);
          this.loadProductPage();
        });
      } else if (result.dismiss === swal.DismissReason.cancel) {
        return false;
      }
    })
  return false;

}
edit(id:any){
  this.router.navigate(['../main/add-product/'+ id]);
}





}
