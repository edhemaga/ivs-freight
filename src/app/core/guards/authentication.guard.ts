import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NotificationService } from '../services/notification/notification.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private notification: NotificationService
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
    if (user) {
      return true;
    }
    this.router.navigate(['/auth']);
    this.notification.warning(
      'Access forbidden, please contact administrator.',
      'Warning:'
    );
    return false;
  }
}
