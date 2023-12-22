import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { SecurityService } from '../services/security.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';

export const JwtInterceptorService: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const securityService = inject(SecurityService);
  const router = inject(Router);
  let hasTokenBeenUpdated: boolean = false;
  let accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  let request = req;
  // Get current JWT
  const myRawToken = securityService.secureStorage.get('tkn');
  const helper = new JwtHelperService();
  const isExpired = helper.isTokenExpired(myRawToken);

  return next(request).pipe(
    catchError((interceptorError: HttpErrorResponse) => {
      // Check if JWT is already expired
      if (interceptorError instanceof HttpErrorResponse && interceptorError.status === HttpStatusCode.Unauthorized && isExpired) {
        // If JWT is already expired and has not yet been updated, the incerceptor will call "/auth/jwt/refresh" endpoint, only for the 1st request
        // (since the interceptor is triggered for each request done), then refresh token is retrieved and stored
        if (!hasTokenBeenUpdated) {
          hasTokenBeenUpdated = true;
          accessTokenSubject.next('');
          return securityService.refreshToken().pipe(
            switchMap((refreshJwtPayload: any) => {
              hasTokenBeenUpdated = false;
              accessTokenSubject.next(refreshJwtPayload.details['refresh_token']);
              securityService.secureStorage.set('tkn', refreshJwtPayload.details['refresh_token']);
              return next(request);
            }),
            catchError((refreshTokenError: HttpErrorResponse) => {
              hasTokenBeenUpdated = false;
              // If JWT cannot be updated, we redirect the user to "/login" page
              securityService.secureStorage.clear();
              router.navigate(['/authentication/login']);
              return throwError(() => new Error(refreshTokenError.message));
            })
          );
        } else {
          // If JWT has been updated before, we retrieve it from "accessTokenSubject"
          return accessTokenSubject.pipe(
            filter(accessToken => accessToken !== null),
            take(1),
            switchMap(token => {
              securityService.secureStorage.set('tkn', token);
              return next(request);
            }));
        }
      }
      return throwError(() => interceptorError);
    })
  );
}
