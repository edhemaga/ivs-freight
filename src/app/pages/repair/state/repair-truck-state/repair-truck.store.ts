import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { RepairResponse } from 'appcoretruckassist';

export interface RepairTruckState extends EntityState<RepairResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairTruck' })
export class RepairTruckStore extends EntityStore<RepairTruckState> {
    constructor() {
        super();
    }
}
