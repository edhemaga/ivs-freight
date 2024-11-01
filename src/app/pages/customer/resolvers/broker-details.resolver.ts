import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { Observable, forkJoin, tap } from 'rxjs';

// services
import { BrokerService } from '@pages/customer/services';

// store
import { BrokerDetailsStore } from '@pages/customer/state/broker-details-state/broker-details.store';
import { BrokerDetailsListStore } from '@pages/customer/state/broker-details-state/broker-details-list-state/broker-details-list.store';

// models
import { BrokerResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class BrokerDetailsResolver {
    constructor(
        // Router
        private router: Router,

        // Services
        private brokerService: BrokerService,

        // Store
        private brokerDetailsStore: BrokerDetailsStore,
        private bls: BrokerDetailsListStore
    ) {}
    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<BrokerResponse[]> | Observable<any> {
        const broker_id = route.paramMap.get('id');
        let ids = parseInt(broker_id);

        const brokerData$ = this.brokerService.getBrokerById(ids);

        const brokerLoads$ = this.brokerService.getBrokerLoads(
            null,
            null,
            null,
            null,
            null,
            null,
            ids
        );

        const brokerPaidInvoiceAging$ =
            this.brokerService.getBrokerInvoiceAging(ids, true);

        const brokerUnpaidInvoiceAging$ =
            this.brokerService.getBrokerInvoiceAging(ids, false);

        return forkJoin({
            brokerData: brokerData$,
            brokerLoads: brokerLoads$,
            brokerPaidInvoiceAging: brokerPaidInvoiceAging$,
            brokerUnpaidInvoiceAging: brokerUnpaidInvoiceAging$,
        }).pipe(
            tap((data) => {
                let brokerRespone = data.brokerData;

                brokerRespone.loadStops = data.brokerLoads;
                brokerRespone.brokerPaidInvoiceAgeing =
                    data.brokerPaidInvoiceAging;
                brokerRespone.brokerUnpaidInvoiceAgeing =
                    data.brokerUnpaidInvoiceAging;

                this.bls.add(brokerRespone);
                this.brokerDetailsStore.set([brokerRespone]);
            })
        );
    }
}
