import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import {
    ShipperDetailsListState,
    ShipperDetailsListStore,
} from '@pages/customer/state/shipper-state/shipper-details-state/shipper-details-list-state/shipper-details-list.store';

@Injectable({ providedIn: 'root' })
export class ShipperDetailsListQuery extends QueryEntity<ShipperDetailsListState> {
    constructor(protected shipperDetailsListStore: ShipperDetailsListStore) {
        super(shipperDetailsListStore);
    }
}
