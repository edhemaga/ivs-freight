import { Injectable } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

//Services
import { FuelService } from '@shared/services/fuel.service';

@Injectable({
    providedIn: 'root',
})
export class FuelResolver {
    constructor(private fuelService: FuelService) {}

    resolve(): Observable<any> {
        return forkJoin([
            this.fuelService.getFuelTransactionsList(),
            this.fuelService.getFuelStopsList(),
        ]).pipe(
            tap(([fuelTransactions, fuelStops]) => {
                localStorage.setItem(
                    'fuelTableCount',
                    JSON.stringify({
                        fuelTransactions: fuelTransactions.fuelTransactionCount,
                        fuelStops: fuelStops?.fuelStopCount,
                        fuelCard: fuelStops?.fuelCardCount,
                    })
                );

                this.fuelService.updateStoreFuelTransactionsList =
                    fuelTransactions.pagination.data;
                this.fuelService.updateStoreFuelStopList =
                    fuelStops.pagination.data;
            })
        );
    }
}
