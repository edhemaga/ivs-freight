import { Injectable } from '@angular/core';

import { Observable, of, catchError, tap } from 'rxjs';

// services
import { BrokerService } from '@pages/customer/services';

// store
import { BrokerMinimalListStore } from '@pages/customer/state/broker-details-state/broker-minimal-list-state/broker-minimal-list.store';

// models
import { BrokerMinimalListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class BrokerMinimalListResolver {
    private pageIndex: number = 1;
    private pageSize: number = 25;
    private count: number;

    constructor(
        // Services
        private brokerService: BrokerService,

        // Store
        private brokerMinimalListStore: BrokerMinimalListStore
    ) {}

    resolve(): Observable<BrokerMinimalListResponse> | Observable<any> {
        return this.brokerService
            .getBrokerMinimalList(this.pageIndex, this.pageSize, this.count)
            .pipe(
                catchError(() => {
                    return of('No broker data for@pages/customer.');
                }),
                tap((brokerMinimalList: BrokerMinimalListResponse) => {
                    this.brokerMinimalListStore.set(
                        brokerMinimalList.pagination.data
                    );
                })
            );
    }
}
