import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

// Store
import { RepairDetailsState } from '../state/repair-details-state/repair-details.store';

// Services
import { RepairDetailsService } from '../services/repair-details.service';
import { RepairService } from '../../../shared/services/repair.service';

@Injectable({
    providedIn: 'root',
})
export class RepairDetailsResolver implements Resolve<RepairDetailsState> {
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

        const repairList$ = this.repairDetailsService.getRepairList(repairShopId);

        const repairShopMinimalList$ =
            this.repairDetailsService.getRepairShopMinimalList(1, 25);
        const repairedVehicleList$ = this.repairDetailsService.getRepairedVehicle(
            repairShopId,
            1,
            25
        );
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
