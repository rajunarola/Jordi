import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { NotificationService } from 'src/shared/Notification/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  LoginUserName:string;
  classproperty: boolean = true;

  constructor( private activatedRoute: ActivatedRoute,
    private router: Router,
    private _accountServiceProxy: AccountServiceProxy,
    private notificationService:NotificationService) { }

  ngOnInit(): void {
    if(localStorage.getItem('LoginUserName')!=null)  
        this.LoginUserName=localStorage.getItem('LoginUserName');
  
  }
  Logout() {
    debugger;
        this._accountServiceProxy.logout().subscribe(res => {
          if (!res.isSuccess) {
            this.notificationService.error(res.message, "error");
          } else {
            localStorage.removeItem('Email');
               localStorage.removeItem('Password');       
            this.router.navigate(['../auth/login']);
          }
        });
        
      }
      hideSidebar() {
        if (this.classproperty) {
          let body = document.getElementsByClassName('mainJordi')[0];
          body.classList.add("main_close");   //add the class
          let sidebar = document.getElementsByClassName('sidebar-wrapper')[0];
          sidebar.classList.add("sidebar_close");   //add the class
          this.classproperty=false;
        }
        else{
          let body = document.getElementsByClassName('mainJordi')[0];
          body.classList.remove("main_close");   //add the class
          let sidebar = document.getElementsByClassName('sidebar-wrapper')[0];
          sidebar.classList.remove("sidebar_close");   //add the class
          this.classproperty=true;
        }
      }
     
}
