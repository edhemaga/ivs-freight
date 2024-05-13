import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    TruckActiveState,
    TruckActiveStore,
} from '@pages/truck/state/truck-active-state/truck-active.store';

@Injectable({ providedIn: 'root' })
export class TruckActiveQuery extends QueryEntity<TruckActiveState> {
    constructor(protected truckStore: TruckActiveStore) {
        super(truckStore);
    }
}
