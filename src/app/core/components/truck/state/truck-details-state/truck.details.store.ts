import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface TruckItemState extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'truckItem' })
export class TruckItemStore extends EntityStore<TruckItemState> {
    constructor() {
        super();
    }
}
