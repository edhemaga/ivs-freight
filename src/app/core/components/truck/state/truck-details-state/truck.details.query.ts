import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TruckItemState, TruckItemStore } from './truck.details.store';

@Injectable({ providedIn: 'root' })
export class TruckDetailsQuery extends QueryEntity<TruckItemState> {
  constructor(protected truckItemStore: TruckItemStore) {
    super(truckItemStore);
  }
}
