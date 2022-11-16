import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
   AccidentActiveState,
   AccidentActiveStore,
} from './accident-active.store';

@Injectable({ providedIn: 'root' })
export class AccidentActiveQuery extends QueryEntity<AccidentActiveState> {
   constructor(protected accidentActiveStore: AccidentActiveStore) {
      super(accidentActiveStore);
   }
}
