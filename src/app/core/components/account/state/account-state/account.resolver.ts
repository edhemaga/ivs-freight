import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CompanyAccountResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AccountTService } from '../account.service';
import { AccountState, AccountStore } from './account.store';

@Injectable({
  providedIn: 'root',
})
export class AccountResolver implements Resolve<AccountState> {
  pageIndex: number = 1;
  pageSize: number = 25;

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
      tap((accountPagination: CompanyAccountResponse) => {
        console.log('Account Resolver Data');
        console.log(accountPagination);
        
        this.accountStore.set(accountPagination);
      })
    );
    
    /* if (this.accountStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.accountService
        .getAccounts(null, 1, 25)
        .pipe(
          catchError(() => {
            return of('No account data...');
          }),
          tap((accountPagination: CompanyAccountResponse) => {
            console.log('Account Resolver Data');
            console.log(accountPagination);

            this.accountStore.set(accountPagination);
          })
        );
    } */
  }
}
