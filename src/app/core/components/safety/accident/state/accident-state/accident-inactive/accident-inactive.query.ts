import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    AccidentInactiveState,
    AccidentInactiveStore,
} from './accident-inactive.store';

@Injectable({ providedIn: 'root' })
export class AccidentInactiveQuery extends QueryEntity<AccidentInactiveState> {
    constructor(protected accidentInactiveStore: AccidentInactiveStore) {
        super(accidentInactiveStore);
    }
}
