import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { RepairDService } from './repair-d.service';
import { RepairDState } from './repair-d.store';
import { tap } from 'rxjs/operators';
import { RepairTService } from '../repair.service';

@Injectable({
    providedIn: 'root',
})
export class RepairDResolver implements Resolve<RepairDState> {
    constructor(
        private repairDService: RepairDService,
        private repairTservice: RepairTService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<RepairDState> {
        const repairShopId = +route.paramMap.get('id');

        const repairShop$ = this.repairTservice.getRepairShopById(
            repairShopId,
            true
        );

        const repairList$ = this.repairDService.getRepairList(
            repairShopId,
        );

        const repairShopMinimalList$ =
            this.repairDService.getRepairShopMinimalList(1, 25);
        const repairedVehicleList$ = this.repairDService.getRepairedVehicle(
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
                this.repairDService.updateRepairShop = data.repairShop;
                this.repairDService.updateRepairList = data.repairList;
                this.repairDService.updateRepairedVehicleList =
                    data.repairedVehicleList;
                this.repairDService.updateRepairShopMinimal =
                    data.repairShopMinimalList;
                
                })
        );
    }
}
