import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// state
import { TerminalState, TerminalStore } from './company-terminal.store';

@Injectable({ providedIn: 'root' })
export class TerminalQuery extends QueryEntity<TerminalState> {
    constructor(protected terminalStore: TerminalStore) {
        super(terminalStore);
    }
}
