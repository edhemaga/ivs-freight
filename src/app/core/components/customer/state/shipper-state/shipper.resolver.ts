import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ShipperListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ShipperTService } from './shipper.service';
import { ShipperState, ShipperStore } from './shipper.store';

@Injectable({
  providedIn: 'root',
})
export class ShipperResolver implements Resolve<ShipperState> {
  tableTab: number = 1;
  pageIndex: number = 1;
  pageSize: number = 25;

  constructor(
    private shipperService: ShipperTService,
    private shipperStore: ShipperStore
  ) {}
  resolve(): Observable<ShipperState | boolean> {
    return this.shipperService
    .getShippersList(this.tableTab, this.pageIndex, this.pageSize)
    .pipe(
      catchError(() => {
        return of('No shippers data...');
      }),
      tap((shipperPagination: ShipperListResponse) => {
        this.shipperStore.set(shipperPagination.pagination.data);
      })
    );
    /* if (this.shipperStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.shipperService
        .getShippersList(this.tableTab, this.pageIndex, this.pageSize)
        .pipe(
          catchError(() => {
            return of('No drivers data...');
          }),
          tap((shipperPagination: ShipperListResponse) => {
            this.shipperStore.set(shipperPagination.pagination.data);
          })
        );
    } */
  }
}
