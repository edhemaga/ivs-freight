import {
    ApplicantResponse,
    ApplicantModalResponse,
    SphPreviousEmployerProspectResponse,
} from 'appcoretruckassist/model/models';

export interface IApplicantStore {
    applicant: ApplicantResponse;
    applicantDropdownLists: ApplicantModalResponse;
    applicantSphForm: {
        companyInfo: any;
        verifyData: any;
        step1: SphPreviousEmployerProspectResponse;
        step2: any;
        step3: any;
    };
}
