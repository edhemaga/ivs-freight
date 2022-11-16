import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { ApplicantService } from '../../../../../../../appcoretruckassist';

import { ApplicantSphFormStore } from '../store/applicant-sph-form-store/applicant-sph-form.store';

import {
  VerifyApplicantCommand,
  AcceptApplicationCommand,
  ApplicantResponse,
  UpdatePersonalInfoCommand,
  CreateSevenDaysHosCommand,
  CreateDrugAndAlcoholCommand,
  UpdateDriverRightsCommand,
  CreateResponse,
  CreateEducationCommand,
  CreateTrafficViolationCommand,
  CreateAccidentRecordCommand,
  CreateApplicantCdlCommand,
  CreateWorkExperienceCommand,
  CreatePersonalInfoReviewCommand,
  CreateWorkExperienceReviewCommand,
  CreateApplicantCdlReviewCommand,
  CreateAccidentRecordReviewCommand,
  CreateTrafficViolationReviewCommand,
  CreateEducationReviewCommand,
  CreateSevenDaysHosReviewCommand,
  CreateDrugAndAlcoholReviewCommand,
  InvitePreviousEmployerCommand,
  VerifyPreviousEmployerCommand,
  CreatePreviousEmployerAccidentHistoryCommand,
  CreatePreviousEmployerDrugAndAlcoholCommand,
  SphPreviousEmployerProspectResponse,
  InviteEmployerResponse,
  UpdateAuthorizationCommand,
  UpdateDisclosureReleaseCommand,
  UpdateDrugAndAlcoholCommand,
  UpdateSevenDaysHosCommand,
  ApplicantModalResponse,
} from 'appcoretruckassist/model/models';

@Injectable({
  providedIn: 'root',
})
export class ApplicantActionsService {
  constructor(
    private applicantService: ApplicantService,
    private applicantSphFormStore: ApplicantSphFormStore
  ) {}

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

  /* BACKEND PUT ACTION FUNCTIONS - APPLICANT & FEEDBACK MODE */

  public updatePersonalInfo(
    data: UpdatePersonalInfoCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantPersonalPut(data);
  }

  public updateSevenDaysHos(
    data: UpdateSevenDaysHosCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantSevendayshosPut(data);
  }

  public updateDrugAndAlcohol(
    data: UpdateDrugAndAlcoholCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantDrugandalcoholPut(data);
  }

  public updateDriverRights(
    data: UpdateDriverRightsCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantDriverrightsPut(data);
  }

  public createDisclosureAndRelease(
    data: UpdateDisclosureReleaseCommand
  ): Observable<CreateResponse> {
    return this.applicantService.apiApplicantDisclosurereleasePut(data);
  }

  public createAuthorization(
    data: UpdateAuthorizationCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantAuthorizationPut(data);
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

  public createTrafficViolationsReview(
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

  public invitePreviousEmployerSphForm(
    data: InvitePreviousEmployerCommand
  ): Observable<InviteEmployerResponse> {
    return this.applicantService.apiApplicantPreviousemployerPost(data);
  }

  public verifyPreviousEmployerSphForm(
    data: VerifyPreviousEmployerCommand
  ): Observable<SphPreviousEmployerProspectResponse> {
    return this.applicantService
      .apiApplicantPreviousemployerVerifyPost(data)
      .pipe(
        tap((res) => {
          this.applicantSphFormStore.set({
            1: {
              companyInfo: null,
              verifyData: null,
              step1: res,
              step2: null,
              step3: null,
            },
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

  public createDrugAndAlcoholSphForm(
    data: CreatePreviousEmployerDrugAndAlcoholCommand
  ): Observable<CreateResponse> {
    return this.applicantService.apiApplicantPreviousemployerDrugandalcoholPost(
      data
    );
  }

  /* BACKEND GET ACTION FUNCTIONS */

  public getApplicantById(id: number): Observable<ApplicantResponse> {
    return this.applicantService.apiApplicantIdGet(id);
  }

  public getDropdownLists(): Observable<ApplicantModalResponse> {
    return this.applicantService.apiApplicantModalGet();
  }
}
