/* eslint-disable no-unused-vars */
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
    distinctUntilChanged,
    skip,
    Subject,
    Subscription,
    takeUntil,
    tap,
    throttleTime,
} from 'rxjs';

// helpers
import {
    anyInputInLineIncorrect,
    isFormValueNotEqual,
} from '@pages/applicant/utils/helpers/applicant.helper';

// validations
import {
    accountBankValidation,
    addressUnitValidation,
    addressValidation,
    bankValidation,
    einNumberRegex,
    phoneFaxRegex,
    truckTrailerModelValidation,
    vinNumberValidation,
    yearValidation,
    yearValidRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ApplicantService } from '@pages/applicant/services/applicant.service';
import { BankVerificationService } from '@shared/services/bank-verification.service';
import { VinDecoderService } from '@shared/services/vin-decoder.service';

// store
import { ApplicantStore } from '@pages/applicant/state/applicant.store';
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import { InputSwitchActions } from '@pages/applicant/enums/input-switch-actions.enum';
import { FilesActions } from '@pages/applicant/enums/files-actions.enum';
import { OwnerInfoTabEnum } from '@pages/applicant/pages/applicant-owner-info/enums/owner-info-tab.enum';
import { OwnerInfoFileType } from '@pages/applicant/pages/applicant-owner-info/enums/owner-info-file-type.enum';
import { OwnerInfoStringEnum } from '@pages/applicant/pages/applicant-owner-info/enums/owner-info-string.enum';
import { StepAction } from '@pages/applicant/enums/step-action.enum';

// models
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
    CompanyOwnerInfoFeedbackResponse,
    CreateCompanyOwnerInfoReviewCommand,
    OwnerType,
} from 'appcoretruckassist';
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';
import { ApplicantDropdownOptions } from '@pages/applicant/pages/applicant-owner-info/models/dropdown-options.model';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { FileEvent } from '@shared/models/file-event.model';

// components
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { ApplicantTruckDetailsComponent } from '@pages/applicant/pages/applicant-owner-info/components/applicant-truck-details/applicant-truck-details.component';
import { ApplicantTrailerDetailsComponent } from '@pages/applicant/pages/applicant-owner-info/components/applicant-trailer-details/applicant-trailer-details.component';
import { ApplicantNextBackBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-next-back-btn/applicant-next-back-btn.component';
import {
    CaInputComponent,
    CaInputDropdownComponent,
    CaInputAddressDropdownComponent,
    CaUploadFilesComponent
} from 'ca-components';

// modules
import { ApplicantModule } from '@pages/applicant/applicant.module';
import { SharedModule } from '@shared/shared.module';
import { ApplicantSvgRoutes } from '@pages/applicant/utils/helpers/applicant-svg-routes';
import { AngularSvgIconModule } from 'angular-svg-icon';

// configs
import { BusinessDetailsConfig } from '@pages/applicant/pages/applicant-owner-info/utils/configs/applicant-owner-info.config';

@Component({
    selector: 'app-owner-info',
    templateUrl: './applicant-owner-info.component.html',
    styleUrls: ['./applicant-owner-info.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,
        AngularSvgIconModule,

        // components
        TaInputAddressDropdownComponent,
        TaCheckboxComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaTabSwitchComponent,
        TaUploadFilesComponent,
        ApplicantTruckDetailsComponent,
        ApplicantTrailerDetailsComponent,
        ApplicantNextBackBtnComponent,

        CaInputComponent,
        CaInputDropdownComponent,
        CaInputAddressDropdownComponent,
        CaUploadFilesComponent,
    ],
})
export class ApplicantOwnerInfoComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string;

    public subscription: Subscription;

    public isValidLoad: boolean;

    public applicantId: number;
    public queryParamId: number | string | null = null;
    public ownerInfoCompanyId: number;

    public ownerInfoForm: UntypedFormGroup;

    public stepValues: any;
    public stepHasValues: boolean = false;
    public stepHasReviewValues: boolean = false;

    public selectedTab: number = OwnerInfoTabEnum.SOLE_PROPRIETOR;
    public selectedAddress: AddressEntity;
    public selectedBank: any = null;
    public selectedTruckType: TruckTypeResponse = null;
    public selectedTruckMake: any = null;
    public selectedTruckColor: any = null;
    public selectedTrailerType: TrailerTypeResponse = null;
    public selectedTrailerMake: any = null;
    public selectedTrailerColor: any = null;
    public selectedTrailerLength: TrailerLengthResponse = null;

    public banksDropdownList: BankResponse[] = [];
    public truckType: TruckTypeResponse[] = [];
    public truckMakeType: any[] = [];
    public colorType: any[] = [];
    public trailerType: TrailerTypeResponse[] = [];
    public trailerMakeType: any[] = [];
    public trailerLengthType: TrailerLengthResponse[] = [];

    public dropdownOptions: ApplicantDropdownOptions = {
        banksDropdownList: [],
        truckType: [],
        truckMakeType: [],
        colorType: [],
        trailerType: [],
        trailerMakeType: [],
        trailerLengthType: [],
    };

    public isBankSelected: boolean = false;
    public isAddTrailerSelected: boolean = false;

    public previousTruckValuesOnTabChange: any = {
        companyTruckValues: null,
        soleTruckValues: null,
    };
    public previousTrailerValues: any;
    public previousSoleTrailerValues: any;

    public loadingTruckVinDecoder: boolean = false;
    public loadingTrailerVinDecoder: boolean = false;
    public skipTruckVinDecocerEdit: boolean = true;
    public skipTrailerVinDecocerEdit: boolean = true;

    public loadingSoleTruckVinDecoder: boolean = false;
    public loadingSoleTrailerVinDecoder: boolean = false;
    public skipSoleTruckVinDecocerEdit: boolean = true;
    public skipSoleTrailerVinDecocerEdit: boolean = true;

    public documents: any[] = [];
    public documentsForDeleteIds: number[] = [];
    public displayDocumentsRequiredNote: boolean = false;

    public truckLicenceDocuments: any[] = [];
    public truckLicenceDocumentsForDeleteIds: number[] = [];
    public truckLicenceDisplayDocumentsRequiredNote: boolean = false;

    public truckFHWADocuments: any[] = [];
    public truckFHWADocumentsForDeleteIds: number[] = [];
    public truckFHWADisplayDocumentsRequiredNote: boolean = false;

    public trailerLicenceDocuments: any[] = [];
    public trailerLicenceDocumentsForDeleteIds: number[] = [];
    public trailerLicenceDisplayDocumentsRequiredNote: boolean = false;

    public trailerFHWADocuments: any[] = [];
    public trailerFHWADocumentsForDeleteIds: number[] = [];
    public trailerFHWADisplayDocumentsRequiredNote: boolean = false;

    public ownerInfoTabs: TabOptions[] = [
        {
            id: 2,
            name: 'Sole Proprietor',
            checked: true,
        },
        {
            id: 1,
            name: 'Company',
            checked: false,
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
    public openSoleAnnotationArray: {
        lineIndex?: number;
        lineInputs?: boolean[];
        displayAnnotationButton?: boolean;
        displayAnnotationTextArea?: boolean;
    }[] = [
            {
                lineIndex: 0,
                lineInputs: [false],
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
                lineInputs: [false],
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
                lineInputs: [false],
                displayAnnotationButton: false,
                displayAnnotationTextArea: false,
            },
        ];
    public hasIncorrectFields: boolean = false;

    public stepFeedbackValues!: any;
    public isFeedbackValueUpdated: boolean = false;

    public applicantSvgRoutes = ApplicantSvgRoutes;
    public ownerInfoTabEnum = OwnerInfoTabEnum;
    public selectedModeEnum = SelectedMode;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private applicantActionsService: ApplicantService,
        private bankVerificationService: BankVerificationService,
        private vinDecoderService: VinDecoderService,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    get businessNameInputConfig(): ITaInput {
        return BusinessDetailsConfig.getBusinessNameInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get einInputConfig(): ITaInput {
        return BusinessDetailsConfig.getEinInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get phoneInputConfig(): ITaInput {
        return BusinessDetailsConfig.getPhoneInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get emailInputConfig(): ITaInput {
        return BusinessDetailsConfig.getEmailInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get addressInputConfig(): ITaInput {
        return BusinessDetailsConfig.getAddressInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get addressUnitInputConfig(): ITaInput {
        return BusinessDetailsConfig.getAddressUnitInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get bankInputConfig(): ITaInput {
        return BusinessDetailsConfig.getBankInputConfig({
            selectedMode: this.selectedMode,
        });
    }

    get accountNumberInputConfig(): ITaInput {
        return BusinessDetailsConfig.getAccountNumberInputConfig({
            selectedMode: this.selectedMode,
            isBankSelected: this.isBankSelected,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get routingNumberInputConfig(): ITaInput {
        return BusinessDetailsConfig.getRoutingNumberInputConfig({
            selectedMode: this.selectedMode,
            isBankSelected: this.isBankSelected,
        });
    }

    ngOnInit(): void {
        this.initMode();

        this.getQueryParams();

        this.createForm();

        this.getDropdownLists();

        this.getStepValuesFromStore();

        this.vinDecoder();
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
            routingNumber: [null],
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

            soleFirstRowReview: [null],
            soleSecondRowReview: [null],
            soleThirdRowReview: [null],
            soleFourthRowReview: [null],
            soleFifthRowReview: [null],

            truckLicenceFiles: [null, Validators.required],
            truckFHWAFiles: [null, Validators.required],
            trailerLicenceFiles: [null],
            trailerFHWAFiles: [null],
        });

        this.inputService.customInputValidator(
            this.ownerInfoForm.get('email'),
            'email',
            this.destroy$
        );
    }

    public initMode(): void {
        this.applicantQuery.selectedMode$
            .pipe(takeUntil(this.destroy$))
            .subscribe((selectedMode: string) => {
                this.selectedMode = selectedMode;
            });
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

                    this.router.navigate(['/website']);
                }
            });
    }

    public patchStepValues(stepValues: CompanyOwnerInfoFeedbackResponse): void {
        const {
            id,
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
            truckLicenceFiles,
            truckFHWAFiles,
            trailerLicenceFiles,
            trailerFHWAFiles,
            ownerType,
        } = stepValues;

        this.ownerInfoCompanyId = id;
        this.selectedTab = ownerType.id;

        if (this.selectedTab === OwnerInfoTabEnum.COMPANY) {
            this.ownerInfoTabs = [
                {
                    id: 2,
                    name: 'Sole Proprietor',
                    checked: false,
                },
                {
                    id: 1,
                    name: 'Company',
                    checked: true,
                },
            ];
            this.onTabChange({ id: 1, name: 'Company', checked: true });
        } else {
            this.onTabChange({ id: 2, name: 'Sole Proprietor', checked: true });
        }

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
                    /*  accountMessage, */
                    addressMessage,
                    isTruckVinValid,
                    truckVinMessage,
                    isTruckModelValid,
                    isTruckYearValid,
                    truckModelYearMessage,
                    isTrailerVinValid,
                    trailerVinMessage,
                    isTrailerModelValid,
                    /*   trailerModelMessage, */
                    isTrailerYearValid,
                    /*      trailerYearMessage, */
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
                    /*   displayAnnotationButton:
                        !isAccountValid && !accountMessage ? true : false,
                    displayAnnotationTextArea: accountMessage ? true : false, */
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
                    /*   displayAnnotationButton:
                        !isTrailerModelValid && !trailerModelMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: trailerModelMessage
                        ? true
                        : false, */
                };
                this.openAnnotationArray[8] = {
                    ...this.openAnnotationArray[8],
                    lineInputs: [!isTrailerYearValid],
                    /*   displayAnnotationButton:
                        !isTrailerYearValid && !trailerYearMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: trailerYearMessage
                        ? true
                        : false, */
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
                    /*             fourthRowReview: accountMessage, */
                    fifthRowReview: truckVinMessage,
                    sixthRowReview: truckModelYearMessage,
                    seventhRowReview: trailerVinMessage,
                    /*           eightRowReview: trailerModelMessage,
                    ninthRowReview: trailerYearMessage, */
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
            truckLicenceFiles: JSON.stringify(truckLicenceFiles),
            truckFHWAFiles: JSON.stringify(truckFHWAFiles),

            ...(hasTrailer && {
                trailerType: trailerType.name,
                trailerVin,
                trailerMake: trailerMake.name,
                trailerModel,
                trailerYear,
                trailerColor: trailerColor.name,
                trailerLength: trailerLength.name,
            }),
        });

        this.truckLicenceDocuments = truckLicenceFiles;
        this.truckFHWADocuments = truckFHWAFiles;

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
                trailerLicenceFiles: JSON.stringify(trailerLicenceFiles),
                trailerFHWAFiles: JSON.stringify(trailerFHWAFiles),
            });

            this.trailerLicenceDocuments = trailerLicenceFiles;
            this.trailerFHWADocuments = trailerFHWAFiles;

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
            }

            this.stepValues = stepValues;

            this.startFeedbackValueChangesMonitoring();
        }
    }

    public onTabChange(event: any): void {
        this.selectedTab = event.id;
        this.addRemoveCompanySpecificValidators();

        const inputsToValidate = [
            'truckType',
            'truckVin',
            'truckMake',
            'truckModel',
            'truckYear',
        ];
        const inputsSoleToValidate = [
            'soleTruckType',
            'soleTruckVin',
            'soleTruckMake',
            'soleTruckModel',
            'soleTruckYear',
        ];

        const {
            soleTruckType,
            soleTruckVin,
            soleTruckMake,
            soleTruckModel,
            soleTruckYear,
            soleTruckColor,
        } = this.ownerInfoForm.value;

        this.previousTruckValuesOnTabChange.soleTruckValues = {
            soleTruckType,
            soleTruckVin,
            soleTruckMake,
            soleTruckModel,
            soleTruckYear,
            soleTruckColor,
        };

        if (this.previousTruckValuesOnTabChange?.companyTruckValues) {
            const {
                truckType,
                truckVin,
                truckMake,
                truckModel,
                truckYear,
                truckColor,
            } = this.previousTruckValuesOnTabChange.companyTruckValues;

            this.ownerInfoForm.patchValue({
                truckType,
                truckVin,
                truckMake,
                truckModel,
                truckYear,
                truckColor,
            });
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
                    [...truckTrailerModelValidation]
                );
            } else if (i === 4) {
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

        for (let i = 0; i < inputsSoleToValidate.length; i++) {
            this.inputService.changeValidators(
                this.ownerInfoForm.get(inputsSoleToValidate[i]),
                false
            );
        }
    }

    public addRemoveCompanySpecificValidators(): void {
        if (this.selectedTab === OwnerInfoTabEnum.SOLE_PROPRIETOR) {
            const inputsToValidate = [
                'businessName',
                'ein',
                'phone',
                'email',
                'address',
                'addressUnit',
                'bank',
                'accountNumber',
                'routingNumber',
            ];

            inputsToValidate.forEach((input) => {
                this.inputService.changeValidators(
                    this.ownerInfoForm.get(input),
                    false,
                    [],
                    false
                );
            });
        } else {
            this.inputService.changeValidators(
                this.ownerInfoForm.get('businessName')
            );

            this.inputService.changeValidators(
                this.ownerInfoForm.get('ein'),
                true,
                [einNumberRegex]
            );

            this.inputService.changeValidators(
                this.ownerInfoForm.get('phone'),
                true,
                [phoneFaxRegex]
            );

            this.inputService.changeValidators(this.ownerInfoForm.get('email'));

            this.inputService.changeValidators(
                this.ownerInfoForm.get('address'),
                true,
                [...addressValidation]
            );

            this.inputService.changeValidators(
                this.ownerInfoForm.get('addressUnit'),
                true,
                [...addressUnitValidation]
            );

            this.inputService.changeValidators(
                this.ownerInfoForm.get('bank'),
                true,
                [...bankValidation]
            );

            this.inputService.changeValidators(
                this.ownerInfoForm.get('accountNumber'),
                true,
                [...accountBankValidation]
            );

            this.inputService.changeValidators(
                this.ownerInfoForm.get('routingNumber')
            );
        }
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
                    this.isBankSelected = true;

                    this.ownerInfoForm.patchValue({
                        bank: null,
                        accountNumber: null,
                        routingNumber: null,
                    });
                }

                this.onBankSelected();

                break;

            default:
                break;
        }
    }

    public handleInputSelectTruckTrailer(event: {
        inputSelectEvent: any;
        action: string;
    }): void {
        const { inputSelectEvent, action } = event;
        switch (action) {
            case InputSwitchActions.TRUCK_TYPE:
                this.selectedTruckType = inputSelectEvent;

                break;
            case InputSwitchActions.TRUCK_MAKE:
                this.selectedTruckMake = inputSelectEvent;

                break;
            case InputSwitchActions.TRUCK_COLOR:
                this.selectedTruckColor = inputSelectEvent;

                break;
            case InputSwitchActions.TRAILER_TYPE:
                this.selectedTrailerType = inputSelectEvent;

                break;
            case InputSwitchActions.TRAILER_MAKE:
                this.selectedTrailerMake = inputSelectEvent;

                break;
            case InputSwitchActions.TRAILER_COLOR:
                this.selectedTrailerColor = inputSelectEvent;

                break;
            case InputSwitchActions.TRAILER_LENGTH: {
                this.selectedTrailerLength = inputSelectEvent;

                break;
            }

            default:
                break;
        }
    }

    private onBankSelected(): void {
        this.ownerInfoForm
            .get('bank')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.isBankSelected = true;
            });
    }

    public onSaveNewBank(bank: { data: any; action: string }): void {
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

    private vinDecoder(): void {
        this.ownerInfoForm
            .get('truckVin')
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                this.skipTruckVinDecocerEdit ? skip(1) : tap()
            )
            .subscribe((value) => {
                this.skipTruckVinDecocerEdit = false;

                if (!(value?.length === 13 || value?.length === 17)) {
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

    private onAddTrailerSelected(): void {
        const inputsToValidate = [
            'trailerType',
            'trailerVin',
            'trailerMake',
            'trailerYear',
            'trailerLength',
            'trailerModel',
            'trailerLicenceFiles',
            'trailerFHWAFiles',
        ];

        if (this.isAddTrailerSelected) {
            if (this.previousTrailerValues) {
                const {
                    trailerType,
                    trailerVin,
                    trailerMake,
                    trailerModel,
                    trailerYear,
                    trailerColor,
                    trailerLength,
                    trailerLicenceFiles,
                    trailerFHWAFiles,
                } = this.previousTrailerValues;

                this.ownerInfoForm.patchValue({
                    trailerType,
                    trailerVin,
                    trailerMake,
                    trailerModel,
                    trailerYear,
                    trailerColor,
                    trailerLength,
                    trailerLicenceFiles,
                    trailerFHWAFiles,
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

                this.selectedTrailerLength = this.trailerLengthType.find(
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
            const {
                trailerType,
                trailerVin,
                trailerMake,
                trailerModel,
                trailerYear,
                trailerColor,
                trailerLength,
                trailerLicenceFiles,
                trailerFHWAFiles,
            } = this.ownerInfoForm.value;

            this.previousTrailerValues = {
                trailerType,
                trailerVin,
                trailerMake,
                trailerModel,
                trailerYear,
                trailerColor,
                trailerLength,
                trailerLicenceFiles,
                trailerFHWAFiles,
            };

            this.ownerInfoForm.patchValue({
                trailerType: null,
                trailerVin: null,
                trailerMake: null,
                trailerModel: null,
                trailerYear: null,
                trailerColor: null,
                trailerLength: null,
                trailerLicenceFiles: null,
                trailerFHWAFiles: null,
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
    }

    public getDropdownLists(): void {
        this.applicantQuery.applicantDropdownLists$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantModalResponse) => {
                this.dropdownOptions = {
                    banksDropdownList: res.banks,
                    truckType: res.truckTypes.map((item) => {
                        return {
                            ...item,
                            folder: 'common',
                            subFolder: 'trucks',
                        };
                    }),
                    truckMakeType: res.truckMakes,
                    colorType: res.colors.map((item) => {
                        return {
                            ...item,
                            folder: 'common',
                            subFolder: 'colors',
                            logoName: 'ic_color.svg',
                        };
                    }),
                    trailerType: res.trailerTypes.map((item) => {
                        return {
                            ...item,
                            folder: 'common',
                            subFolder: 'trailers',
                        };
                    }),
                    trailerMakeType: res.trailerMakes,
                    trailerLengthType: res.trailerLenghts,
                };

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
        const selectedInputsLine =
            this.selectedTab === OwnerInfoTabEnum.COMPANY
                ? this.openAnnotationArray.find(
                    (item) => item.lineIndex === lineIndex
                )
                : this.openSoleAnnotationArray.find(
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

            if (this.selectedTab === OwnerInfoTabEnum.COMPANY) {
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
                        this.ownerInfoForm
                            .get('fourthRowReview')
                            .patchValue(null);

                        break;
                    case 4:
                        this.ownerInfoForm
                            .get('fifthRowReview')
                            .patchValue(null);

                        break;
                    case 5:
                        if (!isAnyInputInLineIncorrect) {
                            this.ownerInfoForm
                                .get('sixthRowReview')
                                .patchValue(null);
                        }

                        break;
                    case 6:
                        this.ownerInfoForm
                            .get('seventhRowReview')
                            .patchValue(null);

                        break;
                    case 7:
                        this.ownerInfoForm
                            .get('eightRowReview')
                            .patchValue(null);

                        break;
                    case 8:
                        this.ownerInfoForm
                            .get('ninthRowReview')
                            .patchValue(null);

                        break;
                    default:
                        break;
                }
            }

            if (this.selectedTab === OwnerInfoTabEnum.SOLE_PROPRIETOR) {
                switch (lineIndex) {
                    case 0:
                        this.ownerInfoForm
                            .get('soleFirstRowReview')
                            .patchValue(null);

                        break;
                    case 1:
                        if (!isAnyInputInLineIncorrect) {
                            this.ownerInfoForm
                                .get('soleSecondRowReview')
                                .patchValue(null);
                        }

                        break;
                    case 2:
                        this.ownerInfoForm
                            .get('thirdRowReview')
                            .patchValue(null);

                        break;
                    case 3:
                        this.ownerInfoForm
                            .get('fourthRowReview')
                            .patchValue(null);

                        break;
                    case 4:
                        this.ownerInfoForm
                            .get('fifthRowReview')
                            .patchValue(null);

                        break;

                    default:
                        break;
                }
            }
        }

        const inputFieldsArray =
            this.selectedTab === OwnerInfoTabEnum.COMPANY
                ? JSON.stringify(
                    this.openAnnotationArray
                        .filter((item) => Object.keys(item).length !== 0)
                        .map((item) => item.lineInputs)
                )
                : JSON.stringify(
                    this.openSoleAnnotationArray
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
            if (this.selectedTab === OwnerInfoTabEnum.COMPANY) {
                this.openAnnotationArray[
                    event.lineIndex
                ].displayAnnotationButton = false;
                this.openAnnotationArray[
                    event.lineIndex
                ].displayAnnotationTextArea = true;
            }

            if (this.selectedTab === OwnerInfoTabEnum.SOLE_PROPRIETOR) {
                this.openSoleAnnotationArray[
                    event.lineIndex
                ].displayAnnotationButton = false;
                this.openSoleAnnotationArray[
                    event.lineIndex
                ].displayAnnotationTextArea = true;
            }
        } else {
            if (this.selectedTab === OwnerInfoTabEnum.COMPANY) {
                this.openAnnotationArray[
                    event.lineIndex
                ].displayAnnotationButton = true;
                this.openAnnotationArray[
                    event.lineIndex
                ].displayAnnotationTextArea = false;
            }

            if (this.selectedTab === OwnerInfoTabEnum.SOLE_PROPRIETOR) {
                this.openSoleAnnotationArray[
                    event.lineIndex
                ].displayAnnotationButton = true;
                this.openSoleAnnotationArray[
                    event.lineIndex
                ].displayAnnotationTextArea = false;
            }
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

                                if (keyName === 'traileryear') {
                                    o['traileryear'] =
                                        +updatedFormValues.trailerYear;
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
        if (event.action === StepAction.NEXT_STEP) {
            if (this.selectedMode !== SelectedMode.REVIEW) {
                this.onSubmit();
            }

            if (this.selectedMode === SelectedMode.REVIEW) {
                this.onSubmitReview();
            }
        }

        if (event.action === StepAction.BACK_STEP) {
            this.router.navigate([`/application/${this.applicantId}/11`]);
        }
    }

    public onSubmit(): void {
        if (this.ownerInfoForm.invalid) {
            this.inputService.markInvalid(this.ownerInfoForm);

            if (!this.truckLicenceDocuments.length) {
                this.truckLicenceDisplayDocumentsRequiredNote = true;
            }

            if (!this.truckFHWADocuments.length) {
                this.truckFHWADisplayDocumentsRequiredNote = true;
            }

            if (!this.trailerLicenceDocuments.length) {
                this.trailerLicenceDisplayDocumentsRequiredNote = true;
            }

            if (!this.trailerFHWADocuments.length) {
                this.trailerFHWADisplayDocumentsRequiredNote = true;
            }
            return;
        }

        const {
            address,
            addressUnit,
            bank,
            businessName,
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
            ein,
            phone,
            email,
            accountNumber,
            routingNumber,
            ...ownerInfoForm
        } = this.ownerInfoForm.value;

        const selectedAddress = {
            ...this.selectedAddress,
            addressUnit,
        };

        let truckLicenceDocuments = [];
        this.truckLicenceDocuments.map((item) => {
            if (item.realFile) {
                truckLicenceDocuments.push(item.realFile);
            }
        });

        let truckFHWADocuments = [];
        this.truckFHWADocuments.map((item) => {
            if (item.realFile) {
                truckFHWADocuments.push(item.realFile);
            }
        });

        let trailerLicenceDocuments = [];
        this.trailerLicenceDocuments.map((item) => {
            if (item.realFile) {
                trailerLicenceDocuments.push(item.realFile);
            }
        });

        let trailerFHWADocuments = [];
        this.trailerFHWADocuments.map((item) => {
            if (item.realFile) {
                trailerFHWADocuments.push(item.realFile);
            }
        });
        const saveData = {
            ...ownerInfoForm,
            ...(this.selectedTab === OwnerInfoTabEnum.COMPANY && {
                businessName,
                address: selectedAddress,
                ein,
                phone,
                email,
                bankId: this.selectedBank ? this.selectedBank.id : null,
                accountNumber,
                routingNumber,
            }),
            ownerType:
                this.selectedTab === OwnerInfoTabEnum.COMPANY
                    ? OwnerType.Company
                    : OwnerType.Proprietor,
            applicantId: this.applicantId,
            truckTypeId: this.truckType.find((item) => item.name === truckType)
                .id,
            truckMakeId: this.truckMakeType.find(
                (item) => item.name === truckMake
            ).id,
            truckYear: +truckYear,
            truckColorId: truckColor
                ? this.colorType.find((item) => item.name === truckColor).id
                : null,
            hasTrailer: this.isAddTrailerSelected,
            trailerTypeId: this.isAddTrailerSelected
                ? this.trailerType.find((item) => item.name === trailerType).id
                : null,
            trailerLengthId: this.isAddTrailerSelected
                ? this.trailerLengthType.find(
                    (item) => item.name === trailerLength
                ).id
                : null,
            trailerVin: this.isAddTrailerSelected ? trailerVin : null,
            trailerMakeId: this.isAddTrailerSelected
                ? this.trailerMakeType.find((item) => item.name === trailerMake)
                    .id
                : null,
            trailerModel: this.isAddTrailerSelected ? trailerModel : null,
            trailerYear: this.isAddTrailerSelected ? +trailerYear : null,
            trailerColorId: this.isAddTrailerSelected
                ? this.colorType.find((item) => item.name === trailerColor).id
                : null,
            truckLicenceFiles: truckLicenceDocuments,
            truckFHWAFiles: truckFHWADocuments,
            trailerLicenceFiles: this.isAddTrailerSelected
                ? trailerLicenceDocuments
                : null,
            trailerFHWAFiles: this.isAddTrailerSelected
                ? trailerFHWADocuments
                : null,
            ...((this.stepHasValues ||
                this.selectedMode === SelectedMode.FEEDBACK) && {
                id: this.ownerInfoCompanyId,
                truckLicenceFilesForDeleteIds:
                    this.truckLicenceDocumentsForDeleteIds,
                truckFHWAFilesForDeleteIds: this.truckFHWADocumentsForDeleteIds,
                trailerLicenceFilesForDeleteIds:
                    this.trailerLicenceDocumentsForDeleteIds,
                trailerFHWAFilesForDeleteIds:
                    this.trailerFHWADocumentsForDeleteIds,
            }),
        };

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
            /*   accountMessage: fourthRowReview, */
            isTruckVinValid: !this.openAnnotationArray[4].lineInputs[0],
            truckVinMessage: fifthRowReview,
            isTruckModelValid: !this.openAnnotationArray[5].lineInputs[0],
            isTruckYearValid: !this.openAnnotationArray[5].lineInputs[1],
            truckModelYearMessage: sixthRowReview,
            isTrailerVinValid: !this.openAnnotationArray[6].lineInputs[0],
            trailerVinMessage: seventhRowReview,
            isTrailerModelValid: !this.openAnnotationArray[7].lineInputs[0],
            /*           trailerModelMessage: eightRowReview, */
            isTrailerYearValid: !this.openAnnotationArray[8].lineInputs[0],
            /*      trailerYearMessage: ninthRowReview, */
        };

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

    public onFilesAction(fileActionEvent: FileEvent & { type: string }): void {
        switch (fileActionEvent.type) {
            case OwnerInfoFileType.TRUCK_LICENCE:
                this.onFileActionControl(
                    fileActionEvent,
                    OwnerInfoStringEnum.TRUCK_LICENCE_FILES
                );

                this.truckLicenceDocuments = fileActionEvent.files;

                this.truckLicenceDisplayDocumentsRequiredNote = false;
                break;
            case OwnerInfoFileType.TRUCK_FHWA:
                this.onFileActionControl(
                    fileActionEvent,
                    OwnerInfoStringEnum.TRUCK_FHWA_FILES
                );

                this.truckFHWADocuments = fileActionEvent.files;

                this.truckFHWADisplayDocumentsRequiredNote = false;
                break;
            case OwnerInfoFileType.TRAILER_LICENCE:
                this.onFileActionControl(
                    fileActionEvent,
                    OwnerInfoStringEnum.TRAILER_LICENCE_FILES
                );

                this.trailerLicenceDocuments = fileActionEvent.files;

                this.trailerLicenceDisplayDocumentsRequiredNote = false;
                break;
            case OwnerInfoFileType.TRAILER_FHWA:
                this.onFileActionControl(
                    fileActionEvent,
                    OwnerInfoStringEnum.TRAILER_FHWA_FILES
                );

                this.trailerFHWADocuments = fileActionEvent.files;

                this.trailerFHWADisplayDocumentsRequiredNote = false;
                break;

            default:
                break;
        }
    }

    public onFileActionControl(
        fileActionEvent: FileEvent,
        formControlName: string
    ): void {
        switch (fileActionEvent.action) {
            case FilesActions.ADD:
                this.ownerInfoForm
                    .get(formControlName)
                    .patchValue(JSON.stringify(fileActionEvent.files));

                break;
            case FilesActions.DELETE:
                this.ownerInfoForm
                    .get(formControlName)
                    .patchValue(
                        fileActionEvent.files.length
                            ? JSON.stringify(fileActionEvent.files)
                            : null
                    );

                switch (fileActionEvent.type) {
                    case OwnerInfoFileType.TRUCK_LICENCE:
                        this.truckLicenceDocumentsForDeleteIds = [
                            ...this.truckLicenceDocumentsForDeleteIds,
                            fileActionEvent.deleteId,
                        ];
                        break;
                    case OwnerInfoFileType.TRUCK_FHWA:
                        this.truckFHWADocumentsForDeleteIds = [
                            ...this.truckFHWADocumentsForDeleteIds,
                            fileActionEvent.deleteId,
                        ];
                        break;
                    case OwnerInfoFileType.TRAILER_LICENCE:
                        this.trailerLicenceDocumentsForDeleteIds = [
                            ...this.trailerLicenceDocumentsForDeleteIds,
                            fileActionEvent.deleteId,
                        ];
                        break;
                    case OwnerInfoFileType.TRAILER_FHWA:
                        this.trailerFHWADocumentsForDeleteIds = [
                            ...this.trailerFHWADocumentsForDeleteIds,
                            fileActionEvent.deleteId,
                        ];
                        break;

                    default:
                        break;
                }

                break;
            case FilesActions.MARK_INCORRECT:
                if (this.selectedMode === SelectedMode.REVIEW) {
                    this.incorrectInput(true, fileActionEvent.index, 1);
                }

                break;
            case FilesActions.MARK_CORRECT:
                if (this.selectedMode === SelectedMode.REVIEW) {
                    this.incorrectInput(false, fileActionEvent.index, 1);
                }

                break;

            default:
                break;
        }
    }

    public toggleAddTrailer(): void {
        this.isAddTrailerSelected = !this.isAddTrailerSelected;
        this.onAddTrailerSelected();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
