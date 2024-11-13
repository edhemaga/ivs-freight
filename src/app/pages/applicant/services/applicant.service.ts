import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

// services
import { ApplicantService as ApplicantBackendService } from 'appcoretruckassist';
import { FormDataService } from '@shared/services/form-data.service';

// environments
import { environment } from 'src/environments/environment';

// models
import {
    VerifyApplicantCommand,
    CreateDisclosureReviewCommand,
    AcceptApplicationCommand,
    ApplicantResponse,
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
    CreateApplicantCdlInformationReviewCommand,
    UpdateApplicantCdlInformationReviewCommand,
    UpdateWorkExperienceReviewCommand,
    CreatePspAuthReviewCommand,
    CreateMedicalCertificateReviewCommand,
    CreateSphReviewCommand,
    CreateHosRulesReviewCommand,
    UpdateMedicalCertificateReviewCommand,
    CreateMvrAuthReviewCommand,
    UpdateMvrAuthReviewCommand,
    CreateCompanyOwnerInfoReviewCommand,
    UpdateCompanyOwnerInfoReviewCommand,
} from 'appcoretruckassist/model/models';

@Injectable({
    providedIn: 'root',
})
export class ApplicantService {
    constructor(
        private applicantService: ApplicantBackendService,
        private formDataService: FormDataService,
        private httpClient: HttpClient
    ) {}

    /* BACKEND POST ACTION FUNCTIONS -  APPLICANT MODE */

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

    public createPersonalInfo(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.applicantService.apiApplicantPersonalPost(data);
    }

    public createWorkExperience(
        data: CreateWorkExperienceCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantWorkexperiencePost(data);
    }

    public createCdlInformation(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);

        const localVarFormParams = new FormData();

        const localVarPath = `${environment.API_ENDPOINT}/api/applicant/cdl`;

        return this.httpClient.post(localVarPath, localVarFormParams);
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

    public createOwnerInfoCompany(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.applicantService.apiApplicantOwnerinfoCompanyPost(data);
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

    /* BACKEND PUT ACTION FUNCTIONS - APPLICANT & FEEDBACK MODE */

    public updatePersonalInfo(data): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.applicantService.apiApplicantPersonalPut(data);
    }

    public updateWorkExperience(
        data: UpdateWorkExperienceCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantWorkexperiencePut(data);
    }

    public updateCdlInformation(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);

        const localVarFormParams = new FormData();

        const localVarPath = `${environment.API_ENDPOINT}/api/applicant/cdl`;

        return this.httpClient.put(localVarPath, localVarFormParams);
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

    public updateOwnerInfoCompany(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.applicantService.apiApplicantOwnerinfoCompanyPut(data);
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

    public createOwnerInfoCompanyReview(
        data: CreateCompanyOwnerInfoReviewCommand
    ): Observable<CreateResponse> {
        return this.applicantService.apiApplicantOwnerinfoCompanyReviewPost(
            data
        );
    }

    public createMedicalCertificateReview(
        data: CreateMedicalCertificateReviewCommand
    ): Observable<CreateResponse> {
        return this.applicantService.apiApplicantMedicalcertificateReviewPost(
            data
        );
    }

    public createMvrAuthorizationReview(
        data: CreateMvrAuthReviewCommand
    ): Observable<CreateWithUploadsResponse> {
        return this.applicantService.apiApplicantMvrReviewPost(data);
    }

    public createPspAuthorizationReview(
        data: CreatePspAuthReviewCommand
    ): Observable<CreateResponse> {
        return this.applicantService.apiApplicantPspReviewPost(data);
    }

    public createSphReview(
        data: CreateSphReviewCommand
    ): Observable<CreateResponse> {
        return this.applicantService.apiApplicantSphReviewPost(data);
    }

    public createHosRulesReview(
        data: CreateHosRulesReviewCommand
    ): Observable<CreateResponse> {
        return this.applicantService.apiApplicantHosrulesReviewPost(data);
    }

    public invitePreviousEmployerSphForm(
        data: InvitePreviousEmployerCommand
    ): Observable<InviteEmployerResponse> {
        return this.applicantService.apiApplicantPreviousemployerPost(data);
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

    public updateOwnerInfoCompanyReview(
        data: UpdateCompanyOwnerInfoReviewCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantOwnerinfoCompanyReviewPut(
            data
        );
    }

    public updateMedicalCertificateReview(
        data: UpdateMedicalCertificateReviewCommand
    ): Observable<CreateResponse> {
        return this.applicantService.apiApplicantMedicalcertificateReviewPut(
            data
        );
    }

    public updateMvrAuthorizationReview(
        data: UpdateMvrAuthReviewCommand
    ): Observable<object> {
        return this.applicantService.apiApplicantMvrReviewPut(data);
    }

    /* BACKEND GET ACTION FUNCTIONS */

    public getApplicantById(id: number): Observable<ApplicantResponse> {
        return this.applicantService.apiApplicantIdGet(id);
    }

    public getDropdownLists(id: number): Observable<ApplicantModalResponse> {
        return this.applicantService.apiApplicantModalGet(id);
    }
}
