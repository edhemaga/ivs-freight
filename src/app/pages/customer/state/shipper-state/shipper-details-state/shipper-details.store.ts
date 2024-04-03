import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface ShipperDetailsState
    extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shipperItem' })
export class ShipperDetailsStore extends EntityStore<ShipperDetailsState> {
    constructor() {
        super();
    }
}
