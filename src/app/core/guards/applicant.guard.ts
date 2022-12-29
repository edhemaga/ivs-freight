import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApplicantQuery } from '../components/applicant/state/store/applicant.query';

@Injectable({ providedIn: 'root' })
export class ApplicantGuard implements CanActivate {
    constructor(
        private router: Router,
        private applicantQuery: ApplicantQuery
    ) {}

    canActivate() {
        // ----------------------- DEVELOP MODE ----------------------------
        this.applicantQuery.applicant$.subscribe((value) => {
            if (!value) {
                this.router.navigate(['/auth']);
                return false;
            }
        });

        return true;
    }
}
