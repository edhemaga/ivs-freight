import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TruckState, TruckStore } from './truck.store';

@Injectable({ providedIn: 'root' })
export class TruckQuery extends QueryEntity<TruckState> {
  constructor(protected truckStore: TruckStore) {
    super(truckStore);
  }
}
