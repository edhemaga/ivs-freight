import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TruckResponse } from 'appcoretruckassist';

export interface TruckMinimalListState
  extends EntityState<TruckResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'truckMinimalList' })
export class TrucksMinimalListStore extends EntityStore<TruckMinimalListState> {
  constructor() {
    super();
  }
}
