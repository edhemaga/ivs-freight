import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DriverShortResponse } from 'appcoretruckassist';

export interface DriversInactiveState
    extends EntityState<DriverShortResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'driverInactive' })
export class DriversInactiveStore extends EntityStore<DriversInactiveState> {
    constructor() {
        super();
    }
}
