import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// state
import {
    IntegrationStore,
    IntegrationActiveState,
} from './integrationActiveStore';

@Injectable({ providedIn: 'root' })
export class IntegrationActiveQuery extends QueryEntity<IntegrationActiveState> {
    constructor(protected integrationStore: IntegrationStore) {
        super(integrationStore);
    }
}
