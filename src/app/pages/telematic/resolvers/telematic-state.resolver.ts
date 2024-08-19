import { Injectable } from '@angular/core';


import { forkJoin, Observable, tap } from 'rxjs';

// services
import { TelematicStateService } from '@pages/telematic/services/telematic-state.service';

// store
import {
    TelematicStateState,
    TelematicStateStore,
} from '@pages/telematic/state/telematic-state.store';

@Injectable({
    providedIn: 'root',
})
export class TelematicResolver  {
    constructor(
        private telematicService: TelematicStateService,
        private telematicStore: TelematicStateStore
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.telematicService.getAllGpsData(),
            this.telematicService.getCompanyUnassignedGpsData({}),
        ]).pipe(
            tap(([assignedGpsData, unassignedGpsData]) => {
                this.telematicStore.set({
                    assigned: assignedGpsData,
                    unassigned: unassignedGpsData,
                });
            })
        );
    }
}
