import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppConstants } from 'src/shared/app.constants';
import { AuthServiceModule } from 'src/shared/auth-service/auth-service.module';
import { ProductServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { SweetAlertModule } from 'src/shared/sweet-alert/sweet-alert.module';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit{
  constructor(private router: Router,
    private authService:AuthServiceModule,
    private _productService:ProductServiceProxy,
    private _alertService:SweetAlertModule,
    private _spinner:NgxSpinnerService) {
      
      }
  ngOnInit(): void {
    //for name display 
  if(this.authService.isAuthorized()){ 
    let userName = document.getElementsByClassName("mat-button-wrapper");
    if (localStorage.getItem('LoginUserName') != null)
      userName[0].textContent = AppConstants.HelloMesg + localStorage.getItem('LoginUserName');
   
    }
   
  }

 
}
