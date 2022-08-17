import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { Applicant } from '../../state/model/applicant.model';
import {
  License,
  CDLInformation,
  LicenseModel,
} from '../../state/model/cdl-information';
import { AnswerChoices } from '../../state/model/applicant-question.model';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.FEEDBACK;

  public permitForm: FormGroup;
  public licenseForm: FormGroup;

  public licenseArray: LicenseModel[] = [
    {
      license: 'd263-540-92-166-0',
      countryType: 'USA',
      stateId: 'AL',
      classType: '1234',
      expDate: '01/18/20',
      endorsments: 'Endorsment 1',
      restrictions: 'Restriction 1',
      isEditingLicense: false,
    },
    {
      license: 'd263-540-92-166-0',
      countryType: 'USA',
      stateId: 'AL',
      classType: '1234',
      expDate: '01/18/20',
      endorsments: 'Endorsment 2',
      restrictions: 'Restriction 2',
      isEditingLicense: false,
    },
    {
      license: 'd263-540-92-166-0',
      countryType: 'USA',
      stateId: 'AL',
      classType: '1234',
      expDate: '01/18/20',
      endorsments: 'Endorsment 2',
      restrictions: 'Restriction 2',
      isEditingLicense: false,
    },
    {
      license: 'd263-540-92-166-0',
      countryType: 'USA',
      stateId: 'AL',
      classType: '1234',
      expDate: '01/18/20',
      endorsments: 'Endorsment 2',
      restrictions: 'Restriction 2',
      isEditingLicense: false,
    },
  ];

  public selectedLicenseIndex: number;

  public helperIndex: number = 2;

  public isEditing: boolean = false;

  public formValuesToPatch: any;

  public answerChoices: AnswerChoices[] = [
    {
      id: 1,
      label: 'YES',
      value: 'permitYes',
      name: 'permitYes',
      checked: false,
    },
    {
      id: 2,
      label: 'NO',
      value: 'permitNo',
      name: 'permitNo',
      checked: false,
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
    {},
    {},
    {},
    {},
    {
      lineIndex: 14,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
  ];

  /* public applicant: Applicant | undefined; */

  /* public licenseArray: License[] = []; */

  /* public cdlInformation: CDLInformation | undefined; */

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  public trackByIdentity = (index: number, item: any): number => index;

  private createForm(): void {
    this.licenseForm = this.formBuilder.group({
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

    this.permitForm = this.formBuilder.group({
      permit: [null, Validators.required],
      permitExplain: [null],
      fifthRowReview: [null],
    });
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.PERMIT:
        const selectedCheckbox = event.find(
          (radio: { checked: boolean }) => radio.checked
        );

        if (selectedCheckbox.label === 'YES') {
          this.inputService.changeValidators(
            this.permitForm.get('permitExplain')
          );
        } else {
          this.inputService.changeValidators(
            this.permitForm.get('permitExplain'),
            false
          );
        }

        this.permitForm.get('permit').patchValue(selectedCheckbox.label);

        break;
      default:
        break;
    }
  }

  public onDeleteLicense(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.licenseArray.splice(index, 1);
  }

  public onEditLicense(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.helperIndex = index;
    this.selectedLicenseIndex = index;

    this.isEditing = true;
    this.licenseArray[index].isEditingLicense = true;

    const selectedLicense = this.licenseArray[index];

    this.formValuesToPatch = selectedLicense;
  }

  public getLicenseFormValues(event: any): void {
    this.licenseArray = [...this.licenseArray, event];

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

  public cancelLicenseEditing(event: any): void {
    this.isEditing = false;
    this.licenseArray[this.selectedLicenseIndex].isEditingLicense = false;

    this.helperIndex = 2;
    this.selectedLicenseIndex = -1;
  }

  public saveEditedLicense(event: any): void {
    this.isEditing = false;
    this.licenseArray[this.selectedLicenseIndex].isEditingLicense = false;

    this.licenseArray[this.selectedLicenseIndex] = event;

    this.helperIndex = 2;
    this.selectedLicenseIndex = -1;
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

  /* public onSubmitForm(): void {
    this.shared.clearNotifications();

        let isValid = true;

        if (!this.licenseArray.filter(a => !a.isDeleted).length) {
            if (!this.shared.markInvalid(this.licenseForm)) {
                isValid = false;
            }

            if (this.licenseArray.length < 1) {
                if (this.shared.markInvalid(this.licenseForm)) {
                    this.onAddLicense();
                } else {
                    isValid = false;
                }
            }
        }

        if (this.isPermit === -1) {
            this.notification.warning('Please answer permit.', 'Warning:');
            isValid = false;
        }

        if (this.isPermit === 1) {
            if (!this.shared.markInvalid(this.permitForm)) {
                isValid = false;
            }
        }

        if (!isValid) {
            return false;
        }

     const cdlInfo: CDLInformation = {
      id: this.cdlInformation?.id ? this.cdlInformation?.id : undefined,
      applicantId: this.applicant?.id,
      licences: this.licenseArray,
      permit: this.licenseForm.get('permit').value,
      explain: this.licenseForm.get('permitExplain').value,
    };

    //REDUX
    this.apppEntityServices.CDLInformationService.upsert(
      cdlInfo
    ).subscribe(
      (response) => {
        this.notification.success('CDL is updated');
      },
      (error) => {
        this.shared.handleError(error);
      }
    );
  } */

  /* public onSubmitReview(data: any): void {} */

  ngOnDestroy(): void {}
}
