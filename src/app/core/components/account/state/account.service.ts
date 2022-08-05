import { CompanyAccountService } from './../../../../../../appcoretruckassist/api/companyAccount.service';
import { Injectable } from '@angular/core';
import { CompanyAccountResponse } from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountTService {
  constructor(private accountService: CompanyAccountService) {}

  // Get Account List
  public getAccounts(
    labelId?: number,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<CompanyAccountResponse> {
    return this.accountService.apiCompanyaccountListGet(
      labelId,
      pageIndex,
      pageSize,
      companyId,
      sort,
      search,
      search1,
      search2
    );
  }
}
