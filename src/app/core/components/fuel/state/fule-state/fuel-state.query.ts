import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FuelState, FuelStore } from './fuel-state.store';

@Injectable({ providedIn: 'root' })
export class FuelQuery extends QueryEntity<FuelState> {
   fuelTransactions$ = this.select('fuelTransactions');

   fuelStops$ = this.select('fuelStops');

   constructor(protected fuelStore: FuelStore) {
      super(fuelStore);
   }
}
