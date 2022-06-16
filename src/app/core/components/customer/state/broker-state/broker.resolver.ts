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
  pageIndex: number = 1;
  pageSize: number = 25;

  constructor(
    private brokerService: BrokerTService,
    private brokerStore: BrokerStore
  ) {}
  resolve(): Observable<BrokerState | boolean> {
    return this.brokerService
    .getBrokerList(null, null, this.pageIndex, this.pageSize)
    .pipe(
      catchError(() => {
        return of('No brokers data...');
      }),
      tap((brokerPagination: GetBrokerListResponse) => {
        this.brokerStore.set(brokerPagination.pagination.data);
      })
    );
    /* if (this.brokerStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.brokerService
        .getBrokerList(this.tableTab, this.pageIndex, this.pageSize)
        .pipe(
          catchError(() => {
            return of('No brokers data...');
          }),
          tap((brokerPagination: GetBrokerListResponse) => {
            this.brokerStore.set(brokerPagination.pagination.data);
          })
        );
    } */
  }
}
