import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import swal from 'sweetalert2';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SweetAlertModule implements OnInit { 
  ngOnInit(){  
  }
  simpleAlert(str:string){  
    swal.fire(str);  
  }  
    
  alertWithSuccess(title:string,mesg:string){  
    swal.fire(title,mesg,"success")  
  }  
  erroalert(title:string,mesg:string,footer:string)  
  {  
    swal.fire({  
      icon: 'error',  
      title: title,  
      text: mesg,  
     // footer: '<a href>Why do I have this issue?</a>'  
     footer:footer
    })  
  }  
  //for displaying alert top right corner
  topend()  
  {  
    swal.fire({  
      position: 'top-end',  
      icon: 'success',  
      title: 'Your work has been saved',  
      showConfirmButton: false,  
      timer: 1500  
    })  
  }  
 

}

