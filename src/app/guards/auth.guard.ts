import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, RouterStateSnapshot, createUrlTreeFromSnapshot } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { map } from 'rxjs';

export const authGuard: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  return inject(SecurityService)
    .isUserLoggedIn()
    .pipe(
      map((isUserLoggedIn) => isUserLoggedIn ? true : createUrlTreeFromSnapshot(childRoute, ['/', 'authentication', '/', 'login']))
    );
};
