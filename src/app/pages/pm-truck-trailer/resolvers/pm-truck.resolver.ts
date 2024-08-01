import { Injectable } from '@angular/core';

import { forkJoin, Observable, tap } from 'rxjs';

// Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { PmService } from '@pages/pm-truck-trailer/services/pm.service';
import { PmListTruckStore } from '@pages/pm-truck-trailer/state/pm-list-truck-state/pm-list-truck.store';

// Store
import {
    PmTruckState,
    PmTruckStore,
} from '@pages/pm-truck-trailer/state/pm-truck-state/pm-truck.store';
import {
    PMTruckListResponse,
    PMTruckUnitListResponse,
    TableConfigResponse,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class PmTruckResolver  {
    constructor(
        // Store
        private pmTruckStore: PmTruckStore,
        private pmListTruckStore: PmListTruckStore,

        // Services
        private pmService: PmService,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<
        [PMTruckUnitListResponse, TableConfigResponse, PMTruckListResponse]
    > {
        return forkJoin([
            this.pmService.getPMTruckUnitList(),
            this.tableService.getTableConfig(13),
            this.pmService.getPMTruckList(),
        ]).pipe(
            tap(([pmTruckPagination, tableConfig, truckPmList]) => {
                localStorage.setItem(
                    'pmTruckTableCount',
                    JSON.stringify({
                        pmTruck: pmTruckPagination.pmTruckCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.pmListTruckStore.set(truckPmList.pagination.data);

                this.pmTruckStore.set(pmTruckPagination.pagination.data);
            })
        );
    }
}
