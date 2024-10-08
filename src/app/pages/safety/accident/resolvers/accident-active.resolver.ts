import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { AccidentService } from '@pages/safety/accident/services/accident.service';

// store
import { AccidentActiveStore } from '@pages/safety/accident/state/accident-active/accident-active.store';
import { AccidentListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class AccidentActiveResolver {
    constructor(
        private accidentService: AccidentService,
        private accidentStore: AccidentActiveStore
    ) {}
    resolve(): Observable<AccidentListResponse> {
        return this.accidentService
            .getAccidentList(
                true,
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
                tap((acidentPagination) => {
                    localStorage.setItem(
                        'accidentTableCount',
                        JSON.stringify({
                            active: acidentPagination.active,
                            inactive: acidentPagination.inactive,
                            nonReportableCount:
                                acidentPagination.nonReportableCount,
                        })
                    );

                    this.accidentStore.set(acidentPagination.pagination.data);
                })
            );
    }
}
