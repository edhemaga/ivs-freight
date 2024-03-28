import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface TruckDetailsListState extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'truckDetailsList' })
export class TrucksDetailsListStore extends EntityStore<TruckDetailsListState> {
    constructor() {
        super();
    }
}
