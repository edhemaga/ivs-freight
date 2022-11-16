import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
   DriverDetailsListState,
   DriversDetailsListStore,
} from './driver-details-list.store';

@Injectable({ providedIn: 'root' })
export class DriversDetailsListQuery extends QueryEntity<DriverDetailsListState> {
   constructor(protected driverDetailsListStore: DriversDetailsListStore) {
      super(driverDetailsListStore);
   }
}
