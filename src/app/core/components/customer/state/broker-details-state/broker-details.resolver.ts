import { BrokerResponse } from 'appcoretruckassist';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { BrokerTService } from '../broker-state/broker.service';
import { BrokerDetailsQuery } from './broker-details.query';
import { BrokerItemStore } from './broker-details.store';

@Injectable({
  providedIn: 'root',
})
export class BrokerSingleResolver implements Resolve<BrokerResponse[]> {
  constructor(
    private brokerService: BrokerTService,
    private brokerDetailsQuery: BrokerDetailsQuery,
    private brokerDetailsStore: BrokerItemStore
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<BrokerResponse[]> | Observable<any> {
    const broker_id = route.paramMap.get('id');
    let ids = parseInt(broker_id);
    if (this.brokerDetailsQuery.hasEntity(ids)) {
      return this.brokerDetailsQuery.selectEntity(ids).pipe(
        catchError((error) => {
          return of('erorr');
        }),
        take(1)
      );
    } else {
      return this.brokerService.getBrokerById(ids).pipe(
        catchError(() => {
          return of('No broker data for...' + ids);
        }),
        tap((brokerRespon: BrokerResponse) => {
          this.brokerDetailsStore.set({ ids: brokerRespon });
        })
      );
    }
  }
}
