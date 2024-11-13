import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { forkJoin, Observable, throwError, catchError, tap } from 'rxjs';

// services
import { ApplicantService } from '@pages/applicant/services/applicant.service';

// store
import {
    ApplicantState,
    ApplicantStore,
} from '@pages/applicant/state/applicant.store';

@Injectable({
    providedIn: 'root',
})
export class ApplicantResolver  {
    constructor(
        private applicantActionsService: ApplicantService,
        private applicantStore: ApplicantStore,
        private router: Router
    ) {}
    resolve(route: ActivatedRouteSnapshot): Observable<ApplicantState> {
        const applicantData$ = this.applicantActionsService.getApplicantById(
            +route.params.id
        );

        const applicantDropdownList$ =
            this.applicantActionsService.getDropdownLists(+route.params.id);

        return forkJoin({
            applicantData: applicantData$,
            applicantDropdownList: applicantDropdownList$,
        }).pipe(
            tap((res: any) => {
                if (res) {
                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: res.applicantData,
                            applicantDropdownLists: res.applicantDropdownList,
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
