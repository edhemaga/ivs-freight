import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Observable, forkJoin, tap } from 'rxjs';

// store
import {
    RepairDetailsState,
    RepairDetailsStore,
} from '@pages/repair/state/repair-details-state/repair-details.store';
import { RepairItemStore } from '@pages/repair/state/repair-details-item-state/repair-details-item.store';

// services
import { RepairService } from '@shared/services/repair.service';

@Injectable({
    providedIn: 'root',
})
export class RepairDetailsResolver {
    constructor(
        private repairService: RepairService,

        // store
        private repairDetailsStore: RepairDetailsStore,
        private repairItemStore: RepairItemStore
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<RepairDetailsState> {
        const pageIndex: number = 1;
        const pageSize: number = 25;

        const repairShopId: number = +route.paramMap.get('id');

        const repairShopData$ =
            this.repairService.getRepairShopById(repairShopId);

        const repairList$ = this.repairService.getRepairList(repairShopId);

        const repairedVehicleList$ =
            this.repairService.getRepairShopRepairedVehicle(
                repairShopId,
                pageIndex,
                pageSize
            );

        return forkJoin({
            repairShopData: repairShopData$,
            repairList: repairList$,
            repairedVehicleList: repairedVehicleList$,
        }).pipe(
            tap((data) => {
                const repairShopData = {
                    ...data?.repairShopData,
                    repairList: data?.repairList?.pagination?.data,
                    repairedVehicleList:
                        data?.repairedVehicleList?.pagination?.data,
                };

                this.repairDetailsStore.add(repairShopData);
                this.repairItemStore.set([repairShopData]);
            })
        );
    }
}
