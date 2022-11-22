import { ShipperResponse } from './../../../../../../../../appcoretruckassist/model/shipperResponse';
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface ShipperItemState
    extends EntityState<ShipperResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shipperItem' })
export class ShipperItemStore extends EntityStore<ShipperItemState> {
    constructor() {
        super();
    }
}
