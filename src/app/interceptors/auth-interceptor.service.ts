import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { SecurityService } from '../services/security.service';

export const AuthInterceptorService: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const securityService = inject(SecurityService);
  // This is a regExp that validates if the url of the current path contains "/login"
  const reLogin = /login/gi;
  // We are validating that the current URL does not contain "/login" so that the request headers can be updated to include the authentication token
  let request = req;
  if (req.url.search(reLogin) === -1) {
    const token = securityService.secureStorage.get('tkn');
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(request);
}
