import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BankService } from './../../../../../../../appcoretruckassist/api/bank.service';

import { BankResponse } from 'appcoretruckassist/model/bankResponse';

@Injectable({
  providedIn: 'root',
})
export class ApplicantListsService {
  constructor(private bankService: BankService) {}

  public getBanksDropdownList(): Observable<Array<BankResponse>> {
    return this.bankService.apiBankApplicantListGet();
  }
}
