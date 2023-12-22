import { Component } from '@angular/core';
import { SecurityService } from '../../../services/security.service';
import { environment } from '../../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ErrorHandler } from '../../../utils/errorHandler';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons/faXTwitter";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    FontAwesomeModule
  ],
  providers: [ErrorHandler],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  providerBaseURL: string = `${environment.baseURL}/auth/login`;
  title: string = environment.titleFull;
  form: FormGroup;
  loading: boolean = false;
  faGoogle = faGoogle;
  faFacebook = faFacebook;
  faGithub = faGithub;
  faTwitter = faXTwitter;

  constructor(
    private securityService: SecurityService,
    private errorHandler: ErrorHandler,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.securityService.secureStorage.clear();
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  signInLocal() {
    this.loading = true;
    this.form.disable();
    this.securityService.signInLocal(this.form.getRawValue()).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.form.enable();
        this.securityService.secureStorage.set('tkn', res.details['access_token']);
        this.router.navigate(['/home'], { replaceUrl: true });
      },
      error: (err: any) => {
        this.loading = false;
        this.form.enable();
        this.errorHandler.handleHTTPErrors(err);
      },
      complete: () => {
        this.loading = false;
        this.form.enable();
      }
    });
  }

  signUpLocal() {
    // TODO: ADD REGISTRATION LOGIC
  }

  signInWithGoogle() {
    this.loading = true;
    this.form.disable();
    window.location.replace(`${this.providerBaseURL}/google`);
  }

  signUpLocal() {
    this.router.navigate(['/authentication/register']);
  }

  signInWithFacebook() {
    this.loading = true;
    this.form.disable();
    window.location.replace(`${this.providerBaseURL}/facebook`);
  }

  signInWithGithub() {
    this.loading = true;
    this.form.disable();
    window.location.replace(`${this.providerBaseURL}/github`);
  }

  signInWithTwitter() {
    this.loading = true;
    this.form.disable();
    window.location.replace(`${this.providerBaseURL}/twitter`);
  }
}
