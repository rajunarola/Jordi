import * as ngCommon from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import { NotificationService } from './notification/notification.service';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        MaterialModule
    ]
})

export class CustomCommonModule {
    static forRoot(): ModuleWithProviders<CustomCommonModule> {
        return {
            ngModule:CustomCommonModule,
            providers: [
                NotificationService
            ]
        };
    }
}