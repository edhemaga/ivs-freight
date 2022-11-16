import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FuelItemState, FuelItemStore } from './fuel-details.store';

@Injectable({ providedIn: 'root' })
export class FuelDetailsQuery extends QueryEntity<FuelItemState> {
  constructor(protected fuelItemStore: FuelItemStore) {
    super(fuelItemStore);
  }
}
