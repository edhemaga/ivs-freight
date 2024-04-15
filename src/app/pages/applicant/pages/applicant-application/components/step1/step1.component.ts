import {
    Component,
    OnInit,
    OnDestroy,
    ViewChildren,
    QueryList,
    AfterViewInit,
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    UntypedFormArray,
    AbstractControl 
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
    isAnyValueInArrayTrue,
    isFormValueNotEqual,
    isAnyRadioInArrayUnChecked,
    filterUnceckedRadiosId,
    isAnyValueInArrayFalse,
} from '@pages/applicant/utils/helpers/applicant.helper';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { questions } from '@pages/applicant/utils/data/questions';
import { openAnnotationArray } from '@pages/applicant/utils/data/formAnnotations';
import { displayRadioRequiredNoteArray } from '@pages/applicant/utils/data/displayRadioRequiredNoteArray';

// validations
import {
    phoneFaxRegex,
    ssnNumberRegex,
    accountBankValidation,
    routingBankValidation,
    addressValidation,
    addressUnitValidation,
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

// models
import {
    BankResponse,
    AddressEntity,
    CreateResponse,
    PersonalInfoFeedbackResponse,
    ApplicantResponse,
    ApplicantModalResponse,
} from 'appcoretruckassist/model/models';
import { ApplicantQuestion } from '@pages/applicant/pages/applicant-application/models/applicant-question.model';

@Component({
    selector: 'app-step1',
    templateUrl: './step1.component.html',
    styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit, OnDestroy, AfterViewInit {
    @ViewChildren('cmp') components: QueryList<any>;

    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public personalInfoRadios: any;
    public displayRadioRequiredNoteArray = displayRadioRequiredNoteArray;

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
    public questions: ApplicantQuestion[] = questions;
    public openAnnotationArray = openAnnotationArray;
    public documents: any[] = [];
    public documentsForDeleteIds: number[] = [];
    public displayDocumentsRequiredNote: boolean = false;

   
    public cardReviewIndex: number = 0;
    public hasIncorrectFields: boolean = false;

    public stepFeedbackValues: any;
    public isFeedbackValueUpdated: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private router: Router,
        private inputService: TaInputService,
        private applicantActionsService: ApplicantService,
        private bankVerificationService: BankVerificationService,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private abstractControl: AbstractControl
    ) {}

    ngOnInit(): void {
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

    public trackByIdentity = (index: number, _: any): number => index;

    private createForm(): void {
        this.personalInfoForm = this.formBuilder.group({
            isAgreement: [false, Validators.requiredTrue],
            firstName: [null, [Validators.required, ...firstNameValidation]],
            lastName: [null, [Validators.required, ...lastNameValidation]],
            dateOfBirth: [null, Validators.required],
            ssn: [null, [Validators.required, ssnNumberRegex]],
            phone: [null, [Validators.required, phoneFaxRegex]],
            previousAddresses: this.formBuilder.array([]),

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
            personalInfoReview
        } = stepValues;
    
        this.personalInfoForm.patchValue({
            isAgreement: isAgreed,
            firstName,
            lastName,
            dateOfBirth: doB ? MethodsCalculationsHelper.convertDateFromBackend(doB) : null,
            ssn,
            phone,
            bankId: bankName || null,
            accountNumber,
            routingNumber,
            usCitizen,
            legalWork,
            anotherName,
            inMilitary,
            felony,
            misdemeanor,
            drunkDriving,
            anotherNameExplain: anotherNameDescription,
            inMilitaryExplain: inMilitaryDescription,
            felonyExplain: felonyDescription,
            misdemeanorExplain: misdemeanorDescription,
            drunkDrivingExplain: drunkDrivingDescription,
        });
    
        this.stepValues = stepValues;
        this.stepHasValues = !!ssn;
    
        if (ssn) {
            this.selectedBank = this.banksDropdownList.find(item => item.id === (bank ? bank.id : null));
            this.updateRadioButtons(usCitizen, legalWork, anotherName, inMilitary, felony, misdemeanor, drunkDriving);
        }
    
        this.updatePreviousAddresses(previousAddresses, address, personalInfoReview);
        this.updateReviewValues(personalInfoReview);
        this.updateFeedbackValues(personalInfoReview, previousAddresses);
    }
    
    private updateRadioButtons(usCitizen: boolean, legalWork: boolean, anotherName: boolean, inMilitary: boolean, felony: boolean, misdemeanor: boolean, drunkDriving: boolean): void {
        const radioButtons = [
          { controlName: 'usCitizen', index: 0 },
          { controlName: 'legalWork', index: 1 },
          { controlName: 'anotherName', index: 2, explainField: 'anotherNameExplain' },
          { controlName: 'inMilitary', index: 3, explainField: 'inMilitaryExplain' },
          { controlName: 'felony', index: 4, explainField: 'felonyExplain' },
          { controlName: 'misdemeanor', index: 5, explainField: 'misdemeanorExplain' },
          { controlName: 'drunkDriving', index: 6, explainField: 'drunkDrivingExplain' }
        ];
      
        const isAgreementValue = this.personalInfoForm.get('isAgreement').value;
        if (isAgreementValue) {
          radioButtons.forEach(({ controlName, index, explainField }) => {
            const value = controlName === 'usCitizen' ? usCitizen :
                          controlName === 'legalWork' ? legalWork :
                          controlName === 'anotherName' ? anotherName :
                          controlName === 'inMilitary' ? inMilitary :
                          controlName === 'felony' ? felony :
                          controlName === 'misdemeanor' ? misdemeanor :
                          controlName === 'drunkDriving' ? drunkDriving : null;
      
            this.setRadioButtonsCheckedValue(value, this.personalInfoRadios[index], explainField);
          });
        }
      }
          
      private setRadioButtonsCheckedValue(value: boolean, radioGroup: any, explainField?: string): void {
        const [radioButtonTrue, radioButtonFalse] = radioGroup.buttons;
      
        radioButtonTrue.checked = value === true;
        radioButtonFalse.checked = value === false;
      
        if (explainField) {
          this.inputService.changeValidators(this.personalInfoForm.get(explainField), value);
        }
      }
      
      private updatePreviousAddresses(previousAddresses: any[], address: any, personalInfoReview: any): void {
        if (!previousAddresses) return;
      
        this.previousAddresses.clear();
        this.previousAddressesId = previousAddresses.map(item => item.id);
        const addresses = [...previousAddresses, address];
      
        this.selectedAddresses = addresses.map((item, index) => index === addresses.length - 1 ? item : item.address);
      
        addresses.forEach((item, i) => {
          const newAddressFormGroup = this.createNewAddress();
          const isLastAddress = i === addresses.length - 1;
      
          this.previousAddresses.push(newAddressFormGroup);
          this.isEditingArray.push({
            id: i,
            isEditing: isLastAddress,
            isEditingAddress: false,
            isFirstAddress: false,
          });
      
          newAddressFormGroup.patchValue({
            address: isLastAddress ? address.address : item.address.address,
            addressUnit: isLastAddress ? address.addressUnit : item.address.addressUnit,
            [`cardReview${i + 1}`]: this.getReviewMessage(i, personalInfoReview),
          });
        });
      }
    
    
      private getReviewMessage(index: number, personalInfoReview: any): string | null {
        if (!personalInfoReview) return null;
        const reviewFields = ['personalInfoMessage', 'phoneMessage', 'ssnMessage', 'accountNumberMessage',
            'anotherNameMessage', 'inMilitaryMessage', 'felonyMessage', 'misdemeanorMessage', 'drunkDrivingMessage'];
      
        return personalInfoReview[reviewFields[index]] || null;
      }
      
      private updateReviewValues(personalInfoReview: any): void {
        if (!personalInfoReview) return;
      
        const reviewFields = ['personalInfoMessage', 'phoneMessage', 'ssnMessage', 'accountNumberMessage',
            'anotherNameMessage', 'inMilitaryMessage', 'felonyMessage', 'misdemeanorMessage', 'drunkDrivingMessage'];
      
        reviewFields.forEach((field, index) => {
          this.personalInfoForm.patchValue({
            [`firstRowReview`]: personalInfoReview[reviewFields[0]],
            [`secondRowReview`]: personalInfoReview[reviewFields[1]],
            [`thirdRowReview`]: personalInfoReview[reviewFields[2]],
            [`fourthRowReview`]: personalInfoReview[reviewFields[3]],
            [`questionReview${index + 3}`]: personalInfoReview[reviewFields[index + 4]],
          });
        });
      
        this.updateOpenAnnotationArray(personalInfoReview);
      }
      
    
    private updateOpenAnnotationArray(personalInfoReview: any): void {
        if (!personalInfoReview) return;
    
        const annotationFields = [
            { index: 0, keys: ['isFirstNameValid', 'isLastNameValid', 'isDoBValid'] },
            { index: 1, keys: ['isPhoneValid'] },
            { index: 7, keys: ['isSsnValid'] },
            { index: 8, keys: ['isAccountNumberValid'] },
            { index: 11, keys: ['isAnotherNameValid'] },
            { index: 12, keys: ['isInMilitaryValid'] },
            { index: 13, keys: ['isFelonyValid'] },
            { index: 14, keys: ['isMisdemeanorValid'] },
            { index: 15, keys: ['isDrunkDrivingValid'] },
        ];
    
        annotationFields.forEach(({ index, keys }) => {
            const lineInputs = keys.map(key => !personalInfoReview[key]);
            const displayAnnotationButton = lineInputs.includes(true) && !personalInfoReview[`${keys[0]}Message`];
            const displayAnnotationTextArea = personalInfoReview[`${keys[0]}Message`];
    
            this.openAnnotationArray[index] = {
                lineIndex: index,
                lineInputs,
                displayAnnotationButton,
                displayAnnotationTextArea,
            };
        });
    
        this.hasIncorrectFields = this.openAnnotationArray.some(item => item.lineInputs.includes(true));
    }
    
    private updateFeedbackValues(personalInfoReview: any, previousAddresses: any[]): void {
        if (personalInfoReview) {
            this.stepFeedbackValues = { ...this.stepFeedbackValues, ...personalInfoReview };
        }
    
        if (previousAddresses) {
            const previousAddressesReview = previousAddresses.map((item, index) => ({
                ...item.previousAddressReview,
                address: previousAddresses[index].address.address,
                addressUnit: previousAddresses[index].address.addressUnit,
            }));
    
            this.stepFeedbackValues = { ...this.stepFeedbackValues, previousAddressesReview };
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
    
    private handleBankSelection(event: any): void {
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
    
    private handleAnswerChoice(event: any): void {
        const selectedCheckbox = event.find((radio: { checked: boolean }) => radio.checked);
        const selectedQuestion = this.questions[selectedCheckbox.index];
    
        const selectedFormControlName = selectedQuestion.formControlName;
        const selectedExplainFormControlName = selectedQuestion.formControlNameExplain;
    
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
    
        this.displayRadioRequiredNoteArray[selectedCheckbox.index].displayRadioRequiredNote = false;
    }
    
    private handlePreviousAddress(event: { address: AddressEntity; valid: boolean }, index?: number): void {
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

    public onFilesAction(event: any): void {
        this.documents = event.files;

        this.displayDocumentsRequiredNote = false;

        switch (event.action) {
            case 'add':
                this.personalInfoForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));

                break;
            case 'delete':
                this.personalInfoForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );

                break;

            default:
                break;
        }
    }

    private createNewAddress(): UntypedFormGroup {
        this.cardReviewIndex++;

        return this.formBuilder.group({
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            [`cardReview${this.cardReviewIndex}`]: [null],
        });
    }

    public onAddNewAddress(): void {
        if (
            this.previousAddresses.controls.length &&
            !this.isLastAddedPreviousAddressValid &&
            !this.isLastInputDeleted
        ) {
            return;
        }

        this.isEditingMiddlePositionAddress = false;

        this.helperIndex = 2;

        this.isLastInputDeleted = false;

        this.previousAddresses.push(this.createNewAddress());

        this.isEditingId++;

        this.isEditingArray = [
            ...this.isEditingArray,
            {
                id: this.isEditingId,
                isEditing: true,
                isEditingAddress: false,
                isFirstAddress: false,
            },
        ];

        if (this.previousAddresses.controls.length > 1) {
            this.isEditingArray = this.isEditingArray.map((item, index) => {
                if (index === this.isEditingArray.length - 1) {
                    return { ...item, isEditing: true };
                }

                return { ...item, isEditing: false };
            });
        }

        this.isLastAddedPreviousAddressValid = false;

        const firstEmptyObjectInList = this.openAnnotationArray.find(
            (item) => Object.keys(item).length === 0
        );

        const indexOfFirstEmptyObjectInList = this.openAnnotationArray.indexOf(
            firstEmptyObjectInList
        );

        this.openAnnotationArray[indexOfFirstEmptyObjectInList] = {
            lineIndex: this.openAnnotationArray.indexOf(firstEmptyObjectInList),
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        };
    }

    public onRemoveNewAddress(index: number): void {
        if (this.selectedMode === SelectedMode.REVIEW || this.shouldAbortAddressRemoval(index)) {
            return;
        }
    
        this.updateEditingState(index);
    
        this.removeAddressFromLists(index);
    }
    
    private shouldAbortAddressRemoval(index: number): boolean {
        const isEditingAnyAddress = this.isEditingArray.some(
            item => item.isEditing && item.isEditingAddress
        );
    
        return isEditingAnyAddress || this.previousAddresses.controls.length === 1;
    }
    
    private updateEditingState(index: number): void {
        this.isLastInputDeleted = index !== this.previousAddresses.controls.length - 1;
        this.isEditingMiddlePositionAddress = false;
    }
    
    private removeAddressFromLists(index: number): void {
        this.previousAddresses.removeAt(index);
        this.selectedAddresses.splice(index, 1);
        this.isEditingArray.splice(index, 1);
    
        if (this.previousAddresses.controls.length === 1) {
            this.isEditingArray[0].isEditing = true;
            this.isEditingArray[0].isEditingAddress = false;
        }
    }
    

    public onEditNewAddress(index: number): void {
        if (!this.hasAddressToEdit(index)) {
            return;
        }
    
        this.setHelperIndex(index);
        this.setEditingState(index);
    }
    
    private hasAddressToEdit(index: number): boolean {
        const addressControl = this.previousAddresses.controls[index].get('address');
        return addressControl && !!addressControl.value;
    }
    
    private setHelperIndex(index: number): void {
        this.helperIndex = index;
    }
    
    private setEditingState(index: number): void {
        const addressExists = this.previousAddresses.controls[index].value.address;
    
        if (addressExists) {
            this.isEditingArray = this.isEditingArray.map((item, itemIndex) => ({
                ...item,
                isEditing: index === 0 && this.previousAddresses.controls.length === 1 ? true : itemIndex === index,
                isEditingAddress: index === itemIndex
            }));
    
            this.isEditingMiddlePositionAddress = true;
    
            if (index !== 0 || this.previousAddresses.controls.length !== 1) {
                this.previousAddressOnEdit = this.previousAddresses.controls[index].value.address;
                this.previousAddressUnitOnEdit = this.previousAddresses.controls[index].value.addressUnit;
            }
        }
    }    

    public onConfirmEditedNewAddress(index: number): void {
        if (
            this.previousAddresses.controls[index].value.address &&
            this.previousAddresses.controls[index].valid
        ) {
            this.isEditingArray[index].isEditing = false;
            this.isEditingArray[index].isEditingAddress = false;

            this.helperIndex = 2;
        }

        const lastAddressIndex = this.previousAddresses.controls.length - 1;

        this.isEditingMiddlePositionAddress = false;

        this.isEditingArray[lastAddressIndex].isEditing = true;
    }

    public onCancelEditingNewAddress(index: number): void {
        this.previousAddresses.controls[index].patchValue({
            address: this.previousAddressOnEdit,
            addressUnit: this.previousAddressUnitOnEdit,
        });

        this.isEditingArray[index].isEditing = false;
        this.isEditingArray[index].isEditingAddress = false;

        this.previousAddressOnEdit = null;
        this.previousAddressUnitOnEdit = null;

        this.helperIndex = 2;

        const lastAddressIndex = this.previousAddresses.controls.length - 1;

        this.isEditingMiddlePositionAddress = false;

        this.isEditingArray[lastAddressIndex].isEditing = true;
    }

    public onGetBtnClickValue(event: any): void {
        if (event.notDisabledClick) {
            this.onAddNewAddress();
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
            this.handleRegularInput(selectedInputsLine, event, inputIndex, lineIndex);
        }
    
        this.updateHasIncorrectFields();
    }
    
    private handleCardInput(selectedInputsLine: any, inputIndex: number): void {
        selectedInputsLine.lineInputs[inputIndex] = !selectedInputsLine.lineInputs[inputIndex];
        selectedInputsLine.displayAnnotationButton = !selectedInputsLine.displayAnnotationButton;
    
        if (selectedInputsLine.displayAnnotationTextArea) {
            selectedInputsLine.displayAnnotationButton = false;
            selectedInputsLine.displayAnnotationTextArea = false;
        }
    
        this.updateCardReview(selectedInputsLine, 'card', event);
    }
    
    private handleRegularInput(selectedInputsLine: any, event: any, inputIndex: number, lineIndex: number): void {
        if (event) {
            selectedInputsLine.lineInputs[inputIndex] = true;
    
            if (!selectedInputsLine.displayAnnotationTextArea) {
                selectedInputsLine.displayAnnotationButton = true;
                selectedInputsLine.displayAnnotationTextArea = false;
            }
        } else {
            selectedInputsLine.lineInputs[inputIndex] = false;
    
            const isAnyInputInLineIncorrect = anyInputInLineIncorrect(selectedInputsLine.lineInputs);
    
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
    
    private getReviewControlByLineIndex(lineIndex: number): AbstractControl | null {
        const controlName = this.getReviewControlNameByLineIndex(lineIndex);
        return controlName ? this.personalInfoForm.get(controlName) : null;
    }
    
    private getReviewControlNameByLineIndex(lineIndex: number): string | null {
        switch (lineIndex) {
            case 0: return 'firstRowReview';
            case 1: return 'secondRowReview';
            case 7: return 'thirdRowReview';
            case 8: return 'fourthRowReview';
            case 11: return 'questionReview3';
            case 12: return 'questionReview4';
            case 13: return 'questionReview5';
            case 14: return 'questionReview6';
            case 15: return 'questionReview7';
            default: return null;
        }
    }
    
    private updateCardReview(selectedInputsLine: any, type: string, event?: any): void {
        if (type === 'card' || !event) {
            const isAnyInputInLineIncorrect = anyInputInLineIncorrect(selectedInputsLine.lineInputs);
            const cardReviewControl = this.getCardReviewControlByLineIndex(selectedInputsLine.lineIndex);
            
            if (cardReviewControl && !isAnyInputInLineIncorrect) {
                cardReviewControl.patchValue(null);
            }
        }
    }
    
    
    private getCardReviewControlByLineIndex(lineIndex: number): AbstractControl | null {
        const index = lineIndex - 2; 
        return this.previousAddresses.at(index)?.get(`cardReview${index + 1}`);
    }
    
    private updateHasIncorrectFields(): void {
        const hasIncorrectFields = this.openAnnotationArray.some(item => item.lineInputs.some(input => input));
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
            const filteredIncorrectValues = Object.keys(this.stepFeedbackValues).reduce((o, key) => {
                if (this.stepFeedbackValues[key] === false) {
                    o[key] = this.stepFeedbackValues[key];
                }
                return o;
            }, {});
    
            const previousAddressesHasIncorrectValue = isAnyValueInArrayFalse(
                this.stepFeedbackValues.previousAddressesReview.map((item) => item.isPreviousAddressValid)
            );
    
            const hasIncorrectValues = Object.keys(filteredIncorrectValues).length;
    
            if (hasIncorrectValues || previousAddressesHasIncorrectValue) {
                this.subscription = this.personalInfoForm.valueChanges
                    .pipe(
                        distinctUntilChanged(),
                        throttleTime(2),
                        takeUntil(this.destroy$)
                    )
                    .subscribe((updatedFormValues) => {
                        const filteredFieldsWithIncorrectValues = Object.keys(filteredIncorrectValues).reduce((o, key) => {
                            const keyName = key
                                .replace('Valid', '')
                                .replace('is', '')
                                .trim()
                                .toLowerCase();
    
                            const match = Object.keys(this.stepValues)
                                .filter((item) => item.toLowerCase().includes(keyName))
                                .pop();
    
                            o[keyName] = this.stepValues[match];
    
                            if (keyName === 'dob') {
                                o['dob'] = MethodsCalculationsHelper.convertDateFromBackend(o['dob']);
                            }
    
                            if (keyName === 'address') {
                                o['address'] = JSON.stringify({
                                    address: this.stepValues.address.address,
                                });
                            }
    
                            if (keyName === 'addressunit') {
                                o['addressunit'] = this.stepValues.address.addressUnit;
                            }
    
                            if (keyName === 'anothername') {
                                o['anothername'] = this.stepValues.anotherNameExplain;
                            }
    
                            if (keyName === 'inmilitary') {
                                o['inmilitary'] = this.stepValues.inMilitaryExplain;
                            }
    
                            if (keyName === 'felony') {
                                o['felony'] = this.stepValues.felonyExplain;
                            }
    
                            if (keyName === 'misdemeanor') {
                                o['misdemeanor'] = this.stepValues.misdemeanorExplain;
                            }
    
                            if (keyName === 'drunkdriving') {
                                o['drunkdriving'] = this.stepValues.drunkDrivingExplain;
                            }
    
                            return o;
                        }, {});
    
                        const filteredUpdatedFieldsWithIncorrectValues = Object.keys(filteredFieldsWithIncorrectValues).reduce((o, key) => {
                            const keyName = key;
    
                            const match = Object.keys(this.stepValues)
                                .filter((item) => item.toLowerCase().includes(keyName))
                                .pop();
    
                            o[keyName] = updatedFormValues[match];
    
                            if (keyName === 'dob') {
                                o['dob'] = updatedFormValues.dateOfBirth;
                            }
    
                            if (keyName === 'address') {
                                o['address'] = JSON.stringify({
                                    address: updatedFormValues.previousAddresses[updatedFormValues.previousAddresses.length - 1].address,
                                });
                            }
    
                            if (keyName === 'addressunit') {
                                o['addressunit'] = updatedFormValues.previousAddresses[updatedFormValues.previousAddresses.length - 1].addressUnit;
                            }
    
                            if (keyName === 'anothername') {
                                o['anothername'] = updatedFormValues.anotherNameExplain;
                            }
    
                            if (keyName === 'inmilitary') {
                                o['inmilitary'] = updatedFormValues.inMilitaryExplain;
                            }
    
                            if (keyName === 'felony') {
                                o['felony'] = updatedFormValues.felonyExplain;
                            }
    
                            if (keyName === 'misdemeanor') {
                                o['misdemeanor'] = updatedFormValues.misdemeanorExplain;
                            }
    
                            if (keyName === 'drunkdriving') {
                                o['drunkdriving'] = updatedFormValues.drunkDrivingExplain;
                            }
    
                            return o;
                        }, {});
    
                        let reviewedCorrectItemsIndex: any = [];
    
                        const filteredPreviousAddressesFields = this.stepFeedbackValues.previousAddressesReview
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
    
                        const filteredUpdatedPreviousAddressesFields = updatedFormValues.previousAddresses
                            .filter((item, index) => {
                                if (reviewedCorrectItemsIndex.includes(index)) {
                                    return false;
                                }
    
                                if (index === updatedFormValues.previousAddresses.length - 1) {
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
    
                        for (let i = 0; i < filteredPreviousAddressesFields.length; i++) {
                            const equalValue = JSON.stringify(filteredPreviousAddressesFields[i]) === JSON.stringify(filteredUpdatedPreviousAddressesFields[i]);
    
                            formNotEqualArray = [
                                ...formNotEqualArray,
                                equalValue,
                            ];
                        }
    
                        const hasTrueValues = !isAnyValueInArrayTrue(formNotEqualArray);
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
        if (this.selectedMode === SelectedMode.FEEDBACK && !this.isFeedbackValueUpdated) {
            return;
        }
    
        const { personalInfoForm } = this;
        const {
            usCitizen, legalWork, anotherName, inMilitary, felony, misdemeanor, drunkDriving,
            isAgreement, dateOfBirth, previousAddresses, bankId, ...formValues
        } = personalInfoForm.value;
    
        const radioButtons = [usCitizen, legalWork, anotherName, inMilitary, felony, misdemeanor, drunkDriving];
    
        if (personalInfoForm.invalid || radioButtons.some(value => !value)) {
            if (personalInfoForm.invalid) {
                this.inputService.markInvalid(personalInfoForm);
                this.displayDocumentsRequiredNote = !this.documents.length;
            }
    
            const uncheckedRadios = radioButtons.map((value, index) => ({ id: index, isChecked: !value }));
            this.displayRadioRequiredNoteArray = this.displayRadioRequiredNoteArray.map((item, index) => {
                if (uncheckedRadios.some(radio => radio.id === index)) {
                    return { ...item, displayRadioRequiredNote: true };
                }
                return item;
            });
    
            return;
        }
    
        const selectedAddresses = previousAddresses
            .filter((address: any) => address.address)
            .map((address: any) => ({ ...address, addressUnit: address.addressUnit || null, county: null }));
        const lastActiveAddress = selectedAddresses[selectedAddresses.length - 1];
        const stepPreviousAddresses = this.stepValues?.previousAddresses;
        const storePreviousAddresses = selectedAddresses
            .filter((_, index) => index !== selectedAddresses.length - 1)
            .map((address: any, index: number) => ({
                ...(this.stepHasValues || this.selectedMode === SelectedMode.FEEDBACK) && {
                    id: stepPreviousAddresses[index]?.id,
                    previousAddressReview: stepPreviousAddresses[index]?.previousAddressReview,
                },
                address
            }));
        const documents = this.documents.map(({ realFile }) => realFile).filter(Boolean);
    
        const saveData = {
            ...formValues,
            applicantId: this.applicantId,
            isAgreed: isAgreement,
            doB: MethodsCalculationsHelper.convertDateToBackend(dateOfBirth),
            address: lastActiveAddress ? {
                ...lastActiveAddress,
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
            } : null,
            previousAddresses: selectedAddresses.length > 1 ? storePreviousAddresses : [],
            bankId: this.selectedBank?.id || null,
            usCitizen, legalWork, anotherName,
            anotherNameDescription: personalInfoForm.value.anotherNameExplain,
            inMilitary, inMilitaryDescription: personalInfoForm.value.inMilitaryExplain,
            felony, felonyDescription: personalInfoForm.value.felonyExplain,
            misdemeanor, misdemeanorDescription: personalInfoForm.value.misdemeanorExplain,
            drunkDriving, drunkDrivingDescription: personalInfoForm.value.drunkDrivingExplain,
            files: documents,
        };
    
        const selectMatchingBackendMethod = () => {
            if (this.selectedMode === SelectedMode.APPLICANT && !this.stepHasValues) {
                return this.applicantActionsService.createPersonalInfo(saveData);
            }
    
            if ((this.selectedMode === SelectedMode.APPLICANT && this.stepHasValues) || this.selectedMode === SelectedMode.FEEDBACK) {
                return this.applicantActionsService.updatePersonalInfo(saveData);
            }
        };
    
        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([`/application/${this.applicantId}/2`]);
    
                    this.applicantStore.update((store) => {
                        const previousAddressStore = Array(selectedAddresses.length - 1).fill({
                            id: null,
                            address: null,
                            previousAddressReview: null,
                        });
    
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                personalInfo: {
                                    ...store.applicant.personalInfo,
                                    ...saveData,
                                    bank: this.banksDropdownList.find(item => item.id === saveData.bankId),
                                    bankName: this.banksDropdownList.find(item => item.id === saveData.bankId)?.name,
                                    previousAddresses: previousAddressStore.map((item, index) => ({
                                        ...item,
                                        id: storePreviousAddresses[index]?.id,
                                        address: storePreviousAddresses[index]?.address,
                                        previousAddressReview: storePreviousAddresses[index]?.previousAddressReview,
                                    })),
                                },
                            },
                        };
                    });
    
                    if (this.selectedMode === SelectedMode.FEEDBACK && this.subscription) {
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
        const { firstRowReview, secondRowReview, thirdRowReview, fourthRowReview,
            questionReview3, questionReview4, questionReview5, questionReview6, questionReview7 } = personalInfoForm.value;
    
        const previousAddresses = this.previousAddresses.controls.length === 1
            ? []
            : this.previousAddresses.controls
                .filter((_, index) => index !== this.previousAddresses.controls.length - 1)
                .map((_, index) => ({
                    ...(this.stepHasReviewValues && {
                        id: this.previousAddressesReviewId[index],
                    }),
                    previousAddressId: this.previousAddressesId[index],
                    isPreviousAddressValid: !this.openAnnotationArray[index + 2].lineInputs[0],
                    previousAddressMessage: this.previousAddresses.controls[index]?.get(`cardReview${index + 1}`).value,
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
                ? !this.openAnnotationArray[this.previousAddresses.controls.length + 1].lineInputs[0]
                : null,
            isAddressUnitValid: this.previousAddresses.controls.length
                ? !this.openAnnotationArray[this.previousAddresses.controls.length + 1].lineInputs[1]
                : null,
            addressMessage: this.previousAddresses.controls.length
                ? this.previousAddresses.controls[this.previousAddresses.controls.length - 1].get(`cardReview${this.previousAddresses.controls.length}`).value
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
            if (this.selectedMode === SelectedMode.REVIEW && !this.stepHasReviewValues) {
                return this.applicantActionsService.createPersonalInfoReview(saveData);
            }
    
            if (this.selectedMode === SelectedMode.REVIEW && this.stepHasReviewValues) {
                return this.applicantActionsService.updatePersonalInfoReview(saveData);
            }
        };
    
        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([`/application/${this.applicantId}/2`]);
    
                    this.applicantStore.update((store) => ({
                        ...store,
                        applicant: {
                            ...store.applicant,
                            personalInfo: {
                                ...store.applicant.personalInfo,
                                previousAddresses: store.applicant.personalInfo.previousAddresses.map((item, index) => ({
                                    ...item,
                                    previousAddressReview: previousAddresses[index],
                                })),
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
    
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}    