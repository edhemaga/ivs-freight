import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RepairShopService } from 'appcoretruckassist';
import { RepairShopNewListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class CompanyRepairShopService {
    constructor(private companyRepairShop: RepairShopService) {}

    // Get RepairShopList List
    // Get Repair List
    public getRepairShopList(
        active?: number,
        pinned?: boolean,
        companyOwned?: boolean,
        categoryIds?: Array<number>,
        _long?: number,
        lat?: number,
        distance?: number,
        costFrom?: number,
        costTo?: number,
        visitedByMe?: boolean,
        driverId?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<RepairShopNewListResponse> {
        return this.companyRepairShop.apiRepairshopListGet(
            active,
            pinned,
            companyOwned,
            categoryIds,
            _long,
            lat,
            distance,
            costFrom,
            costTo,
            visitedByMe,
            driverId,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }
}
