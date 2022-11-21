import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TruckListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
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
    resolve(): Observable<TruckActiveState | boolean> {
        // Get Table Configuration
        // const sub = this.tableService.getTableConfig(8).subscribe((res) => {
        //     const tableConfig = JSON.parse(res.config);

        //     console.log('Pozvata getTableConfig metoda');

        //     localStorage.setItem(
        //         `table-${res.tableType}-Configuration`,
        //         JSON.stringify(tableConfig)
        //     );

        //     sub.unsubscribe();
        // });

        // Get Table List
        return this.truckService.getTruckList(1, 1, 25).pipe(
            catchError(() => {
                return of('No inactive trucks...');
            }),
            tap((truckPagination: TruckListResponse) => {
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
