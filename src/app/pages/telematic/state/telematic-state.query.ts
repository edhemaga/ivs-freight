import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import { TelematicStateStore, TelematicStateState } from './telematic-state.store';

// Models
import { TelematicState } from '../models/telematic-state.model';

@Injectable({
  providedIn: 'root'
})
export class TelematicStateQuery extends QueryEntity<TelematicStateState, TelematicState> {

  constructor(protected store: TelematicStateStore) {
    super(store);
  }

}
