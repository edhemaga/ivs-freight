import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { AccidentShortResponse } from 'appcoretruckassist';

export interface AccidentNonReportedState extends EntityState<AccidentShortResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'accidentNonReported' })
export class AccidentNonReportedStore extends EntityStore<AccidentNonReportedState> {
  constructor() {
    super();
  }
}
