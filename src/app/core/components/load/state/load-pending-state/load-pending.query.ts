import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { LoadPandingState, LoadPandinStore } from './load-panding.store';

@Injectable({ providedIn: 'root' })
export class LoadPandinQuery extends QueryEntity<LoadPandingState> {
   constructor(protected loadPandinStore: LoadPandinStore) {
      super(loadPandinStore);
   }
}
