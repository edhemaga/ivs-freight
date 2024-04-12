import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    DriverMinimalListState,
    DriversMinimalListStore,
} from '@pages/driver/state/driver-details-minimal-list-state/driver-minimal-list.store';

@Injectable({ providedIn: 'root' })
export class DriversMinimalListQuery extends QueryEntity<DriverMinimalListState> {
    constructor(protected driverMinimalListStore: DriversMinimalListStore) {
        super(driverMinimalListStore);
    }
}
