import { RepairShopMinimalResponse } from './../../../../../../../../appcoretruckassist/model/repairShopMinimalResponse';
import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import {
  DriverMinimalListResponse,
  DriverMinimalResponsePagination,
  RepairShopMinimalListResponse,
} from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { RepairTService } from '../../repair.service';
import {
  RepairShopMinimalListState,
  RepairShopMinimalListStore,
} from './shop-minimal.store';

@Injectable({
  providedIn: 'root',
})
export class RepairShopMinimalResolver
  implements Resolve<RepairShopMinimalListState>
{
  pageIndex: number = 1;
  pageSize: number = 25;
  count: number;
  constructor(
    private repairShopService: RepairTService,
    private ShopMinimalListStore: RepairShopMinimalListStore
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<RepairShopMinimalListState> | Observable<any> {
    return this.repairShopService
      .getRepairShopMinimalList(this.pageIndex, this.pageSize, this.count)
      .pipe(
        catchError((error) => {
          return of('No repair shop data for...');
        }),
        tap((shopMinimalList: RepairShopMinimalListResponse) => {
          this.ShopMinimalListStore.set(shopMinimalList.pagination.data);
        })
      );
  }
}
