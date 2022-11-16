import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
  RoadsideMinimalListState,
  RoadsideMinimalListStore,
} from './roadside-minimal.store';

@Injectable({ providedIn: 'root' })
export class RoadsideMinimalListQuery extends QueryEntity<RoadsideMinimalListState> {
  constructor(protected rsMinimalListStore: RoadsideMinimalListStore) {
    super(rsMinimalListStore);
  }
}
