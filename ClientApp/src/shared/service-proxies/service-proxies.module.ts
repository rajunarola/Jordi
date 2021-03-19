import {NgModule} from '@angular/core';
import * as ApiServiceProxies from './service-proxies';

@NgModule({
  providers: [
    ApiServiceProxies.WeatherForecastServiceProxy,
    ApiServiceProxies.AccountServiceProxy,
    ApiServiceProxies.ProductServiceProxy,
    ApiServiceProxies.CategoryServiceProxy,
    ApiServiceProxies.UserServiceProxy,
    ApiServiceProxies.CartServiceProxy
  ]
})
export class ServiceProxyModule {
}
