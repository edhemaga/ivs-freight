import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// store
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

@Injectable({ providedIn: 'root' })
export class ApplicantGuard  {
    constructor(
        private router: Router,
        private applicantQuery: ApplicantQuery
    ) {}

    canActivate() {
        this.applicantQuery.applicant$.subscribe((value) => {
            if (!value) {
                this.router.navigate(['/website']);

                return false;
            }
        });

        return true;
    }
}
