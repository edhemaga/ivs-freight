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

import { Subject, takeUntil } from 'rxjs';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

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

import { ApplicantListsService } from './../../state/services/applicant-lists.service';
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
} from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('cmp') components: QueryList<any>;

  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.FEEDBACK;

  public personalInfoRadios: any;

  public applicantId: number;
  public personalInfoId: number;
  public previousAddressesId: number[];

  public personalInfoForm: FormGroup;

  public selectedBank: any = null;
  public selectedAddresses: AddressEntity[] = [];

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

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private router: Router,
    private applicantListsService: ApplicantListsService,
    private applicantActionsService: ApplicantActionsService,
    private bankVerificationService: BankVerificationService,
    private notificationService: NotificationService,
    private applicantStore: ApplicantStore,
    private applicantQuery: ApplicantQuery
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.getApplicantId();

    this.getStepValuesFromStore();

    this.getBanksDropdownList();

    this.isBankUnselected();
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
    let stepValuesResponse: any;

    this.applicantQuery.personalInfoList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        stepValuesResponse = res;
      });

    if (stepValuesResponse) {
      this.patchStepValues(stepValuesResponse);
    }
  }

  public patchStepValues(stepValues: any): void {
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
    }

    setTimeout(() => {
      console.log('id', bankId);
      console.log('banke', this.banksDropdownList);

      this.selectedBank = this.banksDropdownList.find(
        (item) => item.id === bankId
      );

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
    }, 150);

    this.personalInfoId = id;
    this.previousAddressesId = previousAddresses.map((item: any) => item.id);

    const addresses = [...previousAddresses, address];

    this.selectedAddresses = addresses.map((item, index) => {
      if (index === addresses.length - 1) {
        return item;
      }

      return {
        ...item.address,
      };
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
            lineIndex: this.openAnnotationArray.indexOf(firstEmptyObjectInList),
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

          this.previousAddresses
            .at(this.previousAddresses.length - 1)
            .get(`cardReview${i + 1}`)
            .patchValue(addressMessage ? addressMessage : null);
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
          address: previousAddresses[i].address.address,
          addressUnit: previousAddresses[i].address.addressUnit,
        });

        if (this.selectedMode === SelectedMode.REVIEW) {
          const selectedPreviousAddressReview =
            previousAddresses[i].previousAddressReview;

          let isPreviousAddressValid: any;
          let previousAddressMessage: any;

          if (selectedPreviousAddressReview) {
            isPreviousAddressValid =
              selectedPreviousAddressReview.isPreviousAddressValid;

            previousAddressMessage =
              selectedPreviousAddressReview.previousAddressMessage;
          }

          const firstEmptyObjectInList = this.openAnnotationArray.find(
            (item) => Object.keys(item).length === 0
          );

          const indexOfFirstEmptyObjectInList =
            this.openAnnotationArray.indexOf(firstEmptyObjectInList);

          this.openAnnotationArray[indexOfFirstEmptyObjectInList] = {
            lineIndex: this.openAnnotationArray.indexOf(firstEmptyObjectInList),
            lineInputs: [
              isPreviousAddressValid === null ? false : !isPreviousAddressValid,
            ],
            displayAnnotationButton:
              !isPreviousAddressValid && !previousAddressMessage ? true : false,
            displayAnnotationTextArea: previousAddressMessage ? true : false,
          };

          this.previousAddresses
            .at(i)
            .get(`cardReview${i + 1}`)
            .patchValue(previousAddressMessage ? previousAddressMessage : null);
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
          ssnBankMessage,
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
          displayAnnotationButton:
            !isSsnValid && !ssnBankMessage ? true : false,
          displayAnnotationTextArea: ssnBankMessage ? true : false,
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
          thirdRowReview: ssnBankMessage,
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
        this.stepFeedbackValues = personalInfoReview;

        console.log('this.stepFeedbackValues', this.stepFeedbackValues);
      }
    }
  }

  public handleInputSelect(event: any, action: string, index?: number): void {
    switch (action) {
      case InputSwitchActions.BANK:
        this.selectedBank = event;

        if (!event) {
          this.personalInfoForm.get('bankId').patchValue(null);
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
          this.personalInfoForm.get(selectedFormControlName).patchValue(true);

          this.inputService.changeValidators(
            this.personalInfoForm.get(selectedExplainFormControlName)
          );
        } else {
          this.personalInfoForm.get(selectedFormControlName).patchValue(false);

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
        } else {
          this.previousAddresses.at(index).patchValue({
            address: address.address,
          });

          if (this.previousAddresses.controls.length === 5) {
            this.isEditingArray[
              this.previousAddresses.controls.length - 1
            ].isEditing = false;
          }
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

  public isBankUnselected(): void {
    this.personalInfoForm
      .get('bankId')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (!value) {
          this.isBankSelected = false;

          this.personalInfoForm.patchValue({
            accountNumber: null,
            routingNumber: null,
          });
        }
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

    if (this.previousAddresses.controls.length === 1) {
      this.isLastInputDeleted = false;
    }
  }

  public onEditNewAddress(index: number): void {
    this.helperIndex = index;

    const lastPreviousAddressAdded = this.previousAddresses.length - 1;

    if (this.previousAddresses.controls[index].value.address) {
      this.isEditingArray[index].isEditingAddress = true;

      this.previousAddressOnEdit =
        this.previousAddresses.controls[index].value.address;

      this.previousAddressUnitOnEdit =
        this.previousAddresses.controls[index].value.addressUnit;

      if (index !== 0) {
        this.isEditingMiddlePositionAddress = true;

        if (
          !this.previousAddresses.at(lastPreviousAddressAdded).value.address
        ) {
          this.previousAddresses.removeAt(lastPreviousAddressAdded);

          this.isEditingArray.splice(lastPreviousAddressAdded, 1);

          this.isLastInputDeleted = true;
        }
      } else {
        this.isEditingMiddlePositionAddress = false;

        if (
          !this.previousAddresses.at(lastPreviousAddressAdded).value.address
        ) {
          this.previousAddresses.removeAt(lastPreviousAddressAdded);

          this.isEditingArray.splice(lastPreviousAddressAdded, 1);

          this.isLastInputDeleted = true;
        }
      }

      this.isEditingArray = this.isEditingArray.map((item, itemIndex) => {
        if (index === 0 && this.previousAddresses.controls.length === 1) {
          return { ...item, isEditing: true, isEditingAddress: false };
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

    if (this.previousAddresses.controls.length < 5) {
      const lastAddressIndex = this.previousAddresses.controls.length - 1;

      this.isEditingArray[lastAddressIndex].isEditing = true;

      this.isEditingMiddlePositionAddress = false;
    }
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

    if (this.previousAddresses.controls.length < 5) {
      const lastAddressIndex = this.previousAddresses.controls.length - 1;

      this.isEditingArray[lastAddressIndex].isEditing = true;

      this.isEditingMiddlePositionAddress = false;
    }
  }

  public getBanksDropdownList(): void {
    this.applicantListsService
      .getBanksDropdownList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.banksDropdownList = data;
      });
  }

  public getApplicantId() {
    this.applicantQuery.applicantId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.applicantId = res;
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
              this.personalInfoForm.get('firstRowReview').patchValue(null);
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
      const isAnyInputInLineIncorrect = anyInputInLineIncorrect(lineInputItems);

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
      this.openAnnotationArray[event.lineIndex].displayAnnotationButton = false;
      this.openAnnotationArray[event.lineIndex].displayAnnotationTextArea =
        true;
    } else {
      this.openAnnotationArray[event.lineIndex].displayAnnotationButton = true;
      this.openAnnotationArray[event.lineIndex].displayAnnotationTextArea =
        false;
    }
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      if (this.selectedMode === SelectedMode.APPLICANT) {
        this.onSubmit();
      }

      if (this.selectedMode === SelectedMode.REVIEW) {
        this.onSubmitReview();
      }
    }
  }

  public onSubmit(): void {
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

    const storePreviousAddresses = this.selectedAddresses
      .filter((item, index) => index !== this.selectedAddresses.length - 1)
      .map((item, index) => {
        return {
          address: item,
        };
      });

    this.applicantActionsService
      .updatePersonalInfo(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/2`]);

          this.applicantStore.update(1, (entity) => {
            return {
              ...entity,
              personalInfo: {
                ...entity.personalInfo,
                ...saveData,
                bank: this.banksDropdownList.find(
                  (item) => item.id === saveData.bankId
                ),
                bankName: this.banksDropdownList.find(
                  (item) => item.id === saveData.bankId
                ).name,
                previousAddresses: storePreviousAddresses,
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
        : this.previousAddresses.controls.length === 2
        ? [
            {
              previousAddressId: this.previousAddressesId[0],
              isPreviousAddressValid:
                !this.openAnnotationArray[2].lineInputs[0],
              previousAddressMessage:
                this.previousAddresses.controls[0]?.get('cardReview1').value,
            },
          ]
        : this.previousAddresses.controls.length === 3
        ? [
            {
              previousAddressId: this.previousAddressesId[0],
              isPreviousAddressValid:
                !this.openAnnotationArray[2].lineInputs[0],
              previousAddressMessage:
                this.previousAddresses.controls[0]?.get('cardReview1').value,
            },
            {
              previousAddressId: this.previousAddressesId[1],
              isPreviousAddressValid:
                !this.openAnnotationArray[3].lineInputs[0],
              previousAddressMessage:
                this.previousAddresses.controls[1]?.get('cardReview2').value,
            },
          ]
        : this.previousAddresses.controls.length === 4
        ? [
            {
              previousAddressId: this.previousAddressesId[0],
              isPreviousAddressValid:
                !this.openAnnotationArray[2].lineInputs[0],
              previousAddressMessage:
                this.previousAddresses.controls[0]?.get('cardReview1').value,
            },
            {
              previousAddressId: this.previousAddressesId[1],
              isPreviousAddressValid:
                !this.openAnnotationArray[3].lineInputs[0],
              previousAddressMessage:
                this.previousAddresses.controls[1]?.get('cardReview2').value,
            },
            {
              previousAddressId: this.previousAddressesId[2],
              isPreviousAddressValid:
                !this.openAnnotationArray[4].lineInputs[0],
              previousAddressMessage:
                this.previousAddresses.controls[2]?.get('cardReview3').value,
            },
          ]
        : this.previousAddresses.controls.length === 5
        ? [
            {
              previousAddressId: this.previousAddressesId[0],
              isPreviousAddressValid:
                !this.openAnnotationArray[2].lineInputs[0],
              previousAddressMessage:
                this.previousAddresses.controls[0]?.get('cardReview1').value,
            },
            {
              previousAddressId: this.previousAddressesId[1],
              isPreviousAddressValid:
                !this.openAnnotationArray[3].lineInputs[0],
              previousAddressMessage:
                this.previousAddresses.controls[1]?.get('cardReview2').value,
            },
            {
              previousAddressId: this.previousAddressesId[2],
              isPreviousAddressValid:
                !this.openAnnotationArray[4].lineInputs[0],
              previousAddressMessage:
                this.previousAddresses.controls[2]?.get('cardReview3').value,
            },
            {
              previousAddressId: this.previousAddressesId[3],
              isPreviousAddressValid:
                !this.openAnnotationArray[5].lineInputs[0],
              previousAddressMessage:
                this.previousAddresses.controls[3]?.get('cardReview4').value,
            },
          ]
        : null;

    const saveData: CreatePersonalInfoReviewCommand = {
      applicantId: this.applicantId,
      personalInfoId: this.personalInfoId,
      isFirstNameValid: !this.openAnnotationArray[0].lineInputs[0],
      isLastNameValid: !this.openAnnotationArray[0].lineInputs[1],
      isDoBValid: !this.openAnnotationArray[0].lineInputs[2],
      personalInfoMessage: firstRowReview,
      isPhoneValid: !this.openAnnotationArray[1].lineInputs[0],
      phoneMessage: secondRowReview,
      isAddressValid:
        this.previousAddresses.controls.length === 1
          ? !this.openAnnotationArray[2].lineInputs[0]
          : this.previousAddresses.controls.length === 2
          ? !this.openAnnotationArray[3].lineInputs[0]
          : this.previousAddresses.controls.length === 3
          ? !this.openAnnotationArray[4].lineInputs[0]
          : this.previousAddresses.controls.length === 4
          ? !this.openAnnotationArray[5].lineInputs[0]
          : this.previousAddresses.controls.length === 5
          ? !this.openAnnotationArray[6].lineInputs[0]
          : null,
      isAddressUnitValid:
        this.previousAddresses.controls.length === 1
          ? !this.openAnnotationArray[2].lineInputs[1]
          : this.previousAddresses.controls.length === 2
          ? !this.openAnnotationArray[3].lineInputs[1]
          : this.previousAddresses.controls.length === 3
          ? !this.openAnnotationArray[4].lineInputs[1]
          : this.previousAddresses.controls.length === 4
          ? !this.openAnnotationArray[5].lineInputs[1]
          : this.previousAddresses.controls.length === 5
          ? !this.openAnnotationArray[6].lineInputs[1]
          : null,
      addressMessage:
        this.previousAddresses.controls.length === 1
          ? this.previousAddresses.controls[0].get('cardReview1').value
          : this.previousAddresses.controls.length === 2
          ? this.previousAddresses.controls[1].get('cardReview2').value
          : this.previousAddresses.controls.length === 3
          ? this.previousAddresses.controls[2].get('cardReview3').value
          : this.previousAddresses.controls.length === 4
          ? this.previousAddresses.controls[3].get('cardReview4').value
          : this.previousAddresses.controls.length === 5
          ? this.previousAddresses.controls[4].get('cardReview5').value
          : null,
      isSsnValid: !this.openAnnotationArray[7].lineInputs[0],
      isBankValid: !this.openAnnotationArray[7].lineInputs[1],
      ssnBankMessage: thirdRowReview,
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

          this.applicantStore.update(1, (entity) => {
            return {
              ...entity,
              personalInfo: {
                ...entity.personalInfo,
                previousAddresses: entity.personalInfo.previousAddresses.map(
                  (item, index) => {
                    return {
                      ...item,
                      previousAddressReview: previousAddresses[index],
                    };
                  }
                ),
                personalInfoReview: saveData,
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
