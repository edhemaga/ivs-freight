import { TrailerResponse } from './../../../../../../../appcoretruckassist/model/trailerResponse';
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface TrailerMinimalListState
  extends EntityState<TrailerResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trailerMinimalList' })
export class TrailersMinimalListStore extends EntityStore<TrailerMinimalListState> {
  constructor() {
    super();
  }
}
