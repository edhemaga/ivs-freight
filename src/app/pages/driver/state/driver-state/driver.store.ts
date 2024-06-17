import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// models
import { DriverShortResponse } from 'appcoretruckassist';

export interface DriverState extends EntityState<DriverShortResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'driver' })
export class DriverStore extends EntityStore<DriverState> {
    constructor() {
        super();
    }
}
