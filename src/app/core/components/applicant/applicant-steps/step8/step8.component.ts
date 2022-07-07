import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  public selectedMode: string = SelectedMode.APPLICANT;

  public applicant: Applicant | undefined;

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

  public drugAndAlcoholInfo: DrugAndAlcohol | undefined;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
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

  private formFilling(): void {
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

  public onSubmitForm(): void {
    /*  this.shared.clearNotifications();

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
        } */

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

    /* this.apppEntityServices.DrugAndAlchocolService.upsert(
            drugAndAlchocol
        ).subscribe(
            () => {
                this.notification.success('Drug And Alchocol is updated');
            },
            (error: any) => {
                this.shared.handleError(error);
            }
        ); */
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      this.onSubmitForm();
    }
  }

  public onSubmitReview(data: any): void {}

  ngOnDestroy(): void {}
}
