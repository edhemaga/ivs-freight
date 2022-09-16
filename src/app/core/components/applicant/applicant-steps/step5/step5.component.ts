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
import { ViolationModel } from '../../state/model/violations.model';
import {
  CreateTrafficViolationCommand,
  TruckTypeResponse,
} from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.scss'],
})
export class Step5Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.APPLICANT;

  public applicantId: number;

  public violationsForm: FormGroup;
  public trafficViolationsForm: FormGroup;
  public notBeenConvictedForm: FormGroup;
  public onlyOneHoldLicenseForm: FormGroup;
  public certifyForm: FormGroup;

  public formStatus: string = 'INVALID';
  public markFormInvalid: boolean;

  public violationsArray: ViolationModel[] = [];

  public lastViolationsCard: any;

  public vehicleType: TruckTypeResponse[] = [];

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

    this.hasNoTrafficViolations();

    this.applicantActionsService.getApplicantInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.applicantId = res.personalInfo.applicantId;
      });
  }

  public trackByIdentity = (index: number, item: any): number => index;

  public createForm(): void {
    this.trafficViolationsForm = this.formBuilder.group({
      noViolationsForPastTwelveMonths: [false],
    });

    this.notBeenConvictedForm = this.formBuilder.group({
      notBeenConvicted: [false, Validators.requiredTrue],
    });

    this.onlyOneHoldLicenseForm = this.formBuilder.group({
      onlyOneHoldLicense: [false, Validators.requiredTrue],
    });

    this.certifyForm = this.formBuilder.group({
      certify: [false, Validators.requiredTrue],
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

  private hasNoTrafficViolations(): void {
    this.trafficViolationsForm
      .get('noViolationsForPastTwelveMonths')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidatorsCheck(
            this.notBeenConvictedForm.get('notBeenConvicted'),
            false
          );
          this.inputService.changeValidatorsCheck(
            this.onlyOneHoldLicenseForm.get('onlyOneHoldLicense'),
            false
          );
          this.inputService.changeValidatorsCheck(
            this.certifyForm.get('certify'),
            false
          );

          this.notBeenConvictedForm.patchValue({ notBeenConvicted: null });
          this.onlyOneHoldLicenseForm.patchValue({ onlyOneHoldLicense: null });
          this.certifyForm.patchValue({ certify: null });

          this.formStatus = 'VALID';

          this.formValuesToPatch = {
            date: null,
            vehicleType: null,
            location: null,
            description: null,
          };

          this.violationsArray = [];
        } else {
          this.inputService.changeValidatorsCheck(
            this.notBeenConvictedForm.get('notBeenConvicted')
          );
          this.inputService.changeValidatorsCheck(
            this.onlyOneHoldLicenseForm.get('onlyOneHoldLicense')
          );
          this.inputService.changeValidatorsCheck(
            this.certifyForm.get('certify')
          );

          this.formStatus = 'INVALID';
        }
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

  public onGetFormStatus(status: string): void {
    this.formStatus = status;
  }

  public onMarkInvalidEmit(event: any): void {
    if (!event) {
      this.markFormInvalid = false;
    }
  }

  public onGetLastFormValues(event: any): void {
    this.lastViolationsCard = event;
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
        this.vehicleType = data.truckTypes;
      });
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      this.onSubmit();
    }

    if (event.action === 'back-step') {
      this.router.navigate([`/application/${this.applicantId}/4`]);
    }
  }

  public onSubmit(): void {
    if (this.notBeenConvictedForm.invalid) {
      this.inputService.markInvalid(this.notBeenConvictedForm);
      return;
    }

    if (this.onlyOneHoldLicenseForm.invalid) {
      this.inputService.markInvalid(this.onlyOneHoldLicenseForm);
      return;
    }

    if (this.certifyForm.invalid) {
      this.inputService.markInvalid(this.certifyForm);
      return;
    }

    if (this.formStatus === 'INVALID') {
      this.markFormInvalid = true;
      return;
    }

    const { noViolationsForPastTwelveMonths } =
      this.trafficViolationsForm.value;

    const { notBeenConvicted } = this.notBeenConvictedForm.value;

    const { onlyOneHoldLicense } = this.onlyOneHoldLicenseForm.value;

    const { certify } = this.certifyForm.value;

    const filteredViolationsArray = this.violationsArray.map((item) => {
      return {
        date: convertDateToBackend(item.date),
        vehicleTypeId: this.vehicleType.find(
          (vehicleItem) => vehicleItem.name === item.vehicleType
        ).id,
        location: item.location.address,
        description: item.description,
      };
    });

    let filteredLastViolationsCard: any;

    if (!noViolationsForPastTwelveMonths) {
      filteredLastViolationsCard = {
        date: convertDateToBackend(this.lastViolationsCard.date),
        vehicleTypeId: this.vehicleType.find(
          (vehicleItem) =>
            vehicleItem.name === this.lastViolationsCard.vehicleType
        ).id,
        location: this.lastViolationsCard.location,
        description: this.lastViolationsCard.description,
      };
    }

    const saveData: CreateTrafficViolationCommand = {
      applicantId: this.applicantId,
      noViolationsForPastTwelveMonths,
      notBeenConvicted: noViolationsForPastTwelveMonths
        ? false
        : notBeenConvicted,
      onlyOneHoldLicense: noViolationsForPastTwelveMonths
        ? false
        : onlyOneHoldLicense,
      certifyViolations: noViolationsForPastTwelveMonths ? false : certify,
      trafficViolationItems: noViolationsForPastTwelveMonths
        ? []
        : [...filteredViolationsArray, filteredLastViolationsCard],
    };

    this.applicantActionsService
      .createTrafficViolations(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/6`]);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  /* public onSubmitReview(data: any): void {} */

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
