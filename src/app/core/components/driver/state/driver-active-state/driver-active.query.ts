import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DriversActiveStore, DriversState } from './driver-active.store';
@Injectable({ providedIn: 'root' })
export class DriversQuery extends QueryEntity<DriversState> {
  constructor(
    protected driverStore: DriversActiveStore,
  ) {
    super(driverStore);
  }
}
