import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// store
import { ShipperStore } from '@pages/customer/state/shipper-state/shipper.store';

// service
import { ShipperService } from '@pages/customer/services';

// models
import { ShipperListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class ShipperResolver {
    constructor(
        private shipperStore: ShipperStore,

        // services
        private shipperService: ShipperService
    ) {}
    resolve(): Observable<ShipperListResponse> {
        return this.shipperService
            .getShippersList(null, null, null, null, 1, 25, null)
            .pipe(
                tap((shipperPagination) => {
                    localStorage.setItem(
                        'brokerShipperTableCount',
                        JSON.stringify({
                            broker: shipperPagination.brokerCount,
                            shipper: shipperPagination.shipperCount,
                        })
                    );

                    this.shipperStore.set(shipperPagination.pagination.data);
                })
            );
    }
}
