import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// models
import {
    ApplicantService,
    CreatePreviousEmployerAccidentHistoryCommand,
    CreatePreviousEmployerDrugAndAlcoholCommand,
    CreateResponse,
    SphPreviousEmployerProspectResponse,
    VerifyPreviousEmployerCommand,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class ApplicantSphService {
    constructor(private applicantService: ApplicantService) {}

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

    public verifyPreviousEmployerSphForm(
        data: VerifyPreviousEmployerCommand
    ): Observable<SphPreviousEmployerProspectResponse> {
        return this.applicantService.apiApplicantPreviousemployerVerifyPost(
            data
        );
    }
}
