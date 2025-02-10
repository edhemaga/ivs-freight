import {
    Component,
    OnInit,
    OnDestroy,
    ViewChildren,
    QueryList,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    UntypedFormArray,
    AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    isAnyValueInArrayTrue,
    isFormValueNotEqual,
    isAnyValueInArrayFalse,
    filterUnceckedRadiosId,
} from '@pages/applicant/utils/helpers/applicant.helper';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { ApplicantApplicationConstants } from '@pages/applicant/pages/applicant-application/utils/constants/applicant-application.constants';

// validations
import {
    phoneFaxRegex,
    ssnNumberRegex,
    accountBankValidation,
    routingBankValidation,
    firstNameValidation,
    bankValidation,
    lastNameValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// services
import { ApplicantService } from '@pages/applicant/services/applicant.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { BankVerificationService } from '@shared/services/bank-verification.service';

// store
import { ApplicantStore } from '@pages/applicant/state/applicant.store';
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import { InputSwitchActions } from '@pages/applicant/enums/input-switch-actions.enum';
import { ApplicantApplicationStringEnum } from '@pages/applicant/pages/applicant-application/enums/applicant-application-string.enum';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';
import { EFileFormControls, EGeneralActions } from '@shared/enums';

// models
import {
    BankResponse,
    AddressEntity,
    CreateResponse,
    PersonalInfoFeedbackResponse,
    ApplicantResponse,
    ApplicantModalResponse,
    ApplicantPreviousAddressResponse,
    ApplicantPersonalInfoReviewResponse,
} from 'appcoretruckassist/model/models';
import { AnswerChoices } from '@pages/applicant/pages/applicant-application/models/answer-choices.model';
import { AnnotationItem } from '@pages/applicant/pages/applicant-application/models/annotation-item.model';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// components
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputRadiobuttonsComponent } from '@shared/components/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { ApplicantNextBackBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-next-back-btn/applicant-next-back-btn.component';

// modules
import { SharedModule } from '@shared/shared.module';
import { ApplicantModule } from '@pages/applicant/applicant.module';

// config
import { Step1Config } from '@pages/applicant/pages/applicant-application/components/step1/configs/step1.config';

@Component({
    selector: 'app-step1',
    templateUrl: './step1.component.html',
    styleUrls: ['./step1.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,

        // components
        TaUploadFilesComponent,
        TaInputAddressDropdownComponent,
        TaCheckboxComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaCounterComponent,
        TaCustomCardComponent,
        TaModalTableComponent,
        TaInputRadiobuttonsComponent,
        ApplicantNextBackBtnComponent,
    ],
})
export class Step1Component implements OnInit, OnDestroy, AfterViewInit {
    @ViewChildren('cmp') components: QueryList<any>;

    private destroy$ = new Subject<void>();

    public selectedMode: string;

    public personalInfoRadios: any;
    public displayRadioRequiredNoteArray =
        ApplicantApplicationConstants.displayRadioRequiredNoteArray;
    public questions = ApplicantApplicationConstants.questions;
    public openAnnotationArray =
        ApplicantApplicationConstants.openAnnotationArray;
    public subscription: Subscription;

    public stepValues: any;
    public stepHasValues: boolean = false;
    public stepHasReviewValues: boolean = false;

    public companyName: string;

    public applicantId: number;
    public personalInfoId: number | null = null;
    public previousAddressesId: number[];
    public previousAddressesReviewId: number[] = [];

    public personalInfoForm: UntypedFormGroup;

    public selectedBank: any = null;
    public selectedAddresses: AddressEntity[] | any = [];

    public banksDropdownList: BankResponse[] = [];

    public isBankSelected: boolean = false;
    public isLastAddedPreviousAddressValid: boolean = false;
    public isLastInputDeleted: boolean = false;
    public isEditingMiddlePositionAddress: boolean = false;

    public isEditingArray: {
        id: number;
        isEditing: boolean;
        isEditingAddress: boolean;
        isFirstAddress: boolean;
    }[] = [];
    public isEditingId: number = -1;

    public helperIndex: number = 2;

    public previousAddressOnEdit: string;
    public previousAddressUnitOnEdit: string;

    public documents: any[] = [];
    public documentsForDeleteIds: number[] = [];
    public displayDocumentsRequiredNote: boolean = false;

    public cardReviewIndex: number = 0;
    public hasIncorrectFields: boolean = false;

    public stepFeedbackValues: any;
    public isFeedbackValueUpdated: boolean = false;

    public previousAddressesItems = [];
    public isPreviousAddressesRowCreated: boolean = false;
    public isEachPreviousAddressesRowValid: boolean = true;
    public updatedPreviousAddressesItems = [];

    // enums
    public modalTableTypeEnum = ModalTableTypeEnum;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private router: Router,
        private inputService: TaInputService,
        private applicantActionsService: ApplicantService,
        private bankVerificationService: BankVerificationService,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,

        // change detector
        private changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.initMode();

        this.createForm();

        this.getStepValuesFromStore();

        this.getDropdownLists();
    }

    ngAfterViewInit(): void {
        this.personalInfoRadios = this.components.toArray();
    }

    public get previousAddresses(): UntypedFormArray {
        return this.personalInfoForm.get(
            'previousAddresses'
        ) as UntypedFormArray;
    }

    get firstNameInputConfig(): ITaInput {
        return Step1Config.getFirstNameInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get lastNameInputConfig(): ITaInput {
        return Step1Config.getLastNameInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get dateOfBirthInputConfig(): ITaInput {
        return Step1Config.getDateOfBirthInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get ssnInputConfig(): ITaInput {
        return Step1Config.getSsnInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get phoneInputConfig(): ITaInput {
        return Step1Config.getPhoneInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get emailInputConfig(): ITaInput {
        return Step1Config.getEmailInputConfig();
    }

    get bankIdInputConfig(): ITaInput {
        return Step1Config.getBankIdInputConfig({
            selectedMode: this.selectedMode,
        });
    }

    get accountNumberInputConfig(): ITaInput {
        return Step1Config.getAccountNumberInputConfig({
            selectedMode: this.selectedMode,
            isBankSelected: this.isBankSelected,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get routingNumberInputConfig(): ITaInput {
        return Step1Config.getRoutingNumberInputConfig({
            selectedMode: this.selectedMode,
            isBankSelected: this.isBankSelected,
        });
    }

    public trackByIdentity = (index: number, _: any): number => index;

    private createForm(): void {
        this.personalInfoForm = this.formBuilder.group({
            isAgreement: [false, Validators.requiredTrue],
            firstName: [null, [Validators.required, ...firstNameValidation]],
            lastName: [null, [Validators.required, ...lastNameValidation]],
            dateOfBirth: [null, Validators.required],
            ssn: [null, [Validators.required, ssnNumberRegex]],
            phone: [null, [Validators.required, phoneFaxRegex]],
            email: [null, Validators.required],
            previousAddresses: [null, Validators.required],

            bankId: [null, [...bankValidation]],
            accountNumber: [null, accountBankValidation],
            routingNumber: [null, routingBankValidation],
            usCitizen: [null, Validators.required],
            usCitizenExplain: [null],
            legalWork: [null, Validators.required],
            legalWorkExplain: [null],
            anotherName: [null, Validators.required],
            inMilitary: [null, Validators.required],
            felony: [null, Validators.required],
            misdemeanor: [null, Validators.required],
            drunkDriving: [null, Validators.required],
            anotherNameExplain: [null],
            inMilitaryExplain: [null],
            felonyExplain: [null],
            misdemeanorExplain: [null],
            drunkDrivingExplain: [null],
            files: [null, Validators.required],

            firstRowReview: [null],
            secondRowReview: [null],
            thirdRowReview: [null],
            fourthRowReview: [null],

            questionReview1: [null],
            questionReview2: [null],
            questionReview3: [null],
            questionReview4: [null],
            questionReview5: [null],
            questionReview6: [null],
            questionReview7: [null],
        });
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
                this.companyName = res.companyInfo.name;

                this.applicantId = res.id;

                if (res.personalInfo) {
                    this.patchStepValues(res.personalInfo);
                }
            });
    }

    public patchStepValues(stepValues: PersonalInfoFeedbackResponse): void {
        if (!stepValues) return;

        const {
            isAgreed,
            firstName,
            lastName,
            doB,
            ssn,
            phone,
            bank,
            bankName,
            accountNumber,
            routingNumber,
            usCitizen,
            legalWork,
            anotherName,
            inMilitary,
            felony,
            misdemeanor,
            drunkDriving,
            anotherNameDescription,
            inMilitaryDescription,
            felonyDescription,
            misdemeanorDescription,
            drunkDrivingDescription,
            previousAddresses,
            address,
            personalInfoReview,
            email,
            files,
        } = stepValues;

        this.personalInfoForm.patchValue({
            [ApplicantApplicationStringEnum.IsAgreement]: isAgreed,
            [ApplicantApplicationStringEnum.FirstName]: firstName,
            [ApplicantApplicationStringEnum.LastName]: lastName,
            [ApplicantApplicationStringEnum.Email]: email,
            [ApplicantApplicationStringEnum.DateOfBirth]: doB
                ? MethodsCalculationsHelper.convertDateFromBackend(doB)
                : null,
            [ApplicantApplicationStringEnum.SSN]: ssn,
            [ApplicantApplicationStringEnum.Phone]: phone,
            [ApplicantApplicationStringEnum.BankId]: bankName || null,
            [ApplicantApplicationStringEnum.AccountNumber]: accountNumber,
            [ApplicantApplicationStringEnum.RoutingNumber]: routingNumber,
            [ApplicantApplicationStringEnum.UsCitizen]: usCitizen,
            [ApplicantApplicationStringEnum.LegalWork]: legalWork,
            [ApplicantApplicationStringEnum.AnotherName]: anotherName,
            [ApplicantApplicationStringEnum.InMilitary]: inMilitary,
            [ApplicantApplicationStringEnum.Felony]: felony,
            [ApplicantApplicationStringEnum.Misdemeanor]: misdemeanor,
            [ApplicantApplicationStringEnum.DrunkDriving]: drunkDriving,
            [ApplicantApplicationStringEnum.AnotherNameExplain]:
                anotherNameDescription,
            [ApplicantApplicationStringEnum.InMilitaryExplain]:
                inMilitaryDescription,
            [ApplicantApplicationStringEnum.FelonyExplain]: felonyDescription,
            [ApplicantApplicationStringEnum.MisdemeanorExplain]:
                misdemeanorDescription,
            [ApplicantApplicationStringEnum.DrunkDrivingExplain]:
                drunkDrivingDescription,
            [ApplicantApplicationStringEnum.Files]: JSON.stringify(files),
        });

        this.stepValues = stepValues;
        this.stepHasValues = !!ssn;

        this.documents = files;

        if (ssn) {
            this.selectedBank = this.banksDropdownList.find(
                (item) => item.id === (bank ? bank.id : null)
            );
        }

        setTimeout(() => {
            this.updateRadioButtons();
        }, 1);

        this.updatePreviousAddresses(
            previousAddresses,
            address,
            personalInfoReview
        );
        this.updateReviewValues(personalInfoReview);
        // this.updateFeedbackValues(personalInfoReview, previousAddresses);
    }

    private updateRadioButtons(): void {
        const radioButtons = [
            { controlName: ApplicantApplicationStringEnum.UsCitizen, index: 0 },
            { controlName: ApplicantApplicationStringEnum.LegalWork, index: 1 },
            {
                controlName: ApplicantApplicationStringEnum.AnotherName,
                index: 2,
                explainField: ApplicantApplicationStringEnum.AnotherNameExplain,
            },
            {
                controlName: ApplicantApplicationStringEnum.InMilitary,
                index: 3,
                explainField: ApplicantApplicationStringEnum.InMilitaryExplain,
            },
            {
                controlName: ApplicantApplicationStringEnum.Felony,
                index: 4,
                explainField: ApplicantApplicationStringEnum.FelonyExplain,
            },
            {
                controlName: ApplicantApplicationStringEnum.Misdemeanor,
                index: 5,
                explainField: ApplicantApplicationStringEnum.MisdemeanorExplain,
            },
            {
                controlName: ApplicantApplicationStringEnum.DrunkDriving,
                index: 6,
                explainField:
                    ApplicantApplicationStringEnum.DrunkDrivingExplain,
            },
        ];

        const isAgreementValue = this.personalInfoForm.get(
            ApplicantApplicationStringEnum.IsAgreement
        )?.value;

        if (isAgreementValue) {
            radioButtons.forEach(({ controlName, index, explainField }) => {
                const value =
                    this.personalInfoForm.get(controlName)?.value ?? null;

                this.setRadioButtonsCheckedValue(
                    value,
                    this.personalInfoRadios[index],
                    explainField
                );
            });
        }
    }

    private setRadioButtonsCheckedValue(
        value: boolean,
        radioGroup: { buttons: { checked: boolean }[] },
        explainField?: string
    ): void {
        const [radioButtonTrue, radioButtonFalse] = radioGroup.buttons;

        radioButtonTrue.checked = value === true;
        radioButtonFalse.checked = value === false;

        if (explainField) {
            this.inputService.changeValidators(
                this.personalInfoForm.get(explainField),
                value
            );
        }
    }

    private updatePreviousAddresses(
        previousAddresses: ApplicantPreviousAddressResponse[],
        address: AddressEntity,
        personalInfoReview: ApplicantPersonalInfoReviewResponse
    ): void {
        const mappedPreviousAddresses = previousAddresses.map(
            (item) => item.address
        );
        this.updatedPreviousAddressesItems[0] = address;
        this.updatedPreviousAddressesItems =
            this.updatedPreviousAddressesItems.concat(mappedPreviousAddresses);
        this.updatedPreviousAddressesItems =
            this.updatedPreviousAddressesItems.map((item) => {
                return {
                    address: item,
                    addressUnit: item.addressUnit,
                };
            });
        if (!previousAddresses) return;

        this.previousAddressesId = previousAddresses.map((item) => item.id);
        const addresses = [...previousAddresses.map((p) => p.address), address];
        this.selectedAddresses = addresses;
    }

    private getReviewMessage(
        index: number,
        personalInfoReview: ApplicantPersonalInfoReviewResponse
    ): string | null {
        if (!personalInfoReview) return null;
        const reviewFieldKeys = {
            0: ApplicantApplicationStringEnum.FirstName,
            1: ApplicantApplicationStringEnum.Phone,
            2: ApplicantApplicationStringEnum.SSN,
            3: ApplicantApplicationStringEnum.AccountNumber,
            4: ApplicantApplicationStringEnum.AnotherName,
            5: ApplicantApplicationStringEnum.InMilitary,
            6: ApplicantApplicationStringEnum.Felony,
            7: ApplicantApplicationStringEnum.Misdemeanor,
            8: ApplicantApplicationStringEnum.DrunkDriving,
        };

        return personalInfoReview[`${reviewFieldKeys[index]}Message`] || null;
    }

    private updateReviewValues(
        personalInfoReview: ApplicantPersonalInfoReviewResponse
    ): void {
        if (!personalInfoReview) return;

        const reviewFieldKeys = [
            ApplicantApplicationStringEnum.FirstName,
            ApplicantApplicationStringEnum.Phone,
            ApplicantApplicationStringEnum.SSN,
            ApplicantApplicationStringEnum.AccountNumber,
            ApplicantApplicationStringEnum.AnotherName,
            ApplicantApplicationStringEnum.InMilitary,
            ApplicantApplicationStringEnum.Felony,
            ApplicantApplicationStringEnum.Misdemeanor,
            ApplicantApplicationStringEnum.DrunkDriving,
        ];

        reviewFieldKeys.forEach((fieldEnum, index) => {
            this.personalInfoForm.patchValue({
                [`firstRowReview`]: personalInfoReview[`${fieldEnum}Message`],
                [`secondRowReview`]: personalInfoReview[`${fieldEnum}Message`],
                [`thirdRowReview`]: personalInfoReview[`${fieldEnum}Message`],
                [`fourthRowReview`]: personalInfoReview[`${fieldEnum}Message`],
                [`questionReview${index + 3}`]:
                    personalInfoReview[`${fieldEnum}Message`],
            });
        });

        this.updateOpenAnnotationArray(personalInfoReview);
    }

    private updateOpenAnnotationArray(
        personalInfoReview: ApplicantPersonalInfoReviewResponse
    ): void {
        if (!personalInfoReview) return;

        const annotationFields = this.questions.map((question, index) => ({
            index,
            keys: [question.formControlName],
        }));

        annotationFields.forEach(({ index, keys }) => {
            const lineInputs = keys.map((key) => !personalInfoReview[key]);
            const displayAnnotationButton =
                lineInputs.includes(true) &&
                !personalInfoReview[`${keys[0]}Message`];
            const displayAnnotationTextArea =
                personalInfoReview[`${keys[0]}Message`];

            this.openAnnotationArray[index] = {
                lineIndex: index,
                lineInputs,
                displayAnnotationButton,
                displayAnnotationTextArea,
            };
        });

        this.hasIncorrectFields = this.openAnnotationArray.some((item) =>
            item.lineInputs.includes(true)
        );
    }

    private updateFeedbackValues(
        personalInfoReview: ApplicantPersonalInfoReviewResponse,
        previousAddresses: ApplicantPreviousAddressResponse[]
    ): void {
        if (personalInfoReview) {
            this.stepFeedbackValues = {
                ...this.stepFeedbackValues,
                ...personalInfoReview,
            };
        }

        if (previousAddresses) {
            const previousAddressesReview = previousAddresses.map(
                (item, index) => ({
                    ...item.previousAddressReview,
                    address: previousAddresses[index].address.address,
                    addressUnit: previousAddresses[index].address.addressUnit,
                })
            );

            this.stepFeedbackValues = {
                ...this.stepFeedbackValues,
                previousAddressesReview,
            };
        }

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.startFeedbackValueChangesMonitoring();
        }
    }

    public handleInputSelect(event: any, action: string, index?: number): void {
        switch (action) {
            case InputSwitchActions.BANK:
                this.handleBankSelection(event);
                break;
            case InputSwitchActions.ANSWER_CHOICE:
                this.handleAnswerChoice(event);
                break;
            case InputSwitchActions.PREVIOUS_ADDRESS:
                this.handlePreviousAddress(event, index);
                break;
            default:
                break;
        }
    }

    private handleBankSelection(event: BankResponse): void {
        this.selectedBank = event;
        this.isBankSelected = !!event;

        if (!this.isBankSelected) {
            this.resetBankFormValues();
        }

        this.onBankSelected();
    }

    private resetBankFormValues(): void {
        this.personalInfoForm.patchValue({
            bankId: null,
            accountNumber: null,
            routingNumber: null,
        });
    }

    private handleAnswerChoice(event: AnswerChoices[]): void {
        const selectedCheckbox = event.find(
            (radio: { checked: boolean }) => radio.checked
        );

        const selectedQuestion = this.questions[selectedCheckbox.index];

        const selectedFormControlName = selectedQuestion.formControlName;
        const selectedExplainFormControlName =
            selectedQuestion.formControlNameExplain;

        const isYes = selectedCheckbox.label === 'YES';

        this.personalInfoForm.get(selectedFormControlName).patchValue(isYes);

        this.inputService.changeValidators(
            this.personalInfoForm.get(selectedExplainFormControlName),
            isYes
        );

        if (selectedCheckbox.index === 0 || selectedCheckbox.index === 1) {
            this.inputService.changeValidators(
                this.personalInfoForm.get(selectedExplainFormControlName),
                false
            );
        }

        this.displayRadioRequiredNoteArray[
            selectedCheckbox.index
        ].displayRadioRequiredNote = false;
    }

    private handlePreviousAddress(
        event: { address: AddressEntity; valid: boolean },
        index?: number
    ): void {
        const { address, valid } = event;
        this.isLastAddedPreviousAddressValid = valid;

        if (!valid) {
            this.previousAddresses.at(index).setErrors({ invalid: true });
        } else {
            this.selectedAddresses[index] = address;

            this.previousAddresses.at(index).patchValue({
                address: address.address,
            });
        }
    }

    private onBankSelected() {
        this.personalInfoForm
            .get('bankId')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                const timeout = setTimeout(async () => {
                    this.isBankSelected =
                        await this.bankVerificationService.onSelectBank(
                            this.selectedBank ? this.selectedBank.name : null,
                            this.personalInfoForm.get('routingNumber'),
                            this.personalInfoForm.get('accountNumber')
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

    public onFilesAction(fileActionEvent: {
        files: File[];
        action: EGeneralActions.ADD | EGeneralActions.DELETE;
        deleteId?: number;
    }): void {
        this.documents = fileActionEvent.files;

        this.displayDocumentsRequiredNote = false;

        switch (fileActionEvent.action) {
            case EGeneralActions.ADD:
                this.personalInfoForm
                    .get(EFileFormControls.FILES)
                    .patchValue(JSON.stringify(fileActionEvent.files));
                break;
            case EGeneralActions.DELETE:
                this.personalInfoForm
                    .get(EFileFormControls.FILES)
                    .patchValue(
                        fileActionEvent.files.length
                            ? JSON.stringify(fileActionEvent.files)
                            : null
                    );

                this.documentsForDeleteIds = [
                    ...this.documentsForDeleteIds,
                    fileActionEvent.deleteId,
                ];
                break;

            default:
                break;
        }
    }

    public getDropdownLists(): void {
        this.applicantQuery.applicantDropdownLists$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantModalResponse) => {
                this.banksDropdownList = res.banks;
            });
    }

    public incorrectInput(
        event: any,
        inputIndex: number,
        lineIndex: number,
        type?: string
    ): void {
        const selectedInputsLine = this.openAnnotationArray.find(
            (item) => item.lineIndex === lineIndex
        );

        if (type === 'card') {
            this.handleCardInput(selectedInputsLine, inputIndex);
        } else {
            this.handleRegularInput(
                selectedInputsLine,
                event,
                inputIndex,
                lineIndex
            );
        }

        this.updateHasIncorrectFields();
    }

    private handleCardInput(
        selectedInputsLine: AnnotationItem,
        inputIndex: number
    ): void {
        selectedInputsLine.lineInputs[inputIndex] =
            !selectedInputsLine.lineInputs[inputIndex];
        selectedInputsLine.displayAnnotationButton =
            !selectedInputsLine.displayAnnotationButton;

        if (selectedInputsLine.displayAnnotationTextArea) {
            selectedInputsLine.displayAnnotationButton = false;
            selectedInputsLine.displayAnnotationTextArea = false;
        }

        this.updateCardReview(selectedInputsLine, 'card', event);
    }

    private handleRegularInput(
        selectedInputsLine: AnnotationItem,
        event: any,
        inputIndex: number,
        lineIndex: number
    ): void {
        if (event) {
            selectedInputsLine.lineInputs[inputIndex] = true;

            if (!selectedInputsLine.displayAnnotationTextArea) {
                selectedInputsLine.displayAnnotationButton = true;
                selectedInputsLine.displayAnnotationTextArea = false;
            }
        } else {
            selectedInputsLine.lineInputs[inputIndex] = false;

            const isAnyInputInLineIncorrect = anyInputInLineIncorrect(
                selectedInputsLine.lineInputs
            );

            if (!isAnyInputInLineIncorrect) {
                this.resetReview(lineIndex);
            }
        }

        this.updateCardReview(selectedInputsLine, 'card', event);
    }

    private resetReview(lineIndex: number): void {
        const reviewControl = this.getReviewControlByLineIndex(lineIndex);
        if (reviewControl) {
            reviewControl.patchValue(null);
        }
    }

    private getReviewControlByLineIndex(
        lineIndex: number
    ): AbstractControl | null {
        const controlName = this.getReviewControlNameByLineIndex(lineIndex);
        return controlName ? this.personalInfoForm.get(controlName) : null;
    }

    private getReviewControlNameByLineIndex(lineIndex: number): string | null {
        switch (lineIndex) {
            case 0:
                return 'firstRowReview';
            case 1:
                return 'secondRowReview';
            case 7:
                return 'thirdRowReview';
            case 8:
                return 'fourthRowReview';
            case 11:
                return 'questionReview3';
            case 12:
                return 'questionReview4';
            case 13:
                return 'questionReview5';
            case 14:
                return 'questionReview6';
            case 15:
                return 'questionReview7';
            default:
                return null;
        }
    }

    private updateCardReview(
        selectedInputsLine: any,
        type: string,
        event?: any
    ): void {
        if (type === 'card' || !event) {
            const isAnyInputInLineIncorrect = anyInputInLineIncorrect(
                selectedInputsLine.lineInputs
            );
            const cardReviewControl = this.getCardReviewControlByLineIndex(
                selectedInputsLine.lineIndex
            );

            if (cardReviewControl && !isAnyInputInLineIncorrect) {
                cardReviewControl.patchValue(null);
            }
        }
    }

    private getCardReviewControlByLineIndex(
        lineIndex: number
    ): AbstractControl | null {
        const index = lineIndex - 2;
        return this.previousAddresses.at(index)?.get(`cardReview${index + 1}`);
    }

    private updateHasIncorrectFields(): void {
        const hasIncorrectFields = this.openAnnotationArray.some((item) =>
            item.lineInputs.some((input) => input)
        );
        this.hasIncorrectFields = hasIncorrectFields;
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
                if (this.stepFeedbackValues[key] === false) {
                    o[key] = this.stepFeedbackValues[key];
                }
                return o;
            }, {});

            const previousAddressesHasIncorrectValue = isAnyValueInArrayFalse(
                this.stepFeedbackValues.previousAddressesReview.map(
                    (item) => item.isPreviousAddressValid
                )
            );

            const hasIncorrectValues = Object.keys(
                filteredIncorrectValues
            ).length;

            if (hasIncorrectValues || previousAddressesHasIncorrectValue) {
                this.subscription = this.personalInfoForm.valueChanges
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

                            if (keyName === 'dob') {
                                o['dob'] =
                                    MethodsCalculationsHelper.convertDateFromBackend(
                                        o['dob']
                                    );
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

                            if (keyName === 'anothername') {
                                o['anothername'] =
                                    this.stepValues.anotherNameExplain;
                            }

                            if (keyName === 'inmilitary') {
                                o['inmilitary'] =
                                    this.stepValues.inMilitaryExplain;
                            }

                            if (keyName === 'felony') {
                                o['felony'] = this.stepValues.felonyExplain;
                            }

                            if (keyName === 'misdemeanor') {
                                o['misdemeanor'] =
                                    this.stepValues.misdemeanorExplain;
                            }

                            if (keyName === 'drunkdriving') {
                                o['drunkdriving'] =
                                    this.stepValues.drunkDrivingExplain;
                            }

                            return o;
                        }, {});

                        const filteredUpdatedFieldsWithIncorrectValues =
                            Object.keys(
                                filteredFieldsWithIncorrectValues
                            ).reduce((updatedFields, key) => {
                                const fieldName = key;

                                const match = Object.keys(this.stepValues)
                                    .filter((item) =>
                                        item.toLowerCase().includes(fieldName)
                                    )
                                    .pop();

                                updatedFields[fieldName] =
                                    updatedFormValues[match];

                                if (fieldName === 'dob') {
                                    updatedFields['dob'] =
                                        updatedFormValues.dateOfBirth;
                                }

                                if (fieldName === 'address') {
                                    updatedFields['address'] = JSON.stringify({
                                        address:
                                            updatedFormValues.previousAddresses[
                                                updatedFormValues
                                                    .previousAddresses.length -
                                                    1
                                            ].address,
                                    });
                                }

                                if (fieldName === 'addressunit') {
                                    updatedFields['addressunit'] =
                                        updatedFormValues.previousAddresses[
                                            updatedFormValues.previousAddresses
                                                .length - 1
                                        ].addressUnit;
                                }

                                if (fieldName === 'anothername') {
                                    updatedFields['anothername'] =
                                        updatedFormValues.anotherNameExplain;
                                }

                                if (fieldName === 'inmilitary') {
                                    updatedFields['inmilitary'] =
                                        updatedFormValues.inMilitaryExplain;
                                }

                                if (fieldName === 'felony') {
                                    updatedFields['felony'] =
                                        updatedFormValues.felonyExplain;
                                }

                                if (fieldName === 'misdemeanor') {
                                    updatedFields['misdemeanor'] =
                                        updatedFormValues.misdemeanorExplain;
                                }

                                if (fieldName === 'drunkdriving') {
                                    updatedFields['drunkdriving'] =
                                        updatedFormValues.drunkDrivingExplain;
                                }

                                return updatedFields;
                            }, {});

                        let reviewedCorrectItemsIndex: any = [];

                        const filteredPreviousAddressesFields =
                            this.stepFeedbackValues.previousAddressesReview
                                .filter((item, index) => {
                                    if (item.isPreviousAddressValid) {
                                        reviewedCorrectItemsIndex = [
                                            ...reviewedCorrectItemsIndex,
                                            index,
                                        ];
                                    }

                                    return !item.isPreviousAddressValid;
                                })
                                .map((item) => {
                                    return {
                                        address: item.address,
                                    };
                                });

                        const filteredUpdatedPreviousAddressesFields =
                            updatedFormValues.previousAddresses
                                .filter((item, index) => {
                                    if (
                                        reviewedCorrectItemsIndex.includes(
                                            index
                                        )
                                    ) {
                                        return false;
                                    }

                                    if (
                                        index ===
                                        updatedFormValues.previousAddresses
                                            .length -
                                            1
                                    ) {
                                        return false;
                                    }

                                    return item;
                                })
                                .map((item) => {
                                    return {
                                        address: item.address,
                                    };
                                });

                        let formNotEqualArray = [];

                        for (
                            let i = 0;
                            i < filteredPreviousAddressesFields.length;
                            i++
                        ) {
                            const equalValue =
                                JSON.stringify(
                                    filteredPreviousAddressesFields[i]
                                ) ===
                                JSON.stringify(
                                    filteredUpdatedPreviousAddressesFields[i]
                                );

                            formNotEqualArray = [
                                ...formNotEqualArray,
                                equalValue,
                            ];
                        }

                        const hasTrueValues =
                            !isAnyValueInArrayTrue(formNotEqualArray);
                        const isFormNotEqual = isFormValueNotEqual(
                            filteredFieldsWithIncorrectValues,
                            filteredUpdatedFieldsWithIncorrectValues
                        );

                        if (hasTrueValues && isFormNotEqual) {
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
        if (
            this.selectedMode === SelectedMode.FEEDBACK &&
            !this.isFeedbackValueUpdated
        ) {
            return;
        }

        const { personalInfoForm } = this;
        const {
            usCitizen,
            legalWork,
            anotherName,
            inMilitary,
            felony,
            misdemeanor,
            drunkDriving,
            isAgreement,
            dateOfBirth,
            previousAddresses,
            bankId,
            ...formValues
        } = personalInfoForm.value;

        const radioButtons = [
            usCitizen,
            legalWork,
            anotherName,
            inMilitary,
            felony,
            misdemeanor,
            drunkDriving,
        ];

        const radiosWithIds = radioButtons.map((value, index) => ({
            id: index,
            isChecked: value,
        }));
        const uncheckedRadios = filterUnceckedRadiosId(radiosWithIds);

        if (personalInfoForm.invalid || uncheckedRadios.length) {
            if (personalInfoForm.invalid) {
                this.inputService.markInvalid(personalInfoForm);
                this.displayDocumentsRequiredNote = !this.documents.length;
            }

            this.displayRadioRequiredNoteArray =
                this.displayRadioRequiredNoteArray.map((item, index) => {
                    if (uncheckedRadios.some((radio) => radio === index)) {
                        return { ...item, displayRadioRequiredNote: true };
                    }
                    return item;
                });

            return;
        }

        let mappedPreviousAddresses = previousAddresses.map(
            (previousAddress) => {
                return {
                    address: {
                        ...previousAddress.address,
                        addressUnit: previousAddress.unit,
                    },
                };
            }
        );
        const lastActiveAddress = mappedPreviousAddresses[0].address;
        mappedPreviousAddresses.shift();

        const documents = this.documents
            .map(({ realFile }) => realFile)
            .filter(Boolean);

        const saveData = {
            ...formValues,
            applicantId: this.applicantId,
            isAgreed: isAgreement,
            doB: MethodsCalculationsHelper.convertDateToBackend(dateOfBirth),
            address: lastActiveAddress
                ? {
                      ...lastActiveAddress,
                      addressUnit: lastActiveAddress.addressUnit,
                      addressCity: lastActiveAddress.city,
                      addressState: lastActiveAddress.state,
                      addressCounty: lastActiveAddress.county,
                      addressAddress: lastActiveAddress.address,
                      addressStreet: lastActiveAddress.street,
                      addressStreetNumber: lastActiveAddress.streetNumber,
                      addressCountry: lastActiveAddress.country,
                      addressZipCode: lastActiveAddress.zipCode,
                      addressStateShortName: lastActiveAddress.stateShortName,
                      addressAddressUnit: lastActiveAddress.addressUnit,
                  }
                : null,
            previousAddresses: mappedPreviousAddresses.length
                ? mappedPreviousAddresses
                : [],
            bankId: this.selectedBank?.id || null,
            usCitizen,
            legalWork,
            anotherName,
            anotherNameDescription: personalInfoForm.value.anotherNameExplain,
            inMilitary,
            inMilitaryDescription: personalInfoForm.value.inMilitaryExplain,
            felony,
            felonyDescription: personalInfoForm.value.felonyExplain,
            misdemeanor,
            misdemeanorDescription: personalInfoForm.value.misdemeanorExplain,
            drunkDriving,
            drunkDrivingDescription: personalInfoForm.value.drunkDrivingExplain,
            files: documents,
            ...((this.stepHasValues ||
                this.selectedMode === SelectedMode.FEEDBACK) && {
                id: this.applicantId,
                filesForDeleteIds: this.documentsForDeleteIds,
            }),
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.APPLICANT &&
                !this.stepHasValues
            ) {
                return this.applicantActionsService.createPersonalInfo(
                    saveData
                );
            }

            if (
                (this.selectedMode === SelectedMode.APPLICANT &&
                    this.stepHasValues) ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
                return this.applicantActionsService.updatePersonalInfo(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/2`,
                    ]);

                    // this.applicantStore.update((store) => {
                    //     const previousAddressStore = Array(
                    //         selectedAddresses.length - 1
                    //     ).fill({
                    //         id: null,
                    //         address: null,
                    //         previousAddressReview: null,
                    //     });

                    //     return {
                    //         ...store,
                    //         applicant: {
                    //             ...store.applicant,
                    //             personalInfo: {
                    //                 ...store.applicant.personalInfo,
                    //                 ...saveData,
                    //                 bank: this.banksDropdownList.find(
                    //                     (item) => item.id === saveData.bankId
                    //                 ),
                    //                 bankName: this.banksDropdownList.find(
                    //                     (item) => item.id === saveData.bankId
                    //                 )?.name,
                    //                 previousAddresses: previousAddressStore.map(
                    //                     (item, index) => ({
                    //                         ...item,
                    //                         id: storePreviousAddresses[index]
                    //                             ?.id,
                    //                         address:
                    //                             storePreviousAddresses[index]
                    //                                 ?.address,
                    //                         previousAddressReview:
                    //                             storePreviousAddresses[index]
                    //                                 ?.previousAddressReview,
                    //                     })
                    //                 ),
                    //             },
                    //         },
                    //     };
                    // });

                    if (
                        this.selectedMode === SelectedMode.FEEDBACK &&
                        this.subscription
                    ) {
                        this.subscription.unsubscribe();
                    }
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    public onSubmitReview(): void {
        const { personalInfoForm } = this;
        const {
            firstRowReview,
            secondRowReview,
            thirdRowReview,
            fourthRowReview,
            questionReview3,
            questionReview4,
            questionReview5,
            questionReview6,
            questionReview7,
        } = personalInfoForm.value;

        const previousAddresses =
            this.previousAddresses.controls.length === 1
                ? []
                : this.previousAddresses.controls
                      .filter(
                          (_, index) =>
                              index !==
                              this.previousAddresses.controls.length - 1
                      )
                      .map((_, index) => ({
                          ...(this.stepHasReviewValues && {
                              id: this.previousAddressesReviewId[index],
                          }),
                          previousAddressId: this.previousAddressesId[index],
                          isPreviousAddressValid:
                              !this.openAnnotationArray[index + 2]
                                  .lineInputs[0],
                          previousAddressMessage:
                              this.previousAddresses.controls[index]?.get(
                                  `cardReview${index + 1}`
                              ).value,
                      }));

        const saveData: any = {
            applicantId: this.applicantId,
            ...(this.stepHasReviewValues && {
                id: this.personalInfoId,
            }),
            isFirstNameValid: !this.openAnnotationArray[0].lineInputs[0],
            isLastNameValid: !this.openAnnotationArray[0].lineInputs[1],
            isDoBValid: !this.openAnnotationArray[0].lineInputs[2],
            personalInfoMessage: firstRowReview,
            isPhoneValid: !this.openAnnotationArray[1].lineInputs[0],
            phoneMessage: secondRowReview,
            isAddressValid: this.previousAddresses.controls.length
                ? !this.openAnnotationArray[
                      this.previousAddresses.controls.length + 1
                  ].lineInputs[0]
                : null,
            isAddressUnitValid: this.previousAddresses.controls.length
                ? !this.openAnnotationArray[
                      this.previousAddresses.controls.length + 1
                  ].lineInputs[1]
                : null,
            addressMessage: this.previousAddresses.controls.length
                ? this.previousAddresses.controls[
                      this.previousAddresses.controls.length - 1
                  ].get(`cardReview${this.previousAddresses.controls.length}`)
                      .value
                : null,
            isSsnValid: !this.openAnnotationArray[7].lineInputs[0],
            ssnMessage: thirdRowReview,
            isAccountNumberValid: !this.openAnnotationArray[8].lineInputs[0],
            accountNumberMessage: fourthRowReview,
            isAnotherNameValid: !this.openAnnotationArray[11].lineInputs[0],
            anotherNameMessage: questionReview3,
            isInMilitaryValid: !this.openAnnotationArray[12].lineInputs[0],
            inMilitaryMessage: questionReview4,
            isFelonyValid: !this.openAnnotationArray[13].lineInputs[0],
            felonyMessage: questionReview5,
            isMisdemeanorValid: !this.openAnnotationArray[14].lineInputs[0],
            misdemeanorMessage: questionReview6,
            isDrunkDrivingValid: !this.openAnnotationArray[15].lineInputs[0],
            drunkDrivingMessage: questionReview7,
            previousAddressReviews: [...previousAddresses],
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.REVIEW &&
                !this.stepHasReviewValues
            ) {
                return this.applicantActionsService.createPersonalInfoReview(
                    saveData
                );
            }

            if (
                this.selectedMode === SelectedMode.REVIEW &&
                this.stepHasReviewValues
            ) {
                return this.applicantActionsService.updatePersonalInfoReview(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/2`,
                    ]);

                    this.applicantStore.update((store) => ({
                        ...store,
                        applicant: {
                            ...store.applicant,
                            personalInfo: {
                                ...store.applicant.personalInfo,
                                previousAddresses:
                                    store.applicant.personalInfo.previousAddresses.map(
                                        (item, index) => ({
                                            ...item,
                                            previousAddressReview:
                                                previousAddresses[index],
                                        })
                                    ),
                                personalInfoReview: saveData,
                            },
                        },
                    }));
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    public addPreviousAddress(): void {
        if (
            !this.isEachPreviousAddressesRowValid ||
            this.previousAddressesItems?.length === 3
        )
            return;

        this.isPreviousAddressesRowCreated = true;

        setTimeout(() => {
            this.isPreviousAddressesRowCreated = false;
        }, 400);

        this.changeDetector.detectChanges();
    }

    public handleModalTableValueEmit(modalTableDataValue: any[]): void {
        this.previousAddressesItems = modalTableDataValue;

        this.personalInfoForm
            .get('previousAddresses')
            .patchValue(this.previousAddressesItems);

        this.changeDetector.detectChanges();
    }

    public handleModalTableValidStatusEmit(isEachRowValid: boolean): void {
        this.isEachPreviousAddressesRowValid = isEachRowValid;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
