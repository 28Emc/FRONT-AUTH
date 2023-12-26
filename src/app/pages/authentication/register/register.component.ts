import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SecurityService } from '../../../services/security.service';
import { MyErrorStateMatcher, checkPasswords } from '../../../common/validators/customValidators';
import { ErrorHandler } from '../../../utils/errorHandler';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FontAwesomeModule
  ],
  providers: [ErrorHandler],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  title: string = environment.titleFull;
  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  loading: boolean = false;
  visible: boolean = false;
  visibleCP: boolean = false;
  inputType: 'text' | 'password' = 'password';
  inputTypeCP: 'text' | 'password' = 'password';
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private securityService: SecurityService,
    private router: Router,
    private fb: FormBuilder,
    private errorHandler: ErrorHandler
  ) {
    this.securityService.secureStorage.clear();
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: checkPasswords });
  }

  togglePassword(inputName: 'password' | 'confirm-password'): void {
    if (inputName === 'password') {
      this.inputType = this.inputType === 'password' ? 'text' : 'password';
      this.visible = !this.visible;
    } else {
      this.inputTypeCP = this.inputTypeCP === 'password' ? 'text' : 'password';
      this.visibleCP = !this.visibleCP;
    }
  }

  signUpLocal(): void {
    this.loading = true;
    this.form.disable();
    const { confirmPassword, ...body } = this.form.getRawValue();
    this.securityService.signUpLocal(body).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.form.enable();
        this.securityService.secureStorage.set('tkn', res.details['access_token']);
        this.router.navigate(['/home'], { replaceUrl: true });
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.form.enable();
        this.errorHandler.handleHTTPErrors(err);
        console.error({ err });
      },
      complete: () => {
        this.loading = false;
        this.form.enable();
      }
    });
  }

  signInLocal(): void {
    this.router.navigate(['authentication/login']);
  }
}
