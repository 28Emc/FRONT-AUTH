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
    MatTooltipModule
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

  signUpLocal() {
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

  signInLocal() {
    this.router.navigate(['authentication/login']);
  }
}
