import { Injectable } from '@angular/core';

import { Observable, of, catchError, tap } from 'rxjs';

// store
import { CompanyStore } from '@pages/settings/state/company-state/company-settings.store';
import {
    CompanyRepairShopState,
    CompanyRepairShopStore,
} from '@pages/settings/state/setting-reapir-shop-state/company-repairshop.store';

// services
import { CompanyRepairShopService } from '@pages/settings/services/company-repairshop.service';

// models
import { RepairShopNewListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class CompanyRepairShopResolver {
    pageIndex: number = 1;
    pageSize: number = 25;
    companyId: number = this.companyStore.getValue().ids[0];
    constructor(
        private companyRepairService: CompanyRepairShopService,
        private companyRepairShopStore: CompanyRepairShopStore,
        private companyStore: CompanyStore
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
                1,
                25
            )
            .pipe(
                catchError(() => {
                    return of('No RepairData data...');
                }),
                tap((repairShopPagination: RepairShopNewListResponse) => {
                    localStorage.setItem(
                        'repairShopTableCount',
                        JSON.stringify({
                            repairShops: repairShopPagination.pagination.count,
                        })
                    );
                    this.companyRepairShopStore.set(
                        repairShopPagination.pagination.data
                    );
                })
            );
    }
}
