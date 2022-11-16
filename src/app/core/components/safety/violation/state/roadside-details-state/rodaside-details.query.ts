import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RoadItemState, RoadItemStore } from './roadside-details.store';

@Injectable({ providedIn: 'root' })
export class RoadDetailsQuery extends QueryEntity<RoadItemState> {
  constructor(protected roadItemStore: RoadItemStore) {
    super(roadItemStore);
  }
}
