import { Injectable } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

// models
import {
    FuelService as FuelController,
    FuelStopListResponse,
    FuelTransactionListResponse,
    GetFuelStopRangeResponse,
} from 'appcoretruckassist';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// services
import { FuelService } from '@shared/services/fuel.service';

@Injectable({
    providedIn: 'root',
})
export class FuelResolver {
    constructor(
        // services
        private fuelController: FuelController,
        private fuelService: FuelService
    ) {}

    resolve(): Observable<
        [
            FuelTransactionListResponse,
            FuelStopListResponse,
            GetFuelStopRangeResponse,
        ]
    > {
        return forkJoin([
            this.fuelController.apiFuelTransactionListGet(),
            this.fuelController.apiFuelFuelstopListGet(),
            this.fuelController.apiFuelFuelstopRangeGet(),
        ]).pipe(
            tap(([fuelTransactions, fuelStops, fuelStopPriceRange]) => {
                const tableView = JSON.parse(
                    localStorage.getItem(TableStringEnum.FUEL_TABLE_VIEW)
                );

                localStorage.setItem(
                    'fuelTableCount',
                    JSON.stringify({
                        fuelTransactions:
                            fuelTransactions?.fuelTransactionCount,
                        fuelStops: fuelStops?.fuelStopCount,
                        fuelCard: fuelStops?.fuelCardCount,
                    })
                );

                if (fuelStopPriceRange)
                    this.fuelService.updateStoreFuelStopPriceRange =
                        fuelStopPriceRange;

                if (
                    !tableView ||
                    tableView?.tabSelected === TableStringEnum.FUEL_TRANSACTION
                )
                    this.fuelService.updateStoreFuelTransactionsList =
                        fuelTransactions;
                else this.fuelService.updateStoreFuelStopList = fuelStops;
            })
        );
    }
}
