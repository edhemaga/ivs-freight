import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    TruckMinimalListState,
    TrucksMinimalListStore,
} from './truck-details-minimal.store';

@Injectable({ providedIn: 'root' })
export class TrucksMinimalListQuery extends QueryEntity<TruckMinimalListState> {
    constructor(protected truckMinimalListStore: TrucksMinimalListStore) {
        super(truckMinimalListStore);
    }
}
