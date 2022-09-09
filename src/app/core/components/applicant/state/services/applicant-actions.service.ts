import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { ApplicantService } from './../../../../../../../appcoretruckassist/api/applicant.service';

import {
  VerifyApplicantCommand,
  AcceptApplicationCommand,
  ApplicantResponse,
  UpdatePersonalInfoCommand,
  CreateSevenDaysHosCommand,
  CreateDrugAndAlcoholCommand,
  UpdateDriverRightsCommand,
  CreateDisclosureReleaseCommand,
  CreateAuthorizationCommand,
  CreateResponse,
} from 'appcoretruckassist/model/models';

@Injectable({
  providedIn: 'root',
})
export class ApplicantActionsService {
  private applicantInfoSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private applicantService: ApplicantService) {}

  public getApplicantInfo(data: any) {
    this.applicantInfoSubject.next(data);
  }

  get getApplicantInfo$() {
    return this.applicantInfoSubject.asObservable();
  }

  /* BACKEND ACTION FUNCTIONS */

  public verifyApplicant(
    data: VerifyApplicantCommand
  ): Observable<ApplicantResponse> {
    return this.applicantService.apiApplicantVerifyPost(data);
  }

  public acceptApplicant(
    data: AcceptApplicationCommand
  ): Observable<ApplicantResponse> {
    return this.applicantService.apiApplicantAcceptPost(data);
  }

  public updatePersonalInfo(
    data: UpdatePersonalInfoCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantPersonalPut(data);
  }

  public updateSevenDaysHos(
    data: CreateSevenDaysHosCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantSevendayshosPost(data);
  }

  public updateDrugAndAlcohol(
    data: CreateDrugAndAlcoholCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantDrugandalcoholPost(data);
  }

  public updateDriverRights(
    data: UpdateDriverRightsCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantDriverrightsPut(data);
  }

  public updateDisclosureAndRelease(
    data: CreateDisclosureReleaseCommand
  ): Observable<CreateResponse> {
    return this.applicantService.apiApplicantDisclosurereleasePost(data);
  }

  public updateAuthorization(
    data: CreateAuthorizationCommand
  ): Observable<CreateResponse> {
    return this.applicantService.apiApplicantAuthorizationPost(data);
  }
}
