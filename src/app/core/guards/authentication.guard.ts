import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { NotificationService } from '../services/notification/notification.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private notification: NotificationService,
  ) {
  }

  canActivate() {
    const currentUser = this.authenticationService.currentUserValue;
    const token = JSON.parse(localStorage.getItem('token'));
    if (token && currentUser) {
      // TODO HANDLE ROLES SOMETIMES
      return true;
    }
    this.router.navigate(['/login']);
    this.notification.warning('Access forbidden, please contact administrator.', 'Warning:');
    return false;
  }
}
