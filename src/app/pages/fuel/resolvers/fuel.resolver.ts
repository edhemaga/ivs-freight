import { Injectable } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

// models
import { FuelService } from '@shared/services/fuel.service';

// services
import { FuelStopListResponse, FuelTransactionListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class FuelResolver {
    constructor(private fuelService: FuelService) {}

    resolve(): Observable<[FuelTransactionListResponse, FuelStopListResponse]> {
        return forkJoin([
            this.fuelService.getFuelTransactionsList(),
            this.fuelService.getFuelStopsList(),
        ]).pipe(
            tap(([fuelTransactions, fuelStops]) => {
                localStorage.setItem(
                    'fuelTableCount',
                    JSON.stringify({
                        fuelTransactions: fuelTransactions?.fuelTransactionCount,
                        fuelStops: fuelStops?.fuelStopCount,
                        fuelCard: fuelStops?.fuelCardCount,
                    })
                );

                this.fuelService.updateStoreFuelTransactionsList = fuelTransactions;
                this.fuelService.updateStoreFuelStopList = fuelStops;
            })
        );
    }
}
