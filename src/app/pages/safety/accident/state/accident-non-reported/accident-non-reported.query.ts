import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    AccidentNonReportedState,
    AccidentNonReportedStore,
} from '@pages/safety/accident/state/accident-non-reported/accident-non-reported.store';

@Injectable({ providedIn: 'root' })
export class AccidentNonReportedQuery extends QueryEntity<AccidentNonReportedState> {
    constructor(protected accidentNonReportedStore: AccidentNonReportedStore) {
        super(accidentNonReportedStore);
    }
}
