import { Injectable } from '@angular/core';


import { Observable, of, catchError, tap } from 'rxjs';

// services
import { CompanyTerminalService } from '@pages/settings/services/company-terminal.service';

// store
import {
    TerminalState,
    TerminalStore,
} from '@pages/settings/state/settings-terminal-state/company-terminal.store';

// models
import { TerminalListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class CompanyTerminalResolver  {
    pageIndex: number = 1;
    pageSize: number = 25;
    count: number;
    constructor(
        private terminalService: CompanyTerminalService,
        private terminalStore: TerminalStore
    ) {}
    resolve(): Observable<TerminalState | boolean> {
        return this.terminalService
            .getTerminalList(this.pageIndex, this.pageSize, this.count)
            .pipe(
                catchError(() => {
                    return of('No Terminal data...');
                }),
                tap((terminalPagination: TerminalListResponse) => {
                    this.terminalStore.set(terminalPagination.pagination.data);
                })
            );
    }
}
