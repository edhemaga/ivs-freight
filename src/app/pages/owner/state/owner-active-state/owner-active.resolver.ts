import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { OwnerTService } from '../../services/owner.service';
import { OwnerActiveState, OwnerActiveStore } from './owner-active.store';

@Injectable({
    providedIn: 'root',
})
export class OwnerActiveResolver implements Resolve<OwnerActiveState> {
    constructor(
        private ownerService: OwnerTService,
        private ownerStore: OwnerActiveStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.ownerService.getOwner(
                1,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                1,
                25
            ),
            this.tableService.getTableConfig(17),
        ]).pipe(
            tap(([ownerPagination, tableConfig]) => {
                localStorage.setItem(
                    'ownerTableCount',
                    JSON.stringify({
                        active: ownerPagination.activeCount,
                        inactive: ownerPagination.inactiveCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.ownerStore.set(ownerPagination.pagination.data);
            })
        );
    }
}
