import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ShipperState, ShipperStore } from './shipper.store';

@Injectable({ providedIn: 'root' })
export class ShipperQuery extends QueryEntity<ShipperState> {
    constructor(protected shippeStore: ShipperStore) {
        super(shippeStore);
    }
}
