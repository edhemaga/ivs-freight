import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface ShipperState extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shipper' })
export class ShipperStore extends EntityStore<ShipperState> {
    constructor() {
        super();
    }
}
