import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AccountColorResponse,
  CompanyAccountLabelService,
  CompanyAccountModalResponse,
  CompanyAccountResponse,
  CompanyAccountService,
  CreateCompanyAccountCommand,
  CreateCompanyAccountLabelCommand,
  CreateResponse,
  GetCompanyAccountLabelListResponse,
  UpdateCompanyAccountCommand,
  UpdateCompanyAccountLabelCommand,
} from 'appcoretruckassist';

@Injectable({
  providedIn: 'root',
})
export class AccountModalService {
  constructor(
    private companyAccountService: CompanyAccountService,
    private accountLabelService: CompanyAccountLabelService
  ) {}

  // --------------------- ACCOUNT ---------------------
  public addCompanyAccount(
    data: CreateCompanyAccountCommand
  ): Observable<CreateResponse> {
    return this.companyAccountService.apiCompanyaccountPost(data);
  }

  public deleteCompanyAccountById(id: number): Observable<any> {
    return this.companyAccountService.apiCompanyaccountIdDelete(id);
  }

  public getCompanyAccountById(id: number): Observable<CompanyAccountResponse> {
    return this.companyAccountService.apiCompanyaccountIdGet(id);
  }

  public updateCompanyAccount(
    data: UpdateCompanyAccountCommand
  ): Observable<any> {
    return this.companyAccountService.apiCompanyaccountPut(data);
  }

  public companyAccountModal(): Observable<CompanyAccountModalResponse> {
    return this.companyAccountService.apiCompanyaccountModalGet();
  }

  // --------------------- ACCOUNT LABEL ---------------------
  public companyAccountLabelsList(): Observable<GetCompanyAccountLabelListResponse> {
    return this.accountLabelService.apiCompanyaccountlabelListGet();
  }

  public companyAccountLabelsColorList(): Observable<
    Array<AccountColorResponse>
  > {
    return this.accountLabelService.apiCompanyaccountlabelColorListGet();
  }

  public addCompanyLabel(
    data: CreateCompanyAccountLabelCommand
  ): Observable<CreateResponse> {
    return this.accountLabelService.apiCompanyaccountlabelPost(data);
  }

  public updateCompanyLabel(
    data: UpdateCompanyAccountLabelCommand
  ): Observable<any> {
    return this.accountLabelService.apiCompanyaccountlabelPut(data);
  }
}
