import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TruckMinimalResponse } from 'appcoretruckassist';

export interface TruckMinimalListState
   extends EntityState<TruckMinimalResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'truckMinimalList' })
export class TrucksMinimalListStore extends EntityStore<TruckMinimalListState> {
   constructor() {
      super();
   }
}
