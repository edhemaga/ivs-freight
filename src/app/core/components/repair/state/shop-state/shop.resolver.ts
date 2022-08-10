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
  constructor(
    private repairService: RepairTService,
    private shopStore: ShopStore
  ) {}

  resolve(): Observable<ShopState | boolean> {
    console.log('Poziva se ShopResolver')
    return this.repairService
      .getRepairShopList(1, undefined, undefined, 1, 25)
      .pipe(
        catchError(() => {
          return of('No shops data...');
        }),
        tap((repairPagination: RepairShopListResponse) => {
          localStorage.setItem(
            'repairShopTableCount',
            JSON.stringify({
              repairShops: repairPagination.pagination.count,
            })
          );

          this.shopStore.set(repairPagination.pagination.data);
        })
      );
  }
}
