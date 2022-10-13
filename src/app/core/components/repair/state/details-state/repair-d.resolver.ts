import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { RepairDService } from './repair-d.service';
import { RepairDState } from './repair-d.store';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RepairDResolver implements Resolve<RepairDState> {
  constructor(private repairDService: RepairDService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<RepairDState> {
    const repairShopId = +route.paramMap.get('id');

    const repairShop$ = this.repairDService.getRepairShopById(repairShopId);

    const repairList$ = this.repairDService.getRepairList(
      repairShopId,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );

    const repairShopMinimalList$ = this.repairDService.getRepairShopMinimalList(
      1,
      25
    );

    return forkJoin({
      repairShop: repairShop$,
      repairList: repairList$,
      repairShopMinimalList: repairShopMinimalList$,
    }).pipe(
      tap((data) => {
        console.log('resolver data: ', data);
        this.repairDService.updateRepairShop(data.repairShop);
        this.repairDService.updateRepairList(data.repairList);
        this.repairDService.updateRepairShopMinimal(data.repairShopMinimalList);
      })
    );
  }
}
