import { RepairShopResponse } from '../../../../../../../appcoretruckassist/model/repairShopResponse';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { forkJoin, Observable, of, Subject, takeUntil } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { RepairTService } from '../repair.service';
import { ShopDetailsQuery } from './shop-details.query';
import { ShopItemState, ShopItemStore } from './shop-detail.store';
import { ShopDetailsListQuery } from './shop-details-list-state/shop-details-list.query';
import { ShopDetailsListStore } from './shop-details-list-state/shop-details-list.store';
import { RepairListResponse } from 'appcoretruckassist';
import { RepairDetailsStore } from '../repair-details-state/repair-details.store';

@Injectable({
  providedIn: 'root',
})
export class ShopRepairItemResolver implements Resolve<ShopItemState> {
  private destroy$ = new Subject<void>();
  constructor(
    private shopService: RepairTService,
    private shopDetailQuery: ShopDetailsQuery,
    private shopDetailStore: ShopItemStore,
    private shopDetailsListStore: ShopDetailsListStore,
    private router: Router,
    private sdls: ShopDetailsListStore,
    private sdlq: ShopDetailsListQuery,
    private repairDetailsStore: RepairDetailsStore
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ShopItemState> | Observable<any> {
    const shop_id = route.paramMap.get('id');
    let id = +shop_id;

    forkJoin({
      repairShop: this.shopService.getRepairShopById(id),
      repairsList: this.shopService.getRepairList(
        id,
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
      ),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log(res);

        this.shopDetailsListStore.update((store) => {
          return {
            ...store,
            repairShopDetails: res.repairShop,
          };
        });
        this.repairDetailsStore.update((store) => {
          return {
            ...store,
            repairDetails: res.repairsList.pagination,
          };
        });
      });
    return of(id);
    // if (this.sdlq.hasEntity(id)) {
    //   return this.sdlq.selectEntity(id).pipe(
    //     tap((shopResponse: RepairShopResponse) => {
    //       this.shopDetailStore.set([shopResponse]);
    //     }),
    //     take(1)
    //   );
    // } else {
    //   return this.shopService.getRepairShopById(id).pipe(
    //     catchError(() => {
    //       this.router.navigate(['/repair']);
    //       return of('No shop data for...' + id);
    //     }),
    //     tap((shopRespon: RepairShopResponse) => {
    //       this.sdls.add(shopRespon);
    //       this.shopDetailStore.set([shopRespon]);
    //     })
    //   );
    // }
  }
}
