import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    DriverItemState,
    DriversItemStore,
} from '@pages/driver/state/driver-details-state/driver-details.store';

@Injectable({ providedIn: 'root' })
export class DriversDetailsQuery extends QueryEntity<DriverItemState> {
    constructor(protected driverItemStore: DriversItemStore) {
        super(driverItemStore);
    }
}
