import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { BankService } from './../../../../../../../appcoretruckassist/api/bank.service';
import { ApplicantService } from './../../../../../../../appcoretruckassist/api/applicant.service';

import { ApplicantListsStore } from '../store/applicant-lists-store/applicant-lists.store';

import { BankResponse } from 'appcoretruckassist/model/bankResponse';
import { ApplicantModalResponse } from 'appcoretruckassist/model/models';

@Injectable({
  providedIn: 'root',
})
export class ApplicantListsService {
  constructor(
    private bankService: BankService,
    private applicantService: ApplicantService,
    private applicantListsStore: ApplicantListsStore
  ) {}

  public getBanksDropdownList(): Observable<Array<BankResponse>> {
    return this.bankService.apiBankApplicantListGet();
  }

  public getDropdownLists(): Observable<ApplicantModalResponse> {
    return this.applicantService.apiApplicantModalGet().pipe(
      tap((res: ApplicantModalResponse) => {
        this.applicantListsStore.set({ 1: res });
      })
    );
  }
}
