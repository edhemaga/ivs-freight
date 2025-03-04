/* eslint-disable no-unused-vars */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// validations
import {
    phoneFaxRegex,
    addressValidation,
    addressUnitValidation,
    descriptionValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// store
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

// models
import { ApplicantQuestion } from '@pages/applicant/pages/applicant-application/models/applicant-question.model';
import { AnswerChoices } from '@pages/applicant/pages/applicant-application/models/answer-choices.model';
import {
    ApplicantModalResponse,
    EnumValue,
    TrailerTypeResponse,
    TruckTypeResponse,
} from 'appcoretruckassist/model/models';

// components
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputRadiobuttonsComponent } from '@shared/components/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaInputArrowsComponent } from '@shared/components/ta-input-arrows/ta-input-arrows.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';

// modules
import { ApplicantModule } from '@pages/applicant/applicant.module';
import { SharedModule } from '@shared/shared.module';
import { CaInputDatetimePickerComponent } from 'ca-components';

@Component({
    selector: 'app-sph-modal',
    templateUrl: './applicant-sph-modal.component.html',
    styleUrls: ['./applicant-sph-modal.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,

        // components
        TaCheckboxComponent,
        TaInputRadiobuttonsComponent,
        TaInputComponent,
        TaInputAddressDropdownComponent,
        TaInputArrowsComponent,
        TaInputDropdownComponent,
        TaModalComponent,
        CaInputDatetimePickerComponent,
    ],
})
export class ApplicantSphModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public prospectiveEmployerForm: UntypedFormGroup;
    public accidentHistoryForm: UntypedFormGroup;
    public drugAndAlcoholTestingHistoryForm: UntypedFormGroup;

    public vehicleType: TruckTypeResponse[] = [];
    public trailerType: TrailerTypeResponse[] = [];

    public reasonsForLeaving: EnumValue[] = [];

    public questions: ApplicantQuestion[] = [
        {
            title: 'Did the above applicant work for your company?',
            formControlName: 'applicantWorkForCompany',
            answerChoices: [
                {
                    id: 1,
                    label: 'YES',
                    value: 'applicantWorkForCompanyYes',
                    name: 'applicantWorkForCompanyYes',
                    checked: false,
                    index: 0,
                },
                {
                    id: 2,
                    label: 'NO',
                    value: 'applicantWorkForCompanyNo',
                    name: 'applicantWorkForCompanyNo',
                    checked: false,
                    index: 0,
                },
            ],
        },
        {
            title: 'Did he/she drive a motor vehicle for your company?',
            formControlName: 'motorVehicleForCompany',
            answerChoices: [
                {
                    id: 3,
                    label: 'YES',
                    value: 'motorVehicleForCompanyYes',
                    name: 'motorVehicleForCompanyYes',
                    checked: false,
                    index: 1,
                },
                {
                    id: 4,
                    label: 'NO',
                    value: 'motorVehicleForCompanyNo',
                    name: 'motorVehicleForCompanyNo',
                    checked: false,
                    index: 1,
                },
            ],
        },
        {
            title: 'Would this applicant be considered for employment with your company again?',
            formControlName: 'consideredForEmploymentAgain',
            answerChoices: [
                {
                    id: 5,
                    label: 'YES',
                    value: 'consideredForEmploymentAgainYes',
                    name: 'consideredForEmploymentAgainYes',
                    checked: false,
                    index: 2,
                },
                {
                    id: 6,
                    label: 'NO',
                    value: 'consideredForEmploymentAgainNo',
                    name: 'consideredForEmploymentAgainNo',
                    checked: false,
                    index: 2,
                },
            ],
        },
    ];

    public drugAndAlcoholQuestions: ApplicantQuestion[] = [
        {
            title: 'Has this person had an alcohol test with a result of 0.04 or higher alcohol concentration?',
            formControlName: 'alcoholTest',
            answerChoices: [
                {
                    id: 19,
                    label: 'YES',
                    value: 'alcoholTestYes',
                    name: 'alcoholTestYes',
                    checked: false,
                    index: 9,
                },
                {
                    id: 20,
                    label: 'NO',
                    value: 'alcoholTestNo',
                    name: 'alcoholTestNo',
                    checked: false,
                    index: 9,
                },
            ],
        },
        {
            title: 'Has this person tested positive for controlled substances?',
            formControlName: 'controledSubstances',
            answerChoices: [
                {
                    id: 9,
                    label: 'YES',
                    value: 'controledSubstancesYes',
                    name: 'controledSubstancesYes',
                    checked: false,
                    index: 4,
                },
                {
                    id: 10,
                    label: 'NO',
                    value: 'controledSubstancesNo',
                    name: 'controledSubstancesNo',
                    checked: false,
                    index: 4,
                },
            ],
        },
        {
            title: 'Has this person refused to submit to a post-accident, random, reasonable suspicion, or follow up alcohol or controlled  substances test or adulterated or substituted a drug test specimen?',
            formControlName: 'refusedToSubmit',
            answerChoices: [
                {
                    id: 11,
                    label: 'YES',
                    value: 'refusedToSubmitYes',
                    name: 'refusedToSubmitYes',
                    checked: false,
                    index: 5,
                },
                {
                    id: 12,
                    label: 'NO',
                    value: 'refusedToSubmitNo',
                    name: 'refusedToSubmitNo',
                    checked: false,
                    index: 5,
                },
            ],
        },
        {
            title: 'Has this person committed other violations of Subpart B of Part 382, or 49 CFR Part 40?',
            formControlName: 'otherViolations',
            answerChoices: [
                {
                    id: 13,
                    label: 'YES',
                    value: 'otherViolationsYes',
                    name: 'otherViolationsYes',
                    checked: false,
                    index: 6,
                },
                {
                    id: 14,
                    label: 'NO',
                    value: 'otherViolationsNo',
                    name: 'otherViolationsNo',
                    checked: false,
                    index: 6,
                },
            ],
        },
        {
            title: 'If this person has violated a DOT drug and alcohol regulation, did this person complete an SAP-prescribed rehabilitation program while in your employ, including return-to-duty and follow up tests?',
            formControlName: 'drugAndAlcoholRegulation',
            answerChoices: [
                {
                    id: 15,
                    label: 'YES',
                    value: 'drugAndAlcoholRegulationYes',
                    name: 'drugAndAlcoholRegulationYes',
                    checked: false,
                    index: 7,
                },
                {
                    id: 16,
                    label: 'NO',
                    value: 'drugAndAlcoholRegulationNo',
                    name: 'drugAndAlcoholRegulationNo',
                    checked: false,
                    index: 7,
                },
            ],
        },
        {
            title: 'For a driver who successfully completed an ASP’s rehabilitation referral and remained in your employ. Did this driver, subsequently, have an alcohol test result of 0.04 or greater, verified positive drug test, or refuse to be tested?',
            formControlName: 'aspRehabilitation',
            answerChoices: [
                {
                    id: 17,
                    label: 'YES',
                    value: 'aspRehabilitationYes',
                    name: 'aspRehabilitationYes',
                    checked: false,
                    index: 8,
                },
                {
                    id: 18,
                    label: 'NO',
                    value: 'aspRehabilitationNo',
                    name: 'aspRehabilitationNo',
                    checked: false,
                    index: 8,
                },
            ],
        },
    ];

    public hazmatAnswerChoices: AnswerChoices[] = [
        {
            id: 7,
            label: 'YES',
            value: 'hazmatYes',
            name: 'hazmatYes',
            checked: false,
        },
        {
            id: 8,
            label: 'NO',
            value: 'hazmatNo',
            name: 'hazmatNo',
            checked: false,
        },
    ];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private applicantQuery: ApplicantQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getDropdownLists();
    }

    public trackByIdentity = (index: number, item: any): number => index;

    private createForm(): void {
        this.prospectiveEmployerForm = this.formBuilder.group({
            toPreviousEmployer: [null],
            phone: [null, phoneFaxRegex],
            email: [null],
            fax: [null, phoneFaxRegex],
            address: [null, [...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
        });

        this.accidentHistoryForm = this.formBuilder.group({
            applicantWorkForCompany: [null],
            motorVehicleForCompany: [null],
            vehicleType: [null],
            trailerType: [null],
            reasonForLeaving: [null],
            consideredForEmploymentAgain: [null],
            noSafetyPerformance: [false],
            accidentDate: [null],
            accidentLocation: [null, [...addressValidation]],
            accidentDescription: [null, descriptionValidation],
            hazmatSpill: [null],
            fatalities: [0],
            injuries: [0],
        });

        this.drugAndAlcoholTestingHistoryForm = this.formBuilder.group({
            applicantNotSubject: [false],
            employmentFromDate: [null],
            employmentToDate: [null],
            alcoholTest: [null],
            controledSubstances: [null],
            refusedToSubmit: [null],
            otherViolations: [null],
            drugAndAlcoholRegulation: [null],
            sapName: [null],
            phone: [null, [phoneFaxRegex]],
            address: [null, [...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            aspRehabilitation: [null],
        });
    }

    public handleInputSelect(event: any): void {
        const selectedCheckbox = event.find(
            (radio: { checked: boolean }) => radio.checked
        );

        const selectedFormControlName =
            this.questions[selectedCheckbox.index].formControlName;

        this.accidentHistoryForm
            .get(selectedFormControlName)
            .patchValue(selectedCheckbox.label);
    }

    public getDropdownLists(): void {
        this.applicantQuery.applicantDropdownLists$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantModalResponse) => {
                this.reasonsForLeaving = res.reasonsForLeave;

                this.vehicleType = res.truckTypes.map((item) => {
                    return {
                        ...item,
                        folder: 'common',
                        subFolder: 'trucks',
                    };
                });

                this.trailerType = res.trailerTypes.map((item) => {
                    return {
                        ...item,
                        folder: 'common',
                        subFolder: 'trailers',
                    };
                });
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
