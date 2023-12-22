import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
// import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private snackbar: MatSnackBar
  ) { }

  showMessage(
    msg: string,
    type: 'DEFAULT' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO' = 'DEFAULT',
    msDuration?: number,
    hPosition?: 'center' | 'right',
    vPosition?: 'top' | 'bottom'
  ): void {
    let panelClassArr = [];

    switch (type) {
      case 'SUCCESS':
        panelClassArr.push('snackbar-success');
        break;
      case 'WARNING':
        panelClassArr.push('snackbar-warning');
        break;
      case 'ERROR':
        panelClassArr.push('snackbar-error');
        break;
      case 'INFO':
        panelClassArr.push('snackbar-info');
        break;
      case 'DEFAULT':
      default:
        panelClassArr = [];
        break;
    }

    let options: MatSnackBarConfig = {
      duration: msDuration ?? 5000,
      horizontalPosition: hPosition ?? 'right',
      verticalPosition: vPosition ?? 'bottom',
      panelClass: panelClassArr
    };

    this.snackbar.open(msg, undefined, options);
  }

  close(): void {
    if (this.snackbar) {
      this.snackbar.dismiss();
    }
  }

  /* showLoader(title?: string, text?: string): void {
    Swal.fire({
      title: title ?? 'Lista',
      text: text ?? 'Espere por favor...',
      timerProgressBar: true,
      didOpen: () => Swal.showLoading()
    });
  }

  closeLoader(): void {
    Swal.close();
  }

  showConfirmPopup(text: string, confirmButtonText: string, title?: string, icon?: SweetAlertIcon, cancelButtonText: string = `Cancelar`) {
    return Swal.fire({
      title: title ?? 'Lista',
      text,
      icon: icon ?? 'warning',
      showCancelButton: true,
      confirmButtonText,
      confirmButtonColor: '#3085d6',
      cancelButtonText,
      cancelButtonColor: '#d33',
      allowOutsideClick: false
    });
  }

  showInfoPopup(confirmButtonText: string, title?: string, icon?: SweetAlertIcon) {
    return Swal.fire({
      title: title ?? 'Lista',
      icon: icon ?? 'warning',
      showCancelButton: false,
      confirmButtonText,
      confirmButtonColor: '#3085d6',
      allowOutsideClick: false
    });
  } */
}
