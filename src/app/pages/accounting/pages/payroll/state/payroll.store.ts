import { Injectable } from '@angular/core';

// Akita
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface PayrollState extends EntityState<any, string> {}

export function createInitialState(): PayrollState {
    return {};
}

@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'dispatchboard' })
export class PayrollStore extends EntityStore<PayrollState> {
    constructor() {
        super(createInitialState());
    }
}
