import {NgModule} from '@angular/core';
import * as ApiServiceProxies from './service-proxies';

@NgModule({
  providers: [
    ApiServiceProxies.WeatherForecastServiceProxy,
    ApiServiceProxies.AccountServiceProxy,
    ApiServiceProxies.CategoryServiceProxy,
    ApiServiceProxies.UserServiceProxy,
    ApiServiceProxies.ProductServiceProxy,

  ]
})
export class ServiceProxyModule {
}
