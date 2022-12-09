import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicantService } from '../../../../../../../appcoretruckassist';
import { FormDataService } from 'src/app/core/services/formData/form-data.service';

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
    CreateWorkExperienceCommand,
    CreatePersonalInfoReviewCommand,
    CreateWorkExperienceReviewCommand,
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
    CreateWithUploadsResponse,
    UpdateWorkExperienceCommand,
    UpdatePspAuthCommand,
    UpdateSphCommand,
    UpdateHosRulesCommand,
    UpdateDrugAndAlcoholReviewCommand,
    UpdateSevenDaysHosReviewCommand,
    UpdatePersonalInfoReviewCommand,
    UpdateEducationReviewCommand,
    UpdateTrafficViolationReviewCommand,
    UpdateAccidentRecordReviewCommand,
    CreateApplicantCdlInformationCommand,
    UpdateApplicantCdlInformationCommand,
    CreateApplicantCdlInformationReviewCommand,
    UpdateApplicantCdlInformationReviewCommand,
    UpdateWorkExperienceReviewCommand,
} from 'appcoretruckassist/model/models';

@Injectable({
    providedIn: 'root',
})
export class ApplicantActionsService {
    constructor(
        private applicantService: ApplicantService,
        private formDataService: FormDataService
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

    /*   public createPersonalInfo(
        data: UpdatePersonalInfoCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantPersonalPut(data);
    } */

    public createWorkExperience(
        data: CreateWorkExperienceCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantWorkexperiencePost(data);
    }

    public createCdlInformation(
        data: CreateApplicantCdlInformationCommand
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
        this.formDataService.extractFormDataFromFunction(data);

        return this.applicantService.apiApplicantMedicalcertificatePost(data);
    }

    public createMvrAuthorization(
        data: any
    ): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.applicantService.apiApplicantMvrPost(data);
    }

    public createSsnCard(data: any): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.applicantService.apiApplicantSsnPost(data);
    }

    public createCdlCard(data: any): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.applicantService.apiApplicantCdlcardPost(data);
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
        data: UpdateApplicantCdlInformationCommand
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
        this.formDataService.extractFormDataFromFunction(data);

        return this.applicantService.apiApplicantMedicalcertificatePut(data);
    }

    public updateMvrAuthorization(
        data: any
    ): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.applicantService.apiApplicantMvrPut(data);
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
        this.formDataService.extractFormDataFromFunction(data);

        return this.applicantService.apiApplicantSsnPut(data);
    }

    public updateCdlCard(data: any) {
        this.formDataService.extractFormDataFromFunction(data);

        return this.applicantService.apiApplicantCdlcardPut(data);
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
        data: CreateApplicantCdlInformationReviewCommand
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
        return this.applicantService.apiApplicantTrafficviolationReviewPost(
            data
        );
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
        return this.applicantService.apiApplicantDisclosurereleaseReviewPost(
            data
        );
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
        return this.applicantService.apiApplicantPreviousemployerVerifyPost(
            data
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

    /* BACKEND PUT ACTION FUNCTIONS - REVIEW MODE */

    public updatePersonalInfoReview(
        data: UpdatePersonalInfoReviewCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantPersonalReviewPut(data);
    }

    public updateWorkExperienceReview(
        data: UpdateWorkExperienceReviewCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantWorkexperienceReviewPut(data);
    }

    public updateCdlInformationReview(
        data: UpdateApplicantCdlInformationReviewCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantCdlReviewPut(data);
    }

    public updateAccidentRecordReview(
        data: UpdateAccidentRecordReviewCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantAccidentrecordReviewPut(data);
    }

    public updateTrafficViolationsReview(
        data: UpdateTrafficViolationReviewCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantTrafficviolationReviewPut(
            data
        );
    }

    public updateEducationReview(
        data: UpdateEducationReviewCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantEducationReviewPut(data);
    }

    public updateSevenDaysHosReview(
        data: UpdateSevenDaysHosReviewCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantSevendayshosReviewPut(data);
    }

    public updateDrugAndAcoholReview(
        data: UpdateDrugAndAlcoholReviewCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantDrugandalcoholReviewPut(data);
    }

    /* BACKEND GET ACTION FUNCTIONS */

    public getApplicantById(id: number): Observable<ApplicantResponse> {
        return this.applicantService.apiApplicantIdGet(id);
    }

    public getDropdownLists(): Observable<ApplicantModalResponse> {
        return this.applicantService.apiApplicantModalGet();
    }
}
