import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { PMTrailerUnitResponse } from 'appcoretruckassist';

export interface PmTrailerState
   extends EntityState<PMTrailerUnitResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'pmTrailer' })
export class PmTrailerStore extends EntityStore<PmTrailerState> {
   constructor() {
      super();
   }
}
