import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DriversActiveStore, DriversActiveState } from './driver-active.store';

@Injectable({ providedIn: 'root' })
export class DriversActiveQuery extends QueryEntity<DriversActiveState> {
  constructor(protected driverStore: DriversActiveStore) {
    super(driverStore);
  }
}
