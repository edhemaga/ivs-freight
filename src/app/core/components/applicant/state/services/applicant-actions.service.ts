import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { ApplicantService } from '../../../../../../../appcoretruckassist';

import { ApplicantStore } from '../store/applicant.store';
import { ApplicantSphFormStore } from '../store/applicant-sph-form-store/applicant-sph-form.store';

import {
  VerifyApplicantCommand,
  AcceptApplicationCommand,
  ApplicantResponse,
  UpdatePersonalInfoCommand,
  CreateSevenDaysHosCommand,
  CreateDrugAndAlcoholCommand,
  UpdateDriverRightsCommand,
  /* CreateDisclosureReleaseCommand, */
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
  CreateEducationReviewCommand,
  CreateSevenDaysHosReviewCommand,
  CreateDrugAndAlcoholReviewCommand,
  InvitePreviousEmployerCommand,
  VerifyPreviousEmployerCommand,
  PreviousEmployerProspectResponse,
  CreatePreviousEmployerAccidentHistoryCommand,
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
    private applicantStore: ApplicantStore,
    private applicantSphFormStore: ApplicantSphFormStore
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
    data: /* CreateDisclosureReleaseCommand */ any
  ): Observable<CreateResponse> {
    /*  return this.applicantService.apiApplicantDisclosurereleasePost(data); */
    return;
  }

  public createAuthorization(
    data: CreateAuthorizationCommand
  ): Observable<CreateResponse> {
    return this.applicantService.apiApplicantAuthorizationPost(data);
  }

  /* BACKEND PUT ACTION FUNCTIONS - APPLICANT MODE */

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

  public createEducationReview(
    data: CreateEducationReviewCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantEducationReviewPost(data);
  }

  public createSevenDaysHosReview(
    data: CreateSevenDaysHosReviewCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantSevendayshosReviewPost(data);
  }

  public createDrugAndAcoholReview(
    data: CreateDrugAndAlcoholReviewCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantDrugandalcoholReviewPost(data);
  }

  public createAuthorizationReview(
    data: CreateAuthorizationReviewCommand
  ): Observable<CreateResponse> {
    return this.applicantService.apiApplicantAuthorizationReviewPost(data);
  }

  public invitePreviousEmployerSphForm(
    data: InvitePreviousEmployerCommand
  ): Observable<any> {
    return this.applicantService.apiApplicantPreviousemployerPost(data);
  }

  public verifyPreviousEmployerSphForm(
    data: VerifyPreviousEmployerCommand
  ): Observable<PreviousEmployerProspectResponse> {
    return this.applicantService
      .apiApplicantPreviousemployerInvitePost(data)
      .pipe(
        tap((res) => {
          this.applicantSphFormStore.set({
            1: { verifyData: null, step1: res, step2: null, step3: null },
          });
        })
      );
  }

  public createAccidentHistorySphForm(
    data: CreatePreviousEmployerAccidentHistoryCommand
  ): Observable<CreateResponse> {
    return this.applicantService.apiApplicantPreviousemployerAccidenthistoryPost(
      data
    );
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
