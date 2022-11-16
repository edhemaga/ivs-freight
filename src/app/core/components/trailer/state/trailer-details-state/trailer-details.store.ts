import { TrailerResponse } from './../../../../../../../appcoretruckassist/model/trailerResponse';
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface TrailerItemState
   extends EntityState<TrailerResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trailerItem' })
export class TrailerItemStore extends EntityStore<TrailerItemState> {
   constructor() {
      super();
   }
}
