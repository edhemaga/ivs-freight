import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApplicantActionsService } from '../services/applicant-actions.service';

import { ApplicantState, ApplicantStore } from '../store/applicant.store';

@Injectable({
    providedIn: 'root',
})
export class ApplicantSphFormResolver implements Resolve<ApplicantState> {
    constructor(
        private applicantActionsService: ApplicantActionsService,
        private applicantStore: ApplicantStore,
        private router: Router
    ) {}
    resolve(route: ActivatedRouteSnapshot): Observable<ApplicantState> {
        const applicantSphForm$ =
            this.applicantActionsService.verifyPreviousEmployerSphForm({
                inviteCode: route.queryParams.InviteCode?.split(' ').join('+'),
            });

        const applicantDropdownList$ =
            this.applicantActionsService.getDropdownLists();

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
