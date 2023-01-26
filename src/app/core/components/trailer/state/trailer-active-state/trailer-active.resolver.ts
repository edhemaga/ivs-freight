import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TrailerListResponse } from 'appcoretruckassist';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { TrailerTService } from '../trailer.service';
import { TrailerActiveState, TrailerActiveStore } from './trailer-active.store';

@Injectable({
    providedIn: 'root',
})
export class TrailerActiveResolver implements Resolve<TrailerActiveState> {
    constructor(
        private trailerService: TrailerTService,
        private trailerStore: TrailerActiveStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.trailerService.getTrailers(1, 1, 25),
            this.tableService.getTableConfig(9),
        ]).pipe(
            tap(([trailerPagination, tableConfig]) => {
                localStorage.setItem(
                    'trailerTableCount',
                    JSON.stringify({
                        active: trailerPagination.activeCount,
                        inactive: trailerPagination.inactiveCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.trailerStore.set(trailerPagination.pagination.data);
            })
        );
    }
}
