import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Role } from 'src/app/Models/roles';
import { AppConstants } from 'src/shared/app.constant';
import { AuthServiceModule } from 'src/shared/auth-service/auth-service.module';
import { ProductDto, ProductServiceProxy, SPInput } from 'src/shared/service-proxies/service-proxies';
import { SweetAlertModule } from 'src/shared/sweet-alert/sweet-alert.module';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit , DataSource<ProductDto>{
  
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
  displayedColumns: string[] = ['ImageName','ProductName','ProductDescription','Price','CategoryName', 'IsActive'];
  dataSource: ManageProductComponent;
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
    this._spinner.show();
    this.input = new SPInput();
    this.input.filter = filter;
    this.input.pageNo = pageIndex;
    this.input.maxResultCount = pageSize;
    this.input.sorting = sortDirection;
    this.input.sortColumn=sortColumn;
    this.loadingSubject.next(true);
    var userId=Number(localStorage.getItem("CurrenUserId"));
    //return new Observable(observer => {
    this._productService.getAllAdminProduct(userId,this.input).subscribe(result => {

      this.res = result.jsonObj.data;
      this.totalCount = result.totalCount;
      this.ProductSubject.next(this.res)
      this.loadingSubject.next(false);
      this.lengthSubject.next(this.totalCount);
      this._spinner.hide();
      
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
    
    //this.loadingSubject.next(true);

    //for datatable
   this.dataSource = new ManageProductComponent(this.router,this.authService,this._productService,this._alertService,this._spinner)
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
    toggle(id: any) {
      this._productService.manageActivateStatus(id).subscribe(res => {
        this.loadProductPage();
        this._alertService.alertWithSuccess("",res.message);  
        });
    }
}
