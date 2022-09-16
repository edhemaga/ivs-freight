import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BankService } from './../../../../../../../appcoretruckassist/api/bank.service';
import { ApplicantService } from './../../../../../../../appcoretruckassist/api/applicant.service';

import { BankResponse } from 'appcoretruckassist/model/bankResponse';
import { ApplicantModalResponse } from 'appcoretruckassist/model/models';

@Injectable({
  providedIn: 'root',
})
export class ApplicantListsService {
  constructor(
    private bankService: BankService,
    private applicantService: ApplicantService
  ) {}

  public getBanksDropdownList(): Observable<Array<BankResponse>> {
    return this.bankService.apiBankApplicantListGet();
  }

  public getDropdownLists(): Observable<ApplicantModalResponse> {
    return this.applicantService.apiApplicantModalGet();
  }
}
