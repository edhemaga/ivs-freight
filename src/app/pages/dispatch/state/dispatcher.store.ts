import { Injectable } from '@angular/core';

// Akita
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// Models
import { IDispatcher } from '@pages/dispatch/models/dispatcher-state.model';

export interface DispatcherState extends EntityState<IDispatcher, string> {}

export function createInitialState(): DispatcherState {
    return {
        modal: [],
        dispatchList: [],
    };
}

@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'dispatchboard' })
export class DispatcherStore extends EntityStore<DispatcherState> {
    constructor() {
        super(createInitialState());
    }

    akitaPreUpdateEntity(prevState, nestState) {
        return nestState;
    }

    akitaPreUpdate(
        previousState: Readonly<DispatcherState>,
        nextState: Readonly<DispatcherState>
    ): DispatcherState {
        return nextState;
    }
}
