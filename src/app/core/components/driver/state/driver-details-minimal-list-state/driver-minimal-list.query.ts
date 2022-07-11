
import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DriverMinimalListState, DriversMinimalListStore } from './driver-minimal-list.store';

@Injectable({ providedIn: 'root' })
export class DriversMinimalListQuery extends QueryEntity<DriverMinimalListState> {
  constructor(
    protected driverMinimalListStore: DriversMinimalListStore
  ) {
    super(driverMinimalListStore);
  }
  
}
