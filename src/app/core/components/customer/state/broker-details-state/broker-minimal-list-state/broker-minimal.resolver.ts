import { BrokerMinimalListStore } from './broker-minimal.store';
import { BrokerMinimalListResponse } from './../../../../../../../../appcoretruckassist/model/brokerMinimalListResponse';
import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BrokerTService } from '../../broker-state/broker.service';

@Injectable({
   providedIn: 'root',
})
export class BrokerMinimalListResolver
   implements Resolve<BrokerMinimalListResponse>
{
   pageIndex: number = 1;
   pageSize: number = 25;
   count: number;
   constructor(
      private brokerService: BrokerTService,
      private brokerMinimalListStore: BrokerMinimalListStore
   ) {}
   resolve(
      route: ActivatedRouteSnapshot
   ): Observable<BrokerMinimalListResponse> | Observable<any> {
      return this.brokerService
         .getBrokerMinimalList(this.pageIndex, this.pageSize, this.count)
         .pipe(
            catchError((error) => {
               return of('No broker data for...');
            }),
            tap((brokerMinimalList: BrokerMinimalListResponse) => {
               this.brokerMinimalListStore.set(
                  brokerMinimalList.pagination.data
               );
            })
         );
   }
}
