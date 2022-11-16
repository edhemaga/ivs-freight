import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { IDispatcher } from './dispatcher.model';

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
}
