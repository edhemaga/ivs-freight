/* eslint-disable no-unused-vars */

import {
    Component,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
    distinctUntilChanged,
    Subject,
    Subscription,
    takeUntil,
    throttleTime,
} from 'rxjs';

// helpers
import {
    anyInputInLineIncorrect,
    isFormValueNotEqual,
} from '@pages/applicant/utils/helpers/applicant.helper';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ApplicantService } from '@pages/applicant/services/applicant.service';

// store
import { ApplicantStore } from '@pages/applicant/state/applicant.store';
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

//
import {
    addressUnitValidation,
    addressValidation,
    phoneFaxRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import { InputSwitchActions } from '@pages/applicant/enums/input-switch-actions.enum';

// models
import {
    AddressEntity,
    ApplicantResponse,
    CreateDrugAndAlcoholCommand,
    CreateDrugAndAlcoholReviewCommand,
    DrugAndAlcoholFeedbackResponse,
} from 'appcoretruckassist/model/models';
import { StringConstantsStep8 } from '@pages/applicant/pages/applicant-application/models/string-constants.model';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// modules
import { CommonModule } from '@angular/common';
import { ApplicantModule } from '@pages/applicant/applicant.module';
import { SharedModule } from '@shared/shared.module';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputRadiobuttonsComponent } from '@shared/components/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { ApplicantNextBackBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-next-back-btn/applicant-next-back-btn.component';

// constants
import { ApplicantApplicationConstants } from '@pages/applicant/pages/applicant-application/utils/constants/applicant-application.constants';

// config
import { Step8Config } from '@pages/applicant/pages/applicant-application/components/step8/configs/step8.config';

@Component({
    selector: 'app-step8',
    templateUrl: './step8.component.html',
    styleUrls: ['./step8.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,

        // components
        TaInputComponent,
        TaCheckboxComponent,
        TaInputRadiobuttonsComponent,
        TaAppTooltipV2Component,
        TaInputAddressDropdownComponent,
        ApplicantNextBackBtnComponent
    ],
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

    public selectedMode: string;

    public drugTestRadios: any;

    public subscription: Subscription;

    public stepHasValues: boolean = false;
    public stepHasReviewValues: boolean = false;
    public stepValues: any;
    public previousStepValues: any;

    public drugTestForm: UntypedFormGroup;
    public drugAlcoholStatementForm: UntypedFormGroup;

    public applicantId: number;
    public drugAndAlcoholId: number | null = null;

    public selectedAddress: AddressEntity = null;
    public selectedSapAddress: AddressEntity = null;

    public question = ApplicantApplicationConstants.questionStep8;

    public openAnnotationArray: {
        lineIndex?: number;
        lineInputs?: boolean[];
        displayAnnotationButton?: boolean;
        displayAnnotationTextArea?: boolean;
    }[] = ApplicantApplicationConstants.openAnnotationArrayStep8;
    public hasIncorrectFields: boolean = false;

    public stepFeedbackValues: any;
    public isFeedbackValueUpdated: boolean = false;

    public stringConstants: StringConstantsStep8 =
        ApplicantApplicationConstants.stringConstantsStep8;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private router: Router,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private applicantActionsService: ApplicantService
    ) {}

    get motorCarrierInputConfig(): ITaInput {
        return Step8Config.getMotorCarrierInputConfig({
          selectedMode: this.selectedMode,
          stepFeedbackValues: this.stepFeedbackValues,
        });
      }
    
      get phoneInputConfig(): ITaInput {
        return Step8Config.getPhoneInputConfig({
          selectedMode: this.selectedMode,
          stepFeedbackValues: this.stepFeedbackValues,
        });
      }
    
      get addressInputConfig(): ITaInput {
        return Step8Config.getAddressInputConfig({
          selectedMode: this.selectedMode,
          stepFeedbackValues: this.stepFeedbackValues,
        });
      }
    
      get addressUnitInputConfig(): ITaInput {
        return Step8Config.getAddressUnitInputConfig({
          selectedMode: this.selectedMode,
          stepFeedbackValues: this.stepFeedbackValues,
        });
      }
    
      get sapNameInputConfig(): ITaInput {
        return Step8Config.getSapNameInputConfig({
          selectedMode: this.selectedMode,
          stepFeedbackValues: this.stepFeedbackValues,
        });
      }
    
      get sapPhoneInputConfig(): ITaInput {
        return Step8Config.getSapPhoneInputConfig({
          selectedMode: this.selectedMode,
          stepFeedbackValues: this.stepFeedbackValues,
        });
      }
    
      get sapAddressInputConfig(): ITaInput {
        return Step8Config.getSapAddressInputConfig({
          selectedMode: this.selectedMode,
          stepFeedbackValues: this.stepFeedbackValues,
        });
      }
    
      get sapAddressUnitInputConfig(): ITaInput {
        return Step8Config.getSapAddressUnitInputConfig({
          selectedMode: this.selectedMode,
          stepFeedbackValues: this.stepFeedbackValues,
        });
      }

    ngOnInit(): void {
        this.initMode();

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

    public initMode(): void {
        this.applicantQuery.selectedMode$
            .pipe(takeUntil(this.destroy$))
            .subscribe((selectedMode: string) => {
                this.selectedMode = selectedMode;
            });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.applicantId = res.id;

                if (res.drugAndAlcohol) {
                    this.patchStepValues(res.drugAndAlcohol);

                    this.stepHasValues = true;
                }
            });
    }

    public patchStepValues(stepValues: DrugAndAlcoholFeedbackResponse): void {
        const {
            positiveTest,
            motorCarrier,
            phone,
            address,
            sapName,
            sapPhone,
            sapAddress,
            certifyInformation,
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
                    isSapAddressUnitValid,
                    sapAddressMessage,
                    id,
                } = stepValues.drugAndAlcoholReview;

                this.stepHasReviewValues = true;

                this.drugAndAlcoholId = id;

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
                    lineInputs: [!isSapAddressValid, !isSapAddressUnitValid],
                    displayAnnotationButton:
                        (!isSapAddressValid || !isSapAddressUnitValid) &&
                        !sapAddressMessage
                            ? true
                            : false,
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
                isAgreement: certifyInformation,
            });

            this.selectedAddress = address;
            this.selectedSapAddress = sapAddress;
        } else {
            const inputsToValidate = [
                'motorCarrier',
                'phone',
                'address',
                'sapName',
                'sapPhone',
                'sapAddress',
                'isAgreement',
            ];

            for (let i = 0; i < inputsToValidate.length; i++) {
                if (i === inputsToValidate.length - 1) {
                    this.inputService.changeValidatorsCheck(
                        this.drugAlcoholStatementForm.get(inputsToValidate[i]),
                        false
                    );
                } else {
                    this.inputService.changeValidators(
                        this.drugAlcoholStatementForm.get(inputsToValidate[i]),
                        false
                    );
                }
            }
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
                const inputsToValidate = [
                    'motorCarrier',
                    'phone',
                    'address',
                    'sapName',
                    'sapPhone',
                    'sapAddress',
                    'isAgreement',
                ];

                if (!value) {
                    const {
                        motorCarrier,
                        phone,
                        address,
                        addressUnit,
                        sapName,
                        sapPhone,
                        sapAddress,
                        sapAddressUnit,
                    } = this.drugAlcoholStatementForm.value;

                    this.previousStepValues = {
                        motorCarrier,
                        phone,
                        address,
                        addressUnit,
                        sapName,
                        sapPhone,
                        sapAddress,
                        sapAddressUnit,
                    };

                    for (let i = 0; i < inputsToValidate.length; i++) {
                        if (i === inputsToValidate.length - 1) {
                            this.inputService.changeValidatorsCheck(
                                this.drugAlcoholStatementForm.get(
                                    inputsToValidate[i]
                                ),
                                false
                            );
                        } else {
                            this.inputService.changeValidators(
                                this.drugAlcoholStatementForm.get(
                                    inputsToValidate[i]
                                ),
                                false
                            );
                        }
                    }
                } else {
                    if (this.previousStepValues) {
                        const {
                            motorCarrier,
                            phone,
                            address,
                            addressUnit,
                            sapName,
                            sapPhone,
                            sapAddress,
                            sapAddressUnit,
                        } = this.previousStepValues;

                        this.drugAlcoholStatementForm.patchValue({
                            motorCarrier,
                            phone,
                            address,
                            addressUnit,
                            sapName,
                            sapPhone,
                            sapAddress,
                            sapAddressUnit,
                        });
                    }

                    for (let i = 0; i < inputsToValidate.length; i++) {
                        if (i === inputsToValidate.length - 1) {
                            this.inputService.changeValidatorsCheck(
                                this.drugAlcoholStatementForm.get(
                                    inputsToValidate[i]
                                )
                            );
                        } else {
                            this.inputService.changeValidators(
                                this.drugAlcoholStatementForm.get(
                                    inputsToValidate[i]
                                )
                            );
                        }
                    }
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

    public startFeedbackValueChangesMonitoring(): void {
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
                    .pipe(
                        distinctUntilChanged(),
                        throttleTime(2),
                        takeUntil(this.destroy$)
                    )
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
        if (
            this.drugAlcoholStatementForm.invalid ||
            (this.selectedMode === SelectedMode.FEEDBACK &&
                !this.isFeedbackValueUpdated)
        ) {
            if (this.drugAlcoholStatementForm.invalid) {
                this.inputService.markInvalid(this.drugAlcoholStatementForm);
            }

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
            certifyInformation: drugTestFormValue ? isAgreement : null,
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.APPLICANT &&
                !this.stepHasValues
            ) {
                return this.applicantActionsService.createDrugAndAlcohol(
                    saveData
                );
            }

            if (
                (this.selectedMode === SelectedMode.APPLICANT &&
                    this.stepHasValues) ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
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
                                    certifyInformation:
                                        saveData.certifyInformation,
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
            ...(this.stepHasReviewValues && {
                id: this.drugAndAlcoholId,
            }),
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
            isSapAddressUnitValid: !this.openAnnotationArray[3].lineInputs[1],
            sapAddressMessage: fourthRowReview,
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.REVIEW &&
                !this.stepHasReviewValues
            ) {
                return this.applicantActionsService.createDrugAndAcoholReview(
                    saveData
                );
            }

            if (
                this.selectedMode === SelectedMode.REVIEW &&
                this.stepHasReviewValues
            ) {
                return this.applicantActionsService.updateDrugAndAcoholReview(
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
