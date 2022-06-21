import { RepairShopResponse } from './../../../../../../appcoretruckassist/model/repairShopResponse';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap,take } from 'rxjs/operators';
import { RepairTService } from './repair.service';
import { ShopState, ShopStore } from './shop-state/shop.store';

@Injectable({
  providedIn: 'root',
})
export class ShopRepairItemResolver implements Resolve<ShopState> {
  constructor(
    private shopService: RepairTService,
    private shopStore: ShopStore
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ShopState> | Observable<any> {
    const shop_id = route.paramMap.get('id');
    
    return this.shopService.getRepairShopById(+shop_id).pipe(
      catchError(() => {
        return of('No shop data for...' + shop_id);
      }),
      take(1)
      // tap((driverRespon: RepairShopResponse) => {
      //   this.shopStore.set({ entities: driverRespon[shop_id] });
      // })
    );
  }
}
