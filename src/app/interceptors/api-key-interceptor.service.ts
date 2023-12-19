import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const ApiKeyInterceptorService: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  // We add apiKey header to all requests by default
  let request = req.clone({
    setHeaders: {
      'x-api-key': environment.secretKey
    }
  });
  return next(request);
}
