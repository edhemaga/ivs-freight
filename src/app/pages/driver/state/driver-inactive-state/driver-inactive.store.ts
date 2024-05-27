import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface DriversInactiveState extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'driverInactive' })
export class DriversInactiveStore extends EntityStore<DriversInactiveState> {
    constructor() {
        super();
    }
}
