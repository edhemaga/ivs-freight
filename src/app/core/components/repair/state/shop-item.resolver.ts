import { RepairShopResponse } from './../../../../../../appcoretruckassist/model/repairShopResponse';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ShopTService } from './shop.service';
import { ShopState, ShopStore } from './shop.store';


@Injectable({
  providedIn: 'root',
})
export class ShopRepairItemResolver implements Resolve<ShopState> {
  constructor(
    private shopService: ShopTService,
    private shopStore: ShopStore,
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ShopState> | Observable<any> {
     const shop_id=route.paramMap.get('id')    
    return this.shopService.getRepairShopById(+shop_id).pipe(
        catchError((error)=>{
            this.shopStore.set({ entities: [] });
            return of('No shop data for...' + shop_id);
        }),
        tap((driverRespon: RepairShopResponse) => {
            this.shopStore.set({ entities: driverRespon[shop_id] })
          })
    );
  }
}