import { Injectable } from '@angular/core';


import { Observable, of, catchError, tap } from 'rxjs';

// models
import { AccidentListResponse } from 'appcoretruckassist';

// services
import { AccidentService } from '@pages/safety/accident/services/accident.service';

// store
import {
    AccidentInactiveState,
    AccidentInactiveStore,
} from '@pages/safety/accident/state/accident-inactive/accident-inactive.store';

@Injectable({
    providedIn: 'root',
})
export class AccidentInactiveResolver
    
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
