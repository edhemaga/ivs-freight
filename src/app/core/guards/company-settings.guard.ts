import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// models
import { SignInResponse } from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class CompanySettingsGuard  {
    constructor(private router: Router) {}

    canActivate() {
        const user: SignInResponse = JSON.parse(localStorage.getItem('user'));

        if (!user?.areSettingsUpdated) {
            this.router.navigate(['/company/settings']);

            return false;
        }

        return true;
    }
}
