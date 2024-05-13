import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

// state
import {
    TerminalState,
    TerminalStore,
} from '@pages/settings/state/settings-terminal-state/company-terminal.store';

@Injectable({ providedIn: 'root' })
export class TerminalQuery extends QueryEntity<TerminalState> {
    constructor(protected terminalStore: TerminalStore) {
        super(terminalStore);
    }
}
