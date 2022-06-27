import { ShipperTService } from './shipper.service';

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap,take } from 'rxjs/operators';
import { ShipperState, ShipperStore } from './shipper.store';

@Injectable({
  providedIn: 'root',
})
export class ShipperSingleResolver implements Resolve<ShipperState> {
  constructor(
    private shipperService: ShipperTService,
    private shipperStore: ShipperStore
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ShipperState> | Observable<any> {
    const shipper_id = route.paramMap.get('id');
    
    return this.shipperService.getShipperById(+shipper_id).pipe(
      catchError(() => {
        return of('No shop data for...' + shipper_id);
      }),
      take(1)
      // tap((driverRespon: RepairShopResponse) => {
      //   this.shopStore.set({ entities: driverRespon[shop_id] });
      // })
    );
  }
}
