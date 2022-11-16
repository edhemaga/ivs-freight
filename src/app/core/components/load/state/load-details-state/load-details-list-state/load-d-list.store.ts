import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { LoadResponse } from 'appcoretruckassist';

export interface LoadDetailsListState
   extends EntityState<LoadResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'loadDetailsList' })
export class LoadDetailsListStore extends EntityStore<LoadDetailsListState> {
   constructor() {
      super();
   }
}
