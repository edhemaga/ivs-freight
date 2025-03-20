import { Injectable } from '@angular/core';

import { Observable, of, catchError, tap } from 'rxjs';

// services
import { FuelService } from '@shared/services/fuel.service';

// store
import { FuelMinimalListStore } from '@pages/fuel/state/fuel-details-minimal-list-state/fuel-minimal-list.store';

// models
import { RepairShopMinimalListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class FuelMinimalResolver {
    private pageIndex: number = 1;
    private pageSize: number = 25;

    constructor(
        private fuelService: FuelService,
        private fuelMinimalListStore: FuelMinimalListStore
    ) {}

    resolve(): Observable<string | RepairShopMinimalListResponse> {
        return this.fuelService
            .getFuelStopsMinimalList(null, this.pageIndex, this.pageSize)
            .pipe(
                tap((fuelStopMinimalList) => {
                    this.fuelMinimalListStore.set(
                        fuelStopMinimalList.pagination.data
                    );
                }),
                catchError(() => {
                    return of('No fuel stop data for...');
                })
            );
    }
}
