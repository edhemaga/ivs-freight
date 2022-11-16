import {
    Component,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, Subscription, takeUntil } from 'rxjs';

import { addressValidation } from '../../../shared/ta-input/ta-input.regex-validations';

import {
    anyInputInLineIncorrect,
    isFormValueNotEqual,
} from '../../state/utils/utils';

import {
    convertDateToBackend,
    convertDateFromBackendShortYear,
} from 'src/app/core/utils/methods.calculations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { ApplicantQuestion } from '../../state/model/applicant-question.model';
import {
    AddressEntity,
    ApplicantResponse,
    CreateSevenDaysHosCommand,
    CreateSevenDaysHosReviewCommand,
    SevenDaysHosFeedbackResponse,
} from 'appcoretruckassist/model/models';

@Component({
    selector: 'app-step7',
    templateUrl: './step7.component.html',
    styleUrls: ['./step7.component.scss'],
})
export class Step7Component implements OnInit, OnDestroy {
    @ViewChildren('cmp') set content(content: QueryList<any>) {
        if (content) {
            const radioButtonsArray = content.toArray();

            this.anotherEmployerRadios = radioButtonsArray[0]
                ? radioButtonsArray[0].buttons
                : null;

            this.intendToWorkForAnotherEmployerRadios = radioButtonsArray[1]
                ? radioButtonsArray[1].buttons
                : null;
        }
    }

    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public subscription: Subscription;

    public stepValues: any;

    public sevenDaysHosForm: FormGroup;

    public applicantId: number;
    public sevenDaysHosId: number;

    public selectedAddress: AddressEntity = null;

    public sevenDaysHosDaysData: string[] = [
        'Day',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
    ];

    public sevenDaysHosDateData: string[] = [
        'Date',
        '01/22/21',
        '01/21/21',
        '01/20/21',
        '01/19/21',
        '01/18/21',
        '01/17/21',
        '01/16/21',
    ];

    public totalHours: { id: number; value: number }[] = [];
    public totalHoursCounter: number = 0;

    public questions: ApplicantQuestion[] = [
        {
            title: 'Are you currently working for another employer?',
            formControlName: 'anotherEmployer',
            answerChoices: [
                {
                    id: 1,
                    label: 'YES',
                    value: 'anotherEmployerYes',
                    name: 'anotherEmployerYes',
                    checked: false,
                    index: 0,
                },
                {
                    id: 2,
                    label: 'NO',
                    value: 'anotherEmployerNo',
                    name: 'anotherEmployerNo',
                    checked: false,
                    index: 0,
                },
            ],
        },
        {
            title: 'At this time do you intend to work for another employer while still employed by this company?',
            formControlName: 'intendToWorkAnotherEmployer',
            answerChoices: [
                {
                    id: 3,
                    label: 'YES',
                    value: 'intendToWorkAnotherEmployerYes',
                    name: 'intendToWorkAnotherEmployerYes',
                    checked: false,
                    index: 1,
                },
                {
                    id: 4,
                    label: 'NO',
                    value: 'intendToWorkAnotherEmployerNo',
                    name: 'intendToWorkAnotherEmployerNo',
                    checked: false,
                    index: 1,
                },
            ],
        },
    ];

    private anotherEmployerRadios: any;
    private intendToWorkForAnotherEmployerRadios: any;

    public openAnnotationArray: {
        lineIndex?: number;
        lineInputs?: boolean[];
        displayAnnotationButton?: boolean;
        displayAnnotationTextArea?: boolean;
    }[] = [
        {
            lineIndex: 0,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];
    public hasIncorrectFields: boolean = false;

    public stepFeedbackValues: any;
    public isFeedbackValueUpdated: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private router: Router,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private applicantActionsService: ApplicantActionsService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.createSevenDaysHos();

        this.getStepValuesFromStore();
    }

    public get hosArray(): FormArray {
        return this.sevenDaysHosForm.get('hosArray') as FormArray;
    }

    public trackByIdentity = (index: number, item: any): number => index;

    public createForm(): void {
        this.sevenDaysHosForm = this.formBuilder.group({
            hosArray: this.formBuilder.array([]),
            isValidHos: [false, Validators.requiredTrue],
            startDate: [null, Validators.required],
            address: [null, [Validators.required, ...addressValidation]],
            anotherEmployer: [null, Validators.required],
            intendToWorkAnotherEmployer: [null, Validators.required],
            isValidAnotherEmployer: [null, Validators.requiredTrue],

            firstRowReview: [null],
        });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.applicantId = res.id;

                if (res.sevenDaysHos) {
                    this.patchStepValues(res.sevenDaysHos);
                }
            });
    }

    public patchStepValues(stepValues: SevenDaysHosFeedbackResponse): void {
        const {
            hos,
            releasedFromWork,
            releasedDate,
            location,
            workingForAnotherEmployer,
            intendToWorkForAnotherEmployer,
            certifyInfomation,
            id,
            sevenDaysHosReview,
        } = stepValues;

        if (this.selectedMode === SelectedMode.REVIEW) {
            if (stepValues.sevenDaysHosReview) {
                const {
                    isReleaseDateValid,
                    isLocationValid,
                    releaseDateLocationMessage,
                } = stepValues.sevenDaysHosReview;
                this.openAnnotationArray[0] = {
                    ...this.openAnnotationArray[0],
                    lineInputs: [!isReleaseDateValid, !isLocationValid],
                    displayAnnotationButton:
                        (!isReleaseDateValid || !isLocationValid) &&
                        !releaseDateLocationMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: releaseDateLocationMessage
                        ? true
                        : false,
                };

                const inputFieldsArray = JSON.stringify(
                    this.openAnnotationArray
                        .filter((item) => Object.keys(item).length !== 0)
                        .map((item) => item.lineInputs)
                );

                if (inputFieldsArray.includes('true')) {
                    this.hasIncorrectFields = true;
                } else {
                    this.hasIncorrectFields = false;
                }

                this.sevenDaysHosForm.patchValue({
                    firstRowReview: releaseDateLocationMessage,
                });
            }
        }

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            if (sevenDaysHosReview) {
                this.stepFeedbackValues = sevenDaysHosReview;
            }

            this.stepValues = stepValues;

            this.startFeedbackValueChangesMonitoring();
        }

        for (let i = 0; i < hos.length; i++) {
            this.hosArray.at(i).patchValue({
                hos: hos[i].hours,
            });

            this.totalHours[i] = {
                id: i,
                value: hos[i].hours,
            };

            this.sevenDaysHosDateData[i + 1] = convertDateFromBackendShortYear(
                hos[i].date
            );
        }

        this.sevenDaysHosId = id;

        this.sevenDaysHosForm.patchValue({
            isValidHos: releasedFromWork,
            startDate: convertDateFromBackendShortYear(releasedDate),
            address: location.address,
            anotherEmployer: workingForAnotherEmployer,
            intendToWorkAnotherEmployer: intendToWorkForAnotherEmployer,
            isValidAnotherEmployer: certifyInfomation,
        });

        setTimeout(() => {
            this.selectedAddress = location;

            const anotherEmployerValue =
                this.sevenDaysHosForm.get('anotherEmployer').value;
            const intendToWorkAnotherEmployerValue = this.sevenDaysHosForm.get(
                'intendToWorkAnotherEmployer'
            ).value;

            if (anotherEmployerValue) {
                this.anotherEmployerRadios[0].checked = true;
            } else {
                this.anotherEmployerRadios[1].checked = true;
            }

            if (intendToWorkAnotherEmployerValue) {
                this.intendToWorkForAnotherEmployerRadios[0].checked = true;
            } else {
                this.intendToWorkForAnotherEmployerRadios[1].checked = true;
            }
        });
    }

    public handleCheckboxParagraphClick(type: string): void {
        if (
            this.selectedMode === 'FEEDBACK_MODE' ||
            this.selectedMode === SelectedMode.REVIEW
        ) {
            return;
        }

        switch (type) {
            case InputSwitchActions.VALID_HOS:
                this.sevenDaysHosForm.patchValue({
                    isValidHos: !this.sevenDaysHosForm.get('isValidHos').value,
                });

                break;
            case InputSwitchActions.VALID_ANOTHER_EMPLOYER:
                this.sevenDaysHosForm.patchValue({
                    isValidAnotherEmployer: !this.sevenDaysHosForm.get(
                        'isValidAnotherEmployer'
                    ).value,
                });

                break;

            default:
                break;
        }
    }

    public handleInputSelect(event: any, action: string): void {
        switch (action) {
            case InputSwitchActions.ADDRESS:
                this.selectedAddress = event.address;

                if (!event.valid) {
                    this.sevenDaysHosForm
                        .get('address')
                        .setErrors({ invalid: true });
                }

                break;
            case InputSwitchActions.ANSWER_CHOICE:
                const selectedCheckbox = event.find(
                    (radio: { checked: boolean }) => radio.checked
                );

                const selectedFormControlName =
                    this.questions[selectedCheckbox.index].formControlName;

                if (selectedCheckbox.label === 'YES') {
                    this.sevenDaysHosForm
                        .get(selectedFormControlName)
                        .patchValue(true);
                } else {
                    this.sevenDaysHosForm
                        .get(selectedFormControlName)
                        .patchValue(false);
                }
                break;

            default:
                break;
        }
    }

    public createSevenDaysHos(): void {
        for (let i = 0; i < 7; i++) {
            this.hosArray.push(this.createHos());

            this.totalHours = [
                ...this.totalHours,
                { id: ++this.totalHoursCounter, value: 0 },
            ];
        }
    }

    public createHos(): FormGroup {
        return this.formBuilder.group({
            hos: [null, Validators.required],
        });
    }

    public countTotalHours(index: number): void {
        this.hosArray
            .at(index)
            .get('hos')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.totalHours = [...this.totalHours];
                this.totalHours[index].value = +value;
            });
    }

    public incorrectInput(
        event: any,
        inputIndex: number,
        lineIndex: number
    ): void {
        const selectedInputsLine = this.openAnnotationArray.find(
            (item) => item.lineIndex === lineIndex
        );

        if (event) {
            selectedInputsLine.lineInputs[inputIndex] = true;

            if (!selectedInputsLine.displayAnnotationTextArea) {
                selectedInputsLine.displayAnnotationButton = true;
                selectedInputsLine.displayAnnotationTextArea = false;
            }
        }

        if (!event) {
            selectedInputsLine.lineInputs[inputIndex] = false;

            const lineInputItems = selectedInputsLine.lineInputs;
            const isAnyInputInLineIncorrect =
                anyInputInLineIncorrect(lineInputItems);

            if (!isAnyInputInLineIncorrect) {
                selectedInputsLine.displayAnnotationButton = false;
                selectedInputsLine.displayAnnotationTextArea = false;

                this.sevenDaysHosForm.get('firstRowReview').patchValue(null);
            }
        }

        const inputFieldsArray = JSON.stringify(
            this.openAnnotationArray
                .filter((item) => Object.keys(item).length !== 0)
                .map((item) => item.lineInputs)
        );

        if (inputFieldsArray.includes('true')) {
            this.hasIncorrectFields = true;
        } else {
            this.hasIncorrectFields = false;
        }
    }

    public getAnnotationBtnClickValue(event: any): void {
        if (event.type === 'open') {
            this.openAnnotationArray[event.lineIndex].displayAnnotationButton =
                false;
            this.openAnnotationArray[
                event.lineIndex
            ].displayAnnotationTextArea = true;
        } else {
            this.openAnnotationArray[event.lineIndex].displayAnnotationButton =
                true;
            this.openAnnotationArray[
                event.lineIndex
            ].displayAnnotationTextArea = false;
        }
    }

    public startFeedbackValueChangesMonitoring() {
        if (this.stepFeedbackValues) {
            const filteredIncorrectValues = Object.keys(
                this.stepFeedbackValues
            ).reduce((o, key) => {
                this.stepFeedbackValues[key] === false &&
                    (o[key] = this.stepFeedbackValues[key]);

                return o;
            }, {});

            const hasIncorrectValues = Object.keys(
                filteredIncorrectValues
            ).length;

            if (hasIncorrectValues) {
                this.subscription = this.sevenDaysHosForm.valueChanges
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((updatedFormValues) => {
                        const filteredFieldsWithIncorrectValues = Object.keys(
                            filteredIncorrectValues
                        ).reduce((o, key) => {
                            const keyName = key
                                .replace('Valid', '')
                                .replace('is', '')
                                .trim()
                                .toLowerCase();

                            if (keyName === 'releasedate') {
                                o['startDate'] =
                                    convertDateFromBackendShortYear(
                                        this.stepValues.releasedDate
                                    );
                            }

                            if (keyName === 'location') {
                                o['address'] = JSON.stringify({
                                    address: this.stepValues.location.address,
                                });
                            }

                            return o;
                        }, {});

                        const filteredUpdatedFieldsWithIncorrectValues =
                            Object.keys(
                                filteredFieldsWithIncorrectValues
                            ).reduce((o, key) => {
                                const keyName = key;

                                if (keyName === 'startDate') {
                                    o['startDate'] =
                                        updatedFormValues.startDate;
                                }

                                if (keyName === 'address') {
                                    o['address'] = JSON.stringify({
                                        address: updatedFormValues.address,
                                    });
                                }

                                return o;
                            }, {});

                        const isFormNotEqual = isFormValueNotEqual(
                            filteredFieldsWithIncorrectValues,
                            filteredUpdatedFieldsWithIncorrectValues
                        );

                        if (isFormNotEqual) {
                            this.isFeedbackValueUpdated = true;
                        } else {
                            this.isFeedbackValueUpdated = false;
                        }
                    });
            } else {
                this.isFeedbackValueUpdated = true;
            }
        }
    }

    public onStepAction(event: any): void {
        if (event.action === 'next-step') {
            if (
                this.selectedMode === SelectedMode.APPLICANT ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
                this.onSubmit();
            }

            if (this.selectedMode === SelectedMode.REVIEW) {
                this.onSubmitReview();
            }
        }

        if (event.action === 'back-step') {
            this.router.navigate([`/application/${this.applicantId}/6`]);
        }
    }

    public onSubmit(): void {
        if (this.selectedMode === SelectedMode.FEEDBACK) {
            if (!this.isFeedbackValueUpdated) {
                return;
            }
        }

        if (this.sevenDaysHosForm.invalid) {
            this.inputService.markInvalid(this.sevenDaysHosForm);
            return;
        }

        const {
            hosArray,
            isValidHos,
            startDate,
            anotherEmployer,
            intendToWorkAnotherEmployer,
            isValidAnotherEmployer,
            firstRowReview,
            ...sevenDaysHosForm
        } = this.sevenDaysHosForm.value;

        const filteredHosArray: { hours: number; date: string }[] =
            hosArray.map((item: { hos: string | number }, index: number) => {
                return {
                    hours: +item.hos,
                    date: convertDateToBackend(
                        this.sevenDaysHosDateData[index + 1]
                    ),
                };
            });

        const selectedAddress = {
            ...this.selectedAddress,
            addressUnit: '',
            county: '',
        };

        const saveData: CreateSevenDaysHosCommand = {
            ...sevenDaysHosForm,
            applicantId: this.applicantId,
            hos: [...filteredHosArray],
            releasedFromWork: isValidHos,
            releasedDate: convertDateToBackend(startDate),
            location: selectedAddress,
            workingForAnotherEmployer: anotherEmployer,
            intendToWorkForAnotherEmployer: intendToWorkAnotherEmployer,
            certifyInfomation: isValidAnotherEmployer,
        };

        const selectMatchingBackendMethod = () => {
            if (this.selectedMode === SelectedMode.APPLICANT) {
                return this.applicantActionsService.createSevenDaysHos(
                    saveData
                );
            }

            if (this.selectedMode === SelectedMode.FEEDBACK) {
                return this.applicantActionsService.updateSevenDaysHos(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/8`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                sevenDaysHos: {
                                    ...store.applicant.sevenDaysHos,
                                    hos: saveData.hos,
                                    releasedFromWork: saveData.releasedFromWork,
                                    releasedDate: saveData.releasedDate,
                                    location: saveData.location,
                                    workingForAnotherEmployer:
                                        saveData.workingForAnotherEmployer,
                                    intendToWorkForAnotherEmployer:
                                        saveData.intendToWorkForAnotherEmployer,
                                    certifyInfomation:
                                        saveData.certifyInfomation,
                                },
                            },
                        };
                    });

                    if (this.selectedMode === SelectedMode.FEEDBACK) {
                        if (this.subscription) {
                            this.subscription.unsubscribe();
                        }
                    }
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    public onSubmitReview(): void {
        const saveData: CreateSevenDaysHosReviewCommand = {
            applicantId: this.applicantId,
            // sevenDaysHosId: this.sevenDaysHosId,
            isReleaseDateValid: !this.openAnnotationArray[0].lineInputs[0],
            isLocationValid: !this.openAnnotationArray[0].lineInputs[1],
            releaseDateLocationMessage:
                this.sevenDaysHosForm.get('firstRowReview').value,
        };

        this.applicantActionsService
            .createSevenDaysHosReview(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/8`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                sevenDaysHos: {
                                    ...store.applicant.sevenDaysHos,
                                    sevenDaysHosReview: saveData,
                                },
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
