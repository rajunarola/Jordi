import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from 'src/shared/common/notification/notification.service';
import { AccountServiceProxy, CartServiceProxy, LoginDto } from 'src/shared/service-proxies/service-proxies';
import * as CryptoJS from 'crypto-js';
import { Utils } from 'src/shared/common/Utils/Utils'
import { appId } from 'src/shared/common/enum/enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/shared.service';
import { AppConstants } from 'src/shared/app.constants';
import { AuthServiceModule } from 'src/shared/auth-service/auth-service.module';
import { CartComponent } from 'src/app/main/cart/cart.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup;
  submitted: boolean;
  apiResponseErrorMessage: string;
  loginDTO: LoginDto;
  isLoading: boolean = false;
  classProperty: boolean = true;

  constructor(private _accountServiceProxy: AccountServiceProxy,
    private router: Router,
    private notificationService: NotificationService,
    private _fb: FormBuilder,
    private cookieService: CookieService,
    private _spinner: NgxSpinnerService,
    private _sharedService: SharedService,
    private authService: AuthServiceModule
  ) {

  }

  ngOnInit() {
    debugger;
    this.classProperty = true;
    this.loginDTO = new LoginDto();
    if (this.authService.isAuthorized()) {
      debugger;
      let userName = document.getElementsByClassName("mat-button-wrapper");
      if (localStorage.getItem("LoginUserName") != null)
        userName[0].textContent =
          AppConstants.HelloMesg + localStorage.getItem("LoginUserName");
    }
    else {
      let login = document.getElementsByClassName("nav-link")[0];
      login.classList.add("nav-link");
      login.classList.add("login_button");
    }
    const email = Utils.crLocalStorageValue(this.cookieService.get(Utils.enLocalStorageValue("email")));
    const password = Utils.crLocalStorageValue(this.cookieService.get(Utils.enLocalStorageValue("password")));

    if (email != "" && email != undefined && password != "" && password != undefined) {
      this.loginDTO.email = email;
      this.loginDTO.password = password;
      this.loginDTO.rememberMe = true;
    }
    this.loginDTO.rememberMe = false;
    this.loginForm = this._fb.group({
      email: [this.loginDTO.email, [Validators.required, Validators.email]],
      password: [this.loginDTO.password, [Validators.required]],
      rememberme: [this.loginDTO.rememberMe],
    });
  }

  onSubmit() {

    this._spinner.show();
    this.apiResponseErrorMessage = null;
    if (this.loginForm.invalid) {
      this._spinner.hide();
      return;
    }
    let loginDto = new LoginDto();
    loginDto.email = this.loginForm.controls.email.value;
    loginDto.password = this.loginForm.controls.password.value;
    loginDto.rememberMe = this.loginForm.controls.rememberme.value;

    this._accountServiceProxy.getUserRole(loginDto).subscribe(result => {
      if (!result.isSuccess) {
        this._spinner.hide();
        this.notificationService.error(result.message, "error");
      }
      else {
        if (result.jsonObj == "User") {
          loginDto.appId = appId.User;

          this._accountServiceProxy.login(loginDto).subscribe(res => {
            if (!res.isSuccess) {
              this._spinner.hide();
              this.notificationService.error(res.message, "error");
            } else {
              this.classProperty = false;
              localStorage.setItem('CurrenUserId', res.jsonObj.id);
              localStorage.setItem('CurrentRole', res.jsonObj.role[0]);
              localStorage.setItem('Email', loginDto.email);
              localStorage.setItem('Password', loginDto.password);
              localStorage.setItem('LoginUserName', res.jsonObj.firstName + " " + res.jsonObj.lastName); //Arti

              if (this.loginForm.controls.rememberme.touched) {
                var now = new Date(),
                  // this will set the expiration to 12 months
                  exp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
                this.cookieService.set(Utils.enLocalStorageValue("email"), Utils.enLocalStorageValue(loginDto.email), exp);
                this.cookieService.set(Utils.enLocalStorageValue("password"), Utils.enLocalStorageValue(loginDto.password), exp);
              }
              debugger
              if (this._sharedService.renturnUrl != '' && this._sharedService.productId != undefined) {
                this._sharedService.addCartdata(this._sharedService.productId, res.jsonObj.id);
              }
              else if (this._sharedService.renturnUrl == undefined) {
                this.router.navigate(['/user-dashboard/dashboard']);
                this._spinner.hide();
              } else {
                this.router.navigate([AppConstants.cartRedirection]);

              }

              if (!this.classProperty) {
                let body = document.getElementById('loginbtn');
                body.classList[1].replace("login_button", "");
                body.classList.add("user_name_sec");
                let helloLbl = document.getElementsByClassName('user_name_sec')[0];

                helloLbl.classList.remove("user_name_sec");
                helloLbl.classList.add("user_name_sec_active");
                // set active username                
                let userName = document.getElementsByClassName("mat-button-wrapper");
                if (localStorage.getItem('LoginUserName') != null)
                  userName[0].textContent = AppConstants.HelloMesg + localStorage.getItem('LoginUserName');
              }
            }
          });

        } else {
          this._spinner.hide();
          this.notificationService.error("Invalid User ", "error");
        }
      }
    });


  }

}
