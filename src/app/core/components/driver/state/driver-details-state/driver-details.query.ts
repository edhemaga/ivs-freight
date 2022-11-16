import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DriverItemState, DriversItemStore } from './driver-details.store';

@Injectable({ providedIn: 'root' })
export class DriversDetailsQuery extends QueryEntity<DriverItemState> {
   constructor(protected driverItemStore: DriversItemStore) {
      super(driverItemStore);
   }
}
