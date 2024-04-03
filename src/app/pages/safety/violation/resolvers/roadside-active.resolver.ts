import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { RoadsideService } from '../services/roadside.service';

// store
import {
    RoadsideActiveState,
    RoadsideActiveStore,
} from '../state/roadside-state/roadside-active/roadside-active.store';

@Injectable({
    providedIn: 'root',
})
export class RoadsideActiveResolver implements Resolve<RoadsideActiveState> {
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
                        //categoryReport: roadsidePagination.categoryReport,
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
