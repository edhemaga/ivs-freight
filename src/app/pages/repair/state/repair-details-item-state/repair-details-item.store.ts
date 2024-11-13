import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface RepairItemState extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairItem' })
export class RepairItemStore extends EntityStore<RepairItemState> {
    constructor() {
        super();
    }
}
