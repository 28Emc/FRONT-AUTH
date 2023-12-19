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
          }
        })
      );
  }

  fetchSystemOptions(systemOptionsBody: any): Observable<any> {
    return of(null);
    /* let headers = this.header;
    // return this.http.get(`http://20.226.41.78/Inversionista/Api/Perfil_Opcion/4/${body.UsuarioId}/${SYSTEM_ID}/-/${body.PerfilId}/`, { headers })
    return this.http.get(`${this.urlBase}/Perfil_Opcion/4/${body.UsuarioId}/${SYSTEM_ID}/-/${body.PerfilId}/`, { headers })
      .pipe(map((opciones: any[]) => {
        return {
          message: 'Opciones de sistema obtenidas correctamente.',
          details: opciones
        }
      }
      )); */
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
