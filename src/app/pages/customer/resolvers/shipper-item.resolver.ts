import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, tap } from 'rxjs';

// services
import { ShipperService } from '@pages/customer/services';

// store
import { ShipperDetailsStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-details.store';
import { ShipperDetailsListStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-details-list-state/shipper-details-list.store';

// models
import { ShipperResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class ShipperItemResolver {
    constructor(
        private shipperService: ShipperService,

        // store
        private shipperDetailsStore: ShipperDetailsStore,
        private sls: ShipperDetailsListStore
    ) {}
    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<ShipperResponse[]> | Observable<any> {
        const shipper_id = route.paramMap.get('id');
        const ids = parseInt(shipper_id);

        const shipperData$ = this.shipperService.getShipperById(ids);

        const shipperLoads$ = this.shipperService.getShipperLoads(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            ids
        );

        return forkJoin({
            shipperData: shipperData$,
            shipperLoads: shipperLoads$,
        }).pipe(
            tap((data) => {
                const shipperData = data.shipperData;
                const loadData = data.shipperLoads?.loads?.data;

                shipperData.loadStops = loadData ? loadData : [];

                this.sls.add(shipperData);
                this.shipperDetailsStore.set([shipperData]);
            })
        );
    }
}
