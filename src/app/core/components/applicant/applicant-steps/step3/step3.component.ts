import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { convertDateToBackend } from 'src/app/core/utils/methods.calculations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';
import { ApplicantListsService } from '../../state/services/applicant-lists.service';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { LicenseModel } from '../../state/model/cdl-information';
import { AnswerChoices } from '../../state/model/applicant-question.model';
import {
  CountryType,
  CreateApplicantCdlCommand,
} from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.APPLICANT;

  public permitForm: FormGroup;
  public licenseForm: FormGroup;

  public formStatus: string = 'INVALID';
  public markFormInvalid: boolean;

  public licenseArray: LicenseModel[] = [];

  public lastLicenseCard: any;

  public applicantId: number;

  public selectedLicenseIndex: number;
  public helperIndex: number = 2;

  public isEditing: boolean = false;

  public formValuesToPatch: any;

  public canadaStates: any[] = [];
  public usStates: any[] = [];

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

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private router: Router,
    private applicantActionsService: ApplicantActionsService,
    private applicantListsService: ApplicantListsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.getDropdownLists();

    this.applicantActionsService.getApplicantInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.applicantId = res.personalInfo.applicantId;
      });
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
          this.permitForm.get('permit').patchValue(true);

          this.inputService.changeValidators(
            this.permitForm.get('permitExplain')
          );
        } else {
          this.permitForm.get('permit').patchValue(false);

          this.inputService.changeValidators(
            this.permitForm.get('permitExplain'),
            false
          );
        }

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

  public onGetFormStatus(status: string): void {
    this.formStatus = status;
  }

  public onMarkInvalidEmit(event: any): void {
    if (!event) {
      this.markFormInvalid = false;
    }
  }

  public onGetLastFormValues(event: any): void {
    this.lastLicenseCard = event;
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

  public getDropdownLists(): void {
    this.applicantListsService
      .getDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.usStates = data.usStates.map((item) => {
          return {
            id: item.id,
            name: item.stateShortName,
            stateName: item.stateName,
          };
        });

        this.canadaStates = data.canadaStates.map((item) => {
          return {
            id: item.id,
            name: item.stateShortName,
            stateName: item.stateName,
          };
        });
      });
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      this.onSubmit();
    }

    if (event.action === 'back-step') {
      this.router.navigate([`/application/${this.applicantId}/2`]);
    }
  }

  public onSubmit(): void {
    if (this.permitForm.invalid) {
      this.inputService.markInvalid(this.permitForm);
      return;
    }

    if (this.formStatus === 'INVALID') {
      this.markFormInvalid = true;
      return;
    }

    const { permit, permitExplain } = this.permitForm.value;

    const filteredLicenseArray = this.licenseArray.map((item) => {
      const stateId = this.usStates.find(
        (stateItem) => stateItem.name === item.state
      )
        ? this.usStates.find((stateItem) => stateItem.name === item.state).id
        : this.canadaStates.find((stateItem) => stateItem.name === item.state)
            .id;

      return {
        licenseNumber: item.licenseNumber,
        country: item.country as CountryType,
        stateId,
        class: item.classType,
        expDate: convertDateToBackend(item.expDate),
        restrictions: item.restrictions.map((item) => item.id),
        endorsements: item.endorsments.map((item) => item.id),
      };
    });

    const filteredLastLicenseCardStateId = this.usStates.find(
      (stateItem) => stateItem.name === this.lastLicenseCard.state
    )
      ? this.usStates.find(
          (stateItem) => stateItem.name === this.lastLicenseCard.state
        ).id
      : this.canadaStates.find(
          (stateItem) => stateItem.name === this.lastLicenseCard.state
        ).id;

    const filteredLastLicenseCard = {
      licenseNumber: this.lastLicenseCard.licenseNumber,
      country: this.lastLicenseCard.country as CountryType,
      stateId: filteredLastLicenseCardStateId,
      class: this.lastLicenseCard.classType,
      expDate: convertDateToBackend(this.lastLicenseCard.expDate),
      restrictions: this.lastLicenseCard.restrictions.map((item) => item.id),
      endorsements: this.lastLicenseCard.endorsments.map((item) => item.id),
    };

    const saveData: CreateApplicantCdlCommand = {
      applicantId: this.applicantId,
      cdlDenied: permit,
      cdlDeniedExplanation: permitExplain,
      licences: [...filteredLicenseArray, filteredLastLicenseCard],
    };

    this.applicantActionsService
      .createCdlInformation(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/4`]);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  /* public onSubmitReview(data: any): void {} */

  ngOnDestroy(): void {}
}
