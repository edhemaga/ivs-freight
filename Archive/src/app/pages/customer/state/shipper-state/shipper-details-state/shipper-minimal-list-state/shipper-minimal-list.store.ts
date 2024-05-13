import { Injectable } from '@angular/core';

// Akita
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface ShipperMinimalListState
    extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shipperMinimalList' })
export class ShipperMinimalListStore extends EntityStore<ShipperMinimalListState> {
    constructor() {
        super();
    }
}
