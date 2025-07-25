import { Injectable } from '@angular/core';

// store
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// models
import { RepairResponse } from 'appcoretruckassist';

export interface RepairTruckState extends EntityState<RepairResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairTruck' })
export class RepairTruckStore extends EntityStore<RepairTruckState> {
    constructor() {
        super();
    }
}
