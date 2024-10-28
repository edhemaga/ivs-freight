import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// Store
import { RepairShopStore } from '@pages/repair/state/repair-shop-state/repair-shop.store';

// Services
import { RepairService } from '@shared/services/repair.service';

// models
import { RepairShopNewListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class RepairShopResolver {
    constructor(
        private repairService: RepairService,
        private repairShopStore: RepairShopStore
    ) {}

    resolve(): Observable<RepairShopNewListResponse> {
        return this.repairService
            .getRepairShopList(
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
            )
            .pipe(
                tap((repairTrailerPagination) => {
                    this.repairShopStore.set(
                        repairTrailerPagination.pagination.data
                    );
                })
            );
    }
}
