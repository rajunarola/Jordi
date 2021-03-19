import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentiction.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { API_BASE_URL } from 'src/shared/service-proxies/service-proxies';
import { LocationStrategy } from '@angular/common';
import { AppConstants } from 'src/shared/app.constant';
import { AppPreBootstrap } from 'src/AppPreBootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ServiceProxyModule } from 'src/shared/service-proxies/service-proxies.module';
import { MatSortModule } from '@angular/material/sort';
import { AuthServiceModule } from 'src/shared/auth-service/auth-service.module';
import { AuthGuardModule } from 'src/shared/auth-service/auth-guard.module';
import { UserRoleDirective } from './Directive/UserRoleDirective';
import { UserDirectiveModule } from './Directive/userDirective.module';
//import { MatTableExporterModule } from 'mat-table-exporter';
 import { NgxSpinnerModule } from "ngx-spinner";  

export function appInitializerFactory(injector: Injector, location: LocationStrategy) {

  return () => {
    AppConstants.appBaseHref = getBaseHref(location);
    

    let appBaseUrl = getDocumentOrigin() + AppConstants.appBaseHref;

    AppPreBootstrap.run(appBaseUrl);

     // TO DO : To set user info in app session
    // injector.get(AppSessionService).init();
};



  /*return () => {
    AppConstants.appBaseHref = "/";

    AppConstants.appBaseUrl = environment.appBaseUrl;
    AppConstants.remoteServiceBaseUrl = environment.remoteServiceBaseUrl;
    AppConstants.inProd = environment.production;

  
  };*/
}

function getDocumentOrigin() {
  

  if (!document.location.origin) {
    return document.location.protocol + '//' + document.location.hostname + (document.location.port ? ':' + document.location.port : '');
  }
  

  return document.location.origin;
}

export function getBaseHref(locationStrategy: LocationStrategy): string {
  return '/';
}



export function getRemoteServiceBaseUrl() {
  

  console.log("AppConstants.remoteServiceBaseUrl : ", AppConstants.remoteServiceBaseUrl);
  return AppConstants.remoteServiceBaseUrl;
}


@NgModule({
  declarations: [
    AppComponent,
    UserRoleDirective,
    UserDirectiveModule
      ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceProxyModule,
    AuthServiceModule,
    AuthGuardModule,
    //MatTableExporterModule,
    NgxSpinnerModule
    


    
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializerFactory, deps: [Injector, LocationStrategy], multi: true },
    { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
