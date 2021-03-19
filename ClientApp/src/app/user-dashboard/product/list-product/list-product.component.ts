import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/shared.service';
import { AppConstants } from 'src/shared/app.constants';
import { AuthServiceModule } from 'src/shared/auth-service/auth-service.module';
import { ProductServiceProxy, SPInput } from 'src/shared/service-proxies/service-proxies';
import { SweetAlertModule } from 'src/shared/sweet-alert/sweet-alert.module';
import swal from 'sweetalert2';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit  {
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
      previousLabel: '<<',
      nextLabel: '>>',
      screenReaderPaginationLabel: 'Pagination',
      screenReaderPageLabel: 'page',
      screenReaderCurrentLabel: `You're on page`
  };
  config: any;
 

  input: SPInput;
  res: any[] = [];
  totalCount: number;
  totalLength: number = 10;
  totalProductCount = new Subject();
  totalProductCount$ = this.totalProductCount.asObservable();
  constructor(private router: Router,
    private authService:AuthServiceModule,
    private _productService:ProductServiceProxy,
    private _alertService:SweetAlertModule,
    private _spinner:NgxSpinnerService,
    private _sharedService:SharedService) {
      this.config={ itemsPerPage: 6,
        currentPage: 1,
        totalItems: 0};
       
     }
  

     ngOnInit(): void {
       this.res=this.getProducts('', 'asc', 0, 6,'productName');   
 
  }
  
  getProducts(filter, sortDirection, pageIndex, pageSize,sortColumn):any {
     this._spinner.show();
    
     this.input = new SPInput();
     this.input.filter = filter;
     this.input.pageNo = pageIndex;
     this.input.maxResultCount = pageSize;
     this.input.sorting = sortDirection;
     this.input.sortColumn=sortColumn;
 
     var userId=Number(localStorage.getItem("CurrenUserId"));
    
     this._productService.getAllUserProduct(userId,this.input).subscribe(result => {

       this.res = result.jsonObj.data;
       this.totalCount = result.totalCount;
       this.totalProductCount.next(result.totalCount);
       this.config.totalItems=result.totalCount;
       debugger;

       //Arti - for remove the navigation in pagination when products are not avialable
       if(this.totalCount < 1)
       {
         this.labels="";      
       }
       this._spinner.hide();
     
       return result.jsonObj;
       
     });
    
   }
   onPageChange(event){
     debugger;
     //this.res=this.getProducts('', 'asc', 0, 6,'productName'); 
    this.config.currentPage = event;
    this.config.totalItems= this.totalCount;
    this.config.itemsPerPage= 6;
    this.res=this.getProducts('', 'asc', event-1, 6,'productName');  
  }
  editproduct(id:any){
    this.router.navigate(['/user-dashboard/add-update-product', id]); 
  }
  vieweproduct(id:any)
  {
    this.router.navigate(['/user-dashboard/view-product', id]); 
  }
  deleteproduct(id:any){
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
            this.getProducts('', 'asc', 0, 5,'productName');
          });
        } else if (result.dismiss === swal.DismissReason.cancel) {
          return false;
        }
      })
    return false;
  

  }
 
  
}
