import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor( private _snackBar: MatSnackBar) { }
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  success(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 10000
      ,panelClass: ['success-snackbar'],
      horizontalPosition:this.horizontalPosition,
      verticalPosition:this.verticalPosition
    });
  }

  error(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 10000
      ,panelClass: ['error-snackbar'],
      horizontalPosition:this.horizontalPosition,
      verticalPosition:this.verticalPosition
    });
  }

}