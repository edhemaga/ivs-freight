import { BrokerResponse } from 'appcoretruckassist';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { BrokerTService } from '../broker-state/broker.service';
import { BrokerDetailsQuery } from './broker-details.query';
import { BrokerDetailsStore } from './broker-details.store';

@Injectable({
  providedIn: 'root',
})
export class BrokerDetailsResolver implements Resolve<BrokerResponse[]> {
  constructor(
    private brokerService: BrokerTService,
    private brokerDetailsQuery: BrokerDetailsQuery,
    private brokerDetailsStore: BrokerDetailsStore,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<BrokerResponse[]> | Observable<any> {
    const broker_id = route.paramMap.get('id');
    let ids = parseInt(broker_id);

    return this.brokerService.getBrokerById(ids).pipe(
      catchError(() => {
        this.router.navigate(['/customer']);
        return of('No broker data for...' + ids);
      }),
      tap((brokerRespon: BrokerResponse) => {
        this.brokerDetailsStore.set([brokerRespon]);
      })
    );
  }
}
