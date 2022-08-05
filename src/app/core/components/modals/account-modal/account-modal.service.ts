import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AccountColorResponse,
  CompanyAccountLabelService,
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
    private accountLabelService: CompanyAccountLabelService
  ) {}
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
