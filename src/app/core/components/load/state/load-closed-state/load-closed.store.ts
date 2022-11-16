import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { LoadResponse } from 'appcoretruckassist';

export interface LoadClosedState extends EntityState<LoadResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'loadClosed' })
export class LoadClosedStore extends EntityStore<LoadClosedState> {
   constructor() {
      super();
   }
}
