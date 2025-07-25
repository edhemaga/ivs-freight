import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface DriverItemState extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'driverItem' })
export class DriversItemStore extends EntityStore<DriverItemState> {
    constructor() {
        super();
    }
}
