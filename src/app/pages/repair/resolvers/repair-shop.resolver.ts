import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// store
import { RepairShopStore } from '@pages/repair/state/repair-shop-state/repair-shop.store';

// services
import { RepairService } from '@shared/services/repair.service';

// models
import { RepairShopNewListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class RepairShopResolver {
    constructor(
        private repairService: RepairService,

        // store
        private repairShopStore: RepairShopStore
    ) {}

    resolve(): Observable<RepairShopNewListResponse> {
        return this.repairService.getRepairShopList().pipe(
            tap((repairShopPagination) => {
                const dummy = repairShopPagination.pagination.data.map(
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

                this.repairShopStore.set(
                    dummy
                    /*    repairTrailerPagination.pagination.data */
                );
            })
        );
    }
}
