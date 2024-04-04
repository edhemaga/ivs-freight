import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import {
    ShipperDetailsListState,
    ShipperDetailsListStore,
} from './shipper-details-list.store';

@Injectable({ providedIn: 'root' })
export class ShipperDetailsListQuery extends QueryEntity<ShipperDetailsListState> {
    constructor(protected shipperDetailsListStore: ShipperDetailsListStore) {
        super(shipperDetailsListStore);
    }
}
