import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { RoadsideInspectionResponse } from '../../../../../../../../appcoretruckassist/model/roadsideInspectionResponse';

export interface RoadItemState
  extends EntityState<RoadsideInspectionResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'roadsideItem' })
export class RoadItemStore extends EntityStore<RoadItemState> {
  constructor() {
    super();
  }
}
