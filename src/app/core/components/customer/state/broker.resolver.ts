import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetBrokerListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BrokerTService } from './broker.service';
import { BrokerState, BrokerStore } from './broker.store';

@Injectable({
  providedIn: 'root',
})
export class BrokerResolver implements Resolve<BrokerState> {
  tableTab: number = 1;
  pageIndex: number = 1;
  pageSize: number = 25;

  constructor(
    private customerService: BrokerTService,
    private customersStore: BrokerStore
  ) {}
  resolve(): Observable<BrokerState | boolean> {
    if (this.customersStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.customerService
        .getCustomers(this.tableTab, this.pageIndex, this.pageSize)
        .pipe(
          catchError(() => {
            return of('No drivers data...');
          }),
          tap((driverPagination: GetBrokerListResponse) => {
            this.customersStore.set(driverPagination.pagination.data);
          })
        );
    }
  }
}
