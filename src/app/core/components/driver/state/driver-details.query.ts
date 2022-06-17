import { DriverItemState, DriversItemStore } from './driver-details.store';
import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class DriversDetailsQuery extends QueryEntity<DriverItemState> {
  constructor( protected driverItemStore:DriversItemStore) {
    super( driverItemStore);
  }
}
