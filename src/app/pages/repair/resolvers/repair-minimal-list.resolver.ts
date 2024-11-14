import { Injectable } from '@angular/core';

import { Observable, of, catchError, tap } from 'rxjs';

// services
import { RepairService } from '@shared/services/repair.service';

// store
import { RepairMinimalListStore } from '@pages/repair/state/driver-details-minimal-list-state/repair-minimal-list.store';

// models
import { RepairShopMinimalListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class RepairMinimalResolver {
    private pageIndex: number = 1;
    private pageSize: number = 25;

    constructor(
        private repairService: RepairService,
        private repairMinimalListStore: RepairMinimalListStore
    ) {}
    resolve(): Observable<string | RepairShopMinimalListResponse> {
        return this.repairService
            .getRepairShopMinimalList(this.pageIndex, this.pageSize)
            .pipe(
                tap((repairShopMinimalList) => {
                    const dummy = repairShopMinimalList.pagination.data.map(
                        (dum) => {
                            if (dum.name === '44') {
                                return {
                                    ...dum,
                                    companyOwned: false,
                                };
                            }

                            return dum;
                        }
                    );

                    this.repairMinimalListStore.set(
                        dummy
                        /*   repairShopMinimalList.pagination.data */
                    );
                }),
                catchError(() => {
                    return of('No repair shop data for...');
                })
            );
    }
}
