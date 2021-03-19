import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/shared/common/notification/notification.service';
import { AccountServiceProxy, ForgetPasswordDto } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm :FormGroup;
  submitted: boolean;
  apiResponseErrorMessage: string;
  forgetDTO : ForgetPasswordDto;
  isLoading :boolean=false;
  constructor(private _accountServiceProxy: AccountServiceProxy, 
    private router: Router,
    private notificationService: NotificationService,
    private _fb : FormBuilder,
    private _spinner:NgxSpinnerService
    ) { }

    ngOnInit() {
      this.forgetDTO = new ForgetPasswordDto();
      this.forgetForm = this._fb.group({
        email: [this.forgetDTO.email, [Validators.required, Validators.email]],
      });
    }
  
    onSubmit() {
      this._spinner.show();
      this.apiResponseErrorMessage = null;
      if (this.forgetForm.invalid) {
        return;
      }
      let forgetDto = new ForgetPasswordDto();
      forgetDto.email = this.forgetForm.controls.email.value;
      this._accountServiceProxy.forgetpassword(forgetDto).subscribe(result => {
        if (!result.isSuccess) {
          this._spinner.hide();
          this.notificationService.error(result.message, "error");
        } else {
          this._spinner.hide();
          this.notificationService.success("For Reset Password please check your email.", "success");
        }
      });
    }
}
