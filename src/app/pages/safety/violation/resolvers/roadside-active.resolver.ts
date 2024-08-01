import { Injectable } from '@angular/core';


import { forkJoin, Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { RoadsideService } from '@pages/safety/violation/services/roadside.service';

// store
import {
    RoadsideActiveState,
    RoadsideActiveStore,
} from '@pages/safety/violation/state/roadside-state/roadside-active/roadside-active.store';

@Injectable({
    providedIn: 'root',
})
export class RoadsideActiveResolver  {
    constructor(
        private roadsideService: RoadsideService,
        private roadsideStore: RoadsideActiveStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.roadsideService.getRoadsideList(true, 1, 1, 25),
            this.tableService.getTableConfig(20),
        ]).pipe(
            tap(([roadsidePagination, tableConfig]) => {
                localStorage.setItem(
                    'roadsideTableCount',
                    JSON.stringify({
                        active: roadsidePagination.active,
                        inactive: roadsidePagination.inactive,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.roadsideStore.set(roadsidePagination.pagination.data);
            })
        );
    }
}
