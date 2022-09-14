import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { LoadActiveState, LoadActiveStore } from './load-active.store';

@Injectable({ providedIn: 'root' })
export class LoadActiveQuery extends QueryEntity<LoadActiveState> {
  constructor(protected loadActiveStore: LoadActiveStore) {
    super(loadActiveStore);
  }
}
