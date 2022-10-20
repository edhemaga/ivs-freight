import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { FuelStopResponse } from 'appcoretruckassist';

export interface FuelItemState extends EntityState<FuelStopResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'fuelItem' })
export class FuelItemStore extends EntityStore<FuelItemState> {
  constructor() {
    super();
  }
}
