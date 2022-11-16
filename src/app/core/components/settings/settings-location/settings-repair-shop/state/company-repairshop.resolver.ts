import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CompanyStore } from '../../../state/company-state/company-settings.store';
import { CompanyRepairShopService } from './company-repairshop.service';
import {
  CompanyRepairShopState,
  CompanyRepairShopStore,
} from './company-repairshop.store';
import { RepairShopListResponse } from '../../../../../../../../appcoretruckassist/model/repairShopListResponse';

@Injectable({
  providedIn: 'root',
})
export class companyRepairShopResolver
  implements Resolve<CompanyRepairShopState>
{
  pageIndex: number = 1;
  pageSize: number = 25;
  companyId: number = this.companyStore.getValue().ids[0];
  constructor(
    private companyRepairService: CompanyRepairShopService,
    private companyRepairShopStore: CompanyRepairShopStore,
    private companyStore: CompanyStore
  ) {}
  resolve(): Observable<CompanyRepairShopState | boolean> {
    return this.companyRepairService
      .getRepairShopList(
        1,
        undefined,
        true,
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
          return of('No RepairData data...');
        }),
        tap((repairShopPagination: RepairShopListResponse) => {
          localStorage.setItem(
            'repairShopTableCount',
            JSON.stringify({
              repairShops: repairShopPagination.pagination.count,
            })
          );
          this.companyRepairShopStore.set(repairShopPagination.pagination.data);
        })
      );
  }
}
