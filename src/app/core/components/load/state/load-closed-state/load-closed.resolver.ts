import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { LoadTService } from '../load.service';
import { LoadClosedState, LoadClosedStore } from './load-closed.store';

@Injectable({
    providedIn: 'root',
})
export class LoadClosedResolver implements Resolve<LoadClosedState> {
    constructor(
        private loadService: LoadTService,
        private loadClosedStore: LoadClosedStore,
        private tableService: TruckassistTableService
    ) {}

    resolve(): Observable<any> {
        return forkJoin([
            this.loadService.getLoadList(
                undefined,
                3,
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
            this.tableService.getTableConfig(2),
        ])
            .pipe(
                tap(([loadPagination, tableConfig]) => {
                    localStorage.setItem(
                        'loadTableCount',
                        JSON.stringify({
                            pendingCount: loadPagination.pendingCount,
                            activeCount: loadPagination.activeCount,
                            closedCount: loadPagination.closedCount,
                            templateCount: loadPagination.templateCount,
                        })
                    );

                    if (tableConfig) {
                        const config = JSON.parse(tableConfig.config);

                        localStorage.setItem(
                            `table-${tableConfig.tableType}-Configuration`,
                            JSON.stringify(config)
                        );
                    }

                    this.loadClosedStore.set(loadPagination.pagination.data);
                })
            )
    }
}
