/* eslint-disable no-unused-vars */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { skip, Subject, takeUntil, tap } from 'rxjs';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

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

    public selectedMode: string = SelectedMode.APPLICANT;

    public isValidLoad: boolean;

    public applicantId: number;
    public queryParamId: number | string | null = null;

    public ownerInfoForm: FormGroup;

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
            lineInputs: [false],
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
    ];
    public hasIncorrectFields: boolean = false;

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

                    /* if (res.trafficViolation) {
                    this.patchStepValues(res.trafficViolation);

                    this.stepHasValues = true;
                } */
                } else {
                    console.log('NIJE');
                    this.isValidLoad = false;

                    this.router.navigate(['/auth']);
                }
                this.applicantId = res.id;
            });
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
            .subscribe((res: any /* ApplicantModalResponse */) => {
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
                    this.ownerInfoForm.get('sixthRowReview').patchValue(null);

                    break;
                case 6:
                    this.ownerInfoForm.get('seventhRowReview').patchValue(null);

                    break;
                case 7:
                    this.ownerInfoForm.get('eightRowReview').patchValue(null);

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

        const saveData: any = {
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
            truckColorId: this.colorType.find(
                (item) => item.name === truckColor
            ).id,
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
    }

    public onSubmitReview(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
