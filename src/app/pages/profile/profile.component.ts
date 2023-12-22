import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { SecurityService } from '../../services/security.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '../../utils/errorHandler';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FontAwesomeModule,
    MatTooltipModule
  ],
  providers: [ErrorHandler],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  @ViewChild('imgInput') imgInput!: ElementRef;
  form: FormGroup;
  loading: boolean = false;
  image: any = null;
  faCamera = faCamera;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<ProfileComponent>,
    private securityService: SecurityService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private errorHandler: ErrorHandler
  ) {
    this.form = this.fb.group({
      username: [this.dialogData.profileData.username, [Validators.required]],
      firstName: [this.dialogData.profileData.firstName],
      lastName: [this.dialogData.profileData.lastName],
      status: [{ value: this.dialogData.profileData.status, disabled: true }, [Validators.required]],
    });
  }

  onImgSelected(event: any): void {
    if (event.target?.files && event.target.files.length == 0) {
      this.notificationService.showMessage('Image required', 'WARNING');
      return;
    }
    const img = event.target.files[0];
    if (!['image/png', 'image/jpeg'].includes(img.type)) {
      this.notificationService.showMessage('The selected file is not an valid image', 'WARNING');
      return;
    }
    this.updateProfilePic(img);
  }

  updateProfilePic(img: any): void {
    const reader = new FileReader();
    reader.onload = (fr) => {
      const pictureBody = {
        imgBase64: fr.target?.result?.toString()
      };
      this.loading = true;
      this.securityService.updateProfilePicture(pictureBody).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.notificationService.showMessage('Image uploaded successfully.', 'SUCCESS');
          // this.dialogData.profileData.picture = res.details['imgURL'];
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.errorHandler.handleHTTPErrors(err);
        },
        complete: () => {
          this.loading = false;
        }
      });
    };
    reader.readAsDataURL(img);
  }

  save(): void {
    this.dialogRef.close(this.form.getRawValue());
  }
}
