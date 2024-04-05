import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin, Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { TruckService } from '../../../shared/services/truck.service';

// store
import {
    TruckActiveState,
    TruckActiveStore,
} from '../state/truck-active-state/truck-active.store';

@Injectable({
    providedIn: 'root',
})
export class TruckActiveResolver implements Resolve<TruckActiveState> {
    constructor(
        private truckService: TruckService,
        private truckStore: TruckActiveStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.truckService.getTruckList(1, 1, 25),
            this.tableService.getTableConfig(8),
        ]).pipe(
            tap(([truckPagination, tableConfig]) => {
                localStorage.setItem(
                    'truckTableCount',
                    JSON.stringify({
                        active: truckPagination.activeCount,
                        inactive: truckPagination.inactiveCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.truckStore.set(truckPagination.pagination?.data);
            })
        );
    }
}
