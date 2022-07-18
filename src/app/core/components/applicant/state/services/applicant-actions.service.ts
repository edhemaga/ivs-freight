import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

/* import {
  AcceptApplicationCommand,
  ApplicantResponse,
} from 'appcoretruckassist';

import { ApplicantService } from './../../../../../../../appcoretruckassist/api/applicant.service'; */

@Injectable({
  providedIn: 'root',
})
export class ApplicantActionsService {
  private applicantInfoSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(/* private applicantService: ApplicantService */) {}

  public getApplicantInfo(data: any) {
    this.applicantInfoSubject.next(data);
  }

  get getApplicantInfo$() {
    return this.applicantInfoSubject.asObservable();
  }

  /*  public acceptApplicant(
    data: AcceptApplicationCommand
  ): Observable<ApplicantResponse> {
    return this.applicantService.apiApplicantAcceptPost(data);
  } */
}
