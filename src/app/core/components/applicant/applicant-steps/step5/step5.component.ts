import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import {
  convertDateToBackend,
  convertDateFromBackend,
} from 'src/app/core/utils/methods.calculations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { ViolationModel } from '../../state/model/violations.model';
import {
  ApplicantModalResponse,
  ApplicantResponse,
  CreateTrafficViolationCommand,
  CreateTrafficViolationReviewCommand,
  TrafficViolationFeedbackResponse,
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

  public stepHasValues: boolean = false;

  public lastValidLicense: any;

  public lastViolationsCard: any;

  public vehicleType: TruckTypeResponse[] = [];

  public selectedViolationIndex: number;
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
    private inputService: TaInputService,
    private router: Router,
    private applicantActionsService: ApplicantActionsService,
    private applicantStore: ApplicantStore,
    private applicantQuery: ApplicantQuery
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.hasNoTrafficViolations();

    this.getDropdownLists();

    this.getStepValuesFromStore();
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

  public getStepValuesFromStore(): void {
    this.applicantQuery.applicant$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ApplicantResponse) => {
        this.applicantId = res.id;

        const cdlInformation = res.cdlInformation;

        const lastLicenseAdded =
          cdlInformation?.licences[cdlInformation.licences.length - 1];

        this.lastValidLicense = {
          license: lastLicenseAdded?.licenseNumber,
          state: lastLicenseAdded?.state?.stateShortName,
          classType: lastLicenseAdded?.classType.name,
          expDate: convertDateFromBackend(lastLicenseAdded?.expDate),
        };

        if (res.trafficViolation) {
          this.patchStepValues(res.trafficViolation);

          this.stepHasValues = true;
        }
      });
  }

  public patchStepValues(stepValues: TrafficViolationFeedbackResponse): void {
    const {
      noViolationsForPastTwelveMonths,
      notBeenConvicted,
      onlyOneHoldLicense,
      certifyViolations,
      trafficViolationItems,
    } = stepValues;

    this.trafficViolationsForm
      .get('noViolationsForPastTwelveMonths')
      .patchValue(noViolationsForPastTwelveMonths);

    this.notBeenConvictedForm
      .get('notBeenConvicted')
      .patchValue(notBeenConvicted);

    this.onlyOneHoldLicenseForm
      .get('onlyOneHoldLicense')
      .patchValue(onlyOneHoldLicense);

    this.certifyForm.get('certify').patchValue(certifyViolations);

    if (!noViolationsForPastTwelveMonths) {
      console.log('stepValues', stepValues);
      const lastItemInViolationsArray =
        trafficViolationItems[trafficViolationItems.length - 1];

      const restOfTheItemsInViolationsArray = [...trafficViolationItems];

      restOfTheItemsInViolationsArray.pop();

      const filteredViolationsArray = restOfTheItemsInViolationsArray.map(
        (item) => {
          const itemVehicleTypeName = item.vehicleType.name;

          const itemVehicleType = {
            ...item.vehicleType,
          };

          switch (itemVehicleTypeName) {
            case 'Tow Truck Heavy':
              itemVehicleType.name = 'Tow Truck';
              break;

            case 'Car Hauler - Semi Truck':
              itemVehicleType.name = 'Car Hauler';
              break;

            case 'Semi Truck w Sleeper':
              itemVehicleType.name = 'Semi w/Sleeper';
              break;

            default:
              break;
          }

          return {
            isEditingViolation: false,
            date: convertDateFromBackend(item.date),
            vehicleType: itemVehicleType.name,
            location: item.location,
            description: item.description,
            trafficViolationItemReview: item.trafficViolationItemReview
              ? item.trafficViolationItemReview
              : null,
          };
        }
      );

      const lastItemInViolationsArrayVehicleTypeName =
        lastItemInViolationsArray.vehicleType.name;

      const lastItemVehicleType = {
        ...lastItemInViolationsArray.vehicleType,
      };

      switch (lastItemInViolationsArrayVehicleTypeName) {
        case 'Tow Truck Heavy':
          lastItemVehicleType.name = 'Tow Truck';
          break;

        case 'Car Hauler - Semi Truck':
          lastItemVehicleType.name = 'Car Hauler';
          break;

        case 'Semi Truck w Sleeper':
          lastItemVehicleType.name = 'Semi w/Sleeper';
          break;

        default:
          break;
      }

      const filteredLastItemInViolationsArray = {
        id: lastItemInViolationsArray.id,
        isEditingViolation: false,
        date: convertDateFromBackend(lastItemInViolationsArray.date),
        vehicleType: lastItemVehicleType.name,
        location: lastItemInViolationsArray.location,
        description: lastItemInViolationsArray.description,
        trafficViolationItemReview:
          lastItemInViolationsArray.trafficViolationItemReview
            ? lastItemInViolationsArray.trafficViolationItemReview
            : null,
      };

      this.violationsArray = JSON.parse(
        JSON.stringify(filteredViolationsArray)
      );

      this.formValuesToPatch = filteredLastItemInViolationsArray;
      this.previousFormValuesOnReview = filteredLastItemInViolationsArray;
      this.previousFormValuesOnEdit = this.violationsArray.length
        ? filteredLastItemInViolationsArray
        : {
            date: null,
            vehicleType: null,
            location: null,
            description: null,
          };

      for (let i = 0; i < filteredViolationsArray.length; i++) {
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
    } else {
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

      this.formStatus = 'VALID';
    }
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

          this.formStatus = 'VALID';
        } else {
          if (this.lastViolationsCard) {
            this.formValuesToPatch = {
              date: this.lastViolationsCard?.date,
              vehicleType: this.lastViolationsCard?.vehicleType,
              location: this.lastViolationsCard.location,
              description: this.lastViolationsCard?.description,
            };
          }

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
    if (
      this.selectedMode === SelectedMode.FEEDBACK ||
      this.selectedMode === SelectedMode.REVIEW
    ) {
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
      this.isEditing = false;
      this.violationsArray[this.selectedViolationIndex].isEditingViolation =
        false;

      this.helperIndex = 2;
      this.selectedViolationIndex = -1;
    }

    this.helperIndex = index;
    this.selectedViolationIndex = index;

    this.isEditing = true;
    this.violationsArray[index].isEditingViolation = true;

    const selectedViolation = this.violationsArray[index];

    if (this.lastViolationsCard) {
      this.previousFormValuesOnEdit = {
        date: this.lastViolationsCard?.date,
        vehicleType: this.lastViolationsCard?.vehicleType,
        location: this.lastViolationsCard.location,
        description: this.lastViolationsCard?.description,
      };
    }

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

    this.formValuesToPatch = this.previousFormValuesOnEdit;
  }

  public cancelViolationEditing(event: any): void {
    this.isEditing = false;
    this.violationsArray[this.selectedViolationIndex].isEditingViolation =
      false;

    this.helperIndex = 2;
    this.selectedViolationIndex = -1;

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
    this.lastViolationsCard = event;
  }

  public onHasIncorrectFields(event: any): void {
    if (event) {
      this.hasIncorrectFields = true;
    } else {
      this.hasIncorrectFields = false;
    }
  }

  public onGetOpenAnnotationArrayValues(event: any): void {
    this.previousFormValuesOnReview.trafficViolationItemReview = {
      isDateValid: !event[0].lineInputs[0],
      isLocationValid: !event[0].lineInputs[2],
      isDescriptionValid: !event[1].lineInputs[0],
    };
  }

  public onGetCardOpenAnnotationArrayValues(event: any): void {
    this.isReviewingCard = false;

    this.violationsArray[this.selectedViolationIndex].isEditingViolation =
      false;

    this.violationsArray[
      this.selectedViolationIndex
    ].trafficViolationItemReview = {
      isDateValid: !event[0].lineInputs[0],
      isLocationValid: !event[0].lineInputs[2],
      isDescriptionValid: !event[1].lineInputs[0],
    };

    const hasInvalidFields = JSON.stringify(
      this.violationsArray[this.selectedViolationIndex]
        .trafficViolationItemReview
    );

    if (hasInvalidFields.includes('false')) {
      this.openAnnotationArray[
        this.selectedViolationIndex
      ].displayAnnotationButton = true;

      this.openAnnotationArray[this.selectedViolationIndex].lineInputs[0] =
        true;

      this.cardsWithIncorrectFields = true;
    } else {
      this.openAnnotationArray[
        this.selectedViolationIndex
      ].displayAnnotationButton = false;

      this.hasIncorrectFields = false;
    }

    this.helperIndex = 2;
    this.selectedViolationIndex = -1;

    this.formValuesToPatch = this.previousFormValuesOnReview;
  }

  public cancelViolationReview(event: any): void {
    this.isReviewingCard = false;

    this.violationsArray[this.selectedViolationIndex].isEditingViolation =
      false;

    this.helperIndex = 2;
    this.selectedViolationIndex = -1;

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

      Object.keys(
        this.violationsArray[lineIndex].trafficViolationItemReview
      ).forEach((key) => {
        this.violationsArray[lineIndex].trafficViolationItemReview[key] = true;
      });

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
    this.selectedViolationIndex = index;

    this.violationsArray[index].isEditingViolation = true;

    this.isReviewingCard = true;

    const selectedViolation = this.violationsArray[index];

    this.formValuesToPatch = selectedViolation;
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
      this.router.navigate([`/application/${this.applicantId}/4`]);
    }
  }

  public onSubmit(): void {
    if (this.formStatus === 'INVALID') {
      this.markFormInvalid = true;
      return;
    }

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

    const { noViolationsForPastTwelveMonths } =
      this.trafficViolationsForm.value;

    const { notBeenConvicted } = this.notBeenConvictedForm.value;

    const { onlyOneHoldLicense } = this.onlyOneHoldLicenseForm.value;

    const { certify } = this.certifyForm.value;

    const filteredViolationsArray = this.violationsArray.map((item) => {
      const itemVehicleType = item.vehicleType;

      switch (itemVehicleType) {
        case 'Tow Truck':
          item.vehicleType = 'Tow Truck Heavy';
          break;

        case 'Car Hauler':
          item.vehicleType = 'Car Hauler - Semi Truck';
          break;

        case 'Semi w/Sleeper':
          item.vehicleType = 'Semi Truck w Sleeper';
          break;

        default:
          break;
      }

      return {
        date: convertDateToBackend(item.date),
        vehicleTypeId: this.vehicleType.find(
          (vehicleItem) => vehicleItem.name === item.vehicleType
        ).id,
        location: item.location,
        description: item.description,
      };
    });

    const lastViolationsCardVehicleType = this.lastViolationsCard?.vehicleType;

    switch (lastViolationsCardVehicleType) {
      case 'Tow Truck':
        this.lastViolationsCard.vehicleType = 'Tow Truck Heavy';
        break;

      case 'Car Hauler':
        this.lastViolationsCard.vehicleType = 'Car Hauler - Semi Truck';
        break;

      case 'Semi w/Sleeper':
        this.lastViolationsCard.vehicleType = 'Semi Truck w Sleeper';
        break;

      default:
        break;
    }

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

    const storeTrafficViolationItems = saveData.trafficViolationItems.map(
      (item) => {
        return {
          ...item,
          vehicleType: this.vehicleType.find(
            (vehicleItem) => vehicleItem.id === item.vehicleTypeId
          ),
        };
      }
    );

    const selectMatchingBackendMethod = () => {
      if (this.selectedMode === SelectedMode.APPLICANT && !this.stepHasValues) {
        return this.applicantActionsService.createTrafficViolations(saveData);
      }

      if (
        (this.selectedMode === SelectedMode.APPLICANT && this.stepHasValues) ||
        this.selectedMode === SelectedMode.FEEDBACK
      ) {
        return this.applicantActionsService.updateTrafficViolations(saveData);
      }
    };

    selectMatchingBackendMethod()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/6`]);

          this.applicantStore.update((store) => {
            const noViolations = saveData.noViolationsForPastTwelveMonths;

            return {
              ...store,
              applicant: {
                ...store.applicant,
                trafficViolation: {
                  ...store.applicant.trafficViolation,
                  noViolationsForPastTwelveMonths: noViolations,
                  notBeenConvicted: noViolations
                    ? false
                    : saveData.notBeenConvicted,
                  onlyOneHoldLicense: noViolations
                    ? false
                    : saveData.onlyOneHoldLicense,
                  certifyViolations: noViolations
                    ? false
                    : saveData.certifyViolations,
                  trafficViolationItems: noViolations
                    ? []
                    : storeTrafficViolationItems,
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
    const lastItemReview =
      this.previousFormValuesOnReview.trafficViolationItemReview;

    const lastItemId = this.previousFormValuesOnReview.id;

    const lastReviewedItemIViolationsArray = {
      itemId: lastItemId,
      isPrimary: true,
      commonMessage: null,
      isDateValid: lastItemReview ? lastItemReview.isDateValid : true,
      isVehicleTypeValid: true,
      isLocationValid: lastItemReview ? lastItemReview.isLocationValid : true,
      vehicleTypeLocationMessage: this.lastViolationsCard.firstRowReview,
      isDescriptionValid: lastItemReview
        ? lastItemReview.isDescriptionValid
        : true,
      descriptionMessage: this.lastViolationsCard.secondRowReview,
    };

    const saveData: CreateTrafficViolationReviewCommand = {
      applicantId: this.applicantId,
      trafficViolationReviews: [lastReviewedItemIViolationsArray],
    };

    console.log('saveData', saveData.trafficViolationReviews[0]);

    console.log('store', this.applicantStore);

    this.applicantActionsService
      .createTrafficViolationsReview(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/6`]);

          /*   this.applicantStore.update(store => {
            return {
              ...store,
              applicant: {
                ...store.applicant,
                trafficViolation : {
                  ...store.applicant.trafficViolation,
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
