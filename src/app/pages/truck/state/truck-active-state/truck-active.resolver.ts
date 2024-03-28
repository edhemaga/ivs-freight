import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TruckListResponse } from 'appcoretruckassist';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { TruckTService } from '../truck.service';
import { TruckActiveState, TruckActiveStore } from './truck-active.store';

@Injectable({
    providedIn: 'root',
})
export class TruckActiveResolver implements Resolve<TruckActiveState> {
    constructor(
        private truckService: TruckTService,
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
