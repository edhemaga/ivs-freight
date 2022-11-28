import {
    Component,
    OnInit,
    QueryList,
    ViewChildren,
    AfterViewInit,
    OnDestroy,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import {
    convertDateToBackend,
    convertDateFromBackend,
} from 'src/app/core/utils/methods.calculations';

import {
    filterUnceckedRadiosId,
    isAnyRadioInArrayUnChecked,
} from 'src/app/core/components/applicant/state/utils/utils';

import {
    phoneFaxRegex,
    addressValidation,
    addressUnitValidation,
} from '../../../../../../shared/ta-input/ta-input.regex-validations';

import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { ApplicantActionsService } from 'src/app/core/components/applicant/state/services/applicant-actions.service';

import { ApplicantQuery } from 'src/app/core/components/applicant/state/store/applicant.query';
import { ApplicantStore } from 'src/app/core/components/applicant/state/store/applicant.store';

import { ApplicantQuestion } from '../../../../../state/model/applicant-question.model';
import { InputSwitchActions } from '../../../../../state/enum/input-switch-actions.enum';
import { AddressEntity } from './../../../../../../../../../../appcoretruckassist/model/addressEntity';
import { CreatePreviousEmployerDrugAndAlcoholCommand } from 'appcoretruckassist/model/models';

@Component({
    selector: 'app-step3',
    templateUrl: './step3.component.html',
    styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren('cmp') components: QueryList<any>;

    private destroy$ = new Subject<void>();

    public drugAndAlcoholTestingHistoryForm: FormGroup;

    public radioButtonsArray: any;
    public alcoholTestRadios: any;
    public controledSubstancesRadios: any;
    public refusedToSubmitRadios: any;
    public otherViolationsRadios: any;
    public drugAndAlcoholRegulationRadios: any;
    public aspRehabilitationRadios: any;

    public previousEmployerProspectId: number;

    public previousStepValues: any;

    public selectedAddress: AddressEntity = null;

    public displayRadioRequiredNoteArray: {
        id: number;
        displayRadioRequiredNote: boolean;
    }[] = [
        { id: 0, displayRadioRequiredNote: false },
        { id: 1, displayRadioRequiredNote: false },
        { id: 2, displayRadioRequiredNote: false },
        { id: 3, displayRadioRequiredNote: false },
        { id: 4, displayRadioRequiredNote: false },
        { id: 5, displayRadioRequiredNote: false },
    ];

    public questions: ApplicantQuestion[] = [
        {
            title: 'Has this person had an alcohol test with a result of 0.04 or higher alcohol concentration?',
            formControlName: 'alcoholTest',
            answerChoices: [
                {
                    id: 1,
                    label: 'YES',
                    value: 'alcoholTestYes',
                    name: 'alcoholTestYes',
                    checked: false,
                    index: 0,
                },
                {
                    id: 2,
                    label: 'NO',
                    value: 'alcoholTestNo',
                    name: 'alcoholTestNo',
                    checked: false,
                    index: 0,
                },
            ],
        },
        {
            title: 'Has this person tested positive for controlled substances?',
            formControlName: 'controledSubstances',
            answerChoices: [
                {
                    id: 3,
                    label: 'YES',
                    value: 'controledSubstancesYes',
                    name: 'controledSubstancesYes',
                    checked: false,
                    index: 1,
                },
                {
                    id: 4,
                    label: 'NO',
                    value: 'controledSubstancesNo',
                    name: 'controledSubstancesNo',
                    checked: false,
                    index: 1,
                },
            ],
        },
        {
            title: 'Has this person refused to submit to a post-accident, random, reasonable suspicion, or follow up alcohol or controlled  substances test or adulterated or substituted a drug test specimen?',
            formControlName: 'refusedToSubmit',
            answerChoices: [
                {
                    id: 5,
                    label: 'YES',
                    value: 'refusedToSubmitYes',
                    name: 'refusedToSubmitYes',
                    checked: false,
                    index: 2,
                },
                {
                    id: 6,
                    label: 'NO',
                    value: 'refusedToSubmitNo',
                    name: 'refusedToSubmitNo',
                    checked: false,
                    index: 2,
                },
            ],
        },
        {
            title: 'Has this person committed other violations of Subpart B of Part 382, or 49 CFR Part 40?',
            formControlName: 'otherViolations',
            answerChoices: [
                {
                    id: 7,
                    label: 'YES',
                    value: 'otherViolationsYes',
                    name: 'otherViolationsYes',
                    checked: false,
                    index: 3,
                },
                {
                    id: 8,
                    label: 'NO',
                    value: 'otherViolationsNo',
                    name: 'otherViolationsNo',
                    checked: false,
                    index: 3,
                },
            ],
        },
        {
            title: 'If this person has violated a DOT drug and alcohol regulation, did this person complete an SAP-prescribed rehabilitation program while in your employ, including return-to-duty and follow up tests?',
            formControlName: 'drugAndAlcoholRegulation',
            answerChoices: [
                {
                    id: 9,
                    label: 'YES',
                    value: 'drugAndAlcoholRegulationYes',
                    name: 'drugAndAlcoholRegulationYes',
                    checked: false,
                    index: 4,
                },
                {
                    id: 10,
                    label: 'NO',
                    value: 'drugAndAlcoholRegulationNo',
                    name: 'drugAndAlcoholRegulationNo',
                    checked: false,
                    index: 4,
                },
            ],
        },
        {
            title: 'For a driver who successfully completed an ASP’s rehabilitation referral and remained in your employ. Did this driver, subsequently, have an alcohol test result of 0.04 or greater, verified positive drug test, or refuse to be tested?',
            formControlName: 'aspRehabilitation',
            answerChoices: [
                {
                    id: 11,
                    label: 'YES',
                    value: 'aspRehabilitationYes',
                    name: 'aspRehabilitationYes',
                    checked: false,
                    index: 5,
                },
                {
                    id: 12,
                    label: 'NO',
                    value: 'aspRehabilitationNo',
                    name: 'aspRehabilitationNo',
                    checked: false,
                    index: 5,
                },
            ],
        },
    ];

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private inputService: TaInputService,
        private applicantActionsService: ApplicantActionsService,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.isNotSubjectToTesting();

        this.getStepValuesFromStore();
    }

    ngAfterViewInit(): void {
        this.radioButtonsArray = this.components.toArray();

        this.alcoholTestRadios = this.radioButtonsArray[0].buttons;
        this.controledSubstancesRadios = this.radioButtonsArray[1].buttons;
        this.refusedToSubmitRadios = this.radioButtonsArray[2].buttons;
        this.otherViolationsRadios = this.radioButtonsArray[3].buttons;
        this.drugAndAlcoholRegulationRadios = this.radioButtonsArray[4].buttons;
        this.aspRehabilitationRadios = this.radioButtonsArray[5].buttons;
    }

    public trackByIdentity = (index: number, _: any): number => index;

    private createForm(): void {
        this.drugAndAlcoholTestingHistoryForm = this.formBuilder.group({
            applicantNotSubject: [false],
            employmentFromDate: [null, Validators.required],
            employmentToDate: [null, Validators.required],
            alcoholTest: [null, Validators.required],
            controledSubstances: [null, Validators.required],
            refusedToSubmit: [null, Validators.required],
            otherViolations: [null, Validators.required],
            drugAndAlcoholRegulation: [null, Validators.required],
            sapName: [null, Validators.required],
            phone: [null, [Validators.required, phoneFaxRegex]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            aspRehabilitation: [null, Validators.required],
        });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicantSphForm$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.previousEmployerProspectId = res.id;

                if (res.sphDrugAndAlcohol) {
                    this.patchStepValues(res.sphDrugAndAlcohol);

                    /*  this.stepHasValues = true; */
                }
            });
    }

    public patchStepValues(stepValues: any): void {
        const {
            notSubjectToDot,
            employmentFrom,
            employmentTo,
            higherAlcoholConcentration,
            positiveDrugTest,
            refusedToSubmitTest,
            otherViolations,
            violatedDot,
            sapName,
            phone,
            address,
            hasPositiveTests,
        } = stepValues;

        this.drugAndAlcoholTestingHistoryForm
            .get('applicantNotSubject')
            .patchValue(notSubjectToDot);

        if (!notSubjectToDot) {
            this.drugAndAlcoholTestingHistoryForm.patchValue({
                employmentFromDate: convertDateFromBackend(employmentFrom),
                employmentToDate: convertDateFromBackend(employmentTo),
                alcoholTest: higherAlcoholConcentration,
                controledSubstances: positiveDrugTest,
                refusedToSubmit: refusedToSubmitTest,
                otherViolations,
                drugAndAlcoholRegulation: violatedDot,
                sapName,
                phone,
                address: address.address,
                addressUnit: address.addressUnit,
                aspRehabilitation: hasPositiveTests,
            });

            setTimeout(() => {
                this.selectedAddress = address;

                if (higherAlcoholConcentration) {
                    this.alcoholTestRadios[0].checked = true;
                } else {
                    this.alcoholTestRadios[1].checked = true;
                }

                if (positiveDrugTest) {
                    this.controledSubstancesRadios[0].checked = true;
                } else {
                    this.controledSubstancesRadios[1].checked = true;
                }

                if (refusedToSubmitTest) {
                    this.refusedToSubmitRadios[0].checked = true;
                } else {
                    this.refusedToSubmitRadios[1].checked = true;
                }

                if (otherViolations) {
                    this.otherViolationsRadios[0].checked = true;
                } else {
                    this.otherViolationsRadios[1].checked = true;
                }

                if (violatedDot) {
                    this.drugAndAlcoholRegulationRadios[0].checked = true;
                } else {
                    this.drugAndAlcoholRegulationRadios[1].checked = true;
                }

                if (hasPositiveTests) {
                    this.aspRehabilitationRadios[0].checked = true;
                } else {
                    this.aspRehabilitationRadios[1].checked = true;
                }
            }, 150);
        }
    }

    private isNotSubjectToTesting(): void {
        this.drugAndAlcoholTestingHistoryForm
            .get('applicantNotSubject')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                const inputsToValidate = [
                    'employmentFromDate',
                    'employmentToDate',
                    'alcoholTest',
                    'controledSubstances',
                    'refusedToSubmit',
                    'otherViolations',
                    'drugAndAlcoholRegulation',
                    'sapName',
                    'phone',
                    'address',
                    'aspRehabilitation',
                ];

                if (value) {
                    console.log(this.drugAndAlcoholTestingHistoryForm.value);

                    const {
                        applicantNotSubject,
                        employmentFromDate,
                        employmentToDate,
                        alcoholTest,
                        controledSubstances,
                        refusedToSubmit,
                        otherViolations,
                        drugAndAlcoholRegulation,
                        sapName,
                        phone,
                        address,
                        addressUnit,
                        aspRehabilitation,
                    } = this.drugAndAlcoholTestingHistoryForm.value;

                    this.previousStepValues = {
                        applicantNotSubject,
                        employmentFromDate,
                        employmentToDate,
                        alcoholTest,
                        controledSubstances,
                        refusedToSubmit,
                        otherViolations,
                        drugAndAlcoholRegulation,
                        sapName,
                        phone,
                        address,
                        addressUnit,
                        aspRehabilitation,
                    };

                    for (let i = 0; i < inputsToValidate.length; i++) {
                        this.inputService.changeValidators(
                            this.drugAndAlcoholTestingHistoryForm.get(
                                inputsToValidate[i]
                            ),
                            false
                        );
                    }
                } else {
                    if (this.previousStepValues) {
                        const {
                            applicantNotSubject,
                            employmentFromDate,
                            employmentToDate,
                            alcoholTest,
                            controledSubstances,
                            refusedToSubmit,
                            otherViolations,
                            drugAndAlcoholRegulation,
                            sapName,
                            phone,
                            address,
                            addressUnit,
                            aspRehabilitation,
                        } = this.previousStepValues;

                        this.drugAndAlcoholTestingHistoryForm.patchValue({
                            applicantNotSubject,
                            employmentFromDate,
                            employmentToDate,
                            alcoholTest,
                            controledSubstances,
                            refusedToSubmit,
                            otherViolations,
                            drugAndAlcoholRegulation,
                            sapName,
                            phone,
                            address,
                            addressUnit,
                            aspRehabilitation,
                        });
                    }

                    for (let i = 0; i < inputsToValidate.length; i++) {
                        this.inputService.changeValidators(
                            this.drugAndAlcoholTestingHistoryForm.get(
                                inputsToValidate[i]
                            )
                        );
                    }
                }
            });
    }

    public handleCheckboxParagraphClick(): void {
        this.drugAndAlcoholTestingHistoryForm.patchValue({
            applicantNotSubject: !this.drugAndAlcoholTestingHistoryForm.get(
                'applicantNotSubject'
            ).value,
        });
    }

    public handleInputSelect(event: any, action: string): void {
        switch (action) {
            case InputSwitchActions.ADDRESS:
                if (!event.valid) {
                    this.drugAndAlcoholTestingHistoryForm
                        .get('address')
                        .setErrors({ invalid: true });
                }

                this.selectedAddress = event.address;

                break;
            case InputSwitchActions.ANSWER_CHOICE:
                const selectedCheckbox = event.find(
                    (radio: { checked: boolean }) => radio.checked
                );

                const selectedFormControlName =
                    this.questions[selectedCheckbox.index].formControlName;

                if (selectedCheckbox.label === 'YES') {
                    this.drugAndAlcoholTestingHistoryForm
                        .get(selectedFormControlName)
                        .patchValue(true);
                } else {
                    this.drugAndAlcoholTestingHistoryForm
                        .get(selectedFormControlName)
                        .patchValue(false);
                }

                this.displayRadioRequiredNoteArray[
                    selectedCheckbox.index
                ].displayRadioRequiredNote = false;

                break;

            default:
                break;
        }
    }

    public onStepAction(event: any): void {
        if (event.action === 'next-step') {
            this.onSubmit();
        }

        if (event.action === 'back-step') {
            this.router.navigate(['/sph-form/1/2']);
        }
    }

    public onSubmit(): void {
        const {
            applicantNotSubject,
            employmentFromDate,
            employmentToDate,
            alcoholTest,
            controledSubstances,
            refusedToSubmit,
            otherViolations,
            drugAndAlcoholRegulation,
            sapName,
            phone,
            addressUnit,
            aspRehabilitation,
        } = this.drugAndAlcoholTestingHistoryForm.value;

        const radioButtons = [
            { id: 0, isChecked: alcoholTest },
            { id: 1, isChecked: controledSubstances },
            {
                id: 2,
                isChecked: refusedToSubmit,
            },
            {
                id: 3,
                isChecked: otherViolations,
            },
            {
                id: 4,
                isChecked: otherViolations,
            },
            {
                id: 5,
                isChecked: drugAndAlcoholRegulation,
            },
        ];

        const isAnyRadioUnchecked = isAnyRadioInArrayUnChecked(radioButtons);

        if (
            this.drugAndAlcoholTestingHistoryForm.invalid ||
            isAnyRadioUnchecked
        ) {
            if (this.drugAndAlcoholTestingHistoryForm.invalid) {
                this.inputService.markInvalid(
                    this.drugAndAlcoholTestingHistoryForm
                );
            }

            if (isAnyRadioUnchecked) {
                const uncheckedRadios = filterUnceckedRadiosId(radioButtons);

                this.displayRadioRequiredNoteArray =
                    this.displayRadioRequiredNoteArray.map((item, index) => {
                        if (
                            uncheckedRadios.some(
                                (someItem) => someItem === index
                            )
                        ) {
                            return {
                                ...item,
                                displayRadioRequiredNote: true,
                            };
                        }

                        return item;
                    });
            }

            return;
        }

        const selectedAddress = {
            ...this.selectedAddress,
            addressUnit,
            county: '',
        };

        const saveData: CreatePreviousEmployerDrugAndAlcoholCommand = {
            previousEmployerProspectId: this.previousEmployerProspectId,
            notSubjectToDot: applicantNotSubject,
            employmentFrom: applicantNotSubject
                ? null
                : convertDateToBackend(employmentFromDate),
            employmentTo: applicantNotSubject
                ? null
                : convertDateToBackend(employmentToDate),
            higherAlcoholConcentration: applicantNotSubject
                ? null
                : alcoholTest,
            positiveDrugTest: applicantNotSubject ? null : controledSubstances,
            refusedToSubmitTest: applicantNotSubject ? null : refusedToSubmit,
            otherViolations: applicantNotSubject ? null : otherViolations,
            violatedDot: applicantNotSubject ? null : drugAndAlcoholRegulation,
            sapName: applicantNotSubject ? null : sapName,
            phone: applicantNotSubject ? null : phone,
            address: applicantNotSubject ? null : selectedAddress,
            hasPositiveTests: applicantNotSubject ? null : aspRehabilitation,
        };

        console.log('saveData', saveData);

        this.applicantActionsService
            .createDrugAndAlcoholSphForm(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate(['/sph-form-end']);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicantSphForm: {
                                ...store.applicantSphForm,
                                sphDrugAndAlcohol: saveData,
                            },
                        };
                    });
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
