import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// store
import {
    ShipperDetailsState,
    ShipperDetailsStore,
} from '@pages/customer/state/shipper-state/shipper-details-state/shipper-details.store';

@Injectable({ providedIn: 'root' })
export class ShipperDetailsQuery extends QueryEntity<ShipperDetailsState> {
    constructor(protected shipperDetailsStore: ShipperDetailsStore) {
        super(shipperDetailsStore);
    }
}
