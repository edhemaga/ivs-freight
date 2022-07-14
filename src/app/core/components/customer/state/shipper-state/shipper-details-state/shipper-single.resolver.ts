import { ShipperItemStore } from './shipper-details.store';
import { ShipperDetailsQuery } from './shipper.details.query';
import { ShipperResponse } from './../../../../../../../../appcoretruckassist/model/shipperResponse';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { ShipperTService } from '../shipper.service';

@Injectable({
  providedIn: 'root',
})
export class ShipperSingleResolver implements Resolve<ShipperResponse[]> {
  constructor(
    private shipperService: ShipperTService,
    private shipperDetailsQuery: ShipperDetailsQuery,
    private shipperDetailsStore: ShipperItemStore
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<ShipperResponse[]> | Observable<any> {
    const shipper_id = route.paramMap.get('id');
    let ids = parseInt(shipper_id);

    return this.shipperService.getShipperById(ids).pipe(
      catchError(() => {
        return of('No shipper data for...' + ids);
      }),
      tap((shipperRespon: ShipperResponse) => {
        this.shipperDetailsStore.set({ 0: shipperRespon });
      })
    );
  }
}
