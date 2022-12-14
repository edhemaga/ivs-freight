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
    constructor(
        private brokerService: BrokerTService,
        private brokerStore: BrokerStore
    ) {}
    resolve(): Observable<BrokerState | boolean> {
        return this.brokerService
            .getBrokerList(
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
                    return of('No brokers data...');
                }),
                tap((brokerPagination: GetBrokerListResponse) => {
                    localStorage.setItem(
                        'brokerShipperTableCount',
                        JSON.stringify({
                            broker: brokerPagination.brokerCount,
                            shipper: brokerPagination.shipperCount,
                        })
                    );

                    this.brokerStore.set(brokerPagination.pagination.data);
                })
            );
    }
}
