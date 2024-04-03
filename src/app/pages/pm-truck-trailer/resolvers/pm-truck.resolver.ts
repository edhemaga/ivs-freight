import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { PmService } from '../services/pm.service';

// Store
import { PmTruckState, PmTruckStore } from '../state/pm-truck-state/pm-truck.store';

@Injectable({
    providedIn: 'root',
})
export class PmTruckResolver implements Resolve<PmTruckState> {
    constructor(
        // Store
        private pmTruckStore: PmTruckStore,
        
        // Services
        private pmService: PmService,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.pmService.getPMTruckUnitList(),
            this.tableService.getTableConfig(13),
        ]).pipe(
            tap(([pmTruckPagination, tableConfig]) => {
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

                this.pmTruckStore.set(pmTruckPagination.pagination.data);
            })
        );
    }
}
