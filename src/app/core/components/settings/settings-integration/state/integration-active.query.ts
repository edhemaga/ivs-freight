import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    IntegrationActiveStore,
    IntegrationActiveState,
} from './integrationActiveStore';

@Injectable({ providedIn: 'root' })
export class IntegrationActiveQuery extends QueryEntity<IntegrationActiveState> {
    constructor(protected truckStore: IntegrationActiveStore) {
        super(truckStore);
    }
}
