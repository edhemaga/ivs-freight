import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CompanyStore } from '../state/company-state/company-settings.store';
import { CompanyRepairShopService } from '../pages/settings-location/components/settings-repair-shop/services/company-repairshop.service';
import {
    CompanyRepairShopState,
    CompanyRepairShopStore,
} from '../state/setting-reapir-shop-state/company-repairshop.store';
import { RepairShopNewListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class companyRepairShopResolver
    implements Resolve<CompanyRepairShopState>
{
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
