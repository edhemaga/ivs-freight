import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import {
  addressUnitValidation,
  addressValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { Address } from '../../state/model/address.model';
import { CreateDrugAndAlcoholCommand } from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step8',
  templateUrl: './step8.component.html',
  styleUrls: ['./step8.component.scss'],
})
export class Step8Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.APPLICANT;

  public drugTestForm: FormGroup;
  public drugAlcoholStatementForm: FormGroup;

  public applicantId: number;

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

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private router: Router,
    private applicantActionsService: ApplicantActionsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.isTestedNegative();

    this.applicantActionsService.getApplicantInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.applicantId = res.personalInfo.applicantId;
      });
  }

  public createForm(): void {
    this.drugTestForm = this.formBuilder.group({
      drugTest: [true, Validators.required],
    });

    this.drugAlcoholStatementForm = this.formBuilder.group({
      motorCarrier: [null, Validators.required],
      phone: [null, Validators.required],
      address: [null, [Validators.required, ...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      sapName: [null, Validators.required],
      sapPhone: [null, Validators.required],
      sapAddress: [null, [Validators.required, ...addressValidation]],
      sapAddressUnit: [null, [...addressUnitValidation]],
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

  private isTestedNegative(): void {
    this.drugTestForm
      .get('drugTest')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(
            this.drugAlcoholStatementForm.get('motorCarrier'),
            false
          );
          this.inputService.changeValidators(
            this.drugAlcoholStatementForm.get('phone'),
            false
          );
          this.inputService.changeValidators(
            this.drugAlcoholStatementForm.get('address'),
            false
          );
          this.inputService.changeValidators(
            this.drugAlcoholStatementForm.get('sapName'),
            false
          );
          this.inputService.changeValidators(
            this.drugAlcoholStatementForm.get('sapPhone'),
            false
          );
          this.inputService.changeValidators(
            this.drugAlcoholStatementForm.get('sapAddress'),
            false
          );

          this.drugAlcoholStatementForm.get('isAgreement').clearValidators();
          this.drugAlcoholStatementForm.patchValue({ isAgreement: null });

          this.drugAlcoholStatementForm.patchValue({
            motorCarrier: null,
            phone: null,
            address: null,
            addressUnit: null,
            sapName: null,
            sapPhone: null,
            sapAddress: null,
            sapAddressUnit: null,
            isAgreement: null,
          });
        } else {
          this.inputService.changeValidators(
            this.drugAlcoholStatementForm.get('motorCarrier')
          );
          this.inputService.changeValidators(
            this.drugAlcoholStatementForm.get('phone')
          );
          this.inputService.changeValidators(
            this.drugAlcoholStatementForm.get('address')
          );
          this.inputService.changeValidators(
            this.drugAlcoholStatementForm.get('sapName')
          );
          this.inputService.changeValidators(
            this.drugAlcoholStatementForm.get('sapPhone')
          );
          this.inputService.changeValidators(
            this.drugAlcoholStatementForm.get('sapAddress')
          );

          this.drugAlcoholStatementForm
            .get('isAgreement')
            .setValidators(Validators.requiredTrue);
        }

        this.drugAlcoholStatementForm.controls[
          'isAgreement'
        ].updateValueAndValidity();
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
      this.onSubmit();
    }

    if (event.action === 'back-step') {
      this.router.navigate([`/application/${this.applicantId}/7`]);
    }
  }

  public onSubmit(): void {
    if (this.drugAlcoholStatementForm.invalid) {
      this.inputService.markInvalid(this.drugAlcoholStatementForm);
      return;
    }

    if (this.drugTestForm.invalid) {
      this.inputService.markInvalid(this.drugTestForm);
      return;
    }

    const {
      motorCarrier,
      phone,
      address,
      addressUnit,
      sapName,
      sapPhone,
      sapAddress,
      sapAddressUnit,
      isAgreement,
      firstRowReview,
      secondRowReview,
      thirdRowReview,
      fourthRowReview,
      ...drugAlcoholStatementForm
    } = this.drugAlcoholStatementForm.value;

    if (this.selectedAddress) {
      this.selectedAddress.addressUnit = addressUnit;
      this.selectedAddress.county = '';
    }

    if (this.selectedSapAddress) {
      this.selectedSapAddress.addressUnit = sapAddressUnit;
      this.selectedSapAddress.county = '';
    }

    const drugTestFormValue = this.drugTestForm.get('drugTest').value;

    const saveData: CreateDrugAndAlcoholCommand = {
      ...drugAlcoholStatementForm,
      applicantId: this.applicantId,
      positiveTest: drugTestFormValue,
      motorCarrier: drugTestFormValue ? motorCarrier : null,
      phone: drugTestFormValue ? phone : null,
      address: drugTestFormValue ? this.selectedAddress : null,
      sapName: drugTestFormValue ? sapName : null,
      sapPhone: drugTestFormValue ? sapPhone : null,
      sapAddress: drugTestFormValue ? this.selectedSapAddress : null,
      certifyInformation: isAgreement,
    };

    this.applicantActionsService
      .createDrugAndAlcohol(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/9`]);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  /* public onSubmitReview(data: any): void {} */

  ngOnDestroy(): void {}
}
