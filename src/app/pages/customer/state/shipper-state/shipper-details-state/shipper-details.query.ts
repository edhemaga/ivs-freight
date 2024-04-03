import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    ShipperDetailsState,
    ShipperDetailsStore,
} from './shipper-details.store';

@Injectable({ providedIn: 'root' })
export class ShipperDetailsQuery extends QueryEntity<ShipperDetailsState> {
    constructor(protected shipperDetailsStore: ShipperDetailsStore) {
        super(shipperDetailsStore);
    }
}
