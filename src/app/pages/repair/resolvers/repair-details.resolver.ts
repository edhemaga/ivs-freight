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
import { RepairDetailsService } from '@pages/repair/services';
import { RepairService } from '@shared/services/repair.service';

@Injectable({
    providedIn: 'root',
})
export class RepairDetailsResolver {
    constructor(
        private repairDetailsService: RepairDetailsService,
        private repairservice: RepairService,

        // store
        private repairDetailsStore: RepairDetailsStore,
        private repairItemStore: RepairItemStore
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<RepairDetailsState> {
        const repairShopId = +route.paramMap.get('id');

        const repairShopData$ = this.repairservice.getRepairShopById(
            repairShopId,
            true
        );

        const repairList$ =
            this.repairDetailsService.getRepairList(repairShopId);

        const repairedVehicleList$ =
            this.repairDetailsService.getRepairedVehicle(repairShopId, 1, 25);

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
