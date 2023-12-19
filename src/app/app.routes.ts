import { Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'authentication',
    children: [
      {
        path: 'login',
        title: `${environment.titleFull} - Login`,
        loadComponent: () => import('./pages/authentication/login/login.component').then((c) => c.LoginComponent),
      },
      {
        path: 'register',
        title: `${environment.titleFull} - Register`,
        loadComponent: () => import('./pages/authentication/register/register.component').then((c) => c.RegisterComponent),
      },
      {
        path: 'oauth-redirect',
        title: `${environment.titleFull} - Redirect`,
        loadComponent: () => import('./pages/authentication/oauth-redirect/oauth-redirect.component').then((c) => c.OauthRedirectComponent),
      },
    ]
  },
  {
    path: 'home',
    title: `${environment.titleFull} - Home`,
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: '',
    redirectTo: '/authentication/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/authentication/login',
    pathMatch: 'full',
  },
];
