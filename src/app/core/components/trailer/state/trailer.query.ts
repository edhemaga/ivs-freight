import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TrailerState, TrailerStore } from './trailer.store';


@Injectable({ providedIn: 'root' })
export class TrailerQuery extends QueryEntity<TrailerState> {
  constructor(protected trailerStore: TrailerStore) {
    super(trailerStore);
  }
}
