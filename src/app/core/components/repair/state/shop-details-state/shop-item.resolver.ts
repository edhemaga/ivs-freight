import { RepairShopResponse } from '../../../../../../../appcoretruckassist/model/repairShopResponse';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { RepairTService } from '../repair.service';
import { ShopDetailsQuery } from './shop-details.query';
import { ShopItemState, ShopItemStore } from './shop-detail.store';

@Injectable({
  providedIn: 'root',
})
export class ShopRepairItemResolver implements Resolve<ShopItemState> {
  constructor(
    private shopService: RepairTService,
    private shopDetailQuery: ShopDetailsQuery,
    private shopDetailStore: ShopItemStore,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ShopItemState> | Observable<any> {
    const shop_id = route.paramMap.get('id');
    let id = parseInt(shop_id);

    return this.shopService.getRepairShopById(id).pipe(
      catchError(() => {
        this.router.navigate(['/repair']);
        return of('No shop data for...' + id);
      }),
      tap((shopRespon: RepairShopResponse) => {
        this.shopDetailStore.set({ ids: shopRespon });
      })
    );
  }
}
