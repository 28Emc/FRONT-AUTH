import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../../services/security.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  profileData: any = null;
  loading: boolean = true;
  hasError: boolean = false;
  readOnly: boolean = false;

  constructor(
    private router: Router,
    private securityService: SecurityService
  ) { }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.loading = true;
    this.securityService.fetchProfileInfo()
      .subscribe({
        next: (res: any) => {
          this.profileData = res.details;
          this.loading = false;
          this.readOnly = this.checkIfProfileInfoCanBeEditable(this.profileData);
        },
        error: (err: HttpErrorResponse) => {
          console.error({ err });
          this.loading = false;
          this.hasError = true;
          this.readOnly = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  checkIfProfileInfoCanBeEditable(profileData: any) {
    return profileData.flgLogin && profileData.flgLoginDsc !== 'DEFAULT';
  }

  editProfileInfo() {
    // TODO: EDIT PROFILE LOGIC
    console.log('Edit profile action');
    alert('Not available');
  }

  signOut() {
    this.securityService.secureStorage.clear();
    this.router.navigate(['/authentication/login'], { replaceUrl: true });
  }
}
