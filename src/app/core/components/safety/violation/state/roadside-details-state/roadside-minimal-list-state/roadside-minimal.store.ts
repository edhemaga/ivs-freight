import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { RoadsideInspectionMinimalResponse } from '../../../../../../../../../appcoretruckassist/model/roadsideInspectionMinimalResponse';

export interface RoadsideMinimalListState
  extends EntityState<RoadsideInspectionMinimalResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'roadsideMinimalList' })
export class RoadsideMinimalListStore extends EntityStore<RoadsideMinimalListState> {
  constructor() {
    super();
  }
}
