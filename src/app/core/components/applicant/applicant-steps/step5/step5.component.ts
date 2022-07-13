import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { isFormValueEqual } from '../../state/utils/utils';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { Applicant } from '../../state/model/applicant.model';
import { TruckType } from '../../state/model/truck-type.model';
import { Address } from '../../state/model/address.model';
import {
  Violation,
  ViolationInfo,
  ViolationModel,
} from '../../state/model/violations.model';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.scss'],
})
export class Step5Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.APPLICANT;

  public applicant: Applicant | undefined;

  private subscription: Subscription;

  public trafficViolationsForm: FormGroup;
  public notBeenConvictedForm: FormGroup;
  public onlyOneHoldLicenseForm: FormGroup;
  public certifyForm: FormGroup;

  public violationsForm: FormGroup;
  public violationsArray: ViolationModel[] = [
    {
      violationDate: '01/20/19',
      truckType: 'Cargo Van',
      violationLocation: 'Chicago, IL 25002',
      violationDescription: 'Lorem ipsum dolor sit ametblabla',
      isEditingViolation: false,
    },
    {
      violationDate: '02/20/20',
      truckType: 'Cargo Van',
      violationLocation: 'Chicago, IL 25002',
      violationDescription: 'Lorem ipsum dolor sit ametblabla',
      isEditingViolation: false,
    },
    {
      violationDate: '03/20/21',
      truckType: 'Cargo Van',
      violationLocation: 'Chicago, IL 25002',
      violationDescription: 'Lorem ipsum dolor sit ametblabla',
      isEditingViolation: false,
    },
    {
      violationDate: '04/20/21',
      truckType: 'Cargo Van',
      violationLocation: 'Chicago, IL 25002',
      violationDescription: 'Lorem ipsum dolor sit ametblabla',
      isEditingViolation: false,
    },
  ];

  public isEditing: boolean = false;
  public isViolationEdited: boolean = false;

  public truckType: TruckType[] = [];

  public selectedViolationIndex: number;
  public selectedTruckType: any = null;
  public selectedAddress: Address = null;

  public helperIndex: number = 2;

  //

  /* public violationFormArray: Violation[] = []; */

  public violationInfo: ViolationInfo | undefined;

  public editViolation: number = -1;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private inputResetService: TaInputResetService
  ) {}

  ngOnInit(): void {
    this.createForm();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  public trackByIdentity = (index: number, item: any): number => index;

  public createForm(): void {
    this.trafficViolationsForm = this.formBuilder.group({
      noViolationsForPastTwelveMonths: [false],
    });

    this.notBeenConvictedForm = this.formBuilder.group({
      notBeenConvicted: [false, Validators.required],
    });

    this.onlyOneHoldLicenseForm = this.formBuilder.group({
      onlyOneHoldLicense: [false, Validators.required],
    });

    this.certifyForm = this.formBuilder.group({
      certify: [false, Validators.required],
    });

    this.violationsForm = this.formBuilder.group({
      violationDate: [null, Validators.required],
      truckType: [null, Validators.required],
      violationLocation: [null, Validators.required],
      violationDescription: [null, Validators.required],
    });
  }

  public handleCheckboxParagraphClick(type: string) {
    if (type === 'notBeenConvicted') {
      this.violationsForm.patchValue({
        notBeenConvicted: !this.violationsForm.get('notBeenConvicted').value,
      });
    }

    if (type === 'certify') {
      this.violationsForm.patchValue({
        certify: !this.violationsForm.get('certify').value,
      });
    }
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
    if (this.violationsForm.invalid) {
      this.inputService.markInvalid(this.violationsForm);
      return;
    }

    this.helperIndex = 2;

    this.inputResetService.resetInputSubject.next(true);

    /*  const violationForm = this.violationsForm.value;
    const violation = new Violation();

    violation.violationLocation = violationForm.violationLocation;
    violation.violationDate = violationForm.violationDate;
    violation.violationDescription = violationForm.violationDescription;
    violation.truckType = violationForm.truckType;

    violation.isDeleted = false;

    this.violationFormArray.push(violation);

    this.violationsForm.reset();
    this.editViolation = -1; */
  }

  public onDeleteViolation(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.violationsArray.splice(index, 1);
  }

  public onEditViolation(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.helperIndex = index;

    this.isViolationEdited = false;

    this.isEditing = true;
    this.violationsArray[index].isEditingViolation = true;

    this.selectedViolationIndex = index;

    const selectedViolation = this.violationsArray[index];

    this.violationsForm.patchValue({
      violationDate: selectedViolation.violationDate,
      truckType: selectedViolation.truckType,
      violationLocation: selectedViolation.violationLocation,
      violationDescription: selectedViolation.violationDescription,
    });

    this.subscription = this.violationsForm.valueChanges.subscribe(
      (newFormValue) => {
        if (isFormValueEqual(selectedViolation, newFormValue)) {
          this.isViolationEdited = false;
        } else {
          this.isViolationEdited = true;
        }
      }
    );
  }

  public onSaveEditedViolation(): void {
    if (this.violationsForm.invalid) {
      this.inputService.markInvalid(this.violationsForm);
      return;
    }

    if (!this.isViolationEdited) {
      return;
    }

    this.violationsArray[this.selectedViolationIndex] =
      this.violationsForm.value;

    this.isEditing = false;
    this.violationsArray[this.selectedViolationIndex].isEditingViolation =
      false;

    this.isViolationEdited = false;

    this.helperIndex = 2;

    this.violationsForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }

  public onCancelEditAccident(): void {
    this.isEditing = false;
    this.violationsArray[this.selectedViolationIndex].isEditingViolation =
      false;

    this.isViolationEdited = false;

    this.helperIndex = 2;

    this.violationsForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }

  private formFilling(): void {
    /*  this.violationFormArray = this.violationInfo?.violations
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
    }); */
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
    /*    const violationsForm = this.violationsForm.value;
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
 */
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
