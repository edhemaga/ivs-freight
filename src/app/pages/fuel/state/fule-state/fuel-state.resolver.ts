import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { FuelTService } from '../fuel.service';
import { FuelState } from './fuel-state.store';

@Injectable({
    providedIn: 'root',
})
export class FuelResolver implements Resolve<FuelState> {
    constructor(
        private fuelService: FuelTService,
        private tableService: TruckassistTableService
    ) {}

    resolve(): Observable<any> {
        return forkJoin([
            this.fuelService.getFuelTransactionsList(
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
                undefined,
                undefined,
                undefined,
                1,
                25
            ),
            this.fuelService.getFuelStopsList(
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
                undefined,
                undefined,
                1,
                25
            ),
            this.tableService.getTableConfig(15),
            this.tableService.getTableConfig(16),
        ]).pipe(
            tap(([fuelTransactions, fuelStops, tableConfigTransactions, tableConfigStops]) => {
                localStorage.setItem(
                    'fuelTableCount',
                    JSON.stringify({
                        fuelTransactions: fuelTransactions.fuelTransactionCount,
                        fuelStops: fuelStops.fuelStopCount,
                        fuelCard: fuelStops.fuelCardCount
                    })
                );

                if (tableConfigTransactions) {
                    const config = JSON.parse(tableConfigTransactions.config);

                    localStorage.setItem(
                        `table-${tableConfigTransactions.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                if (tableConfigStops) {
                    const config = JSON.parse(tableConfigStops.config);

                    localStorage.setItem(
                        `table-${tableConfigStops.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.fuelService.updateStoreFuelTransactionsList = fuelTransactions.pagination.data;
                this.fuelService.updateStoreFuelStopList = fuelStops.pagination.data;
            })
        );
    }
}
