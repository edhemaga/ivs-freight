import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { ApplicantService } from '../../../../../../../appcoretruckassist';

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
  CreateAuthorizationReviewCommand,
  CreateWorkExperienceReviewCommand,
  CreateApplicantCdlReviewCommand,
  CreateAccidentRecordReviewCommand,
  CreateTrafficViolationReviewCommand,
} from 'appcoretruckassist/model/models';

@Injectable({
  providedIn: 'root',
})
export class ApplicantActionsService {
  private applicantInfoSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private applicantService: ApplicantService,
    private applicantStore: ApplicantStore
  ) {}

  public getApplicantInfo(data: any) {
    this.applicantInfoSubject.next(data);
  }

  get getApplicantInfo$() {
    return this.applicantInfoSubject.asObservable();
  }

  /* BACKEND POST ACTION FUNCTIONS -  APPLICANT MODE */

  public verifyApplicant(
    data: VerifyApplicantCommand
  ): Observable<ApplicantResponse> {
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

  public createWorkExperienceReview(
    data: CreateWorkExperienceReviewCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantWorkexperienceReviewPost(data);
  }

  public createCdlInformationReview(
    data: CreateApplicantCdlReviewCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantCdlReviewPost(data);
  }

  public createAccidentRecordReview(
    data: CreateAccidentRecordReviewCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantAccidentrecordReviewPost(data);
  }

  public createTrafficViolationReview(
    data: CreateTrafficViolationReviewCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantTrafficviolationReviewPost(data);
  }

  public createAuthorizationReview(
    data: CreateAuthorizationReviewCommand
  ): Observable<CreateResponse> {
    return this.applicantService.apiApplicantAuthorizationReviewPost(data);
  }

  /* BACKEND GET ACTION FUNCTIONS */

  public getApplicantById(id: number): Observable<ApplicantResponse> {
    return this.applicantService.apiApplicantIdGet(id).pipe(
      tap((res: ApplicantResponse) => {
        this.applicantStore.set({ 1: res });
      })
    );
  }
}
