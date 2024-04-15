import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable } from 'rxjs';

// store
import { ApplicantTableState } from '@pages/driver/state/applicant-state/applicant-table.store';

@Injectable({
    providedIn: 'root',
})
export class ApplicantTableResolver implements Resolve<ApplicantTableState> {
    constructor() {}

    resolve(): Observable<any> {
        return null;
    }
}
