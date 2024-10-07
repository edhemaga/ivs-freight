import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// models
import { DriverListItemResponse } from 'appcoretruckassist';

export interface DriverState
    extends EntityState<DriverListItemResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'driver' })
export class DriverStore extends EntityStore<DriverState> {
    constructor() {
        super();
    }
}
