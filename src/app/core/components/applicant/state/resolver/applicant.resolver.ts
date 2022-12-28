import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApplicantActionsService } from '../services/applicant-actions.service';

import { ApplicantState, ApplicantStore } from '../store/applicant.store';

@Injectable({
    providedIn: 'root',
})
export class ApplicantResolver implements Resolve<ApplicantState> {
    constructor(
        private applicantActionsService: ApplicantActionsService,
        private applicantStore: ApplicantStore,
        private router: Router
    ) {}
    resolve(route: ActivatedRouteSnapshot): Observable<ApplicantState> {
        const applicantData$ = this.applicantActionsService.getApplicantById(
            +route.params.id
        );

        const applicantDropdownList$ =
            this.applicantActionsService.getDropdownLists();

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
                    this.router.navigate(['/auth']);
                }
            }),
            catchError((error: any) => {
                this.router.navigate(['/auth']);
                // TODO: MILADIN: uhvati error.error i obavesti korisnika da ne poostoji applicant sa tim id-em
                return throwError(() => error);
            })
        );
    }
}
