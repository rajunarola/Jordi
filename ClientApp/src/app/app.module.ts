import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from "src/app/material/material.module";
import { AppComponent } from './app.component';
import { API_BASE_URL } from 'src/shared/service-proxies/service-proxies';
import { AppConstants } from 'src/shared/app.constants';
import { APP_BASE_HREF, LocationStrategy } from '@angular/common';
import { ServiceProxyModule } from 'src/shared/service-proxies/service-proxies.module';
import { NavMenuComponent } from './Layout/nav-menu/nav-menu.component';
import { AppRoutes } from './app.routing';
import { AppPreBootstrap } from 'src/AppPreBootstrap';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CustomCommonModule} from '../shared/common/common.module'
import { NgxSpinnerModule } from "ngx-spinner";  
import { AuthServiceModule } from 'src/shared/auth-service/auth-service.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { SharedService } from './shared.service';
import { SweetAlertModule } from 'src/shared/sweet-alert/sweet-alert.module';
import { NgxPaginationModule, PaginationService } from 'ngx-pagination';
import { jqxMenuModule } from 'jqwidgets-ng/jqxmenu';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CartComponent } from './main/cart/cart.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';

export function appInitializerFactory(injector: Injector, location: LocationStrategy) {

  return () => {
    
    AppConstants.appBaseHref = getBaseHref(location);

    let appBaseUrl = getDocumentOrigin() + AppConstants.appBaseHref;
    
    AppPreBootstrap.run(appBaseUrl);

     // TO DO : To set user info in app session
    // injector.get(AppSessionService).init();
};
  
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
  
  //console.log("AppConstants.remoteServiceBaseUrl : ", AppConstants.remoteServiceBaseUrl);
  return AppConstants.remoteServiceBaseUrl;
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HeaderComponent,
    FooterComponent,
    UserDashboardComponent

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceProxyModule,
    CustomCommonModule.forRoot(),
    RouterModule.forRoot(AppRoutes,{ useHash: true }),
    MaterialModule,
    NgxSpinnerModule,
    AuthServiceModule,
    SweetAlertModule,
    NgxPaginationModule,
    CarouselModule,
    jqxMenuModule,
    NgxImageZoomModule,
    NgbModule
      ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializerFactory, deps: [Injector, LocationStrategy], multi: true },
    { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
    SharedService,
    Title //arti
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
 
  
}
