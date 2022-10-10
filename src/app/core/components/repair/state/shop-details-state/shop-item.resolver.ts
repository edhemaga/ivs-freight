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
import { ShopDetailsListQuery } from './shop-details-list-state/shop-details-list.query';
import { ShopDetailsListStore } from './shop-details-list-state/shop-details-list.store';

@Injectable({
  providedIn: 'root',
})
export class ShopRepairItemResolver implements Resolve<ShopItemState> {
  constructor(
    private shopService: RepairTService,
    private shopDetailQuery: ShopDetailsQuery,
    private shopDetailStore: ShopItemStore,
    private router: Router,
    private sdls: ShopDetailsListStore,
    private sdlq: ShopDetailsListQuery
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ShopItemState> | Observable<any> {
    const shop_id = route.paramMap.get('id');
    let id = parseInt(shop_id);

    // const data = forkJoin({
    //   repairShop: this.shopService.getRepairShopById(id).pipe(
    //     catchError(() => {
    //       this.router.navigate(['/repair']);
    //       return of('No shop data for...' + id);
    //     }),
    //     tap((shopRespon: RepairShopResponse) => {
    //       // this.sdls.add(shopRespon);
    //       this.shopDetailStore.set([shopRespon]);
    //     })
    //   ),
    //   repairs: this.shopService
    //     .getRepairList(
    //       id,
    //       null,
    //       null,
    //       null,
    //       null,
    //       null,
    //       null,
    //       null,
    //       null,
    //       null,
    //       null,
    //       null,
    //       null,
    //       null,
    //       null,
    //       null
    //     )
    //     .pipe(
    //       catchError(() => {
    //         return of('No repair data...');
    //       }),
    //       tap((repair: RepairListResponse) => {
    //         this.repairDetailsStore.set([repair.pagination]);
    //       })
    //     ),
    // });

    // return data;
    if (this.sdlq.hasEntity(id)) {
      return this.sdlq.selectEntity(id).pipe(
        tap((shopResponse: RepairShopResponse) => {
          this.shopDetailStore.set([shopResponse]);
        }),
        take(1)
      );
    } else {
      return this.shopService.getRepairShopById(id).pipe(
        catchError(() => {
          this.router.navigate(['/repair']);
          return of('No shop data for...' + id);
        }),
        tap((shopRespon: RepairShopResponse) => {
          this.sdls.add(shopRespon);
          this.shopDetailStore.set([shopRespon]);
        })
      );
    }
  }
}
