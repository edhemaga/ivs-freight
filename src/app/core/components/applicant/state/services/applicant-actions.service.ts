import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { ApplicantService } from './../../../../../../../appcoretruckassist/api/applicant.service';

import { ApplicantStore } from '../store/applicant.store';

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
  CreateEducationCommand,
  CreateTrafficViolationCommand,
  CreateAccidentRecordCommand,
  CreateApplicantCdlCommand,
  CreateWorkExperienceCommand,
  CreatePersonalInfoReviewCommand,
} from 'appcoretruckassist/model/models';
import { ApplicantQuery } from '../store/applicant.query';

@Injectable({
  providedIn: 'root',
})
export class ApplicantActionsService {
  private applicantInfoSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private applicantService: ApplicantService,
    private applicantStore: ApplicantStore,
    private applicantQuery: ApplicantQuery
  ) {}

  public getApplicantInfo(data: any) {
    this.applicantInfoSubject.next(data);
  }

  get getApplicantInfo$() {
    return this.applicantInfoSubject.asObservable();
  }

  /* BACKEND POST ACTION FUNCTIONS -  APPLICANT MODE */

  public verifyApplicant(data: VerifyApplicantCommand): Observable<any> {
    return this.applicantService.apiApplicantAdminVerifyPost(data);
  }

  public acceptApplicant(
    data: AcceptApplicationCommand
  ): Observable<ApplicantResponse> {
    return this.applicantService.apiApplicantAdminAcceptPost(data);
  }

  public createWorkExperience(
    data: CreateWorkExperienceCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantWorkexperiencePost(data);
  }

  public createCdlInformation(
    data: CreateApplicantCdlCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantCdlPost(data);
  }

  public createAccidentRecord(
    data: CreateAccidentRecordCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantAccidentrecordPost(data);
  }

  public createTrafficViolations(
    data: CreateTrafficViolationCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantTrafficviolationPost(data);
  }

  public createEducation(data: CreateEducationCommand): Observable<object> {
    return this.applicantService.apiApplicantEducationPost(data);
  }

  public createSevenDaysHos(
    data: CreateSevenDaysHosCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantSevendayshosPost(data);
  }

  public createDrugAndAlcohol(
    data: CreateDrugAndAlcoholCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantDrugandalcoholPost(data);
  }

  public createDisclosureAndRelease(
    data: CreateDisclosureReleaseCommand
  ): Observable<CreateResponse> {
    return this.applicantService.apiApplicantDisclosurereleasePost(data);
  }

  public createAuthorization(
    data: CreateAuthorizationCommand
  ): Observable<CreateResponse> {
    return this.applicantService.apiApplicantAuthorizationPost(data);
  }

  /* BACKEND PUT ACTION FUNCTIONS */

  public updatePersonalInfo(
    data: UpdatePersonalInfoCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantPersonalPut(data);
  }

  public updateDriverRights(
    data: UpdateDriverRightsCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantDriverrightsPut(data);
  }

  /* BACKEND POST ACTION FUNCTIONS -  REVIEW MODE */

  public createPersonalInfoReview(
    data: CreatePersonalInfoReviewCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantPersonalReviewPost(data);
  }

  /* BACKEND GET ACTION FUNCTIONS */

  public getApplicantById(id: number): Observable<ApplicantResponse> {
    return this.applicantService.apiApplicantIdGet(id).pipe(
      tap((res: ApplicantResponse) => {
        console.log('aaa');
      })
    );
  }
}
