import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// store
import {
    ShipperState,
    ShipperStore,
} from '@pages/customer/state/shipper-state/shipper.store';

@Injectable({ providedIn: 'root' })
export class ShipperQuery extends QueryEntity<ShipperState> {
    constructor(protected shippeStore: ShipperStore) {
        super(shippeStore);
    }
}
