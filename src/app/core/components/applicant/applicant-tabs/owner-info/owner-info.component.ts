/* eslint-disable no-unused-vars */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import {
    distinctUntilChanged,
    skip,
    Subject,
    Subscription,
    takeUntil,
    tap,
    throttleTime,
} from 'rxjs';

import {
    anyInputInLineIncorrect,
    isFormValueNotEqual,
} from '../../state/utils/utils';

import {
    accountBankValidation,
    addressUnitValidation,
    addressValidation,
    bankValidation,
    einNumberRegex,
    phoneFaxRegex,
    routingBankValidation,
    truckTrailerModelValidation,
    vinNumberValidation,
    yearValidation,
    yearValidRegex,
} from '../../../shared/ta-input/ta-input.regex-validations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';
import { BankVerificationService } from 'src/app/core/services/BANK-VERIFICATION/bankVerification.service';
import { VinDecoderService } from 'src/app/core/services/VIN-DECODER/vindecoder.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import {
    AddressEntity,
    BankResponse,
    CreateResponse,
    TruckTypeResponse,
    VinDecodeResponse,
    TrailerTypeResponse,
    TrailerLengthResponse,
    ApplicantResponse,
    ApplicantModalResponse,
    CreateCompanyOwnerInfoCommand,
    CompanyOwnerInfoFeedbackResponse,
    CreateCompanyOwnerInfoReviewCommand,
} from 'appcoretruckassist';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { IdNameList } from '../../state/model/lists.model';

@Component({
    selector: 'app-owner-info',
    templateUrl: './owner-info.component.html',
    styleUrls: ['./owner-info.component.scss'],
})
export class OwnerInfoComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.FEEDBACK;

    public subscription: Subscription;

    public isValidLoad: boolean;

    public applicantId: number;
    public queryParamId: number | string | null = null;
    public ownerInfoCompanyId: number;

    public ownerInfoForm: FormGroup;

    public stepValues: any;
    public stepHasValues: boolean = false;
    public stepHasReviewValues: boolean = false;

    public selectedTab: number = 1;
    public selectedAddress: AddressEntity;
    public selectedBank: any = null;
    public selectedTruckType: any = null;
    public selectedTruckMake: any = null;
    public selectedTruckColor: any = null;
    public selectedTrailerType: any = null;
    public selectedTrailerMake: any = null;
    public selectedTrailerColor: any = null;
    public selectedTrailerLength: any = null;

    public banksDropdownList: BankResponse[] = [];
    public truckType: TruckTypeResponse[] = [];
    public truckMakeType: any[] = [];
    public colorType: any[] = [];
    public trailerType: TrailerTypeResponse[] = [];
    public trailerMakeType: any[] = [];
    public trailerLengthType: TrailerLengthResponse[] = [];

    public isBankSelected: boolean = false;
    public isAddTrailerSelected: boolean = false;

    public previousTrailerValues: any;

    public loadingTruckVinDecoder: boolean = false;
    public loadingTrailerVinDecoder: boolean = false;
    public skipTruckVinDecocerEdit: boolean = true;
    public skipTrailerVinDecocerEdit: boolean = true;

    public ownerInfoTabs: IdNameList[] = [
        {
            id: 1,
            name: 'Company',
        },
        {
            id: 2,
            name: 'Sole Proprietor',
        },
    ];

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
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 4,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 5,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 6,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 7,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 8,
            lineInputs: [false],
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
        private applicantActionsService: ApplicantActionsService,
        private bankVerificationService: BankVerificationService,
        private vinDecoderService: VinDecoderService,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.getQueryParams();

        this.createForm();

        this.getDropdownLists();

        this.getStepValuesFromStore();

        this.vinDecoder();

        this.onAddTrailerSelected();
    }

    public createForm(): void {
        this.ownerInfoForm = this.formBuilder.group({
            businessName: [null, Validators.required],
            ein: [null, [Validators.required, einNumberRegex]],
            phone: [null, [Validators.required, phoneFaxRegex]],
            email: [null, [Validators.required]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, addressUnitValidation],
            bank: [null, [...bankValidation]],
            accountNumber: [null, accountBankValidation],
            routingNumber: [null, routingBankValidation],
            truckType: [null, Validators.required],
            truckVin: [null, [Validators.required, ...vinNumberValidation]],
            truckMake: [null, Validators.required],
            truckModel: [
                null,
                [Validators.required, ...truckTrailerModelValidation],
            ],
            truckYear: [
                null,
                [Validators.required, ...yearValidation, yearValidRegex],
            ],
            truckColor: [null],
            addTrailer: [false],
            trailerType: [null],
            trailerVin: [null],
            trailerMake: [null],
            trailerModel: [null, truckTrailerModelValidation],
            trailerYear: [null],
            trailerColor: [null],
            trailerLength: [null],

            firstRowReview: [null],
            secondRowReview: [null],
            thirdRowReview: [null],
            fourthRowReview: [null],
            fifthRowReview: [null],
            sixthRowReview: [null],
            seventhRowReview: [null],
            eightRowReview: [null],
            ninthRowReview: [null],
        });

        this.inputService.customInputValidator(
            this.ownerInfoForm.get('email'),
            'email',
            this.destroy$
        );
    }

    public getQueryParams(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.queryParamId = params.get('id');
        });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                if (res && res.id == this.queryParamId) {
                    this.isValidLoad = true;

                    this.applicantId = res.id;

                    if (res.companyOwnerInfo) {
                        this.patchStepValues(res.companyOwnerInfo);

                        this.stepHasValues = true;
                    }
                } else {
                    this.isValidLoad = false;

                    this.router.navigate(['/auth']);
                }
            });
    }

    public patchStepValues(stepValues: CompanyOwnerInfoFeedbackResponse): void {
        console.log('stepValues', stepValues);

        const {
            businessName,
            ein,
            phone,
            email,
            address,
            bank,
            accountNumber,
            routingNumber,
            truckType,
            truckVin,
            truckMake,
            truckModel,
            truckYear,
            truckColor,
            hasTrailer,
            trailerType,
            trailerVin,
            trailerMake,
            trailerModel,
            trailerYear,
            trailerColor,
            trailerLength,
            review,
        } = stepValues;

        if (this.selectedMode === SelectedMode.REVIEW) {
            if (stepValues.review) {
                const {
                    id,
                    isBusinessNameValid,
                    isEinValid,
                    businessNameEinMessage,
                    isPhoneValid,
                    isEmailValid,
                    contactMessage,
                    isAddressValid,
                    isAddressUnitValid,
                    isAccountValid,
                    accountRoutingMessage,
                    addressMessage,
                    isTruckVinValid,
                    truckVinMessage,
                    isTruckModelValid,
                    isTruckYearValid,
                    truckModelYearMessage,
                    isTrailerVinValid,
                    trailerVinMessage,
                    isTrailerModelValid,
                    isTrailerYearValid,
                } = stepValues.review;

                this.stepHasReviewValues = true;

                this.ownerInfoCompanyId = id;

                this.openAnnotationArray[0] = {
                    ...this.openAnnotationArray[0],
                    lineInputs: [!isBusinessNameValid, !isEinValid],
                    displayAnnotationButton:
                        (!isBusinessNameValid || !isEinValid) &&
                        !businessNameEinMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: businessNameEinMessage
                        ? true
                        : false,
                };
                this.openAnnotationArray[1] = {
                    ...this.openAnnotationArray[1],
                    lineInputs: [!isPhoneValid, !isEmailValid],
                    displayAnnotationButton:
                        (!isPhoneValid || !isEmailValid) && !contactMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: contactMessage ? true : false,
                };
                this.openAnnotationArray[2] = {
                    ...this.openAnnotationArray[2],
                    lineInputs: [!isAddressValid, !isAddressUnitValid],
                    displayAnnotationButton:
                        (!isAddressValid || !isAddressUnitValid) &&
                        !addressMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: addressMessage ? true : false,
                };
                this.openAnnotationArray[3] = {
                    ...this.openAnnotationArray[3],
                    lineInputs: [!isAccountValid],
                    displayAnnotationButton:
                        !isAccountValid && !accountRoutingMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: accountRoutingMessage
                        ? true
                        : false,
                };
                this.openAnnotationArray[4] = {
                    ...this.openAnnotationArray[4],
                    lineInputs: [!isTruckVinValid],
                    displayAnnotationButton:
                        !isTruckVinValid && !truckVinMessage ? true : false,
                    displayAnnotationTextArea: truckVinMessage ? true : false,
                };
                this.openAnnotationArray[5] = {
                    ...this.openAnnotationArray[5],
                    lineInputs: [!isTruckModelValid, !isTruckYearValid],
                    displayAnnotationButton:
                        (!isTruckModelValid || !isTruckYearValid) &&
                        !truckModelYearMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: truckModelYearMessage
                        ? true
                        : false,
                };
                this.openAnnotationArray[6] = {
                    ...this.openAnnotationArray[6],
                    lineInputs: [!isTrailerVinValid],
                    displayAnnotationButton:
                        !isTrailerVinValid && !trailerVinMessage ? true : false,
                    displayAnnotationTextArea: trailerVinMessage ? true : false,
                };
                this.openAnnotationArray[7] = {
                    ...this.openAnnotationArray[7],
                    lineInputs: [!isTrailerModelValid],
                    /*  displayAnnotationButton:
                        !isTrailerModelValid && !trailerVinMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: trailerVinMessage ? true : false, */
                };
                this.openAnnotationArray[8] = {
                    ...this.openAnnotationArray[8],
                    lineInputs: [!isTrailerYearValid],
                    /*  displayAnnotationButton:
                        !isTrailerYearValid && !trailerVinMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: trailerVinMessage ? true : false, */
                };

                const inputFieldsArray = JSON.stringify(
                    this.openAnnotationArray.map((item) => item.lineInputs)
                );

                if (inputFieldsArray.includes('true')) {
                    this.hasIncorrectFields = true;
                } else {
                    this.hasIncorrectFields = false;
                }

                this.ownerInfoForm.patchValue({
                    firstRowReview: businessNameEinMessage,
                    secondRowReview: contactMessage,
                    thirdRowReview: addressMessage,
                    fourthRowReview: accountRoutingMessage,
                    fifthRowReview: truckVinMessage,
                    sixthRowReview: truckModelYearMessage,
                    seventhRowReview: trailerVinMessage,
                    eightRowReview: null,
                    ninthRowReview: null,
                });
            }
        }

        this.ownerInfoForm.patchValue({
            businessName,
            ein,
            phone,
            email,
            address: address.address,
            addressUnit: address.addressUnit,
            bank: bank ? bank.name : null,
            accountNumber,
            routingNumber,
            truckType: truckType.name,
            truckVin,
            truckMake: truckMake.name,
            truckModel,
            truckYear,
            truckColor: truckColor.name,
            addTrailer: hasTrailer,
        });

        this.selectedBank = bank;
        this.selectedAddress = address;
        this.selectedTruckType = truckType;
        this.selectedTruckMake = truckMake;
        this.selectedTruckColor = truckColor;

        if (bank) {
            this.isBankSelected = true;
        }

        if (hasTrailer) {
            this.ownerInfoForm.patchValue({
                trailerType: trailerType.name,
                trailerVin,
                trailerMake: trailerMake.name,
                trailerModel,
                trailerYear,
                trailerColor: trailerColor.name,
                trailerLength: trailerLength.name,
            });

            this.selectedTrailerType = trailerType;
            this.selectedTrailerMake = trailerMake;
            this.selectedTrailerColor = trailerColor;
            this.selectedTrailerLength = trailerLength;

            this.isAddTrailerSelected = true;
        } else {
            this.isAddTrailerSelected = false;
        }

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            if (review) {
                this.stepFeedbackValues = review;

                console.log('this.stepFeedbackValues', this.stepFeedbackValues);
            }

            this.stepValues = stepValues;

            this.startFeedbackValueChangesMonitoring();
        }
    }

    public onTabChange(event: any): void {
        this.selectedTab = event.id;
    }

    public handleInputSelect(event: any, action: string): void {
        switch (action) {
            case InputSwitchActions.ADDRESS:
                this.selectedAddress = event.address;

                if (!event.valid) {
                    this.ownerInfoForm
                        .get('address')
                        .setErrors({ invalid: true });
                }

                break;
            case InputSwitchActions.BANK:
                this.selectedBank = event;

                if (!event) {
                    this.isBankSelected = false;

                    this.ownerInfoForm.patchValue({
                        bank: null,
                        accountNumber: null,
                        routingNumber: null,
                    });
                }

                this.onBankSelected();

                break;
            case InputSwitchActions.TRUCK_TYPE:
                this.selectedTruckType = event;

                break;
            case InputSwitchActions.TRUCK_MAKE:
                this.selectedTruckMake = event;

                break;
            case InputSwitchActions.TRUCK_COLOR:
                this.selectedTruckColor = event;

                break;
            case InputSwitchActions.TRAILER_TYPE:
                this.selectedTrailerType = event;

                break;
            case InputSwitchActions.TRAILER_MAKE:
                this.selectedTrailerMake = event;

                break;
            case InputSwitchActions.TRAILER_COLOR:
                this.selectedTrailerColor = event;

                break;
            case InputSwitchActions.TRAILER_LENGTH: {
                this.selectedTrailerLength = event;

                break;
            }

            default:
                break;
        }
    }

    private onBankSelected() {
        this.ownerInfoForm
            .get('bank')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                const timeout = setTimeout(async () => {
                    this.isBankSelected =
                        await this.bankVerificationService.onSelectBank(
                            this.selectedBank ? this.selectedBank.name : null,
                            this.ownerInfoForm.get('routingNumber'),
                            this.ownerInfoForm.get('accountNumber')
                        );
                    clearTimeout(timeout);
                }, 100);
            });
    }

    public onSaveNewBank(bank: { data: any; action: string }) {
        this.selectedBank = bank.data;

        this.bankVerificationService
            .createBank({ name: bank.data.name })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CreateResponse) => {
                    this.selectedBank = {
                        id: res.id,
                        name: bank.data.name,
                    };

                    this.banksDropdownList = [
                        ...this.banksDropdownList,
                        this.selectedBank,
                    ];
                },
            });
    }

    private vinDecoder() {
        this.ownerInfoForm
            .get('truckVin')
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                this.skipTruckVinDecocerEdit ? skip(1) : tap()
            )
            .subscribe((value) => {
                this.skipTruckVinDecocerEdit = false;

                if (value?.length > 13 && value?.length < 17) {
                    this.ownerInfoForm
                        .get('truckVin')
                        .setErrors({ invalid: true });
                }

                if (value?.length === 17) {
                    this.loadingTruckVinDecoder = true;

                    this.vinDecoderService
                        .getVINDecoderData(value.toString(), 1)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (res: VinDecodeResponse) => {
                                this.ownerInfoForm.patchValue({
                                    truckModel: res?.model ? res.model : null,
                                    truckYear: res?.year
                                        ? res.year.toString()
                                        : null,
                                    truckMake: res.truckMake
                                        ? res.truckMake.name
                                        : null,
                                });

                                this.loadingTruckVinDecoder = false;

                                this.selectedTruckMake = res.truckMake;
                            },
                        });
                }
            });

        this.ownerInfoForm
            .get('trailerVin')
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                this.skipTrailerVinDecocerEdit ? skip(1) : tap()
            )
            .subscribe((value) => {
                this.skipTrailerVinDecocerEdit = false;

                if (value?.length > 13 && value?.length < 17) {
                    this.ownerInfoForm
                        .get('trailerVin')
                        .setErrors({ invalid: true });
                }

                if (value?.length === 17) {
                    this.loadingTrailerVinDecoder = true;

                    this.vinDecoderService
                        .getVINDecoderData(value.toString(), 2)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (res: VinDecodeResponse) => {
                                this.ownerInfoForm.patchValue({
                                    trailerModel: res?.model ? res.model : null,
                                    trailerYear: res?.year
                                        ? res.year.toString()
                                        : null,
                                    trailerMake: res.trailerMake?.name
                                        ? res.trailerMake.name
                                        : null,
                                });

                                this.loadingTrailerVinDecoder = false;

                                this.selectedTrailerMake = res.trailerMake;
                            },
                        });
                }
            });
    }

    private onAddTrailerSelected() {
        this.ownerInfoForm
            .get('addTrailer')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                const inputsToValidate = [
                    'trailerType',
                    'trailerVin',
                    'trailerMake',
                    'trailerYear',
                    'trailerLength',
                ];

                if (value) {
                    this.isAddTrailerSelected = true;

                    if (this.previousTrailerValues) {
                        const {
                            trailerType,
                            trailerVin,
                            trailerMake,
                            trailerModel,
                            trailerYear,
                            trailerColor,
                            trailerLength,
                        } = this.previousTrailerValues;

                        this.ownerInfoForm.patchValue({
                            trailerType,
                            trailerVin,
                            trailerMake,
                            trailerModel,
                            trailerYear,
                            trailerColor,
                            trailerLength,
                        });

                        this.selectedTrailerType = this.trailerType.find(
                            (item) => item.name === trailerType
                        );

                        this.selectedTrailerMake = this.trailerMakeType.find(
                            (item) => item.name === trailerMake
                        );

                        this.selectedTrailerColor = this.colorType.find(
                            (item) => item.name === trailerColor
                        );

                        this.selectedTrailerLength =
                            this.trailerLengthType.find(
                                (item) => item.name === trailerLength
                            );
                    }

                    for (let i = 0; i < inputsToValidate.length; i++) {
                        if (i === 1) {
                            this.inputService.changeValidators(
                                this.ownerInfoForm.get(inputsToValidate[i]),
                                true,
                                [...vinNumberValidation]
                            );
                        } else if (i === 3) {
                            this.inputService.changeValidators(
                                this.ownerInfoForm.get(inputsToValidate[i]),
                                true,
                                [yearValidRegex, ...yearValidation]
                            );
                        } else {
                            this.inputService.changeValidators(
                                this.ownerInfoForm.get(inputsToValidate[i])
                            );
                        }
                    }
                } else {
                    this.isAddTrailerSelected = false;

                    const {
                        trailerType,
                        trailerVin,
                        trailerMake,
                        trailerModel,
                        trailerYear,
                        trailerColor,
                        trailerLength,
                    } = this.ownerInfoForm.value;

                    this.previousTrailerValues = {
                        trailerType,
                        trailerVin,
                        trailerMake,
                        trailerModel,
                        trailerYear,
                        trailerColor,
                        trailerLength,
                    };

                    this.ownerInfoForm.patchValue({
                        trailerType: null,
                        trailerVin: null,
                        trailerMake: null,
                        trailerModel: null,
                        trailerYear: null,
                        trailerColor: null,
                        trailerLength: null,
                    });

                    this.selectedTrailerType = null;
                    this.selectedTrailerMake = null;
                    this.selectedTrailerColor = null;
                    this.selectedTrailerLength = null;

                    for (let i = 0; i < inputsToValidate.length; i++) {
                        this.inputService.changeValidators(
                            this.ownerInfoForm.get(inputsToValidate[i]),
                            false
                        );
                    }
                }
            });
    }

    public getDropdownLists(): void {
        this.applicantQuery.applicantDropdownLists$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantModalResponse) => {
                this.banksDropdownList = res.banks;

                this.truckType = res.truckTypes.map((item) => {
                    return {
                        ...item,
                        folder: 'common',
                        subFolder: 'trucks',
                    };
                });

                this.truckMakeType = res.truckMakes;

                this.colorType = res.colors.map((item) => {
                    return {
                        ...item,
                        folder: 'common',
                        subFolder: 'colors',
                        logoName: 'ic_color.svg',
                    };
                });

                this.trailerType = res.trailerTypes.map((item) => {
                    return {
                        ...item,
                        folder: 'common',
                        subFolder: 'trailers',
                    };
                });

                this.trailerMakeType = res.trailerMakes;

                this.trailerLengthType = res.trailerLenghts;
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
                        this.ownerInfoForm
                            .get('firstRowReview')
                            .patchValue(null);
                    }

                    break;
                case 1:
                    if (!isAnyInputInLineIncorrect) {
                        this.ownerInfoForm
                            .get('secondRowReview')
                            .patchValue(null);
                    }

                    break;
                case 2:
                    if (!isAnyInputInLineIncorrect) {
                        this.ownerInfoForm
                            .get('thirdRowReview')
                            .patchValue(null);
                    }

                    break;
                case 3:
                    this.ownerInfoForm.get('fourthRowReview').patchValue(null);

                    break;
                case 4:
                    this.ownerInfoForm.get('fifthRowReview').patchValue(null);

                    break;
                case 5:
                    if (!isAnyInputInLineIncorrect) {
                        this.ownerInfoForm
                            .get('sixthRowReview')
                            .patchValue(null);
                    }

                    break;
                case 6:
                    this.ownerInfoForm.get('seventhRowReview').patchValue(null);

                    break;
                case 7:
                    this.ownerInfoForm.get('eightRowReview').patchValue(null);

                    break;
                case 8:
                    this.ownerInfoForm.get('ninthRowReview').patchValue(null);

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
                this.subscription = this.ownerInfoForm.valueChanges
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

                            if (keyName === 'address') {
                                o['address'] = JSON.stringify({
                                    address: this.stepValues.address.address,
                                });
                            }

                            if (keyName === 'addressunit') {
                                o['addressunit'] =
                                    this.stepValues.address.addressUnit;
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

                                if (keyName === 'address') {
                                    o['address'] = JSON.stringify({
                                        address: updatedFormValues.address,
                                    });
                                }

                                if (keyName === 'addressunit') {
                                    o['addressunit'] =
                                        updatedFormValues.addressUnit;
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
            if (this.selectedMode !== SelectedMode.REVIEW) {
                this.onSubmit();
            }

            if (this.selectedMode === SelectedMode.REVIEW) {
                this.onSubmitReview();
            }
        }
    }

    public onSubmit(): void {
        if (this.ownerInfoForm.invalid) {
            this.inputService.markInvalid(this.ownerInfoForm);
            return;
        }

        const {
            address,
            addressUnit,
            bank,
            truckType,
            truckMake,
            truckYear,
            truckColor,
            addTrailer,
            trailerType,
            trailerLength,
            trailerVin,
            trailerMake,
            trailerModel,
            trailerYear,
            trailerColor,
            firstRowReview,
            secondRowReview,
            thirdRowReview,
            fourthRowReview,
            fifthRowReview,
            sixthRowReview,
            seventhRowReview,
            eightRowReview,
            ...ownerInfoForm
        } = this.ownerInfoForm.value;

        const selectedAddress = {
            ...this.selectedAddress,
            addressUnit,
            county: '',
        };

        const saveData: CreateCompanyOwnerInfoCommand = {
            ...ownerInfoForm,
            applicantId: this.applicantId,
            address: selectedAddress,
            bankId: this.selectedBank ? this.selectedBank.id : null,
            truckTypeId: this.truckType.find((item) => item.name === truckType)
                .id,
            truckMakeId: this.truckMakeType.find(
                (item) => item.name === truckMake
            ).id,
            truckYear: +truckYear,
            truckColorId: truckColor
                ? this.colorType.find((item) => item.name === truckColor).id
                : null,
            hasTrailer: addTrailer,
            trailerTypeId: addTrailer
                ? this.trailerType.find((item) => item.name === trailerType).id
                : null,
            trailerLengthId: addTrailer
                ? this.trailerLengthType.find(
                      (item) => item.name === trailerLength
                  ).id
                : null,
            trailerVin: addTrailer ? trailerVin : null,
            trailerMakeId: addTrailer
                ? this.trailerMakeType.find((item) => item.name === trailerMake)
                      .id
                : null,
            trailerModel: addTrailer ? trailerModel : null,
            trailerYear: addTrailer ? +trailerYear : null,
            trailerColorId: addTrailer
                ? this.colorType.find((item) => item.name === trailerColor).id
                : null,
        };

        console.log('saveData', saveData);

        const storeOwnerInfoCompanyItems = {
            ...saveData,
            bank: this.banksDropdownList.find(
                (item) => item.id === saveData.bankId
            ),
            truckType: this.truckType.find(
                (item) => item.id === saveData.truckTypeId
            ),
            truckMake: this.truckMakeType.find(
                (item) => item.id === saveData.truckMakeId
            ),
            truckColor: this.colorType.find(
                (item) => item.id === saveData.truckColorId
            ),
            trailerType: this.trailerType.find(
                (item) => item.id === saveData.trailerTypeId
            ),
            trailerLength: this.trailerLengthType.find(
                (item) => item.id === saveData.trailerLengthId
            ),
            trailerMake: this.trailerMakeType.find(
                (item) => item.id === saveData.trailerMakeId
            ),
            trailerColor: this.colorType.find(
                (item) => item.id === saveData.trailerColorId
            ),
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.APPLICANT &&
                !this.stepHasValues
            ) {
                return this.applicantActionsService.createOwnerInfoCompany(
                    saveData
                );
            }

            if (
                (this.selectedMode === SelectedMode.APPLICANT &&
                    this.stepHasValues) ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
                return this.applicantActionsService.updateOwnerInfoCompany(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/medical-certificate/${this.applicantId}`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                companyOwnerInfo: {
                                    ...store.applicant.companyOwnerInfo,
                                    ...storeOwnerInfoCompanyItems,
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

    public onSubmitReview(): void {
        const {
            firstRowReview,
            secondRowReview,
            thirdRowReview,
            fourthRowReview,
            fifthRowReview,
            sixthRowReview,
            seventhRowReview,
            eightRowReview,
            ninthRowReview,
        } = this.ownerInfoForm.value;

        const saveData: CreateCompanyOwnerInfoReviewCommand = {
            applicantId: this.applicantId,
            ...(this.stepHasReviewValues && {
                id: this.ownerInfoCompanyId,
            }),
            isBusinessNameValid: !this.openAnnotationArray[0].lineInputs[0],
            isEinValid: !this.openAnnotationArray[0].lineInputs[1],
            businessNameEinMessage: firstRowReview,
            isPhoneValid: !this.openAnnotationArray[1].lineInputs[0],
            isEmailValid: !this.openAnnotationArray[1].lineInputs[1],
            contactMessage: secondRowReview,
            isAddressValid: !this.openAnnotationArray[2].lineInputs[0],
            isAddressUnitValid: !this.openAnnotationArray[2].lineInputs[1],
            addressMessage: thirdRowReview,
            isAccountValid: !this.openAnnotationArray[3].lineInputs[0],
            isRoutingValid: true,
            accountRoutingMessage: fourthRowReview,
            isTruckVinValid: !this.openAnnotationArray[4].lineInputs[0],
            truckVinMessage: fifthRowReview,
            isTruckModelValid: !this.openAnnotationArray[5].lineInputs[0],
            isTruckYearValid: !this.openAnnotationArray[5].lineInputs[1],
            truckModelYearMessage: sixthRowReview,
            isTrailerVinValid: !this.openAnnotationArray[6].lineInputs[0],
            trailerVinMessage: seventhRowReview,
            isTrailerModelValid: !this.openAnnotationArray[7].lineInputs[0],
            /*   trailer model message */
            isTrailerYearValid: !this.openAnnotationArray[8].lineInputs[0],
            /*   trailer year message */
        };

        console.log('saveData', saveData);

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.REVIEW &&
                !this.stepHasReviewValues
            ) {
                return this.applicantActionsService.createOwnerInfoCompanyReview(
                    saveData
                );
            }

            if (
                this.selectedMode === SelectedMode.REVIEW &&
                this.stepHasReviewValues
            ) {
                return this.applicantActionsService.updateOwnerInfoCompanyReview(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/medical-certificate/${this.applicantId}`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                companyOwnerInfo: {
                                    ...store.applicant.companyOwnerInfo,
                                    review: saveData,
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
