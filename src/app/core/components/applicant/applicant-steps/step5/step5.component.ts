import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { Applicant } from '../../state/model/applicant.model';
import {
  Violation,
  ViolationInfo,
  ViolationModel,
} from '../../state/model/violations.model';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.scss'],
})
export class Step5Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.FEEDBACK;

  public violationsForm: FormGroup;
  public trafficViolationsForm: FormGroup;
  public notBeenConvictedForm: FormGroup;
  public onlyOneHoldLicenseForm: FormGroup;
  public certifyForm: FormGroup;

  public violationsArray: ViolationModel[] = [
    {
      violationDate: '01/20/19',
      truckType: 'Cargo Van',
      violationLocation: {
        address: 'Chicago, IL, USA',
        city: 'Chicago',
        country: 'US',
        state: 'IL',
        stateShortName: 'IL',
        street: '',
        streetNumber: '',
        zipCode: '',
      },
      violationDescription: 'Lorem Ipsum Dolor Sit Ametblabla',
      isEditingViolation: false,
    },
    {
      violationDate: '02/20/20',
      truckType: 'Cargo Van',
      violationLocation: {
        address: 'Chicago, IL, USA',
        city: 'Chicago',
        country: 'US',
        state: 'IL',
        stateShortName: 'IL',
        street: '',
        streetNumber: '',
        zipCode: '',
      },
      violationDescription: 'Lorem Ipsum Dolor Sit Ametblabla',
      isEditingViolation: false,
    },
    {
      violationDate: '03/20/21',
      truckType: 'Cargo Van',
      violationLocation: {
        address: 'Chicago, IL, USA',
        city: 'Chicago',
        country: 'US',
        state: 'IL',
        stateShortName: 'IL',
        street: '',
        streetNumber: '',
        zipCode: '',
      },
      violationDescription: 'Lorem Ipsum Dolor Sit Ametblabla',
      isEditingViolation: false,
    },
    {
      violationDate: '04/20/21',
      truckType: 'Cargo Van',
      violationLocation: {
        address: 'Chicago, IL, USA',
        city: 'Chicago',
        country: 'US',
        state: 'IL',
        stateShortName: 'IL',
        street: '',
        streetNumber: '',
        zipCode: '',
      },
      violationDescription: 'Lorem Ipsum Dolor Sit Ametblabla',
      isEditingViolation: false,
    },
  ];

  public selectedViolationIndex: number;

  public helperIndex: number = 2;

  public isEditing: boolean = false;

  public formValuesToPatch: any;

  public openAnnotationArray: {
    lineIndex?: number;
    lineInputs?: boolean[];
    displayAnnotationButton?: boolean;
    displayAnnotationTextArea?: boolean;
  }[] = [
    {
      lineIndex: 0,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 1,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 2,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 3,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {},
    {},
    {},
    {},
    {},
    {},
  ];

  /* public applicant: Applicant | undefined; */

  /* public violationFormArray: Violation[] = []; */

  /* public violationInfo: ViolationInfo | undefined; */

  /* public editViolation: number = -1; */

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
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
      cardReview1: [null],
      cardReview2: [null],
      cardReview3: [null],
      cardReview4: [null],
      cardReview5: [null],
      cardReview6: [null],
      cardReview7: [null],
      cardReview8: [null],
      cardReview9: [null],
      cardReview10: [null],
    });
  }

  public handleCheckboxParagraphClick(type: string): void {
    if (this.selectedMode === 'FEEDBACK_MODE') {
      return;
    }

    if (type === 'notBeenConvicted') {
      this.notBeenConvictedForm.patchValue({
        notBeenConvicted:
          !this.notBeenConvictedForm.get('notBeenConvicted').value,
      });
    }

    if (type === 'certify') {
      this.certifyForm.patchValue({
        certify: !this.certifyForm.get('certify').value,
      });
    }
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
    this.selectedViolationIndex = index;

    this.isEditing = true;
    this.violationsArray[index].isEditingViolation = true;

    const selectedViolation = this.violationsArray[index];

    this.formValuesToPatch = selectedViolation;
  }

  public getViolationFormValues(event: any): void {
    this.violationsArray = [...this.violationsArray, event];

    this.helperIndex = 2;

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

  public saveEditedViolation(event: any): void {
    this.isEditing = false;
    this.violationsArray[this.selectedViolationIndex].isEditingViolation =
      false;

    this.violationsArray[this.selectedViolationIndex] = event;

    this.helperIndex = 2;
    this.selectedViolationIndex = -1;
  }

  public cancelViolationEditing(event: any): void {
    this.isEditing = false;
    this.violationsArray[this.selectedViolationIndex].isEditingViolation =
      false;

    this.helperIndex = 2;
    this.selectedViolationIndex = -1;
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
 */

  /* public onSubmitForm(): void {
    this.shared.clearNotifications();

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
        }
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

     this.apppEntityServices.ViolationService.upsert(
            violationInfo
        ).subscribe(
            response => {
                this.notification.success('Violation is updated');
            },
            error => {
                this.shared.handleError(error);
            }
        );
  } */

  /* public onSubmitReview(data: any): void {} */

  ngOnDestroy(): void {}
}
