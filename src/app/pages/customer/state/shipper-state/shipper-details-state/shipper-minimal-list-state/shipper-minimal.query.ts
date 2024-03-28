import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    ShipperMinimalListState,
    ShipperMinimalListStore,
} from './shipper-minimal.store';

@Injectable({ providedIn: 'root' })
export class ShipperMinimalListQuery extends QueryEntity<ShipperMinimalListState> {
    constructor(protected shipperMinimalListStore: ShipperMinimalListStore) {
        super(shipperMinimalListStore);
    }
}
