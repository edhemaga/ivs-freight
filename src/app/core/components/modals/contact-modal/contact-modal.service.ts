import { UpdateCompanyContactCommand } from './../../../../../../appcoretruckassist/model/updateCompanyContactCommand';
import { CreateResponse } from './../../../../../../appcoretruckassist/model/createResponse';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  CompanyAccountLabelService,
  CompanyContactLabelService,
  CompanyContactModalResponse,
  CompanyContactResponse,
  CompanyContactService,
  ContactColorResponse,
  CreateCompanyContactCommand,
  CreateCompanyContactLabelCommand,
  GetCompanyContactLabelListResponse,
} from 'appcoretruckassist';

@Injectable({
  providedIn: 'root',
})
export class ContactModalService {
  constructor(
    private companyContactService: CompanyContactService,
    private companyLabelService: CompanyContactLabelService
  ) {}

  // -------------------- COMPANY -------------------
  public addCompanyContact(
    data: CreateCompanyContactCommand
  ): Observable<CreateResponse> {
    return this.companyContactService.apiCompanycontactPost(data);
  }

  public deleteCompanyContactById(id: number): Observable<any> {
    return this.companyContactService.apiCompanycontactIdDelete(id);
  }

  public getCompanyContactById(id: number): Observable<CompanyContactResponse> {
    return this.companyContactService.apiCompanycontactIdGet(id);
  }

  public updateCompanyContact(
    data: UpdateCompanyContactCommand
  ): Observable<any> {
    return this.companyContactService.apiCompanycontactPut(data);
  }

  public companyContactLabelsAndDeparments(): Observable<CompanyContactModalResponse> {
    return this.companyContactService.apiCompanycontactModalGet();
  }

  // ------------------ COMPANY labels ------------------

  public addCompanyContactLabel(
    data: CreateCompanyContactLabelCommand
  ): Observable<CreateResponse> {
    return this.companyLabelService.apiCompanycontactlabelPost(data);
  }

  public companyContactLabelsColorList(): Observable<
    Array<ContactColorResponse>
  > {
    return this.companyLabelService.apiCompanycontactlabelColorListGet();
  }
}
