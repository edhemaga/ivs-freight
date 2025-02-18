import { Injectable } from '@angular/core';

import { Observable, of, catchError, tap } from 'rxjs';

// store
import { CompanyRepairShopStore } from '@pages/settings/state/setting-reapir-shop-state/company-repairshop.store';

// services
import { CompanyRepairShopService } from '@pages/settings/services/company-repairshop.service';

// models
import { RepairShopNewListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class CompanyRepairShopResolver {
    constructor(
        private companyRepairService: CompanyRepairShopService,

        // store
        private companyRepairShopStore: CompanyRepairShopStore
    ) {}
    resolve(): Observable<RepairShopNewListResponse> {
        return this.companyRepairService
            .getRepairShopList(
                1,
                undefined,
                true,
                false,
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
                catchError(() => {
                    return of('No RepairData data...');
                }),
                tap((repairShopPagination: RepairShopNewListResponse) => {
                    localStorage.setItem(
                        'repairTruckTrailerTableCount',
                        JSON.stringify({
                            repairShops: repairShopPagination.repairShopCount,
                        })
                    );

                    this.companyRepairShopStore.set(
                        repairShopPagination.pagination.data
                    );
                })
            );
    }
}
