import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Services
import { BrokerService } from '../services/broker.service';

// Store
import { BrokerMinimalListStore } from '../state/broker-details-state/broker-minimal-list-state/broker-minimal-list.store';

// Models
import { BrokerMinimalListResponse } from 'appcoretruckassist';

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
