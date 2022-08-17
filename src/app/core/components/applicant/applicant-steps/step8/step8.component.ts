import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { Applicant } from '../../state/model/applicant.model';
import { Address } from '../../state/model/address.model';
import { DrugAndAlcohol } from '../../state/model/drug-and-alchocol.model';

@Component({
  selector: 'app-step8',
  templateUrl: './step8.component.html',
  styleUrls: ['./step8.component.scss'],
})
export class Step8Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.FEEDBACK;

  public drugTestForm: FormGroup;
  public drugAlcoholStatementForm: FormGroup;

  public selectedAddress: Address = null;
  public selectedSapAddress: Address = null;

  public question = {
    title:
      'Have you, the applicant, tested positive, or refused to test, on any pre-employment drug or alcohol test administered by an employer to which you applied for, but did not obtain, safety-sensitive transportation work covered by DOT agency drug and alcohol testing rules during the past two years?',
    formControlName: 'drugTest',
    answerChoices: [
      {
        id: 1,
        label: 'YES',
        value: 'drugTestYes',
        name: 'drugTestYes',
        checked: true,
      },
      {
        id: 2,
        label: 'NO',
        value: 'drugTestNo',
        name: 'drugTestNo',
        checked: false,
      },
    ],
  };

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
      lineInputs: [false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
  ];

  /* public applicant: Applicant | undefined; */

  /* public drugAndAlcoholInfo: DrugAndAlcohol | undefined; */

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  public createForm(): void {
    this.drugTestForm = this.formBuilder.group({
      drugTest: [true, Validators.required],
    });

    this.drugAlcoholStatementForm = this.formBuilder.group({
      motorCarrier: [null, Validators.required],
      phone: [null, Validators.required],
      address: [null, Validators.required],
      addressUnit: [null, Validators.maxLength(6)],
      sapName: [null, Validators.required],
      sapPhone: [null, Validators.required],
      sapAddress: [null, Validators.required],
      sapAddressUnit: [null, Validators.maxLength(6)],
      isAgreement: [null, Validators.requiredTrue],

      firstRowReview: [null],
      secondRowReview: [null],
      thirdRowReview: [null],
      fourthRowReview: [null],
    });
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
          this.drugTestForm.get(selectedFormControlName).patchValue(true);
        } else {
          this.drugTestForm.get(selectedFormControlName).patchValue(false);
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

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
    }

    if (event.action === 'back-step') {
    }
  }

  /* private formFilling(): void {
    this.drugAlcoholStatementForm.patchValue({
      motorCarrier: this.drugAndAlcoholInfo?.motorCarrier,
      phone: this.drugAndAlcoholInfo?.phone,
      address: this.drugAndAlcoholInfo?.address,
      addressUnit: this.drugAndAlcoholInfo?.addressUnit,
      sapName: this.drugAndAlcoholInfo?.sapName,
      sapPhone: this.drugAndAlcoholInfo?.sapPhone,
      sapAddress: this.drugAndAlcoholInfo?.sapAddress,
      sapAddressUnit: this.drugAndAlcoholInfo?.sapAddressUnit,
      isAgreement: this.drugAndAlcoholInfo?.isAgreement,
    });
  }
 */

  /* public onSubmitForm(): void {
     this.shared.clearNotifications();

        let valid = true;

        if (this.positiveTest === undefined) {
            this.notification.warning('Answer the first question', 'Warning:');
            valid = false;
        }

        if (!this.shared.markInvalid(this.drugAlcoholStatementForm)) {
            valid = false;
        }

        if (!valid) {
            return false;
        }

    const drugAlcoholStatementForm = this.drugAlcoholStatementForm.value;
    const drugAndAlcohol = new DrugAndAlcohol(this.drugAndAlcoholInfo);

    drugAndAlcohol.applicantId = this.applicant?.id;

    drugAndAlcohol.drugTest = drugAlcoholStatementForm.drugTest;
    drugAndAlcohol.motorCarrier = drugAlcoholStatementForm.motorCarrier;
    drugAndAlcohol.phone = drugAlcoholStatementForm.phone;
    drugAndAlcohol.address = drugAlcoholStatementForm.address;
    drugAndAlcohol.addressUnit = drugAlcoholStatementForm.addressUnit;
    drugAndAlcohol.sapName = drugAlcoholStatementForm.sapName;
    drugAndAlcohol.sapPhone = drugAlcoholStatementForm.sapPhone;
    drugAndAlcohol.sapAddress = drugAlcoholStatementForm.sapAddress;
    drugAndAlcohol.sapAddressUnit = drugAlcoholStatementForm.sapAddressUnit;
    drugAndAlcohol.isAgreement = drugAlcoholStatementForm.isAgreement;

    this.apppEntityServices.DrugAndAlchocolService.upsert(
            drugAndAlchocol
        ).subscribe(
            () => {
                this.notification.success('Drug And Alchocol is updated');
            },
            (error: any) => {
                this.shared.handleError(error);
            }
        );
  }
 */

  /* public onSubmitReview(data: any): void {} */

  ngOnDestroy(): void {}
}
