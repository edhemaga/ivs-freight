import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { getFunctionParams } from 'src/app/core/utils/methods.globals';

import { ApplicantService } from '../../../../../../../appcoretruckassist';

import {
  VerifyApplicantCommand,
  CreateDisclosureReviewCommand,
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
  CreateAuthorizationReviewCommand,
  CreateDriverRightsReviewCommand,
  UpdateEducationCommand,
  UpdateTrafficViolationCommand,
  UpdateAccidentRecordCommand,
  UpdateApplicantCdlCommand,
  CreateWithUploadsResponse,
  UpdateWorkExperienceCommand,
  UpdatePspAuthCommand,
  UpdateSphCommand,
  UpdateHosRulesCommand,
} from 'appcoretruckassist/model/models';

@Injectable({
  providedIn: 'root',
})
export class ApplicantActionsService {
  constructor(private applicantService: ApplicantService) {}

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

  public createMedicalCertificate(
    data: any
  ): Observable<CreateWithUploadsResponse> {
    const sortedParams = getFunctionParams(
      this.applicantService.apiApplicantMedicalcertificatePost,
      data
    );

    return this.applicantService.apiApplicantMedicalcertificatePost(
      ...sortedParams
    );
  }

  public createMvrAuthorization(
    data: any
  ): Observable<CreateWithUploadsResponse> {
    const sortedParams = getFunctionParams(
      this.applicantService.apiApplicantMvrPost,
      data
    );

    return this.applicantService.apiApplicantMvrPost(...sortedParams);
  }

  public createSsnCard(data: any): Observable<CreateWithUploadsResponse> {
    const sortedParams = getFunctionParams(
      this.applicantService.apiApplicantSsnPost,
      data
    );

    return this.applicantService.apiApplicantSsnPost(...sortedParams);
  }

  public createCdlCard(data: any): Observable<CreateWithUploadsResponse> {
    const sortedParams = getFunctionParams(
      this.applicantService.apiApplicantCdlcardPost,
      data
    );

    return this.applicantService.apiApplicantCdlcardPost(...sortedParams);
  }

  /* BACKEND PUT ACTION FUNCTIONS - APPLICANT & FEEDBACK MODE */

  public updatePersonalInfo(
    data: UpdatePersonalInfoCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantPersonalPut(data);
  }

  public updateWorkExperience(
    data: UpdateWorkExperienceCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantWorkexperiencePut(data);
  }

  public updateCdlInformation(
    data: UpdateApplicantCdlCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantCdlPut(data);
  }

  public updateAccidentRecord(
    data: UpdateAccidentRecordCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantAccidentrecordPut(data);
  }

  public updateTrafficViolations(
    data: UpdateTrafficViolationCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantTrafficviolationPut(data);
  }

  public updateEducation(data: UpdateEducationCommand): Observable<object> {
    return this.applicantService.apiApplicantEducationPut(data);
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

  public updateDisclosureAndRelease(
    data: UpdateDisclosureReleaseCommand
  ): Observable<CreateResponse> {
    return this.applicantService.apiApplicantDisclosurereleasePut(data);
  }

  public updateAuthorization(
    data: UpdateAuthorizationCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantAuthorizationPut(data);
  }

  public updateMedicalCertificate(
    data: any
  ): Observable<CreateWithUploadsResponse> {
    const sortedParams = getFunctionParams(
      this.applicantService.apiApplicantMedicalcertificatePut,
      data
    );

    return this.applicantService.apiApplicantMedicalcertificatePut(
      ...sortedParams
    );
  }

  public updateMvrAuthorization(
    data: any
  ): Observable<CreateWithUploadsResponse> {
    const sortedParams = getFunctionParams(
      this.applicantService.apiApplicantMvrPut,
      data
    );

    return this.applicantService.apiApplicantMvrPut(...sortedParams);
  }

  public updatePspAuthorization(
    data: UpdatePspAuthCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantPspPut(data);
  }

  public updateSph(data: UpdateSphCommand): Observable<object> {
    return this.applicantService.apiApplicantSphPut(data);
  }

  public updateHosRules(data: UpdateHosRulesCommand): Observable<object> {
    return this.applicantService.apiApplicantHosrulesPut(data);
  }

  public updateSsnCard(data: any): Observable<CreateWithUploadsResponse> {
    const sortedParams = getFunctionParams(
      this.applicantService.apiApplicantSsnPut,
      data
    );

    return this.applicantService.apiApplicantSsnPut(...sortedParams);
  }

  public updateCdlCard(data: any) {
    const sortedParams = getFunctionParams(
      this.applicantService.apiApplicantCdlcardPut,
      data
    );

    return this.applicantService.apiApplicantCdlcardPut(...sortedParams);
  }

  /* BACKEND POST ACTION FUNCTIONS - REVIEW MODE */

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

  public createDriverRightsReview(
    data: CreateDriverRightsReviewCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantDriverrightsReviewPost(data);
  }

  public createDisclosureAndReleaseReview(
    data: CreateDisclosureReviewCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantDisclosurereleaseReviewPost(data);
  }

  public createAuthorizationReview(
    data: CreateAuthorizationReviewCommand
  ): Observable<object> {
    return this.applicantService.apiApplicantAuthorizationReviewPost(data);
  }

  public invitePreviousEmployerSphForm(
    data: InvitePreviousEmployerCommand
  ): Observable<InviteEmployerResponse> {
    return this.applicantService.apiApplicantPreviousemployerPost(data);
  }

  public verifyPreviousEmployerSphForm(
    data: VerifyPreviousEmployerCommand
  ): Observable<SphPreviousEmployerProspectResponse> {
    return this.applicantService.apiApplicantPreviousemployerVerifyPost(data);
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
