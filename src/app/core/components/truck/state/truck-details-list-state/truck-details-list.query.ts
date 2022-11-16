import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
   TruckDetailsListState,
   TrucksDetailsListStore,
} from './truck-details-list.store';

@Injectable({ providedIn: 'root' })
export class TrucksDetailsListQuery extends QueryEntity<TruckDetailsListState> {
   constructor(protected truckDetailsListStore: TrucksDetailsListStore) {
      super(truckDetailsListStore);
   }
}
