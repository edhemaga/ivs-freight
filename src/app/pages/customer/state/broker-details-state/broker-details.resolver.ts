import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';

// Services
import { BrokerTService } from '../broker-state/broker.service';

// Store
import { BrokerDetailsStore } from './broker-details.store';
import { BrokerDetailsListStore } from './broker-details-list-state/broker-details-list.store';
import { BrokerDetailsListQuery } from './broker-details-list-state/broker-details-list.query';

// Models
import { BrokerResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class BrokerDetailsResolver implements Resolve<BrokerResponse[]> {
    constructor(
        // Router
        private router: Router,
        
        // Services
        private brokerService: BrokerTService,

        // Store
        private brokerDetailsStore: BrokerDetailsStore,
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
