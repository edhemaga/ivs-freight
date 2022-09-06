import { ShipperItemStore } from './shipper-details.store';
import { ShipperDetailsQuery } from './shipper.details.query';
import { ShipperResponse } from './../../../../../../../../appcoretruckassist/model/shipperResponse';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { ShipperTService } from '../shipper.service';
import { ShipperState } from '../shipper.store';

@Injectable({
  providedIn: 'root',
})
export class ShipperSingleResolver implements Resolve<ShipperState> {
  constructor(
    private shipperService: ShipperTService,
    private shipperDetailsQuery: ShipperDetailsQuery,
    private shipperDetailsStore: ShipperItemStore,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<ShipperState> | Observable<any> {
    const shipper_id = route.paramMap.get('id');
    let ids = parseInt(shipper_id);

    return this.shipperService.getShipperById(ids).pipe(
      catchError(() => {
        this.router.navigate(['/customer']);
        return of('No shipper data for...' + ids);
      }),
      tap((shipperRespon: ShipperResponse) => {
        this.shipperDetailsStore.set([shipperRespon]);
      })
    );
  }
}
