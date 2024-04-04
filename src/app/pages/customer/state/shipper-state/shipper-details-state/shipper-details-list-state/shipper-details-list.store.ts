import { Injectable } from '@angular/core';

// Akita
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface ShipperDetailsListState
    extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shipperDetailsList' })
export class ShipperDetailsListStore extends EntityStore<ShipperDetailsListState> {
    constructor() {
        super();
    }
}
