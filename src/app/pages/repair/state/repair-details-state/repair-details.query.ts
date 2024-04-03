import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import { RepairDetailsState, RepairDetailsStore } from './repair-details.store';

@Injectable({ providedIn: 'root' })
export class RepairDetailsQuery extends QueryEntity<RepairDetailsState> {
    repairShop$ = this.select('repairShop');

    repairList$ = this.select('repairList');

    repairShopMinimal$ = this.select('repairShopMinimal');

    repairedVehicleList$ = this.select('repairedVehicleList');
    constructor(protected repairDetailsStore: RepairDetailsStore) {
        super(repairDetailsStore);
    }
}
