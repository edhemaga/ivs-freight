import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AccountTService } from '../account.service';
import { AccountState, AccountStore } from './account.store';

@Injectable({
  providedIn: 'root',
})
export class AccountResolver implements Resolve<AccountState> {
  constructor(
    private accountService: AccountTService,
    private accountStore: AccountStore
  ) {}
  resolve(): Observable<AccountState | boolean> {
    return this.accountService
    .getAccounts(null, 1, 25)
    .pipe(
      catchError(() => {
        return of('No account data...');
      }),
      tap((accountPagination: any) => {
        localStorage.setItem(
          'accountTableCount',
          JSON.stringify({
            account: accountPagination.count,
          })
        );
        
        this.accountStore.set(accountPagination.pagination.data);
      })
    );
  }
}
