import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { convertDateToBackend } from 'src/app/core/utils/methods.calculations';

import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { WorkHistoryModel } from '../../state/model/work-history.model';
import { CreateWorkExperienceCommand } from 'appcoretruckassist/model/models';

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
    private applicantActionsService: ApplicantActionsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.hasNoWorkExperience();

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

    const { noWorkExperience } = this.workExperienceForm.value;

    let filteredLastWorkExperienceCard: any;

    if (!noWorkExperience) {
      filteredLastWorkExperienceCard = {
        employer: this.lastWorkExperienceCard.employer,
        jobDescription: this.lastWorkExperienceCard.jobDescription,
        from: convertDateToBackend(this.lastWorkExperienceCard.fromDate),
        to: convertDateToBackend(this.lastWorkExperienceCard.toDate),
        phone: this.lastWorkExperienceCard.employerPhone,
      };
    }

    const saveData: CreateWorkExperienceCommand = {
      applicantId: this.applicantId,
      haveWorkExperience: noWorkExperience,
      workExperienceItems: noWorkExperience
        ? []
        : [filteredLastWorkExperienceCard],
    };

    console.log(saveData);
  }

  /* public onSubmitReview(data: any): void {} */

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
