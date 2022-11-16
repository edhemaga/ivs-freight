import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { LoadResponse } from 'appcoretruckassist';

export interface LoadPandingState extends EntityState<LoadResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'loadPanding' })
export class LoadPandinStore extends EntityStore<LoadPandingState> {
   constructor() {
      super();
   }
}
