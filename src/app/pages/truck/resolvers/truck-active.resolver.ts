import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { TruckService } from '@shared/services/truck.service';

// store
import { TruckActiveStore } from '@pages/truck/state/truck-active-state/truck-active.store';

// models
import { TruckListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class TruckActiveResolver {
    constructor(
        private truckService: TruckService,
        private truckStore: TruckActiveStore
    ) {}
    resolve(): Observable<TruckListResponse> {
        return this.truckService.getTruckList(1, null, 1, 25).pipe(
            tap((truckPagination) => {
                localStorage.setItem(
                    'truckTableCount',
                    JSON.stringify({
                        active: truckPagination.activeCount,
                        inactive: truckPagination.inactiveCount,
                    })
                );

                this.truckStore.set(truckPagination.pagination?.data);
            })
        );
    }
}
