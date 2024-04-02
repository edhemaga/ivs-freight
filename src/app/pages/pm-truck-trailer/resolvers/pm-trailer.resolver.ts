import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { PmService } from '../services/pm.service';

// Store
import { PmTrailerState, PmTrailerStore } from '../state/pm-trailer-state/pm-trailer.store';

@Injectable({
    providedIn: 'root',
})
export class pmTrailerResolver implements Resolve<PmTrailerState> {
    constructor(
        private pmService: PmService,
        private pmTrailerStore: PmTrailerStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.pmService.getPMTrailerUnitList(undefined, undefined, 1),
            this.tableService.getTableConfig(14),
        ]).pipe(
            tap(([pmTrailerPagination, tableConfig]) => {
                localStorage.setItem(
                    'pmTrailerTableCount',
                    JSON.stringify({
                        pmTrailer: pmTrailerPagination.pmTrailerCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.pmTrailerStore.set(pmTrailerPagination.pagination.data);
            })
        );
    }
}
