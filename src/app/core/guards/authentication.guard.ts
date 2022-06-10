import { AuthQuery } from './../components/authentication/state/auth.query';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NotificationService } from '../services/notification/notification.service';
import { SignInResponse } from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private notification: NotificationService,
    private authQuery: AuthQuery
  ) {}

  canActivate() {
    // ----------------------- PRODUCSTION MODE ----------------------------
    // if(this.authQuery.getEntity(1)) {
    //   const currentUser: SignInResponse = this.authQuery.getEntity(1);

    //   if (currentUser.token) {
    //     return true;
    //   }
    // }

    // ----------------------- DEVELOP MODE ----------------------------
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.token) {
      return true;
    }
    this.router.navigate(['/login']);
    this.notification.warning(
      'Access forbidden, please contact administrator.',
      'Warning:'
    );
    return false;
  }
}
