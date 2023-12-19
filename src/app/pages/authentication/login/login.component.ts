import { Component } from '@angular/core';
import { SecurityService } from '../../../services/security.service';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  providerBaseURL: string = `${environment.baseURL}/auth/login`;
  title: string = environment.titleFull;
  form: FormGroup;

  constructor(
    private securityService: SecurityService,
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
    this.securityService.signInLocal(this.form.getRawValue()).subscribe({
      next: (res: any) => {
        this.securityService.secureStorage.set('tkn', res.details['access_token']);
        this.router.navigate(['/home'], { replaceUrl: true });
      },
      error: (err: HttpErrorResponse) => {
        console.error({ err });
      },
      complete: () => { }
    });
  }

  signInWithGoogle() {
    window.location.replace(`${this.providerBaseURL}/google`);
  }

  signInWithFacebook() {
    window.location.replace(`${this.providerBaseURL}/facebook`);
  }

  signInWithGithub() {
    window.location.replace(`${this.providerBaseURL}/github`);
  }

  signInWithTwitter() {
    window.location.replace(`${this.providerBaseURL}/twitter`);
  }
}
