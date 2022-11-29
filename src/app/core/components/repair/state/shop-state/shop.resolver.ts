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
        return this.repairService
            .getRepairShopList(
                1,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                1,
                25
            )
            .pipe(
                catchError(() => {
                    return of('No shops data...');
                }),
                tap((repairPagination: RepairShopListResponse) => {
                    localStorage.setItem(
                        'repairShopTableCount',
                        JSON.stringify({
                            repairShops: repairPagination.repairShopCount,
                        })
                    );

                    this.shopStore.set(repairPagination.pagination.data);
                })
            );
    }
}
