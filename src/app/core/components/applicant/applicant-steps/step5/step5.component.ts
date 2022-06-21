import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { Applicant } from '../../state/model/applicant.model';
import { TruckType } from '../../state/model/truck-type.model';
import { Address } from '../../state/model/address.model';
import { Violation, ViolationInfo } from '../../state/model/violations.model';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.scss'],
})
export class Step5Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.APPLICANT;
  public applicant: Applicant | undefined;

  public violationsForm: FormGroup;
  public violationFormArray: Violation[] = [];
  public violationInfo: ViolationInfo | undefined;

  public licenseFormArray: any[] = [
    {
      active: true,
      license: '234234',
      country: 'US',
      state: 'Ohio',
      classData: 'A',
      expDate: '19/02/21',
      endorsments: [],
      restrictions: [],
    },
  ];

  public truckType: TruckType[] = [];

  public selectedTruckType: any = null;
  public selectedAddress: Address = null;

  public editViolation: number = -1;

  public trackByIdentity = (index: number, item: any): number => index;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formInit();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  public formInit(): void {
    this.violationsForm = this.formBuilder.group({
      noViolationsForPastTwelveMonths: [false, Validators.requiredTrue],
      notBeenConvicted: [false, Validators.requiredTrue],
      onlyOneHoldLicense: [false, Validators.requiredTrue],
      violationDate: [null, Validators.required],
      truckType: [null, Validators.required],
      violationLocation: [null, Validators.required],
      violationDescription: [null, Validators.required],
      certify: [null, Validators.requiredTrue],
    });
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.TRUCK_TYPE:
        this.selectedTruckType = event;

        break;
      case InputSwitchActions.ADDRESS:
        this.selectedAddress = event.address;

        if (!event.valid) {
          this.violationsForm
            .get('violationLocation')
            .setErrors({ invalid: true });
        }

        break;
      default:
        break;
    }
  }

  public onAddViolation(): void {
    /* this.shared.clearNotifications(); */

    const violationForm = this.violationsForm.value;
    const violation = new Violation();

    violation.violationLocation = violationForm.violationLocation;
    violation.violationDate = violationForm.violationDate;
    violation.violationDescription = violationForm.violationDescription;
    violation.truckType = violationForm.truckType;

    violation.isDeleted = false;

    this.violationFormArray.push(violation);

    this.violationsForm.reset();
    this.editViolation = -1;
  }

  public onUpdateViolation(): void {
    /* this.shared.clearNotifications(); */

    if (this.violationFormArray?.length) {
      const violationForm = this.violationsForm.value;
      const violation = new Violation(
        this.violationFormArray[this.editViolation]
      );

      violation.violationLocation = violationForm.violationLocation;
      violation.violationDate = violationForm.violationDate;
      violation.violationDescription = violationForm.violationDescription;
      violation.truckType = violationForm.truckType;

      violation.isDeleted = false;

      this.violationFormArray[this.editViolation] = violation;
    }

    this.violationsForm.reset();
    this.editViolation = -1;
  }

  public onEditViolation(index: number): void {
    this.violationsForm.patchValue({
      violationDate: this.violationFormArray[index].violationDate,
      truckType: this.violationFormArray[index].truckType,
      violationLocation: this.violationFormArray[index].violationLocation,
      violationDescription: this.violationFormArray[index].violationDescription,
    });

    this.editViolation = index;
  }

  public onDeleteViolation(index: number): void {
    if (this.violationFormArray?.length && this.violationFormArray[index]) {
      if (this.violationFormArray[index].id) {
        this.violationFormArray[index].isDeleted = true;
      } else {
        this.violationFormArray.splice(index, 1);
      }
    }
  }

  private formFilling(): void {
    this.violationFormArray = this.violationInfo?.violations
      ? this.violationInfo?.violations
      : [];

    this.violationsForm = this.formBuilder.group({
      noViolationsForPastTwelveMonths: [
        this.violationInfo?.noViolationsForPastTwelveMonths,
        Validators.required,
      ],
      notBeenConvicted: [
        this.violationInfo?.notBeenConvicted,
        Validators.required,
      ],
      onlyOneHoldLicense: [
        this.violationInfo?.onlyOneHoldLicense,
        Validators.required,
      ],
      violationDate: [null, Validators.required],
      truckType: [null, Validators.required],
      violationLocation: [null, Validators.required],
      violationDescription: [null, Validators.required],
      certify: [this.violationInfo?.certify, Validators.required],
    });
  }

  public onSubmitForm(): void {
    /* this.shared.clearNotifications();

        if (!this.noViolationsForm.value.noViolationsForPastTwelveMonth) {
            let isValid = true;

            if (this.editViolation !== -1) {
                this.notification.warning('Finish violation edit', 'Warning:');

                isValid = false;
            }

            if (!this.violationData?.length) {
                if (this.shared.markInvalid(this.violationForm)) {
                    this.onCreateViolation();
                } else {
                    isValid = false;
                }
            }

            if (!this.certifyForm.value.certify) {
                this.notification.warning(
                    'You certify that the following is true',
                    'Warning:'
                );
                this.isCertifyInvalid = false;

                const interval = setInterval(() => {
                    this.isCertifyInvalid = true;
                    clearInterval(interval);
                }, 200);

                isValid = false;
            }

            if (!isValid) {
                return false;
            }
        } */

    const violationsForm = this.violationsForm.value;
    const violationInfo = new ViolationInfo(this.violationInfo);

    violationInfo.violations = this.violationFormArray;
    violationInfo.applicantId = this.applicant?.id;

    violationInfo.noViolationsForPastTwelveMonths =
      violationsForm.noViolationsForPastTwelveMonths;

    violationInfo.notBeenConvicted =
      violationsForm.noViolationsForPastTwelveMonths
        ? false
        : violationsForm.notBeenConvicted;

    violationInfo.onlyOneHoldLicense =
      violationsForm.noViolationsForPastTwelveMonths
        ? false
        : violationsForm.onlyOneHoldLicense;

    violationInfo.certify = violationsForm.noViolationsForPastTwelveMonths
      ? false
      : violationsForm.certify;

    /*  this.apppEntityServices.ViolationService.upsert(
            violationInfo
        ).subscribe(
            response => {
                this.notification.success('Violation is updated');
            },
            error => {
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
