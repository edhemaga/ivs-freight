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
        // this.akitaPreUpdate((current, next) => {
        //     console.log(`Updating user from ${current.name} to ${next.name}`)
        //     return next;
        // });
    }

    akitaPreUpdateEntity(prevState, nestState) {
        console.log('UPDATING STATE AFTER CHANGING IT');
        return nestState;
    }

    akitaPreUpdate(previousState: Readonly<DispatcherState>, nextState: Readonly<DispatcherState>): DispatcherState {
        console.log(previousState);
        console.log("UDATING STATEEE");
        console.log(nextState);
        return nextState;
    }
}
