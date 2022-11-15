import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import {
  convertDateToBackend,
  convertDateFromBackend,
} from 'src/app/core/utils/methods.calculations';

import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { AccidentModel } from '../../state/model/accident.model';
import {
  AccidentRecordFeedbackResponse,
  ApplicantModalResponse,
  ApplicantResponse,
  CreateAccidentRecordCommand,
  CreateAccidentRecordReviewCommand,
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

  public stepHasValues: boolean = false;

  public lastAccidentCard: any;

  public vehicleType: TruckTypeResponse[] = [];

  public applicantId: number;

  public selectedAccidentIndex: number;
  public helperIndex: number = 2;

  public isEditing: boolean = false;
  public isReviewingCard: boolean = false;

  public formValuesToPatch: any;
  public previousFormValuesOnEdit: any;

  public openAnnotationArray: {
    lineIndex?: number;
    lineInputs?: boolean[];
    displayAnnotationButton?: boolean;
    displayAnnotationTextArea?: boolean;
  }[] = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  public hasIncorrectFields: boolean = false;
  public cardsWithIncorrectFields: boolean = false;
  public previousFormValuesOnReview: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private applicantActionsService: ApplicantActionsService,
    private applicantStore: ApplicantStore,
    private applicantQuery: ApplicantQuery
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.getStepValuesFromStore();

    this.getDropdownLists();

    this.hasNoAccidents();
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

  public getStepValuesFromStore(): void {
    this.applicantQuery.applicant$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ApplicantResponse) => {
        this.applicantId = res.id;

        if (res.accidentRecords) {
          this.patchStepValues(res.accidentRecords);

          this.stepHasValues = true;
        }
      });
  }

  public patchStepValues(stepValues: AccidentRecordFeedbackResponse): void {
    console.log('stepValues', stepValues);
    const { noAccidentInThreeYears, accidents } = stepValues;

    this.accidentForm.get('hasPastAccident').patchValue(noAccidentInThreeYears);

    this.formStatus = 'VALID';

    if (!noAccidentInThreeYears) {
      const lastItemInAccidentArray = accidents[accidents.length - 1];

      const restOfTheItemsInAccidenteArray = [...accidents];

      restOfTheItemsInAccidenteArray.pop();

      const filteredAccidentArray = restOfTheItemsInAccidenteArray.map(
        (item) => {
          return {
            isEditingAccident: false,
            location: item.location,
            accidentState: item.location.stateShortName,
            date: convertDateFromBackend(item.date).replace(/-/g, '/'),
            hazmatSpill: item.hazmatSpill,
            fatalities: item.fatalities,
            injuries: item.injuries,
            vehicleType: item.vehicleType.name,
            description: item.description,
            accidentRecordReview: item.accidentRecordReview
              ? item.accidentRecordReview
              : null,
          };
        }
      );

      const filteredLastItemInAccidentArray = {
        id: lastItemInAccidentArray.id,
        isEditingAccident: false,
        location: lastItemInAccidentArray.location,
        accidentState: lastItemInAccidentArray.location.stateShortName,
        date: convertDateFromBackend(lastItemInAccidentArray.date).replace(
          /-/g,
          '/'
        ),
        hazmatSpill: lastItemInAccidentArray.hazmatSpill,
        fatalities: lastItemInAccidentArray.fatalities,
        injuries: lastItemInAccidentArray.injuries,
        vehicleType: lastItemInAccidentArray.vehicleType.name,
        description: lastItemInAccidentArray.description,
        accidentRecordReview: lastItemInAccidentArray.accidentRecordReview
          ? lastItemInAccidentArray.accidentRecordReview
          : null,
      };

      this.accidentArray = JSON.parse(JSON.stringify(filteredAccidentArray));

      this.formValuesToPatch = filteredLastItemInAccidentArray;
      this.previousFormValuesOnReview = filteredLastItemInAccidentArray;
      this.previousFormValuesOnEdit = this.accidentArray.length
        ? filteredLastItemInAccidentArray
        : {
            location: null,
            date: null,
            fatalities: 0,
            injuries: 0,
            hazmatSpill: null,
            vehicleType: null,
            description: null,
          };

      for (let i = 0; i < filteredAccidentArray.length; i++) {
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
    }
  }

  private hasNoAccidents(): void {
    this.accidentForm
      .get('hasPastAccident')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.formStatus = 'VALID';
        } else {
          if (this.lastAccidentCard) {
            this.formValuesToPatch = {
              location: this.lastAccidentCard?.location,
              date: this.lastAccidentCard?.date,
              hazmatSpill: this.lastAccidentCard?.hazmatSpill,
              fatalities: this.lastAccidentCard?.fatalities,
              injuries: this.lastAccidentCard?.injuries,
              vehicleType: this.lastAccidentCard?.vehicleType,
              description: this.lastAccidentCard?.description,
            };
          }

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
      this.isEditing = false;
      this.accidentArray[this.selectedAccidentIndex].isEditingAccident = false;

      this.helperIndex = 2;
      this.selectedAccidentIndex = -1;
    }

    this.helperIndex = index;
    this.selectedAccidentIndex = index;

    this.isEditing = true;
    this.accidentArray[index].isEditingAccident = true;

    const selectedAccident = this.accidentArray[index];

    if (this.lastAccidentCard) {
      this.previousFormValuesOnEdit = {
        location: this.lastAccidentCard?.location,
        date: this.lastAccidentCard?.date,
        hazmatSpill: this.lastAccidentCard?.hazmatSpill,
        fatalities: this.lastAccidentCard?.fatalities,
        injuries: this.lastAccidentCard?.injuries,
        vehicleType: this.lastAccidentCard?.vehicleType,
        description: this.lastAccidentCard?.description,
      };
    }

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

    this.formValuesToPatch = this.previousFormValuesOnEdit;
  }

  public saveEditedAccident(event: any): void {
    this.isEditing = false;
    this.accidentArray[this.selectedAccidentIndex].isEditingAccident = false;

    this.accidentArray[this.selectedAccidentIndex] = event;

    this.helperIndex = 2;
    this.selectedAccidentIndex = -1;

    this.formValuesToPatch = this.previousFormValuesOnEdit;
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

  public onHasIncorrectFields(event: any): void {
    if (event) {
      this.hasIncorrectFields = true;
    } else {
      this.hasIncorrectFields = false;
    }
  }

  public onGetOpenAnnotationArrayValues(event: any): void {
    this.previousFormValuesOnReview.accidentRecordReview = {
      isLocationValid: !event[0].lineInputs[0],
      isDateValid: !event[0].lineInputs[1],
      isDescriptionValid: !event[1].lineInputs[1],
    };
  }

  public onGetCardOpenAnnotationArrayValues(event: any): void {
    this.isReviewingCard = false;

    this.accidentArray[this.selectedAccidentIndex].isEditingAccident = false;

    this.accidentArray[this.selectedAccidentIndex].accidentRecordReview = {
      isLocationValid: !event[0].lineInputs[0],
      isDateValid: !event[0].lineInputs[1],
      isDescriptionValid: !event[1].lineInputs[1],
    };

    const hasInvalidFields = JSON.stringify(
      this.accidentArray[this.selectedAccidentIndex].accidentRecordReview
    );

    if (hasInvalidFields.includes('false')) {
      this.openAnnotationArray[
        this.selectedAccidentIndex
      ].displayAnnotationButton = true;

      this.openAnnotationArray[this.selectedAccidentIndex].lineInputs[0] = true;

      this.cardsWithIncorrectFields = true;
    } else {
      this.openAnnotationArray[
        this.selectedAccidentIndex
      ].displayAnnotationButton = false;

      this.hasIncorrectFields = false;
    }

    this.helperIndex = 2;
    this.selectedAccidentIndex = -1;

    this.formValuesToPatch = this.previousFormValuesOnReview;
  }

  public cancelAccidentReview(event: any): void {
    this.isReviewingCard = false;

    this.accidentArray[this.selectedAccidentIndex].isEditingAccident = false;

    this.helperIndex = 2;
    this.selectedAccidentIndex = -1;

    this.formValuesToPatch = this.previousFormValuesOnReview;
  }

  public getDropdownLists(): void {
    this.applicantQuery.applicantDropdownLists$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ApplicantModalResponse) => {
        this.vehicleType = res.truckTypes;
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
      if (selectedInputsLine.displayAnnotationButton) {
        selectedInputsLine.lineInputs[inputIndex] = false;
        selectedInputsLine.displayAnnotationButton = false;
      }

      if (selectedInputsLine.displayAnnotationTextArea) {
        selectedInputsLine.displayAnnotationButton = false;
        selectedInputsLine.displayAnnotationTextArea = false;
      }

      Object.keys(this.accidentArray[lineIndex].accidentRecordReview).forEach(
        (key) => {
          this.accidentArray[lineIndex].accidentRecordReview[key] = true;
        }
      );

      const inputFieldsArray = JSON.stringify(
        this.openAnnotationArray
          .filter((item) => Object.keys(item).length !== 0)
          .map((item) => item.lineInputs)
      );

      if (inputFieldsArray.includes('true')) {
        this.cardsWithIncorrectFields = true;
      } else {
        this.cardsWithIncorrectFields = false;
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

  public onCardReview(index: number) {
    if (this.isReviewingCard) {
      return;
    }

    this.helperIndex = index;
    this.selectedAccidentIndex = index;

    this.accidentArray[index].isEditingAccident = true;

    this.isReviewingCard = true;

    const selectedAccident = this.accidentArray[index];

    this.formValuesToPatch = selectedAccident;
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      if (
        this.selectedMode === SelectedMode.APPLICANT ||
        this.selectedMode === SelectedMode.FEEDBACK
      ) {
        this.onSubmit();
      }

      if (this.selectedMode === SelectedMode.REVIEW) {
        this.onSubmitReview();
      }
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
        location: item.location,
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

    const storeAccidentRecordItems = saveData.accidents.map((item) => {
      return {
        ...item,
        vehicleType: this.vehicleType.find(
          (vehicleItem) => vehicleItem.id === item.vehicleTypeId
        ),
      };
    });

    const selectMatchingBackendMethod = () => {
      if (this.selectedMode === SelectedMode.APPLICANT && !this.stepHasValues) {
        return this.applicantActionsService.createAccidentRecord(saveData);
      }

      if (
        (this.selectedMode === SelectedMode.APPLICANT && this.stepHasValues) ||
        this.selectedMode === SelectedMode.FEEDBACK
      ) {
        return this.applicantActionsService.updateAccidentRecord(saveData);
      }
    };

    selectMatchingBackendMethod()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/5`]);

          this.applicantStore.update((store) => {
            const noAccidents = saveData.noAccidentInThreeYears;

            return {
              ...store,
              applicant: {
                ...store.applicant,
                accidentRecords: {
                  ...store.applicant.accidentRecords,
                  noAccidentInThreeYears: noAccidents,
                  accidents: noAccidents ? null : storeAccidentRecordItems,
                },
              },
            };
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  public onSubmitReview(): void {
    const lastItemReview = this.previousFormValuesOnReview.accidentRecordReview;

    const lastItemId = this.previousFormValuesOnReview.id;

    console.log('lastItemId', lastItemId);

    const lastReviewedItemInAccidentArray = {
      itemId: lastItemId,
      isPrimary: true,
      commonMessage: null,
      isLocationValid: lastItemReview ? lastItemReview.isLocationValid : true,
      isDateValid: lastItemReview ? lastItemReview.isDateValid : true,
      locationDateMessage: this.lastAccidentCard.firstRowReview,
      isDescriptionValid: lastItemReview
        ? lastItemReview.isDescriptionValid
        : true,
      descriptionMessage: this.lastAccidentCard.secondRowReview,
    };

    const saveData: CreateAccidentRecordReviewCommand = {
      applicantId: this.applicantId,
      accidentReviews: [lastReviewedItemInAccidentArray],
    };

    console.log('saveData', saveData);

    console.log('store', this.applicantStore);

    this.applicantActionsService
      .createAccidentRecordReview(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/5`]);

          /*   this.applicantStore.update(store => {
            return {
              ...store,
              applicant: {
                ...store.applicant,
                accidentRecords : {
                  ...store.applicant.accidentRecords,
                }
              }
            }
          }) */
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
