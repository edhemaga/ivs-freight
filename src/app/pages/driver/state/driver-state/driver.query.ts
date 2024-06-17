import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    DriverStore,
    DriverState,
} from '@pages/driver/state/driver-state/driver.store';

@Injectable({ providedIn: 'root' })
export class DriverQuery extends QueryEntity<DriverState> {
    constructor(protected driverStore: DriverStore) {
        super(driverStore);
    }
}
