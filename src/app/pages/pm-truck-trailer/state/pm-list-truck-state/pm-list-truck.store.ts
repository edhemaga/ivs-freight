import { Injectable } from '@angular/core';

// Akita
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// Models
import { PMTruckResponse } from 'appcoretruckassist';

export interface PmListTruckState
    extends EntityState<PMTruckResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'pmListTruck' })
export class PmListTruckStore extends EntityStore<PmListTruckState> {
    constructor() {
        super();
    }
}
