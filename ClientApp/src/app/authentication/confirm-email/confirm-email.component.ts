import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/shared/common/notification/notification.service';
import { AccountServiceProxy, ConfirmEmailDto, LoginDto } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
  userId$: string;
  accessToken$: string;

  confirmForm: FormGroup;
  isLoading: boolean = false;

  confirmEmailDTO: ConfirmEmailDto;

  constructor(private activatedRoute: ActivatedRoute, private _accountServiceProxy: AccountServiceProxy, private router: Router,
    private notificationService: NotificationService, private _fb: FormBuilder) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userId$ = params.email;
      this.accessToken$ = params.accessToken;
    });
   
    let confirmDto = new ConfirmEmailDto();
    confirmDto.email = this.userId$;
    confirmDto.accessToken = this.accessToken$;
    this._accountServiceProxy.confirmemail(confirmDto).subscribe(result => {
      if (!result.isSuccess) {
        this.notificationService.error(result.message, "error");
      } else {
        if(result.message!=null || result.message !="" || result.message!= undefined){
          this.notificationService.success(result.message, "success");
        }else{
          this.notificationService.success("You email confirmed", "success");
        }
      }
    });
  }

  onLoginClick() {
    this.router.navigate(['/auth/login']);
   
  }

}
