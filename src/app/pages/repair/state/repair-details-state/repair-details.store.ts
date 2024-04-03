import { Injectable } from '@angular/core';

// Akita
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// Models
import { IRepairD } from '../../models/repair-d.model';

export interface RepairDetailsState extends EntityState<IRepairD> {}

export const initialState = (): RepairDetailsState => {
    return {
        repairShop: [],
        repairList: [],
        repairedVehicleList: [],
        repairShopMinimal: [],
    };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairD' })
export class RepairDetailsStore extends EntityStore<RepairDetailsState> {
    constructor() {
        super(initialState());
    }
}
