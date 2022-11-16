import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TruckInactiveState, TruckInactiveStore } from './truck-inactive.store';

@Injectable({ providedIn: 'root' })
export class TruckInactiveQuery extends QueryEntity<TruckInactiveState> {
  constructor(protected truckStore: TruckInactiveStore) {
    super(truckStore);
  }
}
