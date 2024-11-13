import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { RepairService } from '@shared/services/repair.service';

// store
import { RepairTruckStore } from '@pages/repair/state/repair-truck-state/repair-truck.store';

// models
import { RepairListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class RepairTruckResolver {
    constructor(
        private repairService: RepairService,

        // store
        private repairTruckStore: RepairTruckStore
    ) {}

    resolve(): Observable<RepairListResponse> {
        return this.repairService
            .getRepairList(
                undefined,
                1,
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
                tap((repairTruckPagination) => {
                    localStorage.setItem(
                        'repairTruckTrailerTableCount',
                        JSON.stringify({
                            repairShops: repairTruckPagination.repairShopCount,
                            repairTrucks: repairTruckPagination.truckCount,
                            repairTrailers: repairTruckPagination.trailerCount,
                        })
                    );

                    this.repairTruckStore.set(
                        repairTruckPagination.pagination.data
                    );
                })
            );
    }
}
