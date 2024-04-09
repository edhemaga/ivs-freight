import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Services
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { PmService } from '../services/pm.service';

// Store
import {
    PmTrailerState,
    PmTrailerStore,
} from '../state/pm-trailer-state/pm-trailer.store';
import { PmListTrailerStore } from '../state/pm-list-trailer-state/pm-list-trailer.store';

// Models
import { PMTrailerListResponse, PMTrailerUnitListResponse, TableConfigResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class PmTrailerResolver implements Resolve<PmTrailerState> {
    constructor(
        // Store
        private pmTrailerStore: PmTrailerStore,
        private pmListTrailerStore: PmListTrailerStore,

        // Services
        private pmService: PmService,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<[PMTrailerUnitListResponse, TableConfigResponse, PMTrailerListResponse]> {
        return forkJoin([
            this.pmService.getPMTrailerUnitList(undefined, undefined, 1),
            this.tableService.getTableConfig(14),
            this.pmService.getPMTrailerList()
        ]).pipe(
            tap(([pmTrailerPagination, tableConfig, trailerPmList]) => {
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

                this.pmListTrailerStore.set(trailerPmList.pagination.data);

                this.pmTrailerStore.set(pmTrailerPagination.pagination.data);
            })
        );
    }
}
