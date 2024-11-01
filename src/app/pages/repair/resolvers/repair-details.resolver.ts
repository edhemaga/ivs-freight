import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Observable, forkJoin, tap } from 'rxjs';

// Store
import { RepairDetailsState } from '@pages/repair/state/repair-details-state/repair-details.store';

// Services
import { RepairDetailsService } from '@pages/repair/services';
import { RepairService } from '@shared/services/repair.service';

@Injectable({
    providedIn: 'root',
})
export class RepairDetailsResolver {
    constructor(
        private repairDetailsService: RepairDetailsService,
        private repairservice: RepairService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<RepairDetailsState> {
        const repairShopId = +route.paramMap.get('id');

        const repairShop$ = this.repairservice.getRepairShopById(
            repairShopId,
            true
        );

        const repairList$ =
            this.repairDetailsService.getRepairList(repairShopId);

        const repairShopMinimalList$ =
            this.repairDetailsService.getRepairShopMinimalList(1, 25);
        const repairedVehicleList$ =
            this.repairDetailsService.getRepairedVehicle(repairShopId, 1, 25);

        return forkJoin({
            repairShop: repairShop$,
            repairList: repairList$,
            repairedVehicleList: repairedVehicleList$,
            repairShopMinimalList: repairShopMinimalList$,
        }).pipe(
            tap((data) => {
                this.repairDetailsService.updateRepairShop = data.repairShop;
                this.repairDetailsService.updateRepairList = data.repairList;
                this.repairDetailsService.updateRepairedVehicleList =
                    data.repairedVehicleList;
                this.repairDetailsService.updateRepairShopMinimal =
                    data.repairShopMinimalList;
            })
        );
    }
}
