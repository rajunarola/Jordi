import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/shared/common/notification/notification.service';
import { ConfirmedValidator } from 'src/shared/common/Validators/confirmValidator';
import { AccountServiceProxy, ResetPasswordDto } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  accessToken$: string;

  submitted: boolean;
  resetDTO: ResetPasswordDto;
  isLoading: boolean = false;
  isPasswordReset :boolean =false;
  constructor(private _accountServiceProxy: AccountServiceProxy, private router: Router,private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService, private _fb: FormBuilder) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.accessToken$ = params.accessToken;
    });
   
    this.resetDTO = new ResetPasswordDto();
    this.resetForm = this._fb.group({
      email: [this.resetDTO.email, [Validators.required, Validators.email]],
      password: [this.resetDTO.password, [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$")]],
      confirmPassword: [this.resetDTO.confirmPassword, Validators.required],
    },
      {
        validator: ConfirmedValidator('password', 'confirmPassword')
      });
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }
    let resetDto = new ResetPasswordDto();
    resetDto.email = this.resetForm.controls.email.value;
    resetDto.password = this.resetForm.controls.password.value;
    resetDto.confirmPassword = this.resetForm.controls.confirmPassword.value;
    resetDto.code = this.accessToken$;


    this._accountServiceProxy.resetpassword(resetDto).subscribe(result => {
      if (!result.isSuccess) {
        this.notificationService.error(result.message, "error");
      } else {
        this.resetForm.reset();
          this.resetForm.clearValidators();
          this.resetForm.updateValueAndValidity();
          this.resetForm.markAsUntouched();
          this.resetForm.setErrors(null);
          Object.keys(this.resetForm.controls).forEach(key => {
            this.resetForm.get(key).setErrors(null) ;
          });
        this.notificationService.error("Your password has been reset. Please click on login.", "success");
      }
    });
  }
}
