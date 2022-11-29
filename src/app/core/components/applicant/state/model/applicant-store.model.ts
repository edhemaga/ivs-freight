import {
    ApplicantResponse,
    ApplicantModalResponse,
    SphPreviousEmployerProspectResponse,
} from 'appcoretruckassist/model/models';

export interface IApplicantStore {
    applicant: ApplicantResponse;
    applicantDropdownLists: ApplicantModalResponse;
    applicantSphForm: SphPreviousEmployerProspectResponse;
}
