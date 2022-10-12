import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
import { ApplicantListsQuery } from '../../state/store/applicant-lists-store/applicant-lists.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { WorkHistoryModel } from '../../state/model/work-history.model';
import {
  CreateWorkExperienceCommand,
  EnumValue,
  TrailerLengthResponse,
  TrailerTypeResponse,
  TruckTypeResponse,
  CreateWorkExperienceReviewCommand,
} from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.REVIEW;

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
  public isReviewingCard: boolean = false;

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
  }[] = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  public hasIncorrectFields: boolean = false;
  public cardsWithIncorrectFields: boolean = false;
  public previousFormValuesOnReview: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private applicantActionsService: ApplicantActionsService,
    private applicantStore: ApplicantStore,
    private applicantQuery: ApplicantQuery,
    private applicantListsQuery: ApplicantListsQuery
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.getDropdownLists();

    if (this.selectedMode === SelectedMode.APPLICANT) {
      this.hasNoWorkExperience();

      this.applicantActionsService.getApplicantInfo$
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.applicantId = res.personalInfo.applicantId;
        });
    }

    if (this.selectedMode === SelectedMode.REVIEW) {
      let stepValuesResponse: any;

      this.applicantQuery.workExperienceList$
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          stepValuesResponse = res;
        });

      this.patchStepValues(stepValuesResponse);
    }
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

  public patchStepValues(stepValues: any): void {
    const { haveWorkExperience, workExperienceItems } = stepValues;

    this.workExperienceForm
      .get('noWorkExperience')
      .patchValue(haveWorkExperience);

    if (!haveWorkExperience) {
      const lastItemInWorkExperienceArray =
        workExperienceItems[workExperienceItems.length - 1];

      const restOfTheItemsInWorkExperienceArray = [...workExperienceItems];

      restOfTheItemsInWorkExperienceArray.pop();

      const filteredWorkExperienceArray =
        restOfTheItemsInWorkExperienceArray.map((item) => {
          return {
            isEditingWorkHistory: false,
            employer: item.employer,
            jobDescription: item.jobDescription,
            fromDate: convertDateFromBackend(item.from).replace(/-/g, '/'),
            toDate: convertDateFromBackend(item.to).replace(/-/g, '/'),
            employerPhone: item.phone,
            employerEmail: item.email,
            employerFax: item.fax,
            employerAddress: item.address,
            employerAddressUnit: item.address.addressUnit,
            isDrivingPosition: item.isDrivingPosition,
            cfrPart: item.cfrPart,
            fmCSA: item.fmcsa,
            reasonForLeaving: item.reasonForLeaving.name,
            accountForPeriod: item.accountForPeriodBetween,
            classesOfEquipment: item.classesOfEquipment[0]?.vehicleType
              ? item.classesOfEquipment.map((classItem, index) => {
                  return {
                    isEditingClassOfEquipment: false,
                    trailerLength:
                      item.classesOfEquipment[index].trailerLength.name,
                    trailerType:
                      item.classesOfEquipment[index].trailerType.name,
                    vehicleType:
                      item.classesOfEquipment[index].vehicleType.name,
                    trailerTypeImageLocation:
                      item.classesOfEquipment[index].trailerType.logoName,
                    vehicleTypeImageLocation:
                      item.classesOfEquipment[index].vehicleType.logoName,
                  };
                })
              : [],
            workExperienceItemReview: item.workExperienceItemReview
              ? item.workExperienceItemReview
              : null,
          };
        });

      const filteredLastItemInWorkExperienceArray = {
        isEditingWorkHistory: false,
        employer: lastItemInWorkExperienceArray.employer,
        jobDescription: lastItemInWorkExperienceArray.jobDescription,
        fromDate: convertDateFromBackend(
          lastItemInWorkExperienceArray.from
        ).replace(/-/g, '/'),
        toDate: convertDateFromBackend(
          lastItemInWorkExperienceArray.to
        ).replace(/-/g, '/'),
        employerPhone: lastItemInWorkExperienceArray.phone,
        employerEmail: lastItemInWorkExperienceArray.email,
        employerFax: lastItemInWorkExperienceArray.fax,
        employerAddress: lastItemInWorkExperienceArray.address,
        employerAddressUnit: lastItemInWorkExperienceArray.address.addressUnit,
        isDrivingPosition: lastItemInWorkExperienceArray.isDrivingPosition,
        cfrPart: lastItemInWorkExperienceArray.cfrPart,
        fmCSA: lastItemInWorkExperienceArray.fmcsa,
        reasonForLeaving: lastItemInWorkExperienceArray.reasonForLeaving.name,
        accountForPeriod: lastItemInWorkExperienceArray.accountForPeriodBetween,
        classesOfEquipment: lastItemInWorkExperienceArray.classesOfEquipment[0]
          ?.vehicleType
          ? lastItemInWorkExperienceArray.classesOfEquipment.map(
              (classItem, index) => {
                return {
                  isEditingClassOfEquipment: false,
                  trailerLength:
                    lastItemInWorkExperienceArray.classesOfEquipment[index]
                      .trailerLength.name,
                  trailerType:
                    lastItemInWorkExperienceArray.classesOfEquipment[index]
                      .trailerType.name,
                  vehicleType:
                    lastItemInWorkExperienceArray.classesOfEquipment[index]
                      .vehicleType.name,
                  trailerTypeImageLocation:
                    lastItemInWorkExperienceArray.classesOfEquipment[index]
                      .trailerType.logoName,
                  vehicleTypeImageLocation:
                    lastItemInWorkExperienceArray.classesOfEquipment[index]
                      .vehicleType.logoName,
                };
              }
            )
          : [],
        workExperienceItemReview:
          lastItemInWorkExperienceArray.workExperienceItemReview
            ? lastItemInWorkExperienceArray.workExperienceItemReview
            : null,
      };

      this.workExperienceArray = [...filteredWorkExperienceArray];

      this.formValuesToPatch = filteredLastItemInWorkExperienceArray;
      this.previousFormValuesOnReview = filteredLastItemInWorkExperienceArray;

      for (let i = 0; i < filteredWorkExperienceArray.length; i++) {
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

  public onHasIncorrectFields(event: any): void {
    if (event) {
      this.hasIncorrectFields = true;
    } else {
      this.hasIncorrectFields = false;
    }
  }

  public onGetOpenAnnotationArrayValues(event: any): void {
    this.previousFormValuesOnReview.workExperienceItemReview = {
      isEmployerValid: !event[0].lineInputs[0],
      isJobDescriptionValid: !event[1].lineInputs[0],
      isFromValid: !event[1].lineInputs[1],
      isToValid: !event[1].lineInputs[2],
      isPhoneValid: !event[2].lineInputs[0],
      isEmailValid: !event[2].lineInputs[1],
      isFaxValid: !event[2].lineInputs[2],
      isAddressValid: !event[3].lineInputs[0],
      isAddressUnitValid: !event[3].lineInputs[1],
      isReasonForLeavingValid: !event[5].lineInputs[0],
      isAccountForPeriodBetweenValid: !event[6].lineInputs[0],
    };
  }

  public onGetCardOpenAnnotationArrayValues(event: any): void {
    this.isReviewingCard = false;

    this.workExperienceArray[
      this.selectedWorkExperienceIndex
    ].isEditingWorkHistory = false;

    this.workExperienceArray[
      this.selectedWorkExperienceIndex
    ].workExperienceItemReview = {
      isEmployerValid: !event[0].lineInputs[0],
      isJobDescriptionValid: !event[1].lineInputs[0],
      isFromValid: !event[1].lineInputs[1],
      isToValid: !event[1].lineInputs[2],
      isPhoneValid: !event[2].lineInputs[0],
      isEmailValid: !event[2].lineInputs[1],
      isFaxValid: !event[2].lineInputs[2],
      isAddressValid: !event[3].lineInputs[0],
      isAddressUnitValid: !event[3].lineInputs[1],
      isReasonForLeavingValid: !event[5].lineInputs[0],
      isAccountForPeriodBetweenValid: !event[6].lineInputs[0],
    };

    const hasInvalidFields = JSON.stringify(
      this.workExperienceArray[this.selectedWorkExperienceIndex]
        .workExperienceItemReview
    );

    if (hasInvalidFields.includes('false')) {
      this.openAnnotationArray[
        this.selectedWorkExperienceIndex
      ].displayAnnotationButton = true;

      this.openAnnotationArray[this.selectedWorkExperienceIndex].lineInputs[0] =
        true;

      this.cardsWithIncorrectFields = true;
    } else {
      this.openAnnotationArray[
        this.selectedWorkExperienceIndex
      ].displayAnnotationButton = false;

      this.hasIncorrectFields = false;
    }

    this.helperIndex = 2;
    this.selectedWorkExperienceIndex = -1;

    this.formValuesToPatch = this.previousFormValuesOnReview;
  }

  public cancelWorkExperienceReview(event: any): void {
    this.isReviewingCard = false;

    this.workExperienceArray[
      this.selectedWorkExperienceIndex
    ].isEditingWorkHistory = false;

    this.helperIndex = 2;
    this.selectedWorkExperienceIndex = -1;

    this.formValuesToPatch = this.previousFormValuesOnReview;
  }

  public getDropdownLists(): void {
    this.applicantListsQuery.dropdownLists$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.vehicleType = res.truckTypes;

        this.trailerType = res.trailerTypes;

        this.trailerLengthType = res.trailerLenghts;

        this.reasonsForLeaving = res.reasonsForLeave;
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
        this.workExperienceArray[lineIndex].workExperienceItemReview
      ).forEach((key) => {
        this.workExperienceArray[lineIndex].workExperienceItemReview[key] =
          true;
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
    this.selectedWorkExperienceIndex = index;

    this.workExperienceArray[index].isEditingWorkHistory = true;

    this.isReviewingCard = true;

    const selectedWorkExperience = this.workExperienceArray[index];

    this.formValuesToPatch = selectedWorkExperience;
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      if (this.selectedMode === SelectedMode.APPLICANT) {
        this.onSubmit();
      }

      if (this.selectedMode === SelectedMode.REVIEW) {
        this.onSubmitReview();
      }
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

    this.lastWorkExperienceCard.employerAddress.addressUnit =
      this.lastWorkExperienceCard.employerAddressUnit;

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

  public onSubmitReview(): void {
    const lastItemReview =
      this.previousFormValuesOnReview.workExperienceItemReview;

    const lastReviewedItemInWorkExperienceArray = {
      isEmployerValid: lastItemReview ? lastItemReview.isEmployerValid : true,
      employerMessage: this.lastWorkExperienceCard.firstRowReview,
      isJobDescriptionValid: lastItemReview
        ? lastItemReview.isJobDescriptionValid
        : true,
      isFromValid: lastItemReview ? lastItemReview.isFromValid : true,
      isToValid: lastItemReview ? lastItemReview.isToValid : true,
      jobDescriptionMessage: this.lastWorkExperienceCard.secondRowReview,
      isPhoneValid: lastItemReview ? lastItemReview.isPhoneValid : true,
      isFaxValid: lastItemReview ? lastItemReview.isFaxValid : true,
      isEmailValid: lastItemReview ? lastItemReview.isEmailValid : true,
      contactMessage: this.lastWorkExperienceCard.thirdRowReview,
      isAddressValid: lastItemReview ? lastItemReview.isAddressValid : true,
      addressMessage: this.lastWorkExperienceCard.fourthRowReview,
      isReasonForLeavingValid: lastItemReview
        ? lastItemReview.isReasonForLeavingValid
        : true,
      reasonForLeavingMessage: this.lastWorkExperienceCard.sixthRowReview,
      isAccountForPeriodBetweenValid: lastItemReview
        ? lastItemReview.isAccountForPeriodBetweenValid
        : true,
      accountForPeriodBetweenMessage:
        this.lastWorkExperienceCard.seventhRowReview,
    };

    const saveData: CreateWorkExperienceReviewCommand = {
      applicantId: 1,
      workExperienceItemReviews: [lastReviewedItemInWorkExperienceArray],
    };

    console.log('saveData', saveData.workExperienceItemReviews[0]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
