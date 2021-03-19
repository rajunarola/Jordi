import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/shared/common/notification/notification.service';
import { ConfirmedValidator } from 'src/shared/common/Validators/confirmValidator';
import { AccountServiceProxy, RegisterDto } from 'src/shared/service-proxies/service-proxies';
import { ServiceProxyModule } from 'src/shared/service-proxies/service-proxies.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  apiResponseErrorMessage: string;
  isLoading: boolean = false;
  registerDTO: RegisterDto;
  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  phoneNumber: FormControl;
  isRole:FormControl;
  constructor(
    private _fb: FormBuilder, private router: Router,
    private _accountServiceProxy: AccountServiceProxy,
     private notificationService: NotificationService,
     private _spinner:NgxSpinnerService
     ) { }
  
    ngOnInit() {    
      this.createForm();
    }



  createForm() {
    debugger;
    this.registerDTO = new RegisterDto();
    this.registerDTO.isRole = false;
     this.registerForm = this._fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern("^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$")]],
        confirmPassword: ['', Validators.required],
      //  phoneNumber: [' ', [Validators.required, Validators.pattern("^[0-9]*$")]],
        phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]], //Arti
        isRole: [this.registerDTO.isRole]
      },
        {
          validator: ConfirmedValidator('password', 'confirmPassword')
        
        }
      );
  
  }
 

  onSubmit() {
this._spinner.show();
    this.apiResponseErrorMessage = null;
    if (this.registerForm.invalid) {
      this._spinner.hide();
      return;
    }

    let registerDto = new RegisterDto();
    registerDto.email = this.registerForm.controls.email.value;
    registerDto.firstName = this.registerForm.controls.firstName.value;
    registerDto.lastName = this.registerForm.controls.lastName.value;
    registerDto.password = this.registerForm.controls.password.value;
    registerDto.confirmPassword = this.registerForm.controls.confirmPassword.value;
    registerDto.phoneNumber = this.registerForm.controls.phoneNumber.value;
    registerDto.isRole = this.registerForm.controls.isRole.value;
    this._accountServiceProxy.register(registerDto).subscribe(result => {
      if (!result.isSuccess) {
        this._spinner.hide();
        this.notificationService.error(result.message, "error");
      } else {
      this.registerForm.reset();
      this.registerForm.clearValidators();
      this.registerForm.updateValueAndValidity();
      this.registerForm.markAsUntouched();
      this.registerForm.setErrors(null);
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key).setErrors(null) ;
    });    
    this._spinner.hide();

      this.notificationService.success("Please check your Email", "success");
      }
    });
  }

}
