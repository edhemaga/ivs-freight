import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription, Subject, takeUntil } from 'rxjs';

import moment from 'moment';

import {
    anyInputInLineIncorrect,
    isFormValueEqual,
} from '../../state/utils/utils';

import {
    addressValidation,
    phoneFaxRegex,
    addressUnitValidation,
    businessNameValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { FormService } from './../../../../services/form/form.service';

import { ApplicantQuery } from '../../state/store/applicant.query';

import { ApplicantQuestion } from '../../state/model/applicant-question.model';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import {
    AnotherClassOfEquipmentModel,
    WorkHistoryModel,
} from '../../state/model/work-history.model';
import { AddressEntity } from './../../../../../../../appcoretruckassist/model/addressEntity';
import {
    ApplicantModalResponse,
    EnumValue,
    TrailerLengthResponse,
    TrailerTypeResponse,
    TruckTypeResponse,
} from 'appcoretruckassist/model/models';

@Component({
    selector: 'app-step2-form',
    templateUrl: './step2-form.component.html',
    styleUrls: ['./step2-form.component.scss'],
})
export class Step2FormComponent
    implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
    @ViewChildren('cmp') set content(content: QueryList<any>) {
        if (content) {
            const radioButtonsArray = content.toArray();

            this.cfrPartRadios = radioButtonsArray[0]
                ? radioButtonsArray[0].buttons
                : null;
            this.fmcsaRadios = radioButtonsArray[1]
                ? radioButtonsArray[1].buttons
                : null;
        }
    }

    @Input() mode: string;
    @Input() isEditing: boolean;
    @Input() formValuesToPatch?: any;
    @Input() markFormInvalid?: boolean;
    @Input() markInnerFormInvalid?: boolean;
    @Input() isReviewingCard: boolean;
    @Input() stepFeedbackValues?: any;

    @Output() formValuesEmitter = new EventEmitter<any>();
    @Output() cancelFormEditingEmitter = new EventEmitter<any>();
    @Output() saveFormEditingEmitter = new EventEmitter<any>();
    @Output() formStatusEmitter = new EventEmitter<any>();
    @Output() innerFormStatusEmitter = new EventEmitter<any>();
    @Output() markInvalidEmitter = new EventEmitter<any>();
    @Output() markInnerFormInvalidEmitter = new EventEmitter<any>();
    @Output() lastFormValuesEmitter = new EventEmitter<any>();
    @Output() hasIncorrectFieldsEmitter = new EventEmitter<any>();
    @Output() openAnnotationArrayValuesEmitter = new EventEmitter<any>();
    @Output() cardOpenAnnotationArrayValuesEmitter = new EventEmitter<any>();
    @Output() cancelFormReviewingEmitter = new EventEmitter<any>();

    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public subscription: Subscription;
    public innerFormSubscription: Subscription;
    public classOfEquipmentSubscription: Subscription;

    public workExperienceForm: FormGroup;
    public classOfEquipmentForm: FormGroup;

    public classOfEquipmentArray: AnotherClassOfEquipmentModel[] = [];
    public helperClassOfEquipmentArray: AnotherClassOfEquipmentModel[] = [];

    public isEditingClassOfEquipment: boolean = false;
    public isTruckSelected: boolean = false;
    public isWorkExperienceEdited: boolean;
    public isClassOfEquipmentEdited: boolean;

    public editingCardAddress: any;
    public previousFormValuesOnEdit: any;
    public previousClassOfEquipmentCardsListOnEdit: any;

    public selectedAddress: AddressEntity;
    public selectedVehicleType: any = null;
    public selectedTrailerType: any = null;
    public selectedTrailerLength: any = null;
    public selectedReasonForLeaving: any = null;

    public selectedClassOfEquipmentIndex: number;
    public classOfEquipmentHelperIndex: number = 2;

    public vehicleType: TruckTypeResponse[] = [];
    public trailerType: TrailerTypeResponse[] = [];
    public trailerLengthType: TrailerLengthResponse[] = [];

    private cfrPartRadios: any;
    private fmcsaRadios: any;

    public reasonsForLeaving: EnumValue[] = [];

    public questions: ApplicantQuestion[] = [
        {
            title: 'CFR Part 40?',
            formControlName: 'cfrPart',
            answerChoices: [
                {
                    id: 1,
                    label: 'YES',
                    value: 'cfrPartYes',
                    name: 'cfrPartYes',
                    checked: false,
                    index: 0,
                },
                {
                    id: 2,
                    label: 'NO',
                    value: 'cfrPartNo',
                    name: 'cfrPartNo',
                    checked: false,
                    index: 0,
                },
            ],
        },
        {
            title: 'FMCSA Regulated',
            formControlName: 'fmCSA',
            answerChoices: [
                {
                    id: 3,
                    label: 'YES',
                    value: 'fmcsaYes',
                    name: 'fmcsaYes',
                    checked: false,
                    index: 1,
                },
                {
                    id: 4,
                    label: 'NO',
                    value: 'fmcsaNo',
                    name: 'fmcsaNo',
                    checked: false,
                    index: 1,
                },
            ],
        },
    ];

    public openAnnotationArray: {
        lineIndex?: number;
        lineInputs?: boolean[];
        displayAnnotationButton?: boolean;
        displayAnnotationTextArea?: boolean;
    }[] = [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
            lineIndex: 20,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 21,
            lineInputs: [false, false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 22,
            lineInputs: [false, false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 23,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 24,
            lineInputs: [false, false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 25,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 26,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];
    public isCardReviewedIncorrect: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private formService: FormService,
        private applicantQuery: ApplicantQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getDropdownLists();

        this.isDriverPosition();
    }

    ngAfterViewInit(): void {
        if (this.selectedMode === SelectedMode.APPLICANT) {
            this.workExperienceForm.statusChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.formStatusEmitter.emit(res);
                });

            this.classOfEquipmentForm.statusChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.innerFormStatusEmitter.emit(res);
                });

            this.workExperienceForm.valueChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    res.employerAddress = this.selectedAddress;

                    const vehicleTypeImageLocation = res.vehicleType
                        ? this.vehicleType.find(
                              (item) => item.name === res.vehicleType
                          ).logoName
                        : null;

                    const trailerTypeImageLocation = res.trailerType
                        ? this.trailerType.find(
                              (item) => item.name === res.trailerType
                          ).logoName
                        : null;

                    const lastClassOfEquipmentCard = {
                        vehicleType: res.vehicleType,
                        vehicleTypeImageLocation: vehicleTypeImageLocation,
                        trailerType: res.trailerType,
                        trailerLength: res.trailerLength,
                        trailerTypeImageLocation,
                        isEditingClassOfEquipment: false,
                    };

                    if (res.classOfEquipmentSubscription) {
                        res.classesOfEquipment = [
                            ...res.classOfEquipmentSubscription,
                            lastClassOfEquipmentCard,
                        ];
                    } else {
                        res.classesOfEquipment = [lastClassOfEquipmentCard];
                    }

                    res.isDrivingPosition = !res.isDrivingPosition
                        ? false
                        : res.isDrivingPosition;

                    this.lastFormValuesEmitter.emit(res);
                });
        }

        if (this.selectedMode === SelectedMode.REVIEW) {
            this.workExperienceForm.valueChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    const reviewMessages = {
                        firstRowReview: res.firstRowReview,
                        secondRowReview: res.secondRowReview,
                        thirdRowReview: res.thirdRowReview,
                        fourthRowReview: res.fourthRowReview,
                        fifthRowReview:
                            this.classOfEquipmentForm.get('fifthRowReview')
                                .value,
                        sixthRowReview: res.sixthRowReview,
                        seventhRowReview: res.seventhRowReview,
                    };

                    this.lastFormValuesEmitter.emit(reviewMessages);
                });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.mode?.previousValue !== changes.mode?.currentValue) {
            this.selectedMode = changes.mode?.currentValue;

            if (this.selectedMode === SelectedMode.APPLICANT) {
                if (
                    changes.markFormInvalid?.previousValue !==
                    changes.markFormInvalid?.currentValue
                ) {
                    this.inputService.markInvalid(this.workExperienceForm);
                    this.markInvalidEmitter.emit(false);
                }

                if (
                    changes.markInnerFormInvalid?.previousValue !==
                    changes.markInnerFormInvalid?.currentValue
                ) {
                    this.inputService.markInvalid(this.classOfEquipmentForm);
                    this.markInnerFormInvalidEmitter.emit(false);
                }
            }

            if (
                changes.formValuesToPatch?.previousValue !==
                changes.formValuesToPatch?.currentValue
            ) {
                setTimeout(() => {
                    this.patchForm(changes.formValuesToPatch.currentValue);

                    if (this.selectedMode === SelectedMode.APPLICANT) {
                        this.startValueChangesMonitoring();
                        this.startInnerFormValueChangesMonitoring();
                    }
                }, 100);
            }
        }
    }

    public trackByIdentity = (index: number, item: any): number => index;

    private createForm(): void {
        this.workExperienceForm = this.formBuilder.group({
            employer: [null, [Validators.required, ...businessNameValidation]],
            jobDescription: [null, Validators.required],
            fromDate: [null, Validators.required],
            toDate: [null, Validators.required],
            employerPhone: [null, [Validators.required, phoneFaxRegex]],
            employerEmail: [null, [Validators.required]],
            employerFax: [null, phoneFaxRegex],
            employerAddress: [
                null,
                [Validators.required, ...addressValidation],
            ],
            employerAddressUnit: [null, addressUnitValidation],
            isDrivingPosition: [false],
            vehicleType: [null],
            trailerType: [null],
            trailerLength: [null],
            classOfEquipmentCards: this.formBuilder.group({
                cardReview1: [null],
                cardReview2: [null],
                cardReview3: [null],
                cardReview4: [null],
                cardReview5: [null],
                cardReview6: [null],
                cardReview7: [null],
                cardReview8: [null],
                cardReview9: [null],
                cardReview10: [null],
            }),
            cfrPart: [null],
            fmCSA: [null],
            reasonForLeaving: [null, Validators.required],
            accountForPeriod: [null],
            classOfEquipmentSubscription: [],

            firstRowReview: [null],
            secondRowReview: [null],
            thirdRowReview: [null],
            fourthRowReview: [null],
            fifthRowReview: [null],
            sixthRowReview: [null],
            seventhRowReview: [null],
        });

        this.classOfEquipmentForm = this.formBuilder.group({
            vehicleType: [null],
            trailerType: [null],
            trailerLength: [null],

            fifthRowReview: [null],
        });

        this.inputService.customInputValidator(
            this.workExperienceForm.get('employerEmail'),
            'email',
            this.destroy$
        );
    }

    public patchForm(formValue: any): void {
        if (this.selectedMode === SelectedMode.REVIEW) {
            if (formValue.workExperienceItemReview) {
                const {
                    isEmployerValid,
                    employerMessage,
                    isJobDescriptionValid,
                    isFromValid,
                    isToValid,
                    jobDescriptionMessage,
                    isPhoneValid,
                    isEmailValid,
                    isFaxValid,
                    contactMessage,
                    isAddressValid,
                    isAddressUnitValid,
                    addressMessage,
                    isAccountForPeriodBetweenValid,
                    accountForPeriodBetweenMessage,
                } = formValue.workExperienceItemReview;

                this.openAnnotationArray[20] = {
                    ...this.openAnnotationArray[20],
                    lineInputs: [!isEmployerValid],
                    displayAnnotationButton:
                        !isEmployerValid && !employerMessage ? true : false,
                    displayAnnotationTextArea: employerMessage ? true : false,
                };
                this.openAnnotationArray[21] = {
                    ...this.openAnnotationArray[21],
                    lineInputs: [
                        !isJobDescriptionValid,
                        !isFromValid,
                        !isToValid,
                    ],
                    displayAnnotationButton:
                        (!isJobDescriptionValid ||
                            !isFromValid ||
                            !isToValid) &&
                        !jobDescriptionMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: jobDescriptionMessage
                        ? true
                        : false,
                };
                this.openAnnotationArray[22] = {
                    ...this.openAnnotationArray[22],
                    lineInputs: [!isPhoneValid, !isEmailValid, !isFaxValid],
                    displayAnnotationButton:
                        (!isPhoneValid || !isEmailValid || !isFaxValid) &&
                        !contactMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: contactMessage ? true : false,
                };
                this.openAnnotationArray[23] = {
                    ...this.openAnnotationArray[23],
                    lineInputs: [!isAddressValid, !isAddressUnitValid],
                    displayAnnotationButton:
                        (!isAddressValid || !isAddressUnitValid) &&
                        !addressMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: addressMessage ? true : false,
                };
                this.openAnnotationArray[26] = {
                    ...this.openAnnotationArray[26],
                    lineInputs: [!isAccountForPeriodBetweenValid],
                    displayAnnotationButton:
                        !isAccountForPeriodBetweenValid &&
                        !accountForPeriodBetweenMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: accountForPeriodBetweenMessage
                        ? true
                        : false,
                };

                const inputFieldsArray = JSON.stringify(
                    this.openAnnotationArray
                        .filter((item) => Object.keys(item).length !== 0)
                        .map((item) => item.lineInputs)
                );

                if (inputFieldsArray.includes('true')) {
                    this.hasIncorrectFieldsEmitter.emit(true);

                    this.isCardReviewedIncorrect = true;
                } else {
                    this.hasIncorrectFieldsEmitter.emit(false);

                    this.isCardReviewedIncorrect = false;
                }

                this.workExperienceForm.patchValue({
                    firstRowReview: employerMessage,
                    secondRowReview: jobDescriptionMessage,
                    thirdRowReview: contactMessage,
                    fourthRowReview: addressMessage,
                    seventhRowReview: accountForPeriodBetweenMessage,
                });
            }
        }

        this.workExperienceForm.patchValue({
            employer: formValue?.employer,
            jobDescription: formValue?.jobDescription,
            fromDate: formValue?.fromDate,
            toDate: formValue?.toDate,
            employerPhone: formValue?.employerPhone,
            employerEmail: formValue?.employerEmail,
            employerFax: formValue?.employerFax,
            employerAddress: formValue?.employerAddress?.address,
            employerAddressUnit: formValue?.employerAddressUnit,
            isDrivingPosition: formValue?.isDrivingPosition,
            cfrPart: formValue?.cfrPart,
            fmCSA: formValue?.fmCSA,
            reasonForLeaving: formValue?.reasonForLeaving,
            accountForPeriod: formValue?.accountForPeriod,
        });

        this.selectedAddress = formValue?.employerAddress;

        setTimeout(() => {
            this.selectedReasonForLeaving = this.reasonsForLeaving.find(
                (item) => item.name === formValue?.reasonForLeaving
            );
        }, 150);

        if (formValue?.isDrivingPosition) {
            const lastItemInClassOfEquipmentArray =
                formValue?.classesOfEquipment[
                    formValue?.classesOfEquipment.length - 1
                ];

            const restOfTheItemsInClassOfEquipmentArray = [
                ...formValue?.classesOfEquipment,
            ];

            restOfTheItemsInClassOfEquipmentArray.pop();

            this.classOfEquipmentArray = [
                ...restOfTheItemsInClassOfEquipmentArray,
            ];
            this.helperClassOfEquipmentArray = [
                ...formValue.classesOfEquipment,
            ];

            this.workExperienceForm.patchValue({
                vehicleType: lastItemInClassOfEquipmentArray.vehicleType,
                trailerType: lastItemInClassOfEquipmentArray.trailerType,
                trailerLength: lastItemInClassOfEquipmentArray.trailerLength,
                classOfEquipmentSubscription: this.classOfEquipmentArray,
            });

            this.classOfEquipmentForm.patchValue({
                vehicleType: lastItemInClassOfEquipmentArray.vehicleType,
                trailerType: lastItemInClassOfEquipmentArray.trailerType,
                trailerLength: lastItemInClassOfEquipmentArray.trailerLength,
            });

            setTimeout(() => {
                const cfrPartValue =
                    this.workExperienceForm.get('cfrPart').value;
                const fmcsaValue = this.workExperienceForm.get('fmCSA').value;

                if (cfrPartValue) {
                    this.cfrPartRadios[0].checked = true;
                } else {
                    this.cfrPartRadios[1].checked = true;
                }

                if (fmcsaValue) {
                    this.fmcsaRadios[0].checked = true;
                } else {
                    this.fmcsaRadios[1].checked = true;
                }

                this.selectedVehicleType = this.vehicleType.find(
                    (item) =>
                        item.name ===
                        lastItemInClassOfEquipmentArray.vehicleType
                );

                if (
                    this.selectedVehicleType.id === 5 ||
                    this.selectedVehicleType.id === 8
                ) {
                    this.isTruckSelected = false;
                } else {
                    this.isTruckSelected = true;

                    this.selectedTrailerType = this.trailerType.find(
                        (item) =>
                            item.name ===
                            lastItemInClassOfEquipmentArray.trailerType
                    );

                    this.selectedTrailerLength = this.trailerLengthType.find(
                        (item) =>
                            item.name ===
                            lastItemInClassOfEquipmentArray.trailerLength
                    );
                }
            }, 100);
        }
    }

    public startInnerFormValueChangesMonitoring(): void {
        this.innerFormSubscription = this.classOfEquipmentForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                const { vehicleType, trailerType, trailerLength } = value;

                if (!vehicleType || !trailerType || !trailerLength) {
                    this.isWorkExperienceEdited = false;
                } else {
                    this.isWorkExperienceEdited = true;
                }
            });
    }

    public startValueChangesMonitoring(): void {
        this.subscription = this.workExperienceForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((updatedFormValues) => {
                const {
                    id,
                    employerAddress,
                    applicantId,
                    isEditingWorkHistory,
                    fromDate,
                    toDate,
                    workExperienceItemReview,
                    ...previousFormValues
                } = this.formValuesToPatch;

                previousFormValues.fromDate = moment(new Date(fromDate)).format(
                    'MM/DD/YY'
                );
                previousFormValues.toDate = moment(new Date(toDate)).format(
                    'MM/DD/YY'
                );

                previousFormValues.employerAddress = employerAddress?.address;

                this.editingCardAddress = employerAddress;

                if (previousFormValues?.classesOfEquipment[0]?.vehicleType) {
                    const sortedValues =
                        previousFormValues?.classesOfEquipment.map((item) => {
                            return Object.keys(item)
                                .sort()
                                .reduce((accumulator, key) => {
                                    accumulator[key] = item[key];

                                    return accumulator;
                                }, {});
                        });

                    previousFormValues.classesOfEquipment =
                        JSON.stringify(sortedValues);
                } else {
                    previousFormValues.classesOfEquipment = JSON.stringify([
                        null,
                    ]);
                }

                const {
                    employerAddress: newEmployerAddress,
                    classOfEquipmentCards,
                    classOfEquipmentSubscription,
                    vehicleType: updatedVehicleType,
                    trailerType: updatedTrailerType,
                    trailerLength,
                    firstRowReview,
                    secondRowReview,
                    thirdRowReview,
                    fourthRowReview,
                    fifthRowReview: updatedFifthRowReview,
                    sixthRowReview,
                    seventhRowReview,
                    ...newFormValues
                } = updatedFormValues;

                newFormValues.employerAddress = newEmployerAddress?.address;

                const {
                    vehicleType,
                    trailerType,
                    fifthRowReview,
                    ...classOfEquipmentForm
                } = this.classOfEquipmentForm.value;

                let vehicleTypeImageLocation: any;
                let trailerTypeImageLocation: any;

                if (vehicleType) {
                    vehicleTypeImageLocation = this.vehicleType.find(
                        (item) => item.name === vehicleType
                    ).logoName;
                }

                if (trailerType) {
                    trailerTypeImageLocation = this.trailerType.find(
                        (item) => item.name === trailerType
                    ).logoName;
                }

                const lastClassOfEquipmentCard = {
                    ...classOfEquipmentForm,
                    vehicleType,
                    vehicleTypeImageLocation,
                    trailerType,
                    trailerTypeImageLocation,
                    isEditingClassOfEquipment: false,
                };

                if (lastClassOfEquipmentCard.vehicleType) {
                    const newClassOfEquipment = [
                        ...this.classOfEquipmentArray,
                        lastClassOfEquipmentCard,
                    ];

                    const sortedValues = newClassOfEquipment.map((item) => {
                        return Object.keys(item)
                            .sort()
                            .reduce((accumulator, key) => {
                                accumulator[key] = item[key];

                                return accumulator;
                            }, {});
                    });

                    newFormValues.classesOfEquipment =
                        JSON.stringify(sortedValues);
                } else {
                    newFormValues.classesOfEquipment = JSON.stringify([null]);
                }

                if (
                    isFormValueEqual(previousFormValues, newFormValues) ||
                    !this.classOfEquipmentForm.valid
                ) {
                    this.isWorkExperienceEdited = false;
                } else {
                    this.isWorkExperienceEdited = true;
                }
            });
    }

    private isDriverPosition(): void {
        this.workExperienceForm
            .get('isDrivingPosition')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (!value) {
                    this.inputService.changeValidators(
                        this.classOfEquipmentForm.get('vehicleType'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.classOfEquipmentForm.get('trailerType'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.classOfEquipmentForm.get('trailerLength'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.workExperienceForm.get('cfrPart'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.workExperienceForm.get('fmCSA'),
                        false
                    );

                    this.workExperienceForm.patchValue({
                        cfrPart: null,
                        fmCSA: null,
                    });

                    this.classOfEquipmentForm.patchValue({
                        vehicleType: null,
                        trailerType: null,
                        trailerLength: null,
                    });

                    this.selectedVehicleType = null;
                    this.selectedTrailerType = null;
                    this.selectedTrailerLength = null;

                    this.classOfEquipmentArray = [];

                    if (this.cfrPartRadios) {
                        this.cfrPartRadios[0].checked = false;
                        this.cfrPartRadios[1].checked = false;
                    }

                    if (this.fmcsaRadios) {
                        this.fmcsaRadios[0].checked = false;
                        this.fmcsaRadios[1].checked = false;
                    }
                } else {
                    this.inputService.changeValidators(
                        this.classOfEquipmentForm.get('vehicleType')
                    );
                    this.inputService.changeValidators(
                        this.classOfEquipmentForm.get('trailerType')
                    );
                    this.inputService.changeValidators(
                        this.classOfEquipmentForm.get('trailerLength')
                    );
                    this.inputService.changeValidators(
                        this.workExperienceForm.get('cfrPart')
                    );
                    this.inputService.changeValidators(
                        this.workExperienceForm.get('fmCSA')
                    );
                }
            });
    }

    public handleInputSelect(event: any, action: string): void {
        switch (action) {
            case InputSwitchActions.ADDRESS:
                this.selectedAddress = event.address;

                if (!event.valid) {
                    this.workExperienceForm
                        .get('employerAddress')
                        .setErrors({ invalid: true });
                }

                break;
            case InputSwitchActions.TRUCK_TYPE:
                this.selectedVehicleType = event;

                if (event) {
                    this.workExperienceForm
                        .get('vehicleType')
                        .patchValue(event.name);

                    if (event.id === 5 || event.id === 8) {
                        this.isTruckSelected = false;

                        this.selectedTrailerType = null;
                        this.selectedTrailerLength = null;

                        this.classOfEquipmentForm.patchValue({
                            trailerType: null,
                            trailerLength: null,
                        });

                        this.inputService.changeValidators(
                            this.classOfEquipmentForm.get('trailerType'),
                            false
                        );

                        this.inputService.changeValidators(
                            this.classOfEquipmentForm.get('trailerLength'),
                            false
                        );
                    } else {
                        this.isTruckSelected = true;

                        this.inputService.changeValidators(
                            this.classOfEquipmentForm.get('trailerType')
                        );

                        this.inputService.changeValidators(
                            this.classOfEquipmentForm.get('trailerLength')
                        );
                    }
                }

                break;
            case InputSwitchActions.TRAILER_TYPE:
                this.selectedTrailerType = event;

                if (event) {
                    this.workExperienceForm
                        .get('trailerType')
                        .patchValue(event.name);
                }

                break;
            case InputSwitchActions.TRAILER_LENGTH:
                this.selectedTrailerLength = event;

                if (event) {
                    this.workExperienceForm
                        .get('trailerLength')
                        .patchValue(event.name);
                }

                break;
            case InputSwitchActions.ANSWER_CHOICE:
                const selectedCheckbox = event.find(
                    (radio: { checked: boolean }) => radio.checked
                );

                const selectedFormControlName =
                    this.questions[selectedCheckbox.index].formControlName;

                if (selectedCheckbox.label === 'YES') {
                    this.workExperienceForm
                        .get(selectedFormControlName)
                        .patchValue(true);
                } else {
                    this.workExperienceForm
                        .get(selectedFormControlName)
                        .patchValue(false);
                }

                break;
            case InputSwitchActions.REASON_FOR_LEAVING:
                this.selectedReasonForLeaving = event;

                break;
            default:
                break;
        }
    }

    public onAddSecondOrLastEmployer(): void {
        if (this.workExperienceForm.invalid) {
            this.inputService.markInvalid(this.workExperienceForm);
            return;
        }

        const {
            classOfEquipmentSubscription,
            vehicleType,
            trailerType,
            trailerLength,
            employerAddress,
            employerAddressUnit,
            isDrivingPosition,
            classOfEquipmentCards,
            firstRowReview,
            secondRowReview,
            thirdRowReview,
            fourthRowReview,
            fifthRowReview,
            sixthRowReview,
            seventhRowReview,
            ...workExperienceForm
        } = this.workExperienceForm.value;

        const selectedAddress = {
            ...this.selectedAddress,
            addressUnit: employerAddressUnit,
        };

        let lastClassOfEquipmentCard: any;

        if (isDrivingPosition) {
            const { vehicleType, trailerType, ...classOfEquipmentForm } =
                this.classOfEquipmentForm.value;

            const vehicleTypeImageLocation = this.vehicleType.find(
                (item) => item.name === vehicleType
            ).logoName;

            let trailerTypeImageLocation: any;

            if (trailerType) {
                trailerTypeImageLocation = this.trailerType.find(
                    (item) => item.name === trailerType
                ).logoName;
            }

            lastClassOfEquipmentCard = {
                ...classOfEquipmentForm,
                vehicleType,
                vehicleTypeImageLocation,
                trailerType,
                trailerTypeImageLocation,
                isEditingClassOfEquipment: false,
            };
        }

        const saveData: WorkHistoryModel = {
            ...workExperienceForm,
            employerAddress: selectedAddress,
            employerAddressUnit,
            isDrivingPosition,
            classesOfEquipment: [
                ...this.classOfEquipmentArray,
                lastClassOfEquipmentCard,
            ],
            isEditingWorkHistory: false,
        };

        this.formValuesEmitter.emit(saveData);

        this.selectedVehicleType = null;
        this.selectedTrailerType = null;
        this.selectedTrailerLength = null;
        this.selectedReasonForLeaving = null;

        this.classOfEquipmentArray = [];

        this.formService.resetForm(this.workExperienceForm);
    }

    public onCancelEditWorkExperience(): void {
        this.cancelFormEditingEmitter.emit(1);

        this.isWorkExperienceEdited = false;

        this.selectedReasonForLeaving = null;

        if (this.cfrPartRadios) {
            this.cfrPartRadios[0].checked = false;
            this.cfrPartRadios[1].checked = false;
        }

        if (this.fmcsaRadios) {
            this.fmcsaRadios[0].checked = false;
            this.fmcsaRadios[1].checked = false;
        }

        this.formService.resetForm(this.workExperienceForm);

        if (this.selectedMode === SelectedMode.APPLICANT) {
            this.subscription.unsubscribe();
        }
    }

    public onSaveEditedWorkExperience(): void {
        if (this.workExperienceForm.invalid) {
            this.inputService.markInvalid(this.workExperienceForm);
            return;
        }

        if (this.classOfEquipmentForm.invalid) {
            this.inputService.markInvalid(this.classOfEquipmentForm);
            return;
        }

        if (!this.isWorkExperienceEdited) {
            return;
        }

        const {
            fifthRowReview: fifthRowReviewClassOfEquipment,
            ...classOfEquipmentForm
        } = this.classOfEquipmentForm.value;

        if (this.helperClassOfEquipmentArray.length) {
            const lastItemInHelperClassOfEquipmentArray =
                this.helperClassOfEquipmentArray[
                    this.helperClassOfEquipmentArray.length - 1
                ];

            if (
                lastItemInHelperClassOfEquipmentArray?.vehicleType !==
                    classOfEquipmentForm?.vehicleType ||
                lastItemInHelperClassOfEquipmentArray?.trailerType !==
                    classOfEquipmentForm?.trailerType ||
                lastItemInHelperClassOfEquipmentArray?.trailerLength !==
                    classOfEquipmentForm?.trailerLength
            ) {
                this.helperClassOfEquipmentArray[
                    this.helperClassOfEquipmentArray.length - 1
                ] = classOfEquipmentForm;
            }
        }

        const {
            classOfEquipmentSubscription,
            vehicleType,
            trailerType,
            trailerLength,
            employerAddress,
            employerAddressUnit,
            classOfEquipmentCards,
            firstRowReview,
            secondRowReview,
            thirdRowReview,
            fourthRowReview,
            fifthRowReview,
            sixthRowReview,
            seventhRowReview,
            ...workExperienceForm
        } = this.workExperienceForm.value;

        const selectedAddress = {
            ...this.selectedAddress,
            addressUnit: employerAddressUnit,
        };

        const saveData: WorkHistoryModel = {
            ...workExperienceForm,
            employerAddress: this.selectedAddress
                ? selectedAddress
                : this.editingCardAddress,
            employerAddressUnit,
            classesOfEquipment: this.helperClassOfEquipmentArray.length
                ? this.helperClassOfEquipmentArray
                : [...this.classOfEquipmentArray, classOfEquipmentForm],
            isEditingWorkHistory: false,
        };

        this.saveFormEditingEmitter.emit(saveData);

        this.isWorkExperienceEdited = false;

        this.selectedReasonForLeaving = null;

        this.formService.resetForm(this.workExperienceForm);

        this.subscription.unsubscribe();
    }

    public onAddClassOfEquipment(): void {
        if (this.classOfEquipmentForm.invalid) {
            this.inputService.markInvalid(this.classOfEquipmentForm);
            return;
        }

        const { vehicleType, trailerType, ...classOfEquipmentForm } =
            this.classOfEquipmentForm.value;

        const filteredVehicleType = this.vehicleType.find(
            (item) => item.name === vehicleType
        );
        const filteredTrailerType = this.trailerType.find(
            (item) => item.name === trailerType
        );

        const vehicleTypeImageLocation = filteredVehicleType
            ? filteredVehicleType.logoName
            : null;
        const trailerTypeImageLocation = filteredTrailerType
            ? filteredTrailerType.logoName
            : null;

        const saveData: AnotherClassOfEquipmentModel = {
            ...classOfEquipmentForm,
            vehicleType,
            vehicleTypeImageLocation,
            trailerType,
            trailerTypeImageLocation,
            isEditingClassOfEquipment: false,
        };

        if (this.isEditing) {
            this.classOfEquipmentArray = [
                ...this.classOfEquipmentArray,
                saveData,
            ];

            this.helperClassOfEquipmentArray = [
                ...this.classOfEquipmentArray,
                saveData,
            ];
        } else {
            this.classOfEquipmentArray = [
                ...this.classOfEquipmentArray,
                saveData,
            ];
        }

        this.workExperienceForm.patchValue({
            classOfEquipmentSubscription: this.classOfEquipmentArray,
        });

        this.classOfEquipmentHelperIndex = 2;

        this.selectedVehicleType = null;
        this.selectedTrailerType = null;
        this.selectedTrailerLength = null;

        this.classOfEquipmentForm.reset();

        this.formService.resetForm(this.classOfEquipmentForm);
    }

    public onDeleteClassOfEquipment(index: number): void {
        if (this.isEditingClassOfEquipment) {
            return;
        }

        if (this.isEditing) {
            this.classOfEquipmentArray.splice(index, 1);

            this.helperClassOfEquipmentArray.splice(index, 1);
        } else {
            this.classOfEquipmentArray.splice(index, 1);
        }
    }

    public onEditClassOfEquipment(index: number): void {
        if (this.isEditingClassOfEquipment) {
            return;
        }

        if (this.isEditing) {
            this.previousFormValuesOnEdit = this.classOfEquipmentForm.value;

            this.previousClassOfEquipmentCardsListOnEdit =
                this.helperClassOfEquipmentArray;
        } else {
            this.previousFormValuesOnEdit = this.classOfEquipmentForm.value;

            this.previousClassOfEquipmentCardsListOnEdit =
                this.classOfEquipmentArray;
        }

        this.isClassOfEquipmentEdited = false;

        this.classOfEquipmentHelperIndex = index;
        this.selectedClassOfEquipmentIndex = index;

        this.isEditingClassOfEquipment = true;
        this.classOfEquipmentArray[index].isEditingClassOfEquipment = true;

        const selectedClassOfEquipment = this.classOfEquipmentArray[index];

        this.classOfEquipmentForm.patchValue({
            vehicleType: selectedClassOfEquipment.vehicleType,
            trailerType: selectedClassOfEquipment.trailerType,
            trailerLength: selectedClassOfEquipment.trailerLength,
        });

        this.selectedVehicleType = this.vehicleType.find(
            (item) => item.name === selectedClassOfEquipment.vehicleType
        );
        this.selectedTrailerType = this.trailerType.find(
            (item) => item.name === selectedClassOfEquipment.trailerType
        );
        this.selectedTrailerLength = this.trailerLengthType.find(
            (item) => item.name === selectedClassOfEquipment.trailerLength
        );

        this.classOfEquipmentSubscription =
            this.classOfEquipmentForm.valueChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((updatedFormValues) => {
                    const {
                        vehicleTypeImageLocation,
                        trailerTypeImageLocation,
                        isEditingClassOfEquipment,
                        ...previousFormValues
                    } = selectedClassOfEquipment;

                    const {
                        cardReview1,
                        cardReview2,
                        cardReview3,
                        cardReview4,
                        cardReview5,
                        cardReview6,
                        cardReview7,
                        cardReview8,
                        cardReview9,
                        cardReview10,
                        fifthRowReview,
                        ...newFormValues
                    } = updatedFormValues;

                    if (isFormValueEqual(previousFormValues, newFormValues)) {
                        this.isClassOfEquipmentEdited = false;
                    } else {
                        this.isClassOfEquipmentEdited = true;
                    }
                });
    }

    public onCancelEditClassOfEquipment(): void {
        this.isEditingClassOfEquipment = false;
        this.classOfEquipmentArray[
            this.selectedClassOfEquipmentIndex
        ].isEditingClassOfEquipment = false;

        this.classOfEquipmentHelperIndex = 2;
        this.selectedClassOfEquipmentIndex = -1;

        this.isClassOfEquipmentEdited = false;

        this.classOfEquipmentArray =
            this.previousClassOfEquipmentCardsListOnEdit;

        this.classOfEquipmentForm.reset();

        this.classOfEquipmentSubscription.unsubscribe();

        this.classOfEquipmentForm.patchValue({
            vehicleType: this.previousFormValuesOnEdit.vehicleType,
            trailerType: this.previousFormValuesOnEdit.trailerType,
            trailerLength: this.previousFormValuesOnEdit.trailerLength,
        });

        this.selectedVehicleType = this.vehicleType.find(
            (item) => item.name === this.previousFormValuesOnEdit.vehicleType
        );

        if (
            this.selectedVehicleType.id === 5 ||
            this.selectedVehicleType.id === 8
        ) {
            this.isTruckSelected = false;
        } else {
            this.isTruckSelected = true;

            this.selectedTrailerType = this.trailerType.find(
                (item) =>
                    item.name === this.previousFormValuesOnEdit.trailerType
            );

            this.selectedTrailerLength = this.trailerLengthType.find(
                (item) =>
                    item.name === this.previousFormValuesOnEdit.trailerLength
            );
        }
    }

    public onSaveEditedClassOfEquipment(): void {
        if (this.classOfEquipmentForm.invalid) {
            this.inputService.markInvalid(this.classOfEquipmentForm);
            return;
        }

        if (!this.isClassOfEquipmentEdited) {
            return;
        }

        const { vehicleType, trailerType, ...classOfEquipmentForm } =
            this.classOfEquipmentForm.value;

        const vehicleTypeImageLocation = this.vehicleType.find(
            (item) => item.name === vehicleType
        ).logoName;
        const trailerTypeImageLocation = this.trailerType.find(
            (item) => item.name === trailerType
        ).logoName;

        const saveData = {
            ...classOfEquipmentForm,
            vehicleType,
            vehicleTypeImageLocation,
            trailerType,
            trailerTypeImageLocation,
            isEditingClassOfEquipment: false,
        };

        if (this.isEditing) {
            this.helperClassOfEquipmentArray[
                this.selectedClassOfEquipmentIndex
            ] = saveData;
        } else {
            this.classOfEquipmentArray[this.selectedClassOfEquipmentIndex] =
                saveData;
        }

        this.classOfEquipmentArray[this.selectedClassOfEquipmentIndex] =
            saveData;

        this.isEditingClassOfEquipment = false;
        this.classOfEquipmentArray[
            this.selectedClassOfEquipmentIndex
        ].isEditingClassOfEquipment = false;

        this.classOfEquipmentHelperIndex = 2;
        this.selectedClassOfEquipmentIndex = -1;

        this.isClassOfEquipmentEdited = false;

        this.classOfEquipmentForm.reset();

        this.formService.resetForm(this.classOfEquipmentForm);

        this.classOfEquipmentSubscription.unsubscribe();

        this.classOfEquipmentForm.patchValue({
            vehicleType: this.previousFormValuesOnEdit.vehicleType,
            trailerType: this.previousFormValuesOnEdit.trailerType,
            trailerLength: this.previousFormValuesOnEdit.trailerLength,
        });

        this.selectedVehicleType = this.vehicleType.find(
            (item) => item.name === this.previousFormValuesOnEdit.vehicleType
        );

        if (
            this.selectedVehicleType.id === 5 ||
            this.selectedVehicleType.id === 8
        ) {
            this.isTruckSelected = false;
        } else {
            this.isTruckSelected = true;

            this.selectedTrailerType = this.trailerType.find(
                (item) =>
                    item.name === this.previousFormValuesOnEdit.trailerType
            );

            this.selectedTrailerLength = this.trailerLengthType.find(
                (item) =>
                    item.name === this.previousFormValuesOnEdit.trailerLength
            );
        }
    }

    public getDropdownLists(): void {
        this.applicantQuery.applicantDropdownLists$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantModalResponse) => {
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

                this.trailerLengthType = res.trailerLenghts;

                this.reasonsForLeaving = res.reasonsForLeave;
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

        if (this.isReviewingCard) {
            if (event) {
                selectedInputsLine.lineInputs[inputIndex] = true;
            }

            if (!event) {
                selectedInputsLine.lineInputs[inputIndex] = false;
            }

            const inputFieldsArray = JSON.stringify(
                this.openAnnotationArray
                    .filter((item) => Object.keys(item).length !== 0)
                    .map((item) => item.lineInputs)
            );

            if (inputFieldsArray.includes('true')) {
                this.isCardReviewedIncorrect = true;
            } else {
                this.isCardReviewedIncorrect = false;
            }
        } else {
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
                    case 20:
                        this.workExperienceForm
                            .get('firstRowReview')
                            .patchValue(null);

                        break;
                    case 21:
                        if (!isAnyInputInLineIncorrect) {
                            this.workExperienceForm
                                .get('secondRowReview')
                                .patchValue(null);
                        }

                        break;
                    case 22:
                        if (!isAnyInputInLineIncorrect) {
                            this.workExperienceForm
                                .get('thirdRowReview')
                                .patchValue(null);
                        }

                        break;
                    case 23:
                        if (!isAnyInputInLineIncorrect) {
                            this.workExperienceForm
                                .get('fourthRowReview')
                                .patchValue(null);
                        }

                        break;
                    case 26:
                        this.workExperienceForm
                            .get('seventhRowReview')
                            .patchValue(null);

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
                this.hasIncorrectFieldsEmitter.emit(true);
            } else {
                this.hasIncorrectFieldsEmitter.emit(false);
            }

            const filteredOpenAnnotationArray = this.openAnnotationArray.filter(
                (item) => Object.keys(item).length !== 0
            );

            this.openAnnotationArrayValuesEmitter.emit(
                filteredOpenAnnotationArray
            );
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

    public onCancelReviewWorkExperience(): void {
        this.cancelFormReviewingEmitter.emit(1);

        this.isCardReviewedIncorrect = false;
    }

    public onAddAnnotation(): void {
        if (!this.isCardReviewedIncorrect) {
            return;
        }

        const filteredOpenAnnotationArray = this.openAnnotationArray.filter(
            (item) => Object.keys(item).length !== 0
        );

        this.cardOpenAnnotationArrayValuesEmitter.emit(
            filteredOpenAnnotationArray
        );

        this.isCardReviewedIncorrect = false;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
