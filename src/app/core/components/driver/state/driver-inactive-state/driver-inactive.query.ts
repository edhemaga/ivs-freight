import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DriversInactiveState, DriversInactiveStore } from './driver-inactive.store';

@Injectable({ providedIn: 'root' })
export class DriversInactiveQuery extends QueryEntity<DriversInactiveState> {
  constructor(protected driverStore: DriversInactiveStore) {
    super(driverStore);
  }
}
