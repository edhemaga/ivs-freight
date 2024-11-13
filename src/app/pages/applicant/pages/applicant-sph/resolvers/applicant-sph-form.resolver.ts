import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { forkJoin, Observable, throwError, catchError, tap } from 'rxjs';

// services
import { ApplicantService } from '@pages/applicant/services/applicant.service';
import { ApplicantSphService } from '@pages/applicant/pages/applicant-sph/pages/applicant-sph-form/services/applicant-sph.service';

// store
import {
    ApplicantState,
    ApplicantStore,
} from '@pages/applicant/state/applicant.store';

@Injectable({
    providedIn: 'root',
})
export class ApplicantSphFormResolver  {
    constructor(
        private applicantSphService: ApplicantSphService,
        private applicantActionsService: ApplicantService,
        private applicantStore: ApplicantStore,
        private router: Router
    ) {}
    resolve(route: ActivatedRouteSnapshot): Observable<ApplicantState> {
        const applicantSphForm$ =
            this.applicantSphService.verifyPreviousEmployerSphForm({
                inviteCode: route.queryParams.InviteCode?.split(' ').join('+'),
            });

        const applicantDropdownList$ =
            this.applicantActionsService.getDropdownLists(+route.params.id);

        return forkJoin({
            applicantSphForm: applicantSphForm$,
            applicantDropdownList: applicantDropdownList$,
        }).pipe(
            tap((res: any) => {
                if (res) {
                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicantDropdownLists: res.applicantDropdownList,
                            applicantSphForm: res.applicantSphForm,
                        };
                    });
                } else {
                    this.router.navigate(['/website']);
                }
            }),
            catchError((error: any) => {
                this.router.navigate(['/website']);
                // TODO: MILADIN: uhvati error.error i obavesti korisnika da ne poostoji applicant sa tim id-em
                return throwError(() => error);
            })
        );
    }
}
