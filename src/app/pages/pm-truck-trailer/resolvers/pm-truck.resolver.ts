import { Injectable } from '@angular/core';

import { forkJoin, Observable, tap } from 'rxjs';

// Services
import { PmService } from '@pages/pm-truck-trailer/services/pm.service';

// Store
import { PmTruckStore } from '@pages/pm-truck-trailer/state/pm-truck-state/pm-truck.store';
import { PmListTruckStore } from '@pages/pm-truck-trailer/state/pm-list-truck-state/pm-list-truck.store';

// models
import {
    PMTruckListResponse,
    PMTruckUnitListResponse,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class PmTruckResolver {
    constructor(
        // Store
        private pmTruckStore: PmTruckStore,
        private pmListTruckStore: PmListTruckStore,

        // Services
        private pmService: PmService
    ) {}
    resolve(): Observable<[PMTruckUnitListResponse, PMTruckListResponse]> {
        return forkJoin([
            this.pmService.getPMTruckUnitList(),
            this.pmService.getPMTruckList(),
        ]).pipe(
            tap(([pmTruckPagination, truckPmList]) => {
                localStorage.setItem(
                    'pmTruckTableCount',
                    JSON.stringify({
                        pmTruck: pmTruckPagination.pmTruckCount,
                    })
                );

                this.pmListTruckStore.set(truckPmList.pagination.data);

                this.pmTruckStore.set(pmTruckPagination.pagination.data);
            })
        );
    }
}
