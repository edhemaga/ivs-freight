import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApplicantQuery } from 'src/app/pages/applicant/state/applicant.query';

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
                this.router.navigate(['/website']);
                return false;
            }
        });

        return true;
    }
}
