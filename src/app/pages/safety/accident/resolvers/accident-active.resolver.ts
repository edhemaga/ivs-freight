import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin, Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { AccidentService } from '@pages/safety/accident/services/accident.service';

// store
import {
    AccidentActiveState,
    AccidentActiveStore,
} from '@pages/safety/accident/state/accident-active/accident-active.store';

@Injectable({
    providedIn: 'root',
})
export class AccidentActiveResolver implements Resolve<AccidentActiveState> {
    constructor(
        private accidentService: AccidentService,
        private accidentStore: AccidentActiveStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.accidentService.getAccidentList(
                true,
                true,
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
            this.tableService.getTableConfig(21),
        ]).pipe(
            tap(([acidentPagination, tableConfig]) => {
                localStorage.setItem(
                    'accidentTableCount',
                    JSON.stringify({
                        active: acidentPagination.active,
                        inactive: acidentPagination.inactive,
                        nonReportableCount:
                            acidentPagination.nonReportableCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.accidentStore.set(acidentPagination.pagination.data);
            })
        );
    }
}
