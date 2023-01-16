import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TelematicStateStore, TelematicStateState } from './telematic-state.store';
import { TelematicState } from './telematic-state.model';

@Injectable({
  providedIn: 'root'
})
export class TelematicStateQuery extends QueryEntity<TelematicStateState, TelematicState> {

  constructor(protected store: TelematicStateStore) {
    super(store);
  }

}
