import { CreateResponse } from './../../../../../../appcoretruckassist/model/createResponse';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  CompanyContactLabelService,
  ContactColorResponse,
  CreateCompanyContactLabelCommand,
} from 'appcoretruckassist';

@Injectable({
  providedIn: 'root',
})
export class ContactModalService {
  constructor(private companyLabelService: CompanyContactLabelService) {}

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
