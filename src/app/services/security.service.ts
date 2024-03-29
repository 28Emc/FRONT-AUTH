import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import SecureLS from 'secure-ls';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  readonly baseURL: string = environment.baseURL;
  secureStorage = new SecureLS({
    encodingType: 'AES',
    encryptionSecret: environment.secretKey,
    isCompression: true
  });

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  signInLocal(signInBody: any): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/login`, signInBody)
      .pipe(
        map((signInPayload: any) => {
          return {
            message: 'Logged in successfully.',
            details: signInPayload
          };
        })
      );
  }

  signUpLocal(signUpBody: any): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/sign-up`, signUpBody)
      .pipe(
        map((signUpPayload: any) => {
          return {
            message: 'Registered successfully.',
            details: signUpPayload
          }
        })
      );
  }

  fetchSystemOptions(systemOptionsBody: any): Observable<any> {
    return of(null);
  }

  fetchProfileInfo(): Observable<any> {
    return this.http.get(`${this.baseURL}/auth/profile`)
      .pipe(
        map((profileInfoPayload: any) => {
          return {
            message: 'Profile data retrieved.',
            details: profileInfoPayload
          }
        })
      );
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/jwt/refresh`, null)
      .pipe(
        map((refreshJwtPayload: any) => {
          return {
            message: 'JWT has been refreshed successfully.',
            details: refreshJwtPayload
          }
        })
      );
  }

  signOut(signOutBody?: any): Observable<any> {
    this.secureStorage.clear();
    this.router.navigateByUrl('/authentication/login');
    return of({
      message: 'User logged out successfully.',
      details: null
    }).pipe(delay(500));
  }

  isUserLoggedIn(): Observable<boolean> {
    return of(this.secureStorage.get('tkn'));
  }

  storeUserInfo(userInfo: any): void {
    this.secureStorage.set('user', userInfo);
  }

  storeSystemOptionsInfo(options: any[]): void {
    this.secureStorage.set('opts', options);
  }
}
