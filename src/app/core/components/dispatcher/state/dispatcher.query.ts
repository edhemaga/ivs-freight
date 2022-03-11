import { DispatcherState, DispatcherStore } from './dispatcher.store';
import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class DispatcherQuery extends QueryEntity<DispatcherState> {
  dispatchersList$ = this.select('dispatchers');

  constructor(protected store: DispatcherStore) {
    super(store);
  }
}
