import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AccidentListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AccidentTService } from '../../accident.service';
import {
    AccidentNonReportedState,
    AccidentNonReportedStore,
} from './accident-non-reported.store';

@Injectable({
    providedIn: 'root',
})
export class AccidentNonReportedResolver
    implements Resolve<AccidentNonReportedState>
{
    constructor(
        private accidentService: AccidentTService,
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
