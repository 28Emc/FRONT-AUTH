import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SecurityService } from '../../../services/security.service';

@Component({
  selector: 'app-oauth-redirect',
  standalone: true,
  imports: [],
  templateUrl: './oauth-redirect.component.html',
  styleUrls: ['./oauth-redirect.component.scss'],
})
export class OauthRedirectComponent {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private securityService: SecurityService
  ) {
    this.activatedRoute.queryParams
      .subscribe((p: Params) => {
        let accessToken, validToken, isExpired = null;
        try {
          accessToken = p['tkn'];
          if (!accessToken) {
            throw new Error('Token not found');
          }
          const helper = new JwtHelperService();
          validToken = helper.decodeToken(accessToken);
          if (!validToken) {
            throw new Error('Token not valid/malformed');
          }
          isExpired = helper.isTokenExpired(accessToken);
          if (isExpired) {
            throw new Error('Token expired');
          }
          this.securityService.secureStorage.set('tkn', accessToken);
          this.router.navigate(['/home'], { replaceUrl: true });
        } catch (error) {
          console.error('Token error', error);
          this.router.navigate(['/authentication/login'], { replaceUrl: true });
        }
      });
  }
}
