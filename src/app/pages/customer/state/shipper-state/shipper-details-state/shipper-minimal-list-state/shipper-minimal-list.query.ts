import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import {
    ShipperMinimalListState,
    ShipperMinimalListStore,
} from './shipper-minimal-list.store';

@Injectable({ providedIn: 'root' })
export class ShipperMinimalListQuery extends QueryEntity<ShipperMinimalListState> {
    constructor(protected shipperMinimalListStore: ShipperMinimalListStore) {
        super(shipperMinimalListStore);
    }
}
