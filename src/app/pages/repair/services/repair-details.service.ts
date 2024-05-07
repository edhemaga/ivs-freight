import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// Store
import { RepairDetailsStore } from '@pages/repair/state/repair-details-state/repair-details.store';

// Models
import {
    RepairShopService,
    RepairService,
    RepairListResponse,
    RepairShopMinimalListResponse,
    RepairedVehicleListResponse,
    RepairShopResponse,
    RepairShopMinimalResponse,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class RepairDetailsService {
    public currentIndex: number;
    public repairShopList: any;
    public repairShopId: number;

    constructor(
        private repairShopService: RepairShopService,
        private repairService: RepairService,
        private repairDetailsStore: RepairDetailsStore
    ) {}

    // Get Repair List
    public getRepairList(
        repairShopId?: number,
        unitType?: number,
        dateFrom?: string,
        dateTo?: string,
        isPM?: number,
        categoryIds?: number[],
        pmTruckTitles?: string[],
        pmTrailerTitles?: string[],
        isOrder?: boolean,
        truckNumbers?: string[],
        trailerNumbers?: string[],
        costFrom?: number,
        costTo?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: any,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<RepairListResponse> {
        return this.repairService.apiRepairListGet(
            repairShopId,
            unitType,
            dateFrom,
            dateTo,
            isPM,
            categoryIds,
            pmTruckTitles,
            pmTrailerTitles,
            isOrder,
            truckNumbers,
            trailerNumbers,
            costFrom,
            costTo,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }
    // Get Repair Minimal List
    public getRepairShopMinimalList(
        pageIndex?: number,
        pageSize?: number,
        companyId?: number
    ): Observable<RepairShopMinimalListResponse> {
        return this.repairShopService.apiRepairshopListMinimalGet(
            pageIndex,
            pageSize,
            companyId
        );
    }
    //get repreidVehicle list
    public getRepairedVehicle(
        repairShopId?: number,
        pageIndex?: number,
        pageSize?: number
    ): Observable<RepairedVehicleListResponse> {
        return this.repairShopService.apiRepairshopRepairedvehicleGet(
            repairShopId,
            pageIndex,
            pageSize
        );
    }
    set updateRepairShop(data: RepairShopResponse) {
        const repairShop: RepairShopResponse[] = Object.assign(
            [],
            this.repairDetailsStore.getValue().repairShop
        );

        const index = repairShop.findIndex((item) => item.id === data.id);

        if (index === -1) {
            this.repairDetailsStore.update((store) => {
                return {
                    ...store,
                    repairShop: [...store.repairShop, data],
                };
            });
        } else {
            repairShop[index] = data;

            this.repairDetailsStore.update((store) => {
                return {
                    ...store,
                    repairShop: repairShop,
                };
            });
        }
    }

    set updateRepairList(data: RepairListResponse) {
        this.repairDetailsStore.update((store) => {
            return {
                ...store,
                repairList: data,
            };
        });
    }

    set updateRepairedVehicleList(data: RepairedVehicleListResponse) {
        this.repairDetailsStore.update((store) => {
            return {
                ...store,
                repairedVehicleList: data,
            };
        });
    }

    set updateRepairShopMinimal(data: RepairShopMinimalResponse) {
        this.repairDetailsStore.update((store) => {
            return {
                ...store,
                repairShopMinimal: data,
            };
        });
    }
}
