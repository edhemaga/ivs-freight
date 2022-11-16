import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { AccidentShortResponse } from 'appcoretruckassist';

export interface AccidentInactiveState
   extends EntityState<AccidentShortResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'accidentInactive' })
export class AccidentInactiveStore extends EntityStore<AccidentInactiveState> {
   constructor() {
      super();
   }
}
