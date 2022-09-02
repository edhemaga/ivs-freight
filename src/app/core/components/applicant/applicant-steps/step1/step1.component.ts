import {
  bankValidation,
  lastNameValidation,
} from './../../../shared/ta-input/ta-input.regex-validations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { Address } from '../../state/model/address.model';
import { ApplicantQuestion } from '../../state/model/applicant-question.model';

import { BankResponse } from 'appcoretruckassist/model/bankResponse';

import {
  phoneFaxRegex,
  emailRegex,
  ssnNumberRegex,
  accountBankValidation,
  routingBankValidation,
  emailValidation,
  addressValidation,
  addressUnitValidation,
  firstNameValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';

import { ApplicantListsService } from './../../state/services/applicant-lists.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.APPLICANT;

  public personalInfoForm: FormGroup;

  public selectedBank: any = null;

  public banksDropdownList: BankResponse[] = [];

  public isBankSelected: boolean = false;
  public isLastAddedPreviousAddressValid: boolean = false;
  public isLastInputDeleted: boolean = false;
  public isEditingMiddlePositionAddress: boolean = false;

  public helperIndex: number = 2;

  public isEditingArray: {
    id: number;
    isEditing: boolean;
    isEditingAddress: boolean;
    isFirstAddress: boolean;
  }[] = [];
  public isEditingId: number = -1;

  public previousAddressOnEdit: string;
  public previousAddressUnitOnEdit: string;

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

  constructor(
    private formBuilder: FormBuilder,
    private applicantListsService: ApplicantListsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.createFirstAddress();

    this.getBanksDropdownList();

    this.isBankUnselected();
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
      email: [null, [Validators.required, emailRegex, ...emailValidation]],
      address: [null, [Validators.required, ...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
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
      legalWorkExplain: [null, Validators.required],
      anotherNameExplain: [null, Validators.required],
      inMilitaryExplain: [null, Validators.required],
      felonyExplain: [null, Validators.required],
      misdemeanorExplain: [null, Validators.required],
      drunkDrivingExplain: [null, Validators.required],

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

      previousAddresses: this.formBuilder.array([]),
    });
  }

  public handleInputSelect(event: any, action: string, index?: number): void {
    switch (action) {
      case InputSwitchActions.BANK:
        if (event) {
          this.selectedBank = event;

          this.isBankSelected = true;
        }

        break;
      case InputSwitchActions.ANSWER_CHOICE:
        const selectedCheckbox = event.find(
          (radio: { checked: boolean }) => radio.checked
        );

        const selectedFormControlName =
          this.questions[selectedCheckbox.index].formControlName;

        this.personalInfoForm
          .get(selectedFormControlName)
          .patchValue(selectedCheckbox.label);

        break;
      case InputSwitchActions.PREVIOUS_ADDRESS:
        const address: Address = event.address;

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

  public getBanksDropdownList(): void {
    this.applicantListsService
      .getBanksDropdownList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.banksDropdownList = data;
      });
  }

  private createNewAddress(): FormGroup {
    this.cardReviewIndex++;

    return this.formBuilder.group({
      address: [null, Validators.required],
      addressUnit: [null, Validators.maxLength(6)],
      [`cardReview${this.cardReviewIndex}`]: [null],
    });
  }

  private createFirstAddress(): void {
    this.previousAddresses.push(this.createNewAddress());

    this.isEditingId++;

    this.isEditingArray = [
      ...this.isEditingArray,
      {
        id: this.isEditingId,
        isEditing: true,
        isEditingAddress: false,
        isFirstAddress: true,
      },
    ];

    const firstEmptyObjectInList = this.openAnnotationArray.find(
      (item) => Object.keys(item).length === 0
    );

    const indexOfFirstEmptyObjectInList = this.openAnnotationArray.indexOf(
      firstEmptyObjectInList
    );

    this.openAnnotationArray[indexOfFirstEmptyObjectInList] = {
      lineIndex: this.openAnnotationArray.indexOf(firstEmptyObjectInList),
      lineInputs: [false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    };
  }

  public onAddNewAddress(): void {
    this.isEditingMiddlePositionAddress = false;

    this.helperIndex = 2;

    if (
      this.previousAddresses.controls.length &&
      !this.isLastAddedPreviousAddressValid &&
      !this.isLastInputDeleted
    ) {
      return;
    }

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

    this.isEditingArray.splice(index, 1);

    if (this.previousAddresses.controls.length < 2) {
      this.isEditingArray[0].isEditing = true;
      this.isEditingArray[0].isEditingAddress = false;
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
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
    }

    if (event.action === 'back-step') {
    }
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
      }
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

  /* private formFIlling(): void {
    // Redirect to next Step
    // if (this.personalInfo?.isCompleted) {
    //   // this.router.navigateByUrl(`/application/${this.applicant?.id}/2`);
    // }

    const applicantInfo = this.applicant;
    const personalInfo = this.personalInfo;

    this.personalInfoForm = this.formBuilder.group({
      isAgreement: [personalInfo?.isAgreement, Validators.required],

      firstName: [applicantInfo?.firstName, Validators.required],
      lastName: [applicantInfo?.lastName, Validators.required],
      dateOfBirth: [applicantInfo?.dateOfBirth, Validators.required],
      phone: [applicantInfo?.phone, [Validators.required, phoneFaxRegex]],
      email: [applicantInfo?.email, [Validators.required, emailRegex]],
      address: [applicantInfo?.address, Validators.required],
      addressUnit: [applicantInfo?.addressUnit],

      ssn: [personalInfo?.ssn, [Validators.required, ssnNumberRegex]],
      bankId: [personalInfo?.bank],
      accountNumber: [
        personalInfo?.bank?.accountNumber
          ? personalInfo?.bank.accountNumber
          : null,
      ],
      routingNumber: [
        personalInfo?.bank?.routingNumber
          ? personalInfo?.bank.routingNumber
          : null,
      ],

      legalWork: [personalInfo?.legalWork, Validators.required],
      anotherName: [personalInfo?.anotherName, Validators.required],
      inMilitary: [personalInfo?.inMilitary, Validators.required],
      felony: [personalInfo?.felony, Validators.required],
      misdemeanor: [personalInfo?.misdemeanor, Validators.required],
      drunkDriving: [personalInfo?.drunkDriving, Validators.required],
      legalWorkExplain: [
        personalInfo?.legalWorkExplain,
        personalInfo?.legalWork
          ? Validators.required
          : Validators.nullValidator,
      ],
      anotherNameExplain: [
        personalInfo?.anotherNameExplain,
        personalInfo?.anotherName
          ? Validators.required
          : Validators.nullValidator,
      ],
      inMilitaryExplain: [
        personalInfo?.inMilitaryExplain,
        personalInfo?.inMilitary
          ? Validators.required
          : Validators.nullValidator,
      ],
      felonyExplain: [
        personalInfo?.felonyExplain,
        personalInfo?.felony ? Validators.required : Validators.nullValidator,
      ],
      misdemeanorExplain: [
        personalInfo?.misdemeanorExplain,
        personalInfo?.misdemeanor
          ? Validators.required
          : Validators.nullValidator,
      ],
      drunkDrivingExplain: [
        personalInfo?.drunkDrivingExplain,
        personalInfo?.drunkDriving
          ? Validators.required
          : Validators.nullValidator,
      ],

      previousAddresses: this.formBuilder.array([]),
    });

    // Previous Addresses

    if (personalInfo?.previousAddresses?.length) {
      for (let i = 0; i < personalInfo?.previousAddresses.length; i++) {
        this.onAddNewAddress();
        this.previousAddresses.at(i)?.patchValue({
          id: personalInfo?.previousAddresses[i].id,
          address: personalInfo?.previousAddresses[i].address,
          addressUnit: personalInfo?.previousAddresses[i].addressUnit,
        });
      }
    } else {
      this.previousAddresses.controls = [];
    }

    // Bank Info
    //  this.requiredBankInfo(
    //         this.personalInfo?.bank && this.bankData.length ? true : false
    //     );
  }
 */

  /* public onSubmitForm(): void {
    const personalInfoForm = this.personalInfoForm.value;

    // Applicant Data

    const applicant: Applicant = new Applicant(this.applicant);

    applicant.firstName = personalInfoForm.firstName;
    applicant.lastName = personalInfoForm.lastName;
    applicant.dateOfBirth = personalInfoForm.dateOfBirth;
    applicant.phone = personalInfoForm.phone;
    applicant.email = personalInfoForm.email;
    applicant.address = personalInfoForm.address;
    applicant.addressUnit = personalInfoForm.addressUnit;

    // Personal Info Data

    const personalInfo: PersonalInfo = new PersonalInfo(this.personalInfo);

    personalInfo.ssn = personalInfoForm.ssn;
    personalInfo.legalWork = personalInfoForm.legalWork;
    personalInfo.anotherName = personalInfoForm.anotherName;
    personalInfo.inMilitary = personalInfoForm.inMilitary;
    personalInfo.felony = personalInfoForm.felony;
    personalInfo.misdemeanor = personalInfoForm.misdemeanor;
    personalInfo.drunkDriving = personalInfoForm.drunkDriving;
    personalInfo.legalWorkExplain = personalInfoForm.legalWorkExplain;
    personalInfo.anotherNameExplain = personalInfoForm.anotherNameExplain;
    personalInfo.inMilitaryExplain = personalInfoForm.inMilitaryExplain;
    personalInfo.felonyExplain = personalInfoForm.felonyExplain;
    personalInfo.misdemeanorExplain = personalInfoForm.misdemeanorExplain;
    personalInfo.drunkDrivingExplain = personalInfoForm.drunkDrivingExplain;

    personalInfo.isAgreement = personalInfoForm.isAgreement;
    personalInfo.isCompleted = true;

    // Bank Data

    if (personalInfoForm.bankId) {
      const bank = new Bank(this.personalInfo?.bank);

      bank.id = personalInfoForm.bankId;
      bank.name = this.selectedBank.name;
      bank.accountNumber = personalInfoForm.accountNumber;
      bank.routingNumber = personalInfoForm.routingNumber;

      personalInfo.bank = bank;
    } else {
      personalInfo.bank = undefined;
    }

    // Previous Addresses Data

    if (personalInfoForm.previousAddresses?.length) {
      const previousAddresses: IApplicantAddress[] =
        personalInfoForm.previousAddresses;

      // items for delete
      personalInfo.previousAddresses = personalInfo?.previousAddresses?.map(
        (d: IApplicantAddress) => {
          let temp: IApplicantAddress | undefined = previousAddresses.find(
            (ad) => ad.id === d.id
          );

          if (temp) {
            d = temp;
            d.IsDeleted = false;
          } else {
            d.IsDeleted = true;
          }

          return d;
        }
      );

      // new items
      for (const address of previousAddresses) {
        let temp: IApplicantAddress | undefined =
          personalInfo.previousAddresses?.find(
            (ad) =>
              ad.address === address.address &&
              ad.addressUnit === address.addressUnit
          );

        if (!temp) {
          address.id = undefined;
          address.IsDeleted = false;
          personalInfo.previousAddresses?.push(address);
        }
      }
    } else {
      personalInfo.previousAddresses = personalInfo.previousAddresses?.map(
        (d: IApplicantAddress) => {
          d.IsDeleted = true;
          return d;
        }
      );
    }

    // Update Applicant
    //  if (applicant) {
    //   this.apppEntityServices.ApplicantService.upsert(applicant).subscribe(
    //     () => {
    //       if (personalInfo) {
    //         personalInfo.applicantId = applicant.id;
    //         this.apppEntityServices.PersonalInfoService.upsert(
    //           personalInfo
    //         ).subscribe(
    //           () => {
    //             this.notification.success('Personal Info is updated');
    //             this.router.navigateByUrl(`/application/${this.applicant?.id}/2`)
    //           },
    //           (error) => {
    //             this.shared.handleError(error);
    //           }
    //         );
    //       }
    //     },
    //     (error) => {
    //       this.shared.handleError(error);
    //     }
    //   );
    // }
  } */

  /* public onSubmitReview(data: any): void {
    const numberOfPreviousAddresses =
      this.personalInfoForm.value.previousAddresses.length;

    this.reviewFeedback[data.index] = data.reviewFeedbackData;

    this.countOfReview++;

    if (
      this.countOfReview === 10 + numberOfPreviousAddresses &&
      !data.firstLoad
    ) {
      // TODO: Send data to backend and move to next step
      console.log(this.reviewFeedback);
    } else if (data.firstLoad) {
      this.countOfReview = 0;
    }
  } */

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
