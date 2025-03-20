import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { FuelStopMinimalResponse, FuelStopResponse } from 'appcoretruckassist';

export interface FuelMinimalListState
    extends EntityState<FuelStopResponse | FuelStopMinimalResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'fuelMinimalList' })
export class FuelMinimalListStore extends EntityStore<FuelMinimalListState> {
    constructor() {
        super();
    }
}
