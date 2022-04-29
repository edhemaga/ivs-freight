import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  CompanyAccountResponse,
  CompanyAccountService,
  CreateCompanyAccountCommand,
  CreateResponse,
  UpdateCompanyAccountCommand,
} from 'appcoretruckassist';

@Injectable({
  providedIn: 'root',
})
export class AccountModalService {
  constructor(private companyAccountService: CompanyAccountService) {}

  public addCompanyAccount(data: CreateCompanyAccountCommand): Observable<CreateResponse> {
    return this.companyAccountService.apiCompanyaccountPost(data);
  }

  public deleteCompanyAccount(id: number): Observable<any> {
    return this.companyAccountService.apiCompanyaccountIdDelete(id);
  }

  public getCompanyAccountById(id: number): Observable<CompanyAccountResponse> {
    return this.companyAccountService.apiCompanyaccountIdGet(id);
  }

  public updateCompanyAccount(data: UpdateCompanyAccountCommand): Observable<any> {
    return this.companyAccountService.apiCompanyaccountPut(data);
  }
}
