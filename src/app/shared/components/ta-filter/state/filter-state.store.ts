import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { FilterState } from '../models/filter-state.model';

export interface FilterStateState extends EntityState<FilterState> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'filter-state' })
export class FilterStateStore extends EntityStore<
    FilterStateState,
    FilterState
> {
    constructor() {
        super();
    }
}
