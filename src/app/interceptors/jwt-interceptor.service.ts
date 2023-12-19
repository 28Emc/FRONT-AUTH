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
      return throwError(() => new Error(interceptorError.message));
    })
  );
}

/* @Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {
  hasTokenBeenUpdated: boolean = false;
  accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('JWT interceptor');
    let request = req;
    // 1 - OBTENER EL TOKEN ACTUAL
    const myRawToken = this.securityService.secureStorage.get('tkn');
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(myRawToken);
    return next.handle(request);
    // TODO: HANDLE REFRESH TOKEN LOGIC
    return next.handle(request).pipe(
      catchError((e: HttpErrorResponse) => {
        // 2 - VERIFICAR SI EL TOKEN YA EXPIRÓ
        if (e instanceof HttpErrorResponse && e.status === HttpStatusCode.Unauthorized && isExpired) {
          // 3 - SI YA EXPIRÓ, Y AÚN NO HA SIDO ACTUALIZADO, EL INTERCEPTOR VA A LLAMAR AL ENDPOINT "/authentication/refresh"
          // SOLO PARA LA PRIMERA PETICIÓN (YA QUE EL INTERCEPTOR SE ACTIVA POR CADA PETICIÓN), SE OBTIENE EL NUEVO TOKEN
          // Y SE ALMACENA
          if (!this.hasTokenBeenUpdated) {
            this.hasTokenBeenUpdated = true;
            this.accessTokenSubject.next('');

            return this.authService.refreshToken().pipe(
              switchMap((authResponse: any) => {
                this.hasTokenBeenUpdated = false;
                this.accessTokenSubject.next(authResponse.details.token);
                this.securityService.secureStorage.set('tkn', authResponse.details.token);
                return next.handle(request);
              }),
              catchError((e2: HttpErrorResponse) => {
                this.hasTokenBeenUpdated = false;
                // 4 - EN CASO NO SE PUEDA ACTUALIZAR EL TOKEN, SE DERIVA EL USUARIO A LA PANTALLA DE INICIO SESIÓN
                this.securityService.secureStorage.clear();
                this.router.navigate(['/authentication/login']);
                return throwError(() => new Error(e2.message));
              })
            );
          } else {
            // 5 - SI YA HA SIDO ACTUALIZADO EL TOKEN, SE OBTIENE EL TOKEN ACTUALIZADO DESDE EL "subject"
            return this.accessTokenSubject.pipe(
              filter(accessToken => accessToken !== null),
              take(1),
              switchMap(token => {
                this.securityService.secureStorage.set('tkn', token);
                return next.handle(request);
              }));
          }
        }

        return throwError(() => new Error(e.message));
      })
    );
  }
} */
