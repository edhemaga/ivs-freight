import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { convertDateToBackend } from 'src/app/core/utils/methods.calculations';

import { ApplicantActionsService } from '../../state/services/applicant-actions.service';
import { ApplicantListsService } from '../../state/services/applicant-lists.service';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { WorkHistoryModel } from '../../state/model/work-history.model';
import {
  CreateWorkExperienceCommand,
  EnumValue,
  TrailerLengthResponse,
  TrailerTypeResponse,
  TruckTypeResponse,
} from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.APPLICANT;

  public applicantId: number;

  public workExperienceForm: FormGroup;

  public formStatus: string = 'INVALID';
  public innerFormStatus: string = 'VALID';
  public markFormInvalid: boolean;
  public markInnerFormInvalid: boolean;

  public workExperienceArray: WorkHistoryModel[] = [];

  public lastWorkExperienceCard: any;

  public selectedWorkExperienceIndex: number;
  public helperIndex: number = 2;

  public isEditing: boolean = false;

  public formValuesToPatch: any;

  public vehicleType: TruckTypeResponse[] = [];
  public trailerType: TrailerTypeResponse[] = [];
  public trailerLengthType: TrailerLengthResponse[] = [];

  public reasonsForLeaving: EnumValue[] = [];

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
    private router: Router,
    private applicantActionsService: ApplicantActionsService,
    private applicantListsService: ApplicantListsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.hasNoWorkExperience();

    this.getDropdownLists();

    this.applicantActionsService.getApplicantInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.applicantId = res.personalInfo.applicantId;
      });
  }

  public trackByIdentity = (index: number, item: any): number => index;

  private createForm(): void {
    this.workExperienceForm = this.formBuilder.group({
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

      noWorkExperience: [false],
    });
  }

  private hasNoWorkExperience(): void {
    this.workExperienceForm
      .get('noWorkExperience')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.formValuesToPatch = null;

          this.formStatus = 'VALID';
          this.innerFormStatus = 'VALID';
        } else {
          this.formStatus = 'INVALID';
          this.innerFormStatus = 'VALID';
        }
      });
  }

  public onDeleteWorkExperience(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.workExperienceArray.splice(index, 1);
  }

  public onEditWorkExperience(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.helperIndex = index;
    this.selectedWorkExperienceIndex = index;

    this.isEditing = true;
    this.workExperienceArray[index].isEditingWorkHistory = true;

    const selectedWorkExperience = this.workExperienceArray[index];

    this.formValuesToPatch = selectedWorkExperience;
  }

  public getWorkExperienceFormValues(event: any): void {
    this.workExperienceArray = [...this.workExperienceArray, event];

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

  public cancelWorkExperienceEditing(event: any): void {
    this.isEditing = false;
    this.workExperienceArray[
      this.selectedWorkExperienceIndex
    ].isEditingWorkHistory = false;

    this.helperIndex = 2;
    this.selectedWorkExperienceIndex = -1;
  }

  public saveEditedWorkExperience(event: any): void {
    this.isEditing = false;
    this.workExperienceArray[
      this.selectedWorkExperienceIndex
    ].isEditingWorkHistory = false;

    this.workExperienceArray[this.selectedWorkExperienceIndex] = event;

    this.helperIndex = 2;
    this.selectedWorkExperienceIndex = -1;
  }

  public onGetFormStatus(status: string): void {
    this.formStatus = status;
  }

  public onGetInnerFormStatus(status: string): void {
    this.innerFormStatus = status;
  }

  public onMarkInvalidEmit(event: any): void {
    if (!event) {
      this.markFormInvalid = false;
    }
  }

  public onMarkInnerInvalidEmit(event: any): void {
    if (!event) {
      this.markInnerFormInvalid = false;
    }
  }

  public onGetLastFormValues(event: any): void {
    this.lastWorkExperienceCard = event;
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

        this.trailerType = data.trailerTypes;

        this.trailerLengthType = data.trailerLenghts;

        this.reasonsForLeaving = data.reasonsForLeave;
      });
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      this.onSubmit();
    }

    if (event.action === 'back-step') {
      this.router.navigate([`/application/${this.applicantId}/1`]);
    }
  }

  public onSubmit(): void {
    if (this.formStatus === 'INVALID') {
      this.markFormInvalid = true;
      return;
    }

    if (this.innerFormStatus === 'INVALID') {
      this.markInnerFormInvalid = true;
      return;
    }

    const filteredWorkExperienceArray = this.workExperienceArray.map((item) => {
      return {
        employer: item.employer,
        jobDescription: item.jobDescription,
        from: convertDateToBackend(item.fromDate),
        to: convertDateToBackend(item.toDate),
        phone: item.employerPhone,
        email: item.employerEmail,
        fax: item.employerFax,
        address: item.employerAddress,
        isDrivingPosition: item.isDrivingPosition,
        cfrPart: item.cfrPart,
        fmcsa: item.fmCSA,
        reasonForLeaving: this.reasonsForLeaving.find(
          (reasonItem) => reasonItem.name === item.reasonForLeaving
        ).id,
        accountForPeriodBetween: item.accountForPeriod,
        classesOfEquipment: item.classesOfEquipment[0]?.vehicleType
          ? item.classesOfEquipment.map((classTtem, index) => {
              return {
                vehicleTypeId: this.vehicleType.find(
                  (findItem) =>
                    findItem.name === item.classesOfEquipment[index].vehicleType
                )?.id,
                trailerTypeId: this.trailerType.find(
                  (findItem) =>
                    findItem.name === item.classesOfEquipment[index].trailerType
                )?.id,
                trailerLengthId: this.trailerLengthType.find(
                  (findItem) =>
                    findItem.name ===
                    item.classesOfEquipment[index].trailerLength
                )?.id,
              };
            })
          : [],
      };
    });

    const { noWorkExperience } = this.workExperienceForm.value;

    let filteredLastWorkExperienceCard: any;

    if (!noWorkExperience) {
      filteredLastWorkExperienceCard = {
        employer: this.lastWorkExperienceCard.employer,
        jobDescription: this.lastWorkExperienceCard.jobDescription,
        from: convertDateToBackend(this.lastWorkExperienceCard.fromDate),
        to: convertDateToBackend(this.lastWorkExperienceCard.toDate),
        phone: this.lastWorkExperienceCard.employerPhone,
        email: this.lastWorkExperienceCard.employerEmail,
        fax: this.lastWorkExperienceCard.employerFax,
        address: this.lastWorkExperienceCard.employerAddress,
        isDrivingPosition: this.lastWorkExperienceCard.isDrivingPosition,
        cfrPart: this.lastWorkExperienceCard.cfrPart,
        fmcsa: this.lastWorkExperienceCard.fmCSA,
        reasonForLeaving: this.reasonsForLeaving.find(
          (item) => item.name === this.lastWorkExperienceCard.reasonForLeaving
        ).id,
        accountForPeriodBetween: this.lastWorkExperienceCard.accountForPeriod,
        classesOfEquipment: this.lastWorkExperienceCard.classesOfEquipment[0]
          .vehicleType
          ? this.lastWorkExperienceCard.classesOfEquipment.map(
              (item, index) => {
                return {
                  vehicleTypeId: this.vehicleType.find(
                    (item) =>
                      item.name ===
                      this.lastWorkExperienceCard.classesOfEquipment[index]
                        .vehicleType
                  )?.id,
                  trailerTypeId: this.trailerType.find(
                    (item) =>
                      item.name ===
                      this.lastWorkExperienceCard.classesOfEquipment[index]
                        .trailerType
                  )?.id,
                  trailerLengthId: this.trailerLengthType.find(
                    (item) =>
                      item.name ===
                      this.lastWorkExperienceCard.classesOfEquipment[index]
                        .trailerLength
                  )?.id,
                };
              }
            )
          : [],
      };
    }

    const saveData: CreateWorkExperienceCommand = {
      applicantId: this.applicantId,
      haveWorkExperience: noWorkExperience,
      workExperienceItems: noWorkExperience
        ? []
        : [...filteredWorkExperienceArray, filteredLastWorkExperienceCard],
    };

    this.applicantActionsService
      .createWorkExperience(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/3`]);
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
