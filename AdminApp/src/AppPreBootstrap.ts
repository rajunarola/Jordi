import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {CompilerOptions, NgModuleRef, Type} from '@angular/core';
import {environment} from './environments/environment';
import { AppConstants } from './shared/app.constant';


export class AppPreBootstrap {

    static run(appRootUrl: string): void {
        AppPreBootstrap.getApplicationConfig(appRootUrl);
    }

    static bootstrap<TM>(moduleType: Type<TM>, compilerOptions?: CompilerOptions | CompilerOptions[]): Promise<NgModuleRef<TM>> {
        return platformBrowserDynamic().bootstrapModule(moduleType, compilerOptions);
    }

    private static getApplicationConfig(appRootUrl: string) {
        AppConstants.appBaseUrl = environment.appBaseUrl;
        AppConstants.remoteServiceBaseUrl = environment.remoteServiceBaseUrl;
        AppConstants.inProd = environment.production
    }
}
