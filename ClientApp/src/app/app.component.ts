import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';
import { Title } from '@angular/platform-browser';  
import { filter } from 'rxjs/operators';  
import {  NavigationEnd, ActivatedRoute } from '@angular/router';  
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private router: Router,
    private _sharedService: SharedService,
    private activatedRoute: ActivatedRoute,   //arti
              private titleService: Title //arti
    ) { }
  ngOnInit(): void {
    //arti
    this.router.events.pipe(  
      filter(event => event instanceof NavigationEnd),  
    ).subscribe(() => {  
      const rt = this.getChild(this.activatedRoute);  
      rt.data.subscribe(data => {  
        console.log(data);  
        this.titleService.setTitle(data.title)});  
    }); 
    //arti
  //remove localstorage
  if(this._sharedService.isLogout){
debugger;
    localStorage.removeItem('CurrenUserId');
    localStorage.removeItem('CurrentRole');
    
  }
  else{
  }
}
//arti
getChild(activatedRoute: ActivatedRoute) {  
  if (activatedRoute.firstChild) {  
    return this.getChild(activatedRoute.firstChild);  
  } else {  
    return activatedRoute;  
  } 
}
//arti

  getUrl(): string {

   var  urlString:string =this.router.url

  //  return this.router.url;

    if (urlString.includes("/user-dashboard/add-update-product/")) {    
      urlString="/user-dashboard/add-update-product/";
      return urlString;
    }
    else if (urlString.includes("/user-dashboard/view-product/")) {        
      urlString="/user-dashboard/view-product/";
      return urlString;
  
    }else
   
    if (!urlString.includes("/user-dashboard/add-update-product/") || !urlString.includes("/user-dashboard/view-product/"))
    {
           return this.router.url;

   }
      
  }
}
//}
