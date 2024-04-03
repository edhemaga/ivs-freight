import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of, catchError, tap } from 'rxjs';

// models
import { AccidentListResponse } from 'appcoretruckassist';

// services
import { AccidentService } from '../services/accident.service';

// store
import {
    AccidentInactiveState,
    AccidentInactiveStore,
} from '../state/accident-inactive/accident-inactive.store';

@Injectable({
    providedIn: 'root',
})
export class AccidentInactiveResolver
    implements Resolve<AccidentInactiveState>
{
    constructor(
        private accidentService: AccidentService,
        private accidentStore: AccidentInactiveStore
    ) {}
    resolve(): Observable<AccidentInactiveState | boolean> {
        return this.accidentService
            .getAccidentList(
                false,
                true,
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
                    return of('No accident inactive data...');
                }),
                tap((acidentPagination: AccidentListResponse) => {
                    this.accidentStore.set(acidentPagination.pagination.data);
                })
            );
    }
}
