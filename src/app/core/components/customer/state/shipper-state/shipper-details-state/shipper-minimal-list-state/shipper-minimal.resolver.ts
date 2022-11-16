import { ShipperMinimalListResponse } from './../../../../../../../../../appcoretruckassist/model/shipperMinimalListResponse';
import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ShipperTService } from '../../shipper.service';
import { ShipperMinimalListStore } from './shipper-minimal.store';

@Injectable({
  providedIn: 'root',
})
export class ShipperMinimalListResolver
  implements Resolve<ShipperMinimalListResponse>
{
  pageIndex: number = 1;
  pageSize: number = 25;
  count: number;
  constructor(
    private shipperService: ShipperTService,
    private shipperMinimalListStore: ShipperMinimalListStore
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<ShipperMinimalListResponse> | Observable<any> {
    return this.shipperService
      .getShipperMinimalList(this.pageIndex, this.pageSize, this.count)
      .pipe(
        catchError((error) => {
          return of('No shipper data for...');
        }),
        tap((shipperMinimal: ShipperMinimalListResponse) => {
          this.shipperMinimalListStore.set(shipperMinimal.pagination.data);
        })
      );
  }
}
