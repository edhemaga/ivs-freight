import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import {
    ShipperMinimalListState,
    ShipperMinimalListStore,
} from '@pages/customer/state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal-list.store';

@Injectable({ providedIn: 'root' })
export class ShipperMinimalListQuery extends QueryEntity<ShipperMinimalListState> {
    constructor(protected shipperMinimalListStore: ShipperMinimalListStore) {
        super(shipperMinimalListStore);
    }
}
