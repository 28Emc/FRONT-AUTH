import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../../services/security.service';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ErrorHandler } from '../../utils/errorHandler';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faPenToSquare, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { ProfileComponent } from '../profile/profile.component';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
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
    const dialogRef = this.dialog.open(ProfileComponent, {
      width: '400px',
      maxWidth: 'calc(100vw - 5px)',
      disableClose: false,
      hasBackdrop: true,
      enterAnimationDuration: 200,
      exitAnimationDuration: 200,
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
