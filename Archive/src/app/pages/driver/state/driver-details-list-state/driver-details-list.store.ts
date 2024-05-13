import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface DriverDetailsListState
    extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'driverDetailsList' })
export class DriversDetailsListStore extends EntityStore<DriverDetailsListState> {
    constructor() {
        super();
    }
}
