import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    DriverItemState,
    DriversItemStore,
} from '@pages/driver/state/driver-details-state/driver-details-item.store';

@Injectable({ providedIn: 'root' })
export class DriversItemQuery extends QueryEntity<DriverItemState> {
    constructor(protected driverItemStore: DriversItemStore) {
        super(driverItemStore);
    }
}
