import { Injectable } from '@angular/core';

// store
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { FilterState } from '@shared/components/ta-filter/models/filter-state.model';

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
