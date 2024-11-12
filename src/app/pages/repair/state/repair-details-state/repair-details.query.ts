import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';
import {
    RepairDetailsState,
    RepairDetailsStore,
} from '@pages/repair/state/repair-details-state/repair-details.store';

@Injectable({ providedIn: 'root' })
export class RepairDetailsQuery extends QueryEntity<RepairDetailsState> {
    /*  public repairShop$ = this.select('repairShop');

    public repairList$ = this.select('repairList');

    public repairShopMinimal$ = this.select('repairShopMinimal');

    public repairedVehicleList$ = this.select('repairedVehicleList'); */

    constructor(protected repairDetailsStore: RepairDetailsStore) {
        super(repairDetailsStore);
    }
}
