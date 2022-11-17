import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ShipperResponse } from 'appcoretruckassist';

export interface ShipperMinimalListState
    extends EntityState<ShipperResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shipperMinimalList' })
export class ShipperMinimalListStore extends EntityStore<ShipperMinimalListState> {
    constructor() {
        super();
    }
}
