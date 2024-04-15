import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of, catchError, tap } from 'rxjs';

// services
import { AccidentService } from '@pages/safety/accident/services/accident.service';

// store
import {
    AccidentNonReportedState,
    AccidentNonReportedStore,
} from '@pages/safety/accident/state/accident-non-reported/accident-non-reported.store';

// models
import { AccidentListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class AccidentNonReportedResolver
    implements Resolve<AccidentNonReportedState>
{
    constructor(
        private accidentService: AccidentService,
        private accidentStore: AccidentNonReportedStore
    ) {}
    resolve(): Observable<AccidentNonReportedState | boolean> {
        return this.accidentService
            .getAccidentList(
                false,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                1,
                25
            )
            .pipe(
                catchError(() => {
                    return of('No accident non reported data...');
                }),
                tap((acidentPagination: AccidentListResponse) => {
                    this.accidentStore.set(acidentPagination.pagination.data);
                })
            );
    }
}
