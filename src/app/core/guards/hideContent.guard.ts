import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class HideContentGuard implements CanActivate {
    constructor(private router: Router) {}

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
            this.router.navigate(['/dashboard']);
            return false;
        }
        // this.router.navigate(['/auth']);
        return true;
    }
}
