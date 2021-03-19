import { HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';
import { ValidationErrors } from '@angular/forms';
import { CategoryServiceProxy, CommonDto, CommonSpParameterInputDto, DropDownDto } from 'src/shared/service-proxies/service-proxies';


export class CustomValidation {
    constructor(
        public _categoryServceProxy: CategoryServiceProxy

    ) { }



    public validCategoryName(arg0: string):ValidationErrors | null {

        var result;
        this._categoryServceProxy.checkCategory(arg0).subscribe((res) => {

            if (res.status == 0) {

                result = false;
            } else {

                result = true;
            }
        });

        return result;

    }
    // constructor(
    //     private _categoryServceProxy: CategoryServiceProxy     

    //   ) { }
    //     validCategoryName(categoryName: string): boolean {
    //     debugger;
    //     if(categoryName==undefined)
    //     {
    //       return null;
    //     }
    //     var result;
    //     this._categoryServceProxy.checkCategory(categoryName).subscribe((res) => {
    //       if (res.status == 0) {
    //         result = false;
    //       } else { result = true; }
    //     });
    //     return result;

    //   }
}
