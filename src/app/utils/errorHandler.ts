import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../services/notification.service";
import { Injectable } from "@angular/core";

@Injectable()
export class ErrorHandler {
  constructor(
    private notificationService: NotificationService
  ) { }

  handleHTTPErrors(err: any): void {
    if (err instanceof HttpErrorResponse) {
      console.error("default err", err);
      this.notificationService.showMessage(err.message, 'ERROR');
    } else if ('statusCode' in err && err['statusCode'] !== 0) {
      console.error("backend err", err);
      this.notificationService.showMessage(err.message, 'WARNING');
    } else {
      console.error("other err", err);
      this.notificationService.showMessage(err.message ?? 'Hubo un error.', 'DEFAULT');
    }
  }
}
