import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { addressValidation } from '../../../shared/ta-input/ta-input.regex-validations';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { convertDateToBackend } from 'src/app/core/utils/methods.calculations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { ApplicantQuestion } from '../../state/model/applicant-question.model';
import {
  AddressEntity,
  CreateSevenDaysHosCommand,
} from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step7',
  templateUrl: './step7.component.html',
  styleUrls: ['./step7.component.scss'],
})
export class Step7Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.APPLICANT;

  public sevenDaysHosForm: FormGroup;

  public applicantId: number;

  public selectedAddress: AddressEntity = null;

  public sevenDaysHosDaysData: string[] = [
    'Day',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
  ];

  public sevenDaysHosDateData: string[] = [
    'Date',
    '01/22/21',
    '01/21/21',
    '01/20/21',
    '01/19/21',
    '01/18/21',
    '01/17/21',
    '01/16/21',
  ];

  public totalHours: { id: number; value: number }[] = [];
  public totalHoursCounter: number = 0;

  public questions: ApplicantQuestion[] = [
    {
      title: 'Are you currently working for another employer?',
      formControlName: 'anotherEmployer',
      answerChoices: [
        {
          id: 1,
          label: 'YES',
          value: 'anotherEmployerYes',
          name: 'anotherEmployerYes',
          checked: false,
          index: 0,
        },
        {
          id: 2,
          label: 'NO',
          value: 'anotherEmployerNo',
          name: 'anotherEmployerNo',
          checked: false,
          index: 0,
        },
      ],
    },
    {
      title:
        'At this time do you intend to work for another employer while still employed by this company?',
      formControlName: 'intendToWorkAnotherEmployer',
      answerChoices: [
        {
          id: 3,
          label: 'YES',
          value: 'intendToWorkAnotherEmployerYes',
          name: 'intendToWorkAnotherEmployerYes',
          checked: false,
          index: 1,
        },
        {
          id: 4,
          label: 'NO',
          value: 'intendToWorkAnotherEmployerNo',
          name: 'intendToWorkAnotherEmployerNo',
          checked: false,
          index: 1,
        },
      ],
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

    this.createSevenDaysHos();

    this.applicantActionsService.getApplicantInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.applicantId = res.personalInfo.applicantId;
      });
  }

  public get hosArray(): FormArray {
    return this.sevenDaysHosForm.get('hosArray') as FormArray;
  }

  public trackByIdentity = (index: number, item: any): number => index;

  public createForm(): void {
    this.sevenDaysHosForm = this.formBuilder.group({
      hosArray: this.formBuilder.array([]),
      isValidHos: [false, Validators.requiredTrue],
      startDate: [null, Validators.required],
      address: [null, [Validators.required, ...addressValidation]],
      anotherEmployer: [null, Validators.required],
      intendToWorkAnotherEmployer: [null, Validators.required],
      isValidAnotherEmployer: [null, Validators.requiredTrue],

      firstRowReview: [null],
    });
  }

  public handleCheckboxParagraphClick(type: string): void {
    if (this.selectedMode === 'FEEDBACK_MODE') {
      return;
    }

    switch (type) {
      case InputSwitchActions.VALID_HOS:
        this.sevenDaysHosForm.patchValue({
          isValidHos: !this.sevenDaysHosForm.get('isValidHos').value,
        });

        break;
      case InputSwitchActions.VALID_ANOTHER_EMPLOYER:
        this.sevenDaysHosForm.patchValue({
          isValidAnotherEmployer: !this.sevenDaysHosForm.get(
            'isValidAnotherEmployer'
          ).value,
        });

        break;

      default:
        break;
    }
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.ADDRESS:
        this.selectedAddress = event.address;

        if (!event.valid) {
          this.sevenDaysHosForm.get('address').setErrors({ invalid: true });
        }

        break;
      case InputSwitchActions.ANSWER_CHOICE:
        const selectedCheckbox = event.find(
          (radio: { checked: boolean }) => radio.checked
        );

        const selectedFormControlName =
          this.questions[selectedCheckbox.index].formControlName;

        if (selectedCheckbox.label === 'YES') {
          this.sevenDaysHosForm.get(selectedFormControlName).patchValue(true);
        } else {
          this.sevenDaysHosForm.get(selectedFormControlName).patchValue(false);
        }
        break;

      default:
        break;
    }
  }

  public createSevenDaysHos(): void {
    for (let i = 0; i < 7; i++) {
      this.hosArray.push(this.createHos());

      this.totalHours = [
        ...this.totalHours,
        { id: ++this.totalHoursCounter, value: 0 },
      ];
    }
  }

  public createHos(): FormGroup {
    return this.formBuilder.group({
      hos: [null, Validators.required],
    });
  }

  public countTotalHours(index: number): void {
    this.hosArray
      .at(index)
      .get('hos')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.totalHours = [...this.totalHours];
        this.totalHours[index].value = +value;
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
      this.router.navigate([`/application/${this.applicantId}/6`]);
    }
  }

  public onSubmit(): void {
    if (this.sevenDaysHosForm.invalid) {
      this.inputService.markInvalid(this.sevenDaysHosForm);
      return;
    }

    const {
      hosArray,
      isValidHos,
      startDate,
      address,
      anotherEmployer,
      intendToWorkAnotherEmployer,
      isValidAnotherEmployer,
      firstRowReview,
      ...sevenDaysHosForm
    } = this.sevenDaysHosForm.value;

    const filteredHosArray: { hours: number; date: string }[] = hosArray.map(
      (item: { hos: string | number }, index: number) => {
        return {
          hours: +item.hos,
          date: convertDateToBackend(this.sevenDaysHosDateData[index + 1]),
        };
      }
    );

    const saveData: CreateSevenDaysHosCommand = {
      ...sevenDaysHosForm,
      applicantId: this.applicantId,
      hos: [...filteredHosArray],
      releasedFromWork: isValidHos,
      releasedDate: convertDateToBackend(startDate),
      location: address,
      workingForAnotherEmployer: anotherEmployer,
      intendToWorkForAnotherEmployer: intendToWorkAnotherEmployer,
      certifyInfomation: isValidAnotherEmployer,
    };

    this.applicantActionsService
      .createSevenDaysHos(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/8`]);
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
