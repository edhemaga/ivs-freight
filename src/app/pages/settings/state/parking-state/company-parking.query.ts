import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';

//state
import {
    ParkingState,
    ParkingStore,
} from '@pages/settings/state/parking-state/company-parking.store';

@Injectable({ providedIn: 'root' })
export class ParkingQuery extends QueryEntity<ParkingState> {
    constructor(protected parkingStore: ParkingStore) {
        super(parkingStore);
    }
}
