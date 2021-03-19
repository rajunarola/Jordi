import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserDto, ServiceResponse } from 'src/shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { NotificationService } from 'src/shared/Notification/notification.service';
import { SweetAlertModule } from "src/shared/sweet-alert/sweet-alert.module";
import { AppConstants } from 'src/shared/app.constant';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
 
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  User = new MatTableDataSource<UserDto>();
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phoneNumber', 'isActive', 'isDelete'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  supplierId: number;
  res: any[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _userServiceProxy: UserServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationService,
    private _alertService:SweetAlertModule,
    private _spinner:NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
    });

    this.bindUser();

  }

  bindUser() {
    this._spinner.show();
    this._userServiceProxy.getAllUser().subscribe((result: UserDto[]) => {
      this.User = new MatTableDataSource<UserDto>(result);
      debugger;
      this.User.paginator = this.paginator;
      this.User.sort = this.sort;
      this._spinner.hide();
    });

  }



  applyFilter(filterValue: string) {
    debugger;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.User.filter = filterValue;
  }



  deleteUser(distributorId: any) {
    debugger;
    if (distributorId != null || distributorId != 0) {
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
            this._userServiceProxy.deleteUser(distributorId)
            .subscribe((res: ServiceResponse) => {
              this._alertService.alertWithSuccess(AppConstants.deleteTitle,AppConstants.User + " "  +AppConstants.deletedSuccessfully);

              this.bindUser();
            });
        

          } else if (result.dismiss === swal.DismissReason.cancel) {
            return false;
          }
        })
      return false;
        
    }
  }

  toggle(id: any) {
    this._userServiceProxy.setActivationStatus(id).subscribe(res => {
      this.bindUser();
      this._alertService.alertWithSuccess("",res.message);  
    
      });
  }
}
