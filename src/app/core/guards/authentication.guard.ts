import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// services
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private notification: NotificationService
    ) {}

    canActivate() {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) return true;

        this.router.navigate(['/website']);

        this.notification.warning(
            'Access forbidden, please contact administrator.',
            'Warning:'
        );

        return false;
    }
}
