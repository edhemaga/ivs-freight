import {
   Component,
   OnInit,
   OnDestroy,
   ViewChildren,
   QueryList,
   AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, Subscription, takeUntil } from 'rxjs';

import {
   anyInputInLineIncorrect,
   isAnyValueInArrayTrue,
   isFormValueNotEqual,
} from '../../state/utils/utils';

import {
   convertDateToBackend,
   convertDateFromBackend,
} from 'src/app/core/utils/methods.calculations';

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
} from '../../../shared/ta-input/ta-input.regex-validations';

import { ApplicantActionsService } from '../../state/services/applicant-actions.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { BankVerificationService } from 'src/app/core/services/BANK-VERIFICATION/bankVerification.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { ApplicantQuestion } from '../../state/model/applicant-question.model';
import { BankResponse } from 'appcoretruckassist/model/bankResponse';
import {
   AddressEntity,
   CreateResponse,
   UpdatePersonalInfoCommand,
   CreatePersonalInfoReviewCommand,
   PersonalInfoFeedbackResponse,
   ApplicantResponse,
   ApplicantModalResponse,
} from 'appcoretruckassist/model/models';

@Component({
   selector: 'app-step1',
   templateUrl: './step1.component.html',
   styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit, OnDestroy, AfterViewInit {
   @ViewChildren('cmp') components: QueryList<any>;

   private destroy$ = new Subject<void>();

   public selectedMode: string = SelectedMode.REVIEW;

   public personalInfoRadios: any;

   public subscription: Subscription;

   public stepValues: any;

   public companyName: string;

   public applicantId: number;
   public personalInfoId: number;
   public previousAddressesId: number[];

   public personalInfoForm: FormGroup;

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

   public questions: ApplicantQuestion[] = [
      {
         title: 'Do you have legal right to work in the US?',
         formControlName: 'legalWork',
         formControlNameExplain: 'legalWorkExplain',
         answerChoices: [
            {
               id: 1,
               label: 'YES',
               value: 'legalWorkYes',
               name: 'legalWorkYes',
               checked: false,
               index: 0,
            },
            {
               id: 2,
               label: 'NO',
               value: 'legalWorkNo',
               name: 'legalWorkNo',
               checked: false,
               index: 0,
            },
         ],
      },
      {
         title: 'Have you ever been known by any other name?',
         formControlName: 'anotherName',
         formControlNameExplain: 'anotherNameExplain',
         answerChoices: [
            {
               id: 3,
               label: 'YES',
               value: 'anotherNameYes',
               name: 'anotherNameYes',
               checked: false,
               index: 1,
            },
            {
               id: 4,
               label: 'NO',
               value: 'anotherNameNo',
               name: 'anotherNameNo',
               checked: false,
               index: 1,
            },
         ],
      },
      {
         title: 'Were you ever in the military?',
         formControlName: 'inMilitary',
         formControlNameExplain: 'inMilitaryExplain',
         answerChoices: [
            {
               id: 5,
               label: 'YES',
               value: 'inMilitaryYes',
               name: 'inMilitaryYes',
               checked: false,
               index: 2,
            },
            {
               id: 6,
               label: 'NO',
               value: 'inMilitaryNo',
               name: 'inMilitaryNo',
               checked: false,
               index: 2,
            },
         ],
      },
      {
         title: 'Have you ever been convicted of a felony?',
         formControlName: 'felony',
         formControlNameExplain: 'felonyExplain',
         answerChoices: [
            {
               id: 7,
               label: 'YES',
               value: 'felonyYes',
               name: 'felonyYes',
               checked: false,
               index: 3,
            },
            {
               id: 8,
               label: 'NO',
               value: 'felonyNo',
               name: 'felonyNo',
               checked: false,
               index: 3,
            },
         ],
      },
      {
         title: 'Have you ever been convicted of a misdemeanor?',
         formControlName: 'misdemeanor',
         formControlNameExplain: 'misdemeanorExplain',
         answerChoices: [
            {
               id: 9,
               label: 'YES',
               value: 'misdemeanorYes',
               name: 'misdemeanorYes',
               checked: false,
               index: 4,
            },
            {
               id: 10,
               label: 'NO',
               value: 'misdemeanorNo',
               name: 'misdemeanorNo',
               checked: false,
               index: 4,
            },
         ],
      },
      {
         title: 'Have you ever had a DUI, DWI, or OVI?',
         formControlName: 'drunkDriving',
         formControlNameExplain: 'drunkDrivingExplain',
         answerChoices: [
            {
               id: 11,
               label: 'YES',
               value: 'drunkDrivingYes',
               name: 'drunkDrivingYes',
               checked: false,
               index: 5,
            },
            {
               id: 12,
               label: 'NO',
               value: 'drunkDrivingNo',
               name: 'drunkDrivingNo',
               checked: false,
               index: 5,
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
      {
         lineIndex: 0,
         lineInputs: [false, false, false],
         displayAnnotationButton: false,
         displayAnnotationTextArea: false,
      },
      {
         lineIndex: 1,
         lineInputs: [false],
         displayAnnotationButton: false,
         displayAnnotationTextArea: false,
      },
      {},
      {},
      {},
      {},
      {},
      {
         lineIndex: 7,
         lineInputs: [false, false],
         displayAnnotationButton: false,
         displayAnnotationTextArea: false,
      },
      {
         lineIndex: 8,
         lineInputs: [false, false],
         displayAnnotationButton: false,
         displayAnnotationTextArea: false,
      },
      {
         lineIndex: 9,
         lineInputs: [false],
         displayAnnotationButton: false,
         displayAnnotationTextArea: false,
      },
      {
         lineIndex: 10,
         lineInputs: [false],
         displayAnnotationButton: false,
         displayAnnotationTextArea: false,
      },
      {
         lineIndex: 11,
         lineInputs: [false],
         displayAnnotationButton: false,
         displayAnnotationTextArea: false,
      },
      {
         lineIndex: 12,
         lineInputs: [false],
         displayAnnotationButton: false,
         displayAnnotationTextArea: false,
      },
      {
         lineIndex: 13,
         lineInputs: [false],
         displayAnnotationButton: false,
         displayAnnotationTextArea: false,
      },
      {
         lineIndex: 14,
         lineInputs: [false],
         displayAnnotationButton: false,
         displayAnnotationTextArea: false,
      },
   ];
   public cardReviewIndex: number = 0;
   public hasIncorrectFields: boolean = false;

   public stepFeedbackValues: any;
   public isFeedbackValueUpdated: boolean = false;

   constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private inputService: TaInputService,
      private applicantActionsService: ApplicantActionsService,
      private bankVerificationService: BankVerificationService,
      private notificationService: NotificationService,
      private applicantStore: ApplicantStore,
      private applicantQuery: ApplicantQuery
   ) {}

   ngOnInit(): void {
      this.createForm();

      this.getStepValuesFromStore();

      this.getDropdownLists();
   }

   ngAfterViewInit(): void {
      this.personalInfoRadios = this.components.toArray();
   }

   public get previousAddresses(): FormArray {
      return this.personalInfoForm.get('previousAddresses') as FormArray;
   }

   public trackByIdentity = (index: number, item: any): number => index;

   private createForm(): void {
      this.personalInfoForm = this.formBuilder.group({
         isAgreement: [false, Validators.requiredTrue],
         firstName: [null, [Validators.required, ...firstNameValidation]],
         lastName: [null, [Validators.required, ...lastNameValidation]],
         dateOfBirth: [null, Validators.required],
         phone: [null, [Validators.required, phoneFaxRegex]],
         email: [null],
         previousAddresses: this.formBuilder.array([]),
         ssn: [null, [Validators.required, ssnNumberRegex]],
         bankId: [null, [...bankValidation]],
         accountNumber: [null, accountBankValidation],
         routingNumber: [null, routingBankValidation],
         legalWork: [null, Validators.required],
         anotherName: [null, Validators.required],
         inMilitary: [null, Validators.required],
         felony: [null, Validators.required],
         misdemeanor: [null, Validators.required],
         drunkDriving: [null, Validators.required],
         legalWorkExplain: [null],
         anotherNameExplain: [null],
         inMilitaryExplain: [null],
         felonyExplain: [null],
         misdemeanorExplain: [null],
         drunkDrivingExplain: [null],

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
      });

      this.inputService.customInputValidator(
         this.personalInfoForm.get('email'),
         'email',
         this.destroy$
      );
   }

   public getStepValuesFromStore(): void {
      this.applicantQuery.applicant$
         .pipe(takeUntil(this.destroy$))
         .subscribe((res: ApplicantResponse) => {
            this.companyName = res.companyInfo.name;

            this.applicantId = res.id;

            this.patchStepValues(res.personalInfo);
         });
   }

   public patchStepValues(stepValues: PersonalInfoFeedbackResponse): void {
      console.log('stepValues', stepValues);
      const {
         id,
         isAgreed,
         firstName,
         lastName,
         doB,
         phone,
         email,
         previousAddresses,
         address,
         ssn,
         bank,
         bankName,
         accountNumber,
         routingNumber,
         legalWork,
         anotherName,
         inMilitary,
         felony,
         misdemeanor,
         drunkDriving,
         legalWorkDescription,
         anotherNameDescription,
         inMilitaryDescription,
         felonyDescription,
         misdemeanorDescription,
         drunkDrivingDescription,
         personalInfoReview,
      } = stepValues;

      this.personalInfoForm.patchValue({
         isAgreement: isAgreed,
         firstName,
         lastName,
         dateOfBirth: convertDateFromBackend(doB),
         phone,
         email,
         ssn,
         bankId: bankName,
         accountNumber,
         routingNumber,
         legalWork,
         anotherName,
         inMilitary,
         felony,
         misdemeanor,
         drunkDriving,
         legalWorkExplain: legalWorkDescription,
         anotherNameExplain: anotherNameDescription,
         inMilitaryExplain: inMilitaryDescription,
         felonyExplain: felonyDescription,
         misdemeanorExplain: misdemeanorDescription,
         drunkDrivingExplain: drunkDrivingDescription,
      });

      let bankId: any;

      if (bank) {
         const { id: bankNumberId } = bank;

         bankId = bankNumberId;

         this.isBankSelected = true;
      }

      setTimeout(() => {
         this.selectedBank = this.banksDropdownList.find(
            (item) => item.id === bankId
         );

         const isAgreementValue =
            this.personalInfoForm.get('isAgreement').value;

         if (isAgreementValue) {
            if (legalWork) {
               this.personalInfoRadios[0].buttons[0].checked = true;
            } else {
               this.personalInfoRadios[0].buttons[1].checked = true;

               if (legalWork === null) {
                  this.personalInfoRadios[0].buttons[0].checked = false;
                  this.personalInfoRadios[0].buttons[1].checked = false;
               }
            }

            if (anotherName) {
               this.personalInfoRadios[1].buttons[0].checked = true;
            } else {
               this.personalInfoRadios[1].buttons[1].checked = true;

               if (anotherName === null) {
                  this.personalInfoRadios[1].buttons[0].checked = false;
                  this.personalInfoRadios[1].buttons[1].checked = false;
               }
            }

            if (inMilitary) {
               this.personalInfoRadios[2].buttons[0].checked = true;
            } else {
               this.personalInfoRadios[2].buttons[1].checked = true;

               if (inMilitary === null) {
                  this.personalInfoRadios[2].buttons[0].checked = false;
                  this.personalInfoRadios[2].buttons[1].checked = false;
               }
            }

            if (felony) {
               this.personalInfoRadios[3].buttons[0].checked = true;
            } else {
               this.personalInfoRadios[3].buttons[1].checked = true;

               if (felony === null) {
                  this.personalInfoRadios[3].buttons[0].checked = false;
                  this.personalInfoRadios[3].buttons[1].checked = false;
               }
            }

            if (misdemeanor) {
               this.personalInfoRadios[4].buttons[0].checked = true;
            } else {
               this.personalInfoRadios[4].buttons[1].checked = true;

               if (misdemeanor === null) {
                  this.personalInfoRadios[4].buttons[0].checked = false;
                  this.personalInfoRadios[4].buttons[1].checked = false;
               }
            }

            if (drunkDriving) {
               this.personalInfoRadios[5].buttons[0].checked = true;
            } else {
               this.personalInfoRadios[5].buttons[1].checked = true;

               if (drunkDriving === null) {
                  this.personalInfoRadios[5].buttons[0].checked = false;
                  this.personalInfoRadios[5].buttons[1].checked = false;
               }
            }
         }
      }, 150);

      this.stepValues = stepValues;
      this.personalInfoId = id;
      this.previousAddressesId = previousAddresses.map((item: any) => item.id);

      const addresses = [...previousAddresses, address];

      this.selectedAddresses = addresses.map((item, index) => {
         if (index === addresses.length - 1) {
            return item;
         }

         return item.address;
      });

      for (let i = 0; i < addresses.length; i++) {
         this.previousAddresses.push(this.createNewAddress());

         if (i === addresses.length - 1) {
            this.isEditingArray = [
               ...this.isEditingArray,
               {
                  id: i,
                  isEditing: true,
                  isEditingAddress: false,
                  isFirstAddress: false,
               },
            ];

            this.previousAddresses.at(i).patchValue({
               address: address.address,
               addressUnit: address.addressUnit,
            });

            if (this.selectedMode === SelectedMode.REVIEW) {
               const { isAddressValid, isAddressUnitValid, addressMessage } =
                  personalInfoReview || {};

               const firstEmptyObjectInList = this.openAnnotationArray.find(
                  (item) => Object.keys(item).length === 0
               );

               const indexOfFirstEmptyObjectInList =
                  this.openAnnotationArray.indexOf(firstEmptyObjectInList);

               this.openAnnotationArray[indexOfFirstEmptyObjectInList] = {
                  lineIndex: this.openAnnotationArray.indexOf(
                     firstEmptyObjectInList
                  ),
                  lineInputs: [
                     isAddressValid === null ? false : !isAddressValid,
                     isAddressUnitValid === null ? false : !isAddressUnitValid,
                  ],
                  displayAnnotationButton:
                     (!isAddressValid || !isAddressUnitValid) && !addressMessage
                        ? true
                        : false,
                  displayAnnotationTextArea: addressMessage ? true : false,
               };

               this.previousAddresses.at(addresses.length - 1).patchValue({
                  [`cardReview${i + 1}`]: addressMessage,
               });
            }
         } else {
            this.isEditingArray = [
               ...this.isEditingArray,
               {
                  id: i,
                  isEditing: false,
                  isEditingAddress: false,
                  isFirstAddress: false,
               },
            ];

            this.previousAddresses.at(i).patchValue({
               address: previousAddresses[i]?.address?.address,
               addressUnit: previousAddresses[i]?.address?.addressUnit,
            });

            if (this.selectedMode === SelectedMode.REVIEW) {
               const selectedPreviousAddressReview =
                  previousAddresses[i].previousAddressReview;

               let isPreviousAddressValid: any = null;
               let previousAddressMessage: any = null;

               if (selectedPreviousAddressReview) {
                  isPreviousAddressValid =
                     selectedPreviousAddressReview.isPreviousAddressValid;

                  previousAddressMessage =
                     selectedPreviousAddressReview.previousAddressMessage;
               }

               console.log('isPreviousAddressValid', isPreviousAddressValid);

               const firstEmptyObjectInList = this.openAnnotationArray.find(
                  (item) => Object.keys(item).length === 0
               );

               const indexOfFirstEmptyObjectInList =
                  this.openAnnotationArray.indexOf(firstEmptyObjectInList);

               this.openAnnotationArray[indexOfFirstEmptyObjectInList] = {
                  lineIndex: this.openAnnotationArray.indexOf(
                     firstEmptyObjectInList
                  ),
                  lineInputs: [
                     isPreviousAddressValid === null
                        ? false
                        : !isPreviousAddressValid,
                  ],
                  displayAnnotationButton:
                     !isPreviousAddressValid && !previousAddressMessage
                        ? true
                        : false,
                  displayAnnotationTextArea: previousAddressMessage
                     ? true
                     : false,
               };

               console.log(
                  'this.openAnnotationArray',
                  this.openAnnotationArray
               );

               this.previousAddresses.at(i).patchValue({
                  [`cardReview${i + 1}`]: previousAddressMessage,
               });
            }
         }

         this.previousAddresses.removeAt(i + 1);
      }

      this.isLastAddedPreviousAddressValid = true;

      if (this.selectedMode === SelectedMode.REVIEW) {
         if (personalInfoReview) {
            const {
               isFirstNameValid,
               isLastNameValid,
               isDoBValid,
               personalInfoMessage,
               isPhoneValid,
               phoneMessage,
               isSsnValid,
               // ssnBankMessage,
               isAccountNumberValid,
               isRoutingNumberValid,
               accountRoutingMessage,
               isLegalWorkValid,
               legalWorkMessage,
               isAnotherNameValid,
               anotherNameMessage,
               isInMilitaryValid,
               inMilitaryMessage,
               isFelonyValid,
               felonyMessage,
               isMisdemeanorValid,
               misdemeanorMessage,
               isDrunkDrivingValid,
               drunkDrivingMessage,
            } = personalInfoReview;

            this.openAnnotationArray[0] = {
               ...this.openAnnotationArray[0],
               lineInputs: [!isFirstNameValid, !isLastNameValid, !isDoBValid],
               displayAnnotationButton:
                  (!isFirstNameValid || !isLastNameValid || !isDoBValid) &&
                  !personalInfoMessage
                     ? true
                     : false,
               displayAnnotationTextArea: personalInfoMessage ? true : false,
            };
            this.openAnnotationArray[1] = {
               ...this.openAnnotationArray[1],
               lineInputs: [!isPhoneValid],
               displayAnnotationButton:
                  !isPhoneValid && !phoneMessage ? true : false,
               displayAnnotationTextArea: phoneMessage ? true : false,
            };
            this.openAnnotationArray[7] = {
               ...this.openAnnotationArray[7],
               lineInputs: [!isSsnValid],
               // displayAnnotationButton:
               //   !isSsnValid && !ssnBankMessage ? true : false,
               // displayAnnotationTextArea: ssnBankMessage ? true : false,
            };
            this.openAnnotationArray[8] = {
               ...this.openAnnotationArray[8],
               lineInputs: [!isAccountNumberValid, !isRoutingNumberValid],
               displayAnnotationButton:
                  (!isAccountNumberValid || !isRoutingNumberValid) &&
                  !accountRoutingMessage
                     ? true
                     : false,
               displayAnnotationTextArea: accountRoutingMessage ? true : false,
            };
            this.openAnnotationArray[9] = {
               ...this.openAnnotationArray[9],
               lineInputs: [!isLegalWorkValid],
               displayAnnotationButton:
                  !isLegalWorkValid && !legalWorkMessage ? true : false,
               displayAnnotationTextArea: legalWorkMessage ? true : false,
            };
            this.openAnnotationArray[10] = {
               ...this.openAnnotationArray[10],
               lineInputs: [!isAnotherNameValid],
               displayAnnotationButton:
                  !isAnotherNameValid && !anotherNameMessage ? true : false,
               displayAnnotationTextArea: anotherNameMessage ? true : false,
            };
            this.openAnnotationArray[11] = {
               ...this.openAnnotationArray[11],
               lineInputs: [!isInMilitaryValid],
               displayAnnotationButton:
                  !isInMilitaryValid && !inMilitaryMessage ? true : false,
               displayAnnotationTextArea: inMilitaryMessage ? true : false,
            };
            this.openAnnotationArray[12] = {
               ...this.openAnnotationArray[12],
               lineInputs: [!isFelonyValid],
               displayAnnotationButton:
                  !isFelonyValid && !felonyMessage ? true : false,
               displayAnnotationTextArea: felonyMessage ? true : false,
            };
            this.openAnnotationArray[13] = {
               ...this.openAnnotationArray[13],
               lineInputs: [!isMisdemeanorValid],
               displayAnnotationButton:
                  !isMisdemeanorValid && !misdemeanorMessage ? true : false,
               displayAnnotationTextArea: misdemeanorMessage ? true : false,
            };
            this.openAnnotationArray[14] = {
               ...this.openAnnotationArray[14],
               lineInputs: [!isDrunkDrivingValid],
               displayAnnotationButton:
                  !isDrunkDrivingValid && !drunkDrivingMessage ? true : false,
               displayAnnotationTextArea: drunkDrivingMessage ? true : false,
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

            this.personalInfoForm.patchValue({
               firstRowReview: personalInfoMessage,
               secondRowReview: phoneMessage,
               // thirdRowReview: ssnBankMessage,
               fourthRowReview: accountRoutingMessage,

               questionReview1: legalWorkMessage,
               questionReview2: anotherNameMessage,
               questionReview3: inMilitaryMessage,
               questionReview4: felonyMessage,
               questionReview5: misdemeanorMessage,
               questionReview6: drunkDrivingMessage,
            });
         }
      }

      if (this.selectedMode === SelectedMode.FEEDBACK) {
         if (personalInfoReview) {
            this.stepFeedbackValues = {
               ...this.stepFeedbackValues,
               ...personalInfoReview,
            };
         }

         if (previousAddresses) {
            const previousAddressesReview = previousAddresses.map(
               (item, index) => {
                  return {
                     ...item.previousAddressReview,
                     address: previousAddresses[index].address.address,
                     addressUnit: previousAddresses[index].address.addressUnit,
                  };
               }
            );

            this.stepFeedbackValues = {
               ...this.stepFeedbackValues,
               previousAddressesReview,
            };
         }

         this.startFeedbackValueChangesMonitoring();
      }
   }

   public handleInputSelect(event: any, action: string, index?: number): void {
      switch (action) {
         case InputSwitchActions.BANK:
            this.selectedBank = event;

            if (!event) {
               this.isBankSelected = false;

               this.personalInfoForm.patchValue({
                  bankId: null,
                  accountNumber: null,
                  routingNumber: null,
               });
            }

            this.onBankSelected();

            break;
         case InputSwitchActions.ANSWER_CHOICE:
            const selectedCheckbox = event.find(
               (radio: { checked: boolean }) => radio.checked
            );

            const selectedFormControlName =
               this.questions[selectedCheckbox.index].formControlName;

            const selectedExplainFormControlName =
               this.questions[selectedCheckbox.index].formControlNameExplain;

            if (selectedCheckbox.label === 'YES') {
               this.personalInfoForm
                  .get(selectedFormControlName)
                  .patchValue(true);

               this.inputService.changeValidators(
                  this.personalInfoForm.get(selectedExplainFormControlName)
               );
            } else {
               this.personalInfoForm
                  .get(selectedFormControlName)
                  .patchValue(false);

               this.inputService.changeValidators(
                  this.personalInfoForm.get(selectedExplainFormControlName),
                  false
               );
            }

            break;
         case InputSwitchActions.PREVIOUS_ADDRESS:
            const address: AddressEntity = event.address;

            this.selectedAddresses = [...this.selectedAddresses, address];

            this.isLastAddedPreviousAddressValid = event.valid;

            if (!event.valid) {
               this.previousAddresses.at(index).setErrors({ invalid: true });

               this.isLastAddedPreviousAddressValid = false;
            } else {
               this.previousAddresses.at(index).patchValue({
                  address: address.address,
               });
            }

            break;

         default:
            break;
      }
   }

   private onBankSelected() {
      this.personalInfoForm
         .get('bankId')
         .valueChanges.pipe(takeUntil(this.destroy$))
         .subscribe((value) => {
            this.isBankSelected = this.bankVerificationService.onSelectBank(
               this.selectedBank ? this.selectedBank.name : value,
               this.personalInfoForm.get('routingNumber'),
               this.personalInfoForm.get('accountNumber')
            );
         });
   }

   public onSaveNewBank(bank: { data: any; action: string }) {
      this.selectedBank = bank.data;

      this.bankVerificationService
         .createBank({ name: this.selectedBank.name })
         .pipe(takeUntil(this.destroy$))
         .subscribe({
            next: (res: CreateResponse) => {
               this.notificationService.success(
                  'Successfuly add new bank',
                  'Success'
               );

               this.selectedBank = {
                  id: res.id,
                  name: this.selectedBank.name,
               };

               this.banksDropdownList = [
                  ...this.banksDropdownList,
                  this.selectedBank,
               ];
            },
            error: (err) => {
               this.notificationService.error("Can't add new bank", 'Error');
            },
         });
   }

   private createNewAddress(): FormGroup {
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
      if (this.selectedMode === SelectedMode.REVIEW) {
         return;
      }

      const isEditingAnyAddress = this.isEditingArray.some(
         (item) => item.isEditing && item.isEditingAddress
      );

      if (isEditingAnyAddress || this.previousAddresses.controls.length === 1) {
         return;
      }

      if (index === this.previousAddresses?.controls.length - 1) {
         this.isLastInputDeleted = true;
      } else {
         this.isLastInputDeleted = false;
      }

      this.isEditingMiddlePositionAddress = false;

      this.previousAddresses.removeAt(index);
      this.selectedAddresses.splice(index, 1);
      this.isEditingArray.splice(index, 1);

      if (this.previousAddresses.controls.length < 2) {
         this.isEditingArray[0].isEditing = true;
         this.isEditingArray[0].isEditingAddress = false;
      }
   }

   public onEditNewAddress(index: number): void {
      this.helperIndex = index;

      if (this.previousAddresses.controls[index].value.address) {
         this.isEditingArray[index].isEditingAddress = true;

         this.previousAddressOnEdit =
            this.previousAddresses.controls[index].value.address;

         this.previousAddressUnitOnEdit =
            this.previousAddresses.controls[index].value.addressUnit;

         this.isEditingMiddlePositionAddress = true;

         this.isEditingArray = this.isEditingArray.map((item, itemIndex) => {
            if (index === 0 && this.previousAddresses.controls.length === 1) {
               return {
                  ...item,
                  isEditing: true,
                  isEditingAddress: false,
               };
            }

            if (index === itemIndex) {
               return { ...item, isEditing: true, isEditingAddress: true };
            }

            return { ...item, isEditing: false, isEditingAddress: false };
         });
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
         selectedInputsLine.lineInputs[inputIndex] =
            !selectedInputsLine.lineInputs[inputIndex];

         selectedInputsLine.displayAnnotationButton =
            !selectedInputsLine.displayAnnotationButton;

         if (selectedInputsLine.displayAnnotationTextArea) {
            selectedInputsLine.displayAnnotationButton = false;
            selectedInputsLine.displayAnnotationTextArea = false;
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
               case 0:
                  if (!isAnyInputInLineIncorrect) {
                     this.personalInfoForm
                        .get('firstRowReview')
                        .patchValue(null);
                  }

                  break;
               case 1:
                  this.personalInfoForm.get('secondRowReview').patchValue(null);

                  break;
               case 7:
                  this.personalInfoForm.get('thirdRowReview').patchValue(null);

                  break;
               case 8:
                  this.personalInfoForm.get('fourthRowReview').patchValue(null);
                  break;
               case 9:
                  this.personalInfoForm.get('questionReview1').patchValue(null);
                  break;
               case 10:
                  this.personalInfoForm.get('questionReview2').patchValue(null);
                  break;
               case 11:
                  this.personalInfoForm.get('questionReview3').patchValue(null);
                  break;
               case 12:
                  this.personalInfoForm.get('questionReview4').patchValue(null);
                  break;
               case 13:
                  this.personalInfoForm.get('questionReview5').patchValue(null);
                  break;
               case 14:
                  this.personalInfoForm.get('questionReview6').patchValue(null);
                  break;

               default:
                  break;
            }
         }
      }

      if (type === 'card' || !event) {
         const lineInputItems = selectedInputsLine.lineInputs;
         const isAnyInputInLineIncorrect =
            anyInputInLineIncorrect(lineInputItems);

         switch (selectedInputsLine.lineIndex) {
            case 2:
               if (!isAnyInputInLineIncorrect) {
                  this.previousAddresses.at(0).patchValue({
                     cardReview1: null,
                  });
               }

               break;
            case 3:
               if (!isAnyInputInLineIncorrect) {
                  this.previousAddresses.at(1).patchValue({
                     cardReview2: null,
                  });
               }

               break;
            case 4:
               if (!isAnyInputInLineIncorrect) {
                  this.previousAddresses.at(2).patchValue({
                     cardReview3: null,
                  });
               }

               break;
            case 5:
               if (!isAnyInputInLineIncorrect) {
                  this.previousAddresses.at(3).patchValue({
                     cardReview4: null,
                  });
               }

               break;
            case 6:
               if (!isAnyInputInLineIncorrect) {
                  this.previousAddresses.at(4).patchValue({
                     cardReview5: null,
                  });
               }

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
         this.openAnnotationArray[event.lineIndex].displayAnnotationTextArea =
            true;
      } else {
         this.openAnnotationArray[event.lineIndex].displayAnnotationButton =
            true;
         this.openAnnotationArray[event.lineIndex].displayAnnotationTextArea =
            false;
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

         const hasIncorrectValues = Object.keys(filteredIncorrectValues).length;

         if (hasIncorrectValues) {
            this.subscription = this.personalInfoForm.valueChanges
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
                        .filter((item) => item.toLowerCase().includes(keyName))
                        .pop();

                     o[keyName] = this.stepValues[match];

                     if (keyName === 'dob') {
                        o['dob'] = convertDateFromBackend(o['dob']);
                     }

                     if (keyName === 'address') {
                        o['address'] = JSON.stringify({
                           address: this.stepValues.address.address,
                        });
                     }

                     if (keyName === 'addressunit') {
                        o['addressunit'] = this.stepValues.address.addressUnit;
                     }

                     return o;
                  }, {});

                  const filteredUpdatedFieldsWithIncorrectValues = Object.keys(
                     filteredFieldsWithIncorrectValues
                  ).reduce((o, key) => {
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
                           address:
                              updatedFormValues.previousAddresses[
                                 updatedFormValues.previousAddresses.length - 1
                              ].address,
                        });
                     }

                     if (keyName === 'addressunit') {
                        o['addressunit'] =
                           updatedFormValues.previousAddresses[
                              updatedFormValues.previousAddresses.length - 1
                           ].addressUnit;
                     }

                     if (keyName === 'legalwork') {
                        o['legalwork'] = updatedFormValues.legalWorkExplain;
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
                        o['drunkdriving'] =
                           updatedFormValues.drunkDrivingExplain;
                     }

                     return o;
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
                              addressUnit: item.addressUnit,
                           };
                        });

                  const filteredUpdatedPreviousAddressesFields =
                     updatedFormValues.previousAddresses
                        .filter((item, index) => {
                           if (reviewedCorrectItemsIndex.includes(index)) {
                              return false;
                           }

                           if (
                              index ===
                              updatedFormValues.previousAddresses.length - 1
                           ) {
                              return false;
                           }

                           return item;
                        })
                        .map((item) => {
                           return {
                              address: item.address,
                              addressUnit: item.addressUnit,
                           };
                        });

                  let formNotEqualArray = [];

                  for (
                     let i = 0;
                     i < filteredPreviousAddressesFields.length;
                     i++
                  ) {
                     const equalValue =
                        JSON.stringify(filteredPreviousAddressesFields[i]) ===
                        JSON.stringify(
                           filteredUpdatedPreviousAddressesFields[i]
                        );

                     formNotEqualArray = [...formNotEqualArray, equalValue];
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
   }

   public onSubmit(): void {
      if (this.selectedMode === SelectedMode.FEEDBACK) {
         if (!this.isFeedbackValueUpdated) {
            return;
         }
      }

      if (this.personalInfoForm.invalid) {
         this.inputService.markInvalid(this.personalInfoForm);
         return;
      }

      const {
         firstRowReview,
         secondRowReview,
         thirdRowReview,
         fourthRowReview,
         questionReview1,
         questionReview2,
         questionReview3,
         questionReview4,
         questionReview5,
         questionReview6,
         isAgreement,
         dateOfBirth,
         email,
         previousAddresses,
         bankId,
         legalWorkExplain,
         anotherNameExplain,
         inMilitaryExplain,
         felonyExplain,
         misdemeanorExplain,
         drunkDrivingExplain,
         ...personalInfoForm
      } = this.personalInfoForm.value;

      this.selectedAddresses = this.selectedAddresses.filter(
         (item) => item.address
      );

      this.selectedAddresses = this.selectedAddresses.map((item, index) => {
         return {
            ...item,
            addressUnit: previousAddresses[index]
               ? previousAddresses[index].addressUnit
               : null,
            county: null,
         };
      });

      const saveData: UpdatePersonalInfoCommand = {
         ...personalInfoForm,
         applicantId: this.applicantId,
         doB: convertDateToBackend(dateOfBirth),
         isAgreed: isAgreement,
         address: this.selectedAddresses[this.selectedAddresses.length - 1],
         bankId: this.selectedBank ? this.selectedBank.id : null,
         previousAddresses:
            this.selectedAddresses.length <= 1
               ? []
               : this.selectedAddresses.filter(
                    (item, index) => index !== this.selectedAddresses.length - 1
                 ),
         legalWorkDescription: legalWorkExplain,
         anotherNameDescription: anotherNameExplain,
         inMilitaryDescription: inMilitaryExplain,
         felonyDescription: felonyExplain,
         misdemeanorDescription: misdemeanorExplain,
         drunkDrivingDescription: drunkDrivingExplain,
      };

      const stepPreviousAddresses = this.stepValues?.previousAddresses;

      const storePreviousAddresses = this.selectedAddresses
         .filter((item, index) => index !== this.selectedAddresses.length - 1)
         .map((item, index) => {
            return {
               id: stepPreviousAddresses[index]?.id,
               address: item,
               previousAddressReview:
                  stepPreviousAddresses[index]?.previousAddressReview,
            };
         });

      this.applicantActionsService
         .updatePersonalInfo(saveData)
         .pipe(takeUntil(this.destroy$))
         .subscribe({
            next: () => {
               this.router.navigate([`/application/${this.applicantId}/2`]);

               this.applicantStore.update((store) => {
                  let previousAddressStore = [];

                  while (
                     previousAddressStore.length < storePreviousAddresses.length
                  ) {
                     previousAddressStore = [
                        ...previousAddressStore,
                        {
                           id: null,
                           address: null,
                           previousAddressReview: null,
                        },
                     ];
                  }

                  return {
                     ...store,
                     applicant: {
                        ...store.applicant,
                        personalInfo: {
                           ...store.applicant.personalInfo,
                           ...saveData,
                           bank: this.banksDropdownList.find(
                              (item) => item.id === saveData.bankId
                           ),
                           bankName: this.banksDropdownList.find(
                              (item) => item.id === saveData.bankId
                           )?.name,
                           previousAddresses: previousAddressStore.length
                              ? previousAddressStore.map((item, index) => {
                                   return {
                                      ...item,
                                      id: storePreviousAddresses[index]?.id,
                                      address:
                                         storePreviousAddresses[index]?.address,
                                      previousAddressReview:
                                         storePreviousAddresses[index]
                                            ?.previousAddressReview,
                                   };
                                })
                              : storePreviousAddresses,
                        },
                     },
                  };
               });

               console.log('STORE', this.applicantStore);

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
         questionReview1,
         questionReview2,
         questionReview3,
         questionReview4,
         questionReview5,
         questionReview6,
      } = this.personalInfoForm.value;

      const previousAddresses =
         this.previousAddresses.controls.length === 1
            ? []
            : this.previousAddresses.controls.map((item, index) => {
                 if (index === this.previousAddresses.controls.length - 1) {
                    return;
                 }

                 return {
                    previousAddressId: this.previousAddressesId[index],
                    isPreviousAddressValid:
                       !this.openAnnotationArray[index + 2].lineInputs[0],
                    previousAddressMessage: this.previousAddresses.controls[
                       index
                    ]?.get(`cardReview${index + 1}`).value,
                 };
              });

      const saveData: CreatePersonalInfoReviewCommand = {
         applicantId: this.applicantId,
         // personalInfoId: this.personalInfoId,
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
              ].get(`cardReview${this.previousAddresses.controls.length}`).value
            : null,
         isSsnValid: !this.openAnnotationArray[7].lineInputs[0],
         // isBankValid: !this.openAnnotationArray[7].lineInputs[1],
         // ssnBankMessage: thirdRowReview,
         isAccountNumberValid: !this.openAnnotationArray[8].lineInputs[0],
         isRoutingNumberValid: !this.openAnnotationArray[8].lineInputs[1],
         accountRoutingMessage: fourthRowReview,
         isLegalWorkValid: !this.openAnnotationArray[9].lineInputs[0],
         legalWorkMessage: questionReview1,
         isAnotherNameValid: !this.openAnnotationArray[10].lineInputs[0],
         anotherNameMessage: questionReview2,
         isInMilitaryValid: !this.openAnnotationArray[11].lineInputs[0],
         inMilitaryMessage: questionReview3,
         isFelonyValid: !this.openAnnotationArray[12].lineInputs[0],
         felonyMessage: questionReview4,
         isMisdemeanorValid: !this.openAnnotationArray[13].lineInputs[0],
         misdemeanorMessage: questionReview5,
         isDrunkDrivingValid: !this.openAnnotationArray[14].lineInputs[0],
         drunkDrivingMessage: questionReview6,
         previousAddressReviews: [...previousAddresses],
      };

      this.applicantActionsService
         .createPersonalInfoReview(saveData)
         .pipe(takeUntil(this.destroy$))
         .subscribe({
            next: () => {
               this.router.navigate([`/application/${this.applicantId}/2`]);

               this.applicantStore.update((store) => {
                  return {
                     ...store,
                     applicant: {
                        ...store.applicant,
                        personalInfo: {
                           ...store.applicant.personalInfo,
                           previousAddresses:
                              store.applicant.personalInfo.previousAddresses.map(
                                 (item, index) => {
                                    return {
                                       ...item,
                                       previousAddressReview:
                                          previousAddresses[index],
                                    };
                                 }
                              ),
                           personalInfoReview: saveData,
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
