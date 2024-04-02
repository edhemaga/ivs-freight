import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Services
import { TelematicStateService } from '../services/telematic-state.service';

// Store
import {
    TelematicStateState,
    TelematicStateStore,
} from '../state/telematic-state.store';

@Injectable({
    providedIn: 'root',
})
export class TelematicResolver implements Resolve<TelematicStateState> {
    constructor(
        private telematicService: TelematicStateService,
        private telematicStore: TelematicStateStore
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.telematicService.getAllGpsData(),
            this.telematicService.getCompanyUnassignedGpsData({})
        ]).pipe(
            tap(([assignedGpsData, unassignedGpsData]) => {
                this.telematicStore.set({'assigned': assignedGpsData, 'unassigned': unassignedGpsData});
            })
        );
    }
}
