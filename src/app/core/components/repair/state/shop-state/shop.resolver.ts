import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ShopState, ShopStore } from './shop.store';
import { RepairTService } from '../repair.service';
import { RepairShopListResponse } from 'appcoretruckassist';

@Injectable({
  providedIn: 'root',
})
export class ShopResolver implements Resolve<ShopState> {
  pageIndex: number = 1;
  pageSize: number = 25;

  constructor(
    private repairService: RepairTService,
    private shopStore: ShopStore
  ) {}
  resolve(): Observable<ShopState | boolean> {
    return this.repairService
      .getRepairsList(1, undefined, this.pageIndex, this.pageSize)
      .pipe(
        catchError(() => {
          return of('No shops data...');
        }),
        tap((repairPagination: RepairShopListResponse) => {
          console.log('Pozvao se api, podaci za repair');
          console.log(repairPagination);

          this.shopStore.set(repairPagination.pagination.data);
        })
      );

    /* if (this.shopStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.repairService
        .getRepairsList(undefined, undefined, this.pageIndex, this.pageSize)
        .pipe(
          catchError(() => {
            return of('No shops data...');
          }),
          tap((repairPagination: RepairShopListResponse) => {
            this.shopStore.set(repairPagination.pagination.data);
          })
        );
    } */
  }
}
