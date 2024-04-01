import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin, tap } from 'rxjs';

//Store
import { OwnerInactiveState, OwnerInactiveStore } from './owner-inactive.store';

//Services
import { OwnerTService } from '../../services/owner.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

//Enums
import { ComponentsTableEnum } from 'src/app/core/model/enums';

@Injectable({
    providedIn: 'root',
})
export class OwnerInactiveResolver implements Resolve<OwnerInactiveState> {
    constructor(
        private ownerService: OwnerTService,
        private ownerStore: OwnerInactiveStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.ownerService.getOwner(
                0,
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
                    ComponentsTableEnum.OWNER_TABLE_COUNT,
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
