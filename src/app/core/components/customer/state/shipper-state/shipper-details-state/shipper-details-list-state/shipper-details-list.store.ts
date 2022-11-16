import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ShipperResponse } from 'appcoretruckassist';

export interface ShipperDetailsListState
    extends EntityState<ShipperResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shipperDetailsList' })
export class ShipperDetailsListStore extends EntityStore<ShipperDetailsListState> {
    constructor() {
        super();
    }
}
