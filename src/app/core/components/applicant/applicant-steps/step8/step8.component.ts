import {
    Component,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, Subscription, takeUntil } from 'rxjs';

import {
    anyInputInLineIncorrect,
    isFormValueNotEqual,
} from '../../state/utils/utils';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import {
    addressUnitValidation,
    addressValidation,
    phoneFaxRegex,
} from '../../../shared/ta-input/ta-input.regex-validations';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import {
    AddressEntity,
    ApplicantResponse,
    CreateDrugAndAlcoholCommand,
    CreateDrugAndAlcoholReviewCommand,
} from 'appcoretruckassist/model/models';

@Component({
    selector: 'app-step8',
    templateUrl: './step8.component.html',
    styleUrls: ['./step8.component.scss'],
})
export class Step8Component implements OnInit, OnDestroy {
    @ViewChildren('cmp') set content(content: QueryList<any>) {
        if (content) {
            const radioButtonsArray = content.toArray();

            this.drugTestRadios = radioButtonsArray[0]
                ? radioButtonsArray[0].buttons
                : null;
        }
    }

    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public drugTestRadios: any;

    public subscription: Subscription;

    public stepValues: any;

    public drugTestForm: FormGroup;
    public drugAlcoholStatementForm: FormGroup;

    public applicantId: number;
    public drugAndAlcoholId: number;

    public selectedAddress: AddressEntity = null;
    public selectedSapAddress: AddressEntity = null;

    public question = {
        title: 'Have you, the applicant, tested positive, or refused to test, on any pre-employment drug or alcohol test administered by an employer to which you applied for, but did not obtain, safety-sensitive transportation work covered by DOT agency drug and alcohol testing rules during the past two years?',
        formControlName: 'drugTest',
        answerChoices: [
            {
                id: 1,
                label: 'YES',
                value: 'drugTestYes',
                name: 'drugTestYes',
                checked: false,
            },
            {
                id: 2,
                label: 'NO',
                value: 'drugTestNo',
                name: 'drugTestNo',
                checked: false,
            },
        ],
    };

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
        {
            lineIndex: 1,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 2,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 3,
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

        this.getStepValuesFromStore();

        this.isTestedNegative();
    }

    public createForm(): void {
        this.drugTestForm = this.formBuilder.group({
            drugTest: [true, Validators.required],
        });

        this.drugAlcoholStatementForm = this.formBuilder.group({
            motorCarrier: [null, Validators.required],
            phone: [null, [Validators.required, phoneFaxRegex]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            sapName: [null, Validators.required],
            sapPhone: [null, [Validators.required, phoneFaxRegex]],
            sapAddress: [null, [Validators.required, ...addressValidation]],
            sapAddressUnit: [null, [...addressUnitValidation]],
            isAgreement: [null, Validators.requiredTrue],

            firstRowReview: [null],
            secondRowReview: [null],
            thirdRowReview: [null],
            fourthRowReview: [null],
        });

        setTimeout(() => {
            const drugTestValue = this.drugTestForm.get('drugTest').value;

            if (drugTestValue) this.drugTestRadios[0].checked = true;
        }, 100);
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.applicantId = res.id;

                if (res.drugAndAlcohol) {
                    this.patchStepValues(res.drugAndAlcohol);
                }
            });
    }

    public patchStepValues(stepValues: any): void {
        console.log('stepValues', stepValues);
        const {
            positiveTest,
            motorCarrier,
            phone,
            address,
            sapName,
            sapPhone,
            sapAddress,
            certifyInfomation,
            id,
            drugAndAlcoholReview,
        } = stepValues;

        if (this.selectedMode === SelectedMode.REVIEW) {
            if (stepValues.drugAndAlcoholReview) {
                const {
                    isCarrierValid,
                    isPhoneValid,
                    carrierPhoneMessage,
                    isAddressValid,
                    isAddressUnitValid,
                    addressMessage,
                    isSapValid,
                    isSapPhoneValid,
                    sapPhoneMessage,
                    isSapAddressValid,
                    sapAddressMessage,
                } = stepValues.drugAndAlcoholReview;

                this.openAnnotationArray[0] = {
                    ...this.openAnnotationArray[0],
                    lineInputs: [!isCarrierValid, !isPhoneValid],
                    displayAnnotationButton:
                        (!isCarrierValid || !isPhoneValid) &&
                        !carrierPhoneMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: carrierPhoneMessage
                        ? true
                        : false,
                };
                this.openAnnotationArray[1] = {
                    ...this.openAnnotationArray[1],
                    lineInputs: [!isAddressValid, !isAddressUnitValid],
                    displayAnnotationButton:
                        (!isAddressValid || !isAddressUnitValid) &&
                        !addressMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: addressMessage ? true : false,
                };
                this.openAnnotationArray[2] = {
                    ...this.openAnnotationArray[2],
                    lineInputs: [!isSapValid, !isSapPhoneValid],
                    displayAnnotationButton:
                        (!isSapValid || !isSapPhoneValid) && !sapPhoneMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: sapPhoneMessage ? true : false,
                };
                this.openAnnotationArray[3] = {
                    ...this.openAnnotationArray[3],
                    lineInputs: [!isSapAddressValid],
                    displayAnnotationButton:
                        !isSapAddressValid && !sapAddressMessage ? true : false,
                    displayAnnotationTextArea: sapAddressMessage ? true : false,
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

                this.drugAlcoholStatementForm.patchValue({
                    firstRowReview: carrierPhoneMessage,
                    secondRowReview: addressMessage,
                    thirdRowReview: sapPhoneMessage,
                    fourthRowReview: sapAddressMessage,
                });
            }
        }

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            if (drugAndAlcoholReview) {
                this.stepFeedbackValues = drugAndAlcoholReview;
            }

            this.stepValues = stepValues;

            this.startFeedbackValueChangesMonitoring();
        }

        this.drugTestForm.get('drugTest').patchValue(positiveTest);

        this.drugAndAlcoholId = id;

        if (positiveTest) {
            this.drugAlcoholStatementForm.patchValue({
                motorCarrier,
                phone,
                address: address.address,
                addressUnit: address.addressUnit,
                sapName,
                sapPhone,
                sapAddress: sapAddress.address,
                sapAddressUnit: sapAddress.addressUnit,
                isAgreement: certifyInfomation,
            });

            this.selectedAddress = address;
            this.selectedSapAddress = sapAddress;
        }

        setTimeout(() => {
            if (positiveTest) {
                this.drugTestRadios[0].checked = true;
            } else {
                this.drugTestRadios[1].checked = true;
            }
        }, 100);
    }

    public handleInputSelect(
        event: any,
        action: string,
        addressType?: string
    ): void {
        switch (action) {
            case InputSwitchActions.ANSWER_CHOICE:
                const selectedCheckbox = event.find(
                    (radio: { checked: boolean }) => radio.checked
                );

                const selectedFormControlName = this.question.formControlName;

                if (selectedCheckbox.label === 'YES') {
                    this.drugTestForm
                        .get(selectedFormControlName)
                        .patchValue(true);
                } else {
                    this.drugTestForm
                        .get(selectedFormControlName)
                        .patchValue(false);
                }

                break;
            case InputSwitchActions.ADDRESS:
                if (addressType === 'SAP') {
                    this.selectedSapAddress = event.address;

                    if (!event.valid) {
                        this.drugAlcoholStatementForm
                            .get('sapAddress')
                            .setErrors({ invalid: true });
                    }
                } else {
                    this.selectedAddress = event.address;

                    if (!event.valid) {
                        this.drugAlcoholStatementForm
                            .get('address')
                            .setErrors({ invalid: true });
                    }
                }

                break;

            default:
                break;
        }
    }

    private isTestedNegative(): void {
        this.drugTestForm
            .get('drugTest')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (!value) {
                    this.inputService.changeValidators(
                        this.drugAlcoholStatementForm.get('motorCarrier'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.drugAlcoholStatementForm.get('phone'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.drugAlcoholStatementForm.get('address'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.drugAlcoholStatementForm.get('sapName'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.drugAlcoholStatementForm.get('sapPhone'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.drugAlcoholStatementForm.get('sapAddress'),
                        false
                    );

                    this.inputService.changeValidatorsCheck(
                        this.drugAlcoholStatementForm.get('isAgreement'),
                        false
                    );

                    this.drugAlcoholStatementForm.patchValue({
                        motorCarrier: null,
                        phone: null,
                        address: null,
                        addressUnit: null,
                        sapName: null,
                        sapPhone: null,
                        sapAddress: null,
                        sapAddressUnit: null,
                        isAgreement: null,
                    });
                } else {
                    this.inputService.changeValidators(
                        this.drugAlcoholStatementForm.get('motorCarrier')
                    );
                    this.inputService.changeValidators(
                        this.drugAlcoholStatementForm.get('phone')
                    );
                    this.inputService.changeValidators(
                        this.drugAlcoholStatementForm.get('address')
                    );
                    this.inputService.changeValidators(
                        this.drugAlcoholStatementForm.get('sapName')
                    );
                    this.inputService.changeValidators(
                        this.drugAlcoholStatementForm.get('sapPhone')
                    );
                    this.inputService.changeValidators(
                        this.drugAlcoholStatementForm.get('sapAddress')
                    );

                    this.inputService.changeValidatorsCheck(
                        this.drugAlcoholStatementForm.get('isAgreement')
                    );
                }
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
        {
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
                }

                switch (lineIndex) {
                    case 0:
                        if (!isAnyInputInLineIncorrect) {
                            this.drugAlcoholStatementForm
                                .get('firstRowReview')
                                .patchValue(null);
                        }
                        break;
                    case 1:
                        if (!isAnyInputInLineIncorrect) {
                            this.drugAlcoholStatementForm
                                .get('secondRowReview')
                                .patchValue(null);
                        }
                        break;
                    case 2:
                        if (!isAnyInputInLineIncorrect) {
                            this.drugAlcoholStatementForm
                                .get('thirdRowReview')
                                .patchValue(null);
                        }
                        break;
                    case 3:
                        if (!isAnyInputInLineIncorrect) {
                            this.drugAlcoholStatementForm
                                .get('fourthRowReview')
                                .patchValue(null);
                        }
                        break;
                    default:
                        break;
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
                this.subscription = this.drugAlcoholStatementForm.valueChanges
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

                            const match = Object.keys(this.stepValues)
                                .filter((item) =>
                                    item.toLowerCase().includes(keyName)
                                )
                                .pop();

                            o[keyName] = this.stepValues[match];

                            if (keyName === 'phone') {
                                o['phone'] = this.stepValues.phone;
                            }

                            if (keyName === 'address') {
                                o['address'] = JSON.stringify({
                                    address: this.stepValues.address.address,
                                });
                            }

                            if (keyName === 'addressunit') {
                                o['addressunit'] =
                                    this.stepValues.address.addressUnit;
                            }

                            if (keyName === 'sap') {
                                o['sapname'] = this.stepValues.sapName;

                                delete o['sap'];
                            }

                            if (keyName === 'sapaddress') {
                                o['sapaddress'] = JSON.stringify({
                                    address: this.stepValues.sapAddress.address,
                                });
                            }

                            if (keyName === 'sapaddressunit') {
                                o['sapaddressunit'] =
                                    this.stepValues.sapAddress.addressUnit;
                            }

                            return o;
                        }, {});

                        const filteredUpdatedFieldsWithIncorrectValues =
                            Object.keys(
                                filteredFieldsWithIncorrectValues
                            ).reduce((o, key) => {
                                const keyName = key;

                                const match = Object.keys(this.stepValues)
                                    .filter((item) =>
                                        item.toLowerCase().includes(keyName)
                                    )
                                    .pop();

                                o[keyName] = updatedFormValues[match];

                                if (keyName === 'phone') {
                                    o['phone'] = updatedFormValues.phone;
                                }

                                if (keyName === 'address') {
                                    o['address'] = JSON.stringify({
                                        address: updatedFormValues.address,
                                    });
                                }

                                if (keyName === 'addressunit') {
                                    o['addressunit'] =
                                        updatedFormValues.addressUnit;
                                }

                                if (keyName === 'sapaddress') {
                                    o['sapaddress'] = JSON.stringify({
                                        address: updatedFormValues.sapAddress,
                                    });
                                }

                                if (keyName === 'sapaddressunit') {
                                    o['sapaddressunit'] =
                                        updatedFormValues.sapAddressUnit;
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
            this.router.navigate([`/application/${this.applicantId}/7`]);
        }
    }

    public onSubmit(): void {
        if (this.selectedMode === SelectedMode.FEEDBACK) {
            if (!this.isFeedbackValueUpdated) {
                return;
            }
        }

        if (this.drugAlcoholStatementForm.invalid) {
            this.inputService.markInvalid(this.drugAlcoholStatementForm);
            return;
        }

        if (this.drugTestForm.invalid) {
            this.inputService.markInvalid(this.drugTestForm);
            return;
        }

        const {
            motorCarrier,
            phone,
            address,
            addressUnit,
            sapName,
            sapPhone,
            sapAddress,
            sapAddressUnit,
            isAgreement,
            firstRowReview,
            secondRowReview,
            thirdRowReview,
            fourthRowReview,
            ...drugAlcoholStatementForm
        } = this.drugAlcoholStatementForm.value;

        const selectedAddress = {
            ...this.selectedAddress,
            addressUnit,
            county: '',
        };

        const selectedSapAddress = {
            ...this.selectedSapAddress,
            addressUnit: sapAddressUnit,
            county: '',
        };

        const drugTestFormValue = this.drugTestForm.get('drugTest').value;

        const saveData: CreateDrugAndAlcoholCommand = {
            ...drugAlcoholStatementForm,
            applicantId: this.applicantId,
            positiveTest: drugTestFormValue,
            motorCarrier: drugTestFormValue ? motorCarrier : null,
            phone: drugTestFormValue ? phone : null,
            address: drugTestFormValue ? selectedAddress : null,
            sapName: drugTestFormValue ? sapName : null,
            sapPhone: drugTestFormValue ? sapPhone : null,
            sapAddress: drugTestFormValue ? selectedSapAddress : null,
            certifyInfomation: drugTestFormValue ? isAgreement : null,
        };

        const selectMatchingBackendMethod = () => {
            if (this.selectedMode === SelectedMode.APPLICANT) {
                return this.applicantActionsService.createDrugAndAlcohol(
                    saveData
                );
            }

            if (this.selectedMode === SelectedMode.FEEDBACK) {
                return this.applicantActionsService.updateDrugAndAlcohol(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/9`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                drugAndAlcohol: {
                                    ...store.applicant.drugAndAlcohol,
                                    positiveTest: saveData.positiveTest,
                                    motorCarrier: saveData.motorCarrier,
                                    phone: saveData.phone,
                                    address: saveData.address,
                                    sapName: saveData.sapName,
                                    sapPhone: saveData.sapPhone,
                                    sapAddress: saveData.sapAddress,
                                    // certifyInfomation: saveData.certifyInfomation,
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
        const {
            firstRowReview,
            secondRowReview,
            thirdRowReview,
            fourthRowReview,
        } = this.drugAlcoholStatementForm.value;

        const saveData: CreateDrugAndAlcoholReviewCommand = {
            applicantId: this.applicantId,
            // drugAndAlcoholId: this.drugAndAlcoholId,
            isCarrierValid: !this.openAnnotationArray[0].lineInputs[0],
            isPhoneValid: !this.openAnnotationArray[0].lineInputs[1],
            carrierPhoneMessage: firstRowReview,
            isAddressValid: !this.openAnnotationArray[1].lineInputs[0],
            isAddressUnitValid: !this.openAnnotationArray[1].lineInputs[1],
            addressMessage: secondRowReview,
            isSapValid: !this.openAnnotationArray[2].lineInputs[0],
            isSapPhoneValid: !this.openAnnotationArray[2].lineInputs[1],
            sapPhoneMessage: thirdRowReview,
            isSapAddressValid: !this.openAnnotationArray[3].lineInputs[0],
            sapAddressMessage: fourthRowReview,
        };

        this.applicantActionsService
            .createDrugAndAcoholReview(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/9`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                drugAndAlcohol: {
                                    ...store.applicant.drugAndAlcohol,
                                    drugAndAlcoholReview: saveData,
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
