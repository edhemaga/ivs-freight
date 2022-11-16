import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApplicantActionsService } from '../services/applicant-actions.service';

import { ApplicantState, ApplicantStore } from '../store/applicant.store';

@Injectable({
    providedIn: 'root',
})
export class ApplicantSphFormResolver implements Resolve<ApplicantState> {
    constructor(
        private applicantActionsService: ApplicantActionsService,
        private applicantStore: ApplicantStore
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
                this.applicantStore.update((store) => {
                    return {
                        ...store,
                        applicantDropdownLists: res.applicantDropdownList,
                        applicantSphForm: res.applicantSphForm,
                    };
                });
            })
        );
    }
}
