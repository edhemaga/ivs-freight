import { DriverItemState, DriversItemStore } from './driver-details.store';
import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DriversState, DriversStore } from './driver.store';

@Injectable({ providedIn: 'root' })
export class DriversQuery extends QueryEntity<DriversState> {
  constructor(protected driverStore: DriversStore) {
    super(driverStore);
  }
}
