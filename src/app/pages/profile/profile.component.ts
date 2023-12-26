import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faPenToSquare, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { SecurityService } from '../../services/security.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '../../utils/errorHandler';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { ProfileFormComponent } from './profile-form/profile-form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    FontAwesomeModule,
    MatTooltipModule,
    MatDialogModule
  ],
  providers: [ErrorHandler],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileData: any = null;
  loading: boolean = true;
  hasError: boolean = false;
  readOnly: boolean = false;
  faCircle = faCircle;
  faPenToSquare = faPenToSquare;
  faSignOut = faSignOut;

  constructor(
    private router: Router,
    private securityService: SecurityService,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandler,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getProfileInfo();
  }

  getProfileInfo(): void {
    this.loading = true;
    this.securityService.fetchProfileInfo()
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.profileData = res.details;
          this.readOnly = this.checkIfProfileInfoCanBeEditable(this.profileData);
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.hasError = true;
          this.readOnly = false;
          console.error({ err });
          this.errorHandler.handleHTTPErrors(err);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  checkIfProfileInfoCanBeEditable(profileData: any): boolean {
    return profileData.flgLogin && profileData.flgLoginDsc !== 'DEFAULT';
  }

  goToProfilePage(): void {
    const dialogRef = this.dialog.open(ProfileFormComponent, {
      width: '400px',
      maxWidth: 'calc(100vw - 5px)',
      disableClose: true,
      enterAnimationDuration: 250,
      exitAnimationDuration: 250,
      data: {
        profileData: this.profileData
      },
    });
    dialogRef.afterClosed().subscribe(
      (dialogData) => {
        if (dialogData) {
          this.editProfileInfo(dialogData);
        }
      }
    );
  }

  editProfileInfo(profileInfo: any): void {
    this.loading = true;
    this.securityService.updateProfileInfo(profileInfo)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.securityService.secureStorage.set('tkn', res.details['access_token']);
          this.notificationService.showMessage('Profile info updated successfully.', 'SUCCESS');
          this.getProfileInfo();
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.hasError = true;
          this.readOnly = false;
          console.error({ err });
          this.errorHandler.handleHTTPErrors(err);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  signOut(): void {
    this.securityService.secureStorage.clear();
    this.router.navigate(['/authentication/login'], { replaceUrl: true });
  }
}
