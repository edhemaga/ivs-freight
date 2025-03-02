import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Observable, tap, forkJoin } from 'rxjs';

// store
import { FuelItemStore } from '@pages/fuel/state/fuel-details-item-state/fuel-details-item.store';
import {
    FuelDetailsState,
    FuelDetailsStore,
} from '@pages/fuel/state/fuel-details-state/fuel-details.store';

// services
import { FuelService } from '@shared/services/fuel.service';

@Injectable({
    providedIn: 'root',
})
export class FuelDetailsResolver {
    constructor(
        private fuelService: FuelService,

        // store
        private fuelDetailsStore: FuelDetailsStore,
        private fuelItemStore: FuelItemStore
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<FuelDetailsState> {
        const pageIndex: number = 1;
        const pageSize: number = 25;

        const fuelStopId: number = +route.paramMap.get('id');

        const fuelStopData$ = this.fuelService.getFuelStopById(fuelStopId);

        const transactionList$ = this.fuelService.getFuelTransactionsList([
            fuelStopId,
        ]);

        return forkJoin({
            fuelStopData: fuelStopData$,
            transactionList: transactionList$,
        }).pipe(
            tap((data) => {
                const fuelStopData = {
                    ...data?.fuelStopData,
                    transactionList: data?.transactionList?.pagination?.data,
                };

                this.fuelDetailsStore.add(fuelStopData);
                this.fuelItemStore.set([fuelStopData]);
            })
        );
    }
}
