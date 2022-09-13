import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { convertDateToBackend } from 'src/app/core/utils/methods.calculations';

import { ApplicantActionsService } from '../../state/services/applicant-actions.service';
import { ApplicantListsService } from '../../state/services/applicant-lists.service';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { AccidentModel } from '../../state/model/accident.model';
import {
  CreateAccidentRecordCommand,
  TruckTypeResponse,
} from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss'],
})
export class Step4Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.APPLICANT;

  public accidentForm: FormGroup;

  public formStatus: string = 'INVALID';
  public markFormInvalid: boolean;

  public accidentArray: AccidentModel[] = [];

  public lastAccidentCard: any;

  public vehicleType: TruckTypeResponse[] = [];

  public applicantId: number;

  public selectedAccidentIndex: number;
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
    private applicantActionsService: ApplicantActionsService,
    private applicantListsService: ApplicantListsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.getDropdownLists();

    this.hasNoAccidents();

    this.applicantActionsService.getApplicantInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.applicantId = res.personalInfo.applicantId;
      });
  }

  public trackByIdentity = (index: number, item: any): number => index;

  public createForm(): void {
    this.accidentForm = this.formBuilder.group({
      hasPastAccident: [false],

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

  private hasNoAccidents(): void {
    this.accidentForm
      .get('hasPastAccident')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.formStatus = 'VALID';

          this.formValuesToPatch = {
            date: null,
            fatalities: null,
            injuries: null,
            hazmatSpill: null,
            vehicleType: null,
            description: null,
          };

          this.accidentArray = [];
        } else {
          this.formStatus = 'INVALID';
        }
      });
  }

  public onDeleteAccident(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.accidentArray.splice(index, 1);
  }

  public onEditAccident(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.helperIndex = index;
    this.selectedAccidentIndex = index;

    this.isEditing = true;
    this.accidentArray[index].isEditingAccident = true;

    const selectedAccident = this.accidentArray[index];

    this.formValuesToPatch = selectedAccident;
  }

  public getAccidentFormValues(event: any): void {
    this.accidentArray = [...this.accidentArray, event];

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

  public cancelAccidentEditing(event: any): void {
    this.isEditing = false;
    this.accidentArray[this.selectedAccidentIndex].isEditingAccident = false;

    this.helperIndex = 2;
    this.selectedAccidentIndex = -1;
  }

  public saveEditedAccident(event: any): void {
    this.isEditing = false;
    this.accidentArray[this.selectedAccidentIndex].isEditingAccident = false;

    this.accidentArray[this.selectedAccidentIndex] = event;

    this.helperIndex = 2;
    this.selectedAccidentIndex = -1;
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
    this.lastAccidentCard = event;
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
      this.router.navigate([`/application/${this.applicantId}/3`]);
    }
  }

  public onSubmit(): void {
    if (this.formStatus === 'INVALID') {
      this.markFormInvalid = true;
      return;
    }

    const { hasPastAccident } = this.accidentForm.value;

    const filteredAccidentArray = this.accidentArray.map((item) => {
      return {
        location: item.location.address,
        date: convertDateToBackend(item.date),
        fatalities: item.fatalities,
        injuries: item.injuries,
        hazmatSpill: item.hazmatSpill,
        vehicleTypeId: this.vehicleType.find(
          (vehicleItem) => vehicleItem.name === item.vehicleType
        ).id,
        description: item.description,
      };
    });

    let filteredLastAccidentCard: any;

    if (!hasPastAccident) {
      filteredLastAccidentCard = {
        location: this.lastAccidentCard.location,
        date: convertDateToBackend(this.lastAccidentCard.date),
        fatalities: this.lastAccidentCard.fatalities,
        injuries: this.lastAccidentCard.injuries,
        hazmatSpill: this.lastAccidentCard.hazmatSpill,
        vehicleTypeId: this.vehicleType.find(
          (vehicleItem) =>
            vehicleItem.name === this.lastAccidentCard.vehicleType
        ).id,
        description: this.lastAccidentCard.description,
      };
    }

    const saveData: CreateAccidentRecordCommand = {
      applicantId: this.applicantId,
      noAccidentInThreeYears: hasPastAccident,
      accidents: hasPastAccident
        ? []
        : [...filteredAccidentArray, filteredLastAccidentCard],
    };

    this.applicantActionsService
      .createAccidentRecord(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/5`]);
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
