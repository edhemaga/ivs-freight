import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
  LoadDetailsListState,
  LoadDetailsListStore,
} from './load-d-list.store';

@Injectable({ providedIn: 'root' })
export class LoadDetailsListQuery extends QueryEntity<LoadDetailsListState> {
  constructor(protected loadDetailsListStore: LoadDetailsListStore) {
    super(loadDetailsListStore);
  }
}
