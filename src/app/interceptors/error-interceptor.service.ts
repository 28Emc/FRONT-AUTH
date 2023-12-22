import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { APIError } from '../interfaces/APIError.interface';

export const ErrorInterceptorService: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorPayload: Error | APIError;
      if (error.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
        errorPayload = error as Error;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        // console.error(`Backend returned code ${error.status}, body was: ${error.message}`);
        errorPayload = {
          error: error.error.error,
          message: error.error.message,
          statusCode: error.status
        } as APIError;
        console.error(`Backend returned code ${errorPayload.statusCode}, body was: ${errorPayload.message}`);
      }

      // If you want to return a new response:
      //return of(new HttpResponse({body: [{name: "Default value..."}]}));

      // If you want to return the error on the upper level:
      return throwError(() => errorPayload);

      // or just return nothing:
      // return EMPTY;
    })
  );
}
