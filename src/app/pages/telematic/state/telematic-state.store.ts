import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TelematicState } from './telematic-state.model';

export interface TelematicStateState extends EntityState<TelematicState> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'telematic-state' })
export class TelematicStateStore extends EntityStore<TelematicStateState, TelematicState> {

  constructor() {
    super();
  }

}

