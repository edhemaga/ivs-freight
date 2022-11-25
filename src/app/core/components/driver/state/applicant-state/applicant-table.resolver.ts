import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetApplicantListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApplicantTService } from '../applicant.service';
import {
    ApplicantTableState,
    ApplicantTableStore,
} from './applicant-table.store';

@Injectable({
    providedIn: 'root',
})
export class ApplicantTableResolver implements Resolve<ApplicantTableState> {
    constructor(
        private applicantService: ApplicantTService,
        private store: ApplicantTableStore
    ) {}

    resolve(): Observable<ApplicantTableState | boolean> {
        return this.applicantService
            .getApplicantAdminList(undefined, undefined, undefined, 1, 25)
            .pipe(
                catchError(() => {
                    return of('No applicants data...');
                }),
                tap((applicantPagination: GetApplicantListResponse) => {
                    localStorage.setItem(
                        'applicantTableCount',
                        JSON.stringify({
                            applicant: applicantPagination.count,
                        })
                    );

                    this.applicantService.updateStoreApplicantList = applicantPagination.pagination.data
                })
            );
    }
}
