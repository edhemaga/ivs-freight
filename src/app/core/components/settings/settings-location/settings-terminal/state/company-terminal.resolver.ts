import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CompanyTerminalService } from './company-terminal.service';
import { TerminalState, TerminalStore } from './company-terminal.store';
import { TerminalListResponse } from '../../../../../../../../appcoretruckassist/model/terminalListResponse';

@Injectable({
   providedIn: 'root',
})
export class TerminalResolver implements Resolve<TerminalState> {
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
