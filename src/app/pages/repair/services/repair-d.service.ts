import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { RepairDStore } from '../state/details-state/repair-d.store';

import { RepairDQuery } from '../state/details-state/repair-d.query';
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
export class RepairDService {
    public currentIndex: number;
    public repairShopList: any;
    public repairShopId: number;
    private destroy$ = new Subject<void>();
    constructor(
        private repairShopService: RepairShopService,
        private repairService: RepairService,
        private repairDStore: RepairDStore,
        private rDq: RepairDQuery
    ) {}

    // Get Repair List
    public getRepairList(
        repairShopId?: number,
        unitType?: number,
        dateFrom?: string,
        dateTo?: string,
        isPM?: number,
        categoryIds?: Array<number>,
        pmTruckTitles?: Array<string>,
        pmTrailerTitles?: Array<string>,
        isOrder?: boolean,
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
            this.repairDStore.getValue().repairShop
        );

        const index = repairShop.findIndex((item) => item.id === data.id);

        if (index === -1) {
            this.repairDStore.update((store) => {
                return {
                    ...store,
                    repairShop: [...store.repairShop, data],
                };
            });
        } else {
            repairShop[index] = data;

            this.repairDStore.update((store) => {
                return {
                    ...store,
                    repairShop: repairShop,
                };
            });
        }
    }

    set updateRepairList(data: RepairListResponse) {
        this.repairDStore.update((store) => {
            return {
                ...store,
                repairList: data,
            };
        });
    }

    set updateRepairedVehicleList(data: RepairedVehicleListResponse) {
        this.repairDStore.update((store) => {
            return {
                ...store,
                repairedVehicleList: data,
            };
        });
    }

    set updateRepairShopMinimal(data: RepairShopMinimalResponse) {
        this.repairDStore.update((store) => {
            return {
                ...store,
                repairShopMinimal: data,
            };
        });
    }
}
