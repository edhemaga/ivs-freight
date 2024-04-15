import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// store
import {
    FilterStateStore,
    FilterStateState,
} from '@shared/components/ta-filter/state/filter-state.store';
import { FilterState } from '@shared/components/ta-filter/models/filter-state.model';

@Injectable({
    providedIn: 'root',
})
export class FilterStateQuery extends QueryEntity<
    FilterStateState,
    FilterState
> {
    constructor(protected store: FilterStateStore) {
        super(store);
    }
}
