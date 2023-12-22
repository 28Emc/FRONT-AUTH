import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { SpanishPaginatorIntl } from './utils/spanish-paginator-intl';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { JwtInterceptorService } from './interceptors/jwt-interceptor.service';
import { ApiKeyInterceptorService } from './interceptors/api-key-interceptor.service';
import { ErrorInterceptorService } from './interceptors/error-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(withInterceptors([
      ErrorInterceptorService,
      ApiKeyInterceptorService,
      JwtInterceptorService,
      AuthInterceptorService
    ])),
    { provide: MatPaginatorIntl, useClass: SpanishPaginatorIntl },
  ],
};
