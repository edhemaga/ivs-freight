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
            tap((repairTrailerPagination) => {
                this.repairShopStore.set(
                    repairTrailerPagination.pagination.data
                );
            })
        );
    }
}
