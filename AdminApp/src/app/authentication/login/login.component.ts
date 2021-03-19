import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountServiceProxy, LoginDto } from 'src/shared/service-proxies/service-proxies';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from 'src/shared/Notification/notification.service';
import { Utils } from 'src/shared/utils/utils.service';
import { appId } from 'src/shared/enum/enum';
import { AuthServiceModule  } from "../../../shared/auth-service/auth-service.module";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm :FormGroup;
  loginDto:LoginDto;
  apiResponseErrorMessage: string;

  constructor(
    private _accountServiceProxy:AccountServiceProxy,
    private _formBuilder:FormBuilder,
    private router:Router,
    private cookieService: CookieService,
    private notificationService: NotificationService,
    private  _authService:  AuthServiceModule,
    private _spinner:NgxSpinnerService

    ) { }

  ngOnInit(): void {
    debugger;
    this.loginDto = new LoginDto();
    const email = Utils.crLocalStorageValue(this.cookieService.get(Utils.enLocalStorageValue("email")));
    const password = Utils.crLocalStorageValue(this.cookieService.get(Utils.enLocalStorageValue("password")));

    if (email != "" && email != undefined && password != "" && password != undefined) {
      this.loginDto.email = email;
      this.loginDto.password = password;
      this.loginDto.rememberMe = true;
    }
    this.loginDto.rememberMe = false;
    this.loginForm = this._formBuilder.group({
      email: [this.loginDto.email, [Validators.required, Validators.email]],
      password: [this.loginDto.password, [Validators.required]],
      rememberme: [this.loginDto.rememberMe],
    });
  }
  onSubmit() {

  this.apiResponseErrorMessage = null;
    if (this.loginForm.invalid) {
      return;
    }
    this._spinner.show();
    let loginDto = new LoginDto();
    loginDto.email = this.loginForm.controls.email.value;
    loginDto.password = this.loginForm.controls.password.value;
    loginDto.rememberMe = this.loginForm.controls.rememberme.value;
    //loginDto.appId = appId.Admin;
    this._accountServiceProxy.getUserRole(loginDto).subscribe(result => {
      if (!result.isSuccess) {
        this.notificationService.error("Invalid User", "error");
      } 
      else{
       
        if(result.jsonObj!="User"){   
      
      
    this._accountServiceProxy.login(loginDto).subscribe(res => {
      if (!res.isSuccess) {
        this.notificationService.error(res.message, "error");
      } 
      else 
      {
         localStorage.setItem('CurrenUserId',res.jsonObj.id);
        // console.log(res.jsonObj.role[0]);
        // console.log(res.jsonObj.id);

        localStorage.setItem('CurrentRole',res.jsonObj.role[0]);
        localStorage.setItem('LoginUserName',res.jsonObj.firstName+" "+res.jsonObj.lastName);

        this._authService.AssignRole(res.jsonObj.role[0]);
        //this.router.navigate(['/']);

        localStorage.setItem('Email',loginDto.email);
        localStorage.setItem('Password',loginDto.password);

        if (this.loginForm.controls.rememberme.touched) {
          var now = new Date(),
            // this will set the expiration to 12 months
          exp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
          this.cookieService.set(Utils.enLocalStorageValue("email"), Utils.enLocalStorageValue(loginDto.email), exp);
          this.cookieService.set(Utils.enLocalStorageValue("password"), Utils.enLocalStorageValue(loginDto.password), exp);
        }
        this._spinner.hide();
        this.router.navigate(['/main/dashboard']);
      }
    });
  }
  else{
    this._spinner.hide(); 
    this.notificationService.error("Invalid User", "error");}
}
  });

}
     
    }

