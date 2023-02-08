import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { LoadTService } from '../load.service';
import { LoadTemplateState, LoadTemplateStore } from './load-template.store';

@Injectable({
    providedIn: 'root',
})
export class LoadTemplateResolver implements Resolve<LoadTemplateState> {
    constructor(
        private loadService: LoadTService,
        private loadTemplateStore: LoadTemplateStore,
        private tableService: TruckassistTableService
    ) {}

    resolve(): Observable<any> {
        return forkJoin([
            this.loadService.getLoadList(
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
            this.tableService.getTableConfig(1),
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

                    this.loadTemplateStore.set(loadPagination.pagination.data);
                })
            )
    }
}
