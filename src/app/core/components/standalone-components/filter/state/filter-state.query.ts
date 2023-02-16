import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FilterStateStore, FilterStateState } from './filter-state.store';
import { FilterState } from './filter-state.model';

@Injectable({
  providedIn: 'root'
})
export class FilterStateQuery extends QueryEntity<FilterStateState, FilterState> {

  constructor(protected store: FilterStateStore) {
    super(store);
  }

}
