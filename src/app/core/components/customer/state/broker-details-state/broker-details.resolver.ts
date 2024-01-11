import { BrokerResponse } from 'appcoretruckassist';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { BrokerTService } from '../broker-state/broker.service';
import { BrokerDetailsStore } from './broker-details.store';
import { BrokerDetailsListQuery } from './broker-details-list-state/broker-details-list.query';
import { BrokerDetailsListStore } from './broker-details-list-state/broker-details-list.store';

@Injectable({
    providedIn: 'root',
})
export class BrokerDetailsResolver implements Resolve<BrokerResponse[]> {
    constructor(
        private brokerService: BrokerTService,
        private brokerDetailsStore: BrokerDetailsStore,
        private router: Router,
        private bls: BrokerDetailsListStore,
        private blq: BrokerDetailsListQuery
    ) {}
    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<BrokerResponse[]> | Observable<any> {
        const broker_id = route.paramMap.get('id');
        let ids = parseInt(broker_id);

        const brokerData$ = this.brokerService.getBrokerById(ids);

        const brokerLoads$ = this.brokerService.getBrokerLoads(ids);

        return forkJoin({
            brokerData: brokerData$,
            brokerLoads: brokerLoads$,
        }).pipe(
            tap((data) => {
                let brokerRespone = data.brokerData;
                brokerRespone.loadStops = data.brokerLoads;
                this.bls.add(brokerRespone);
                this.brokerDetailsStore.set([brokerRespone]);
            })
        );
    }
}
