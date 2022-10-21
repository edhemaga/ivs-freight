import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import {
  convertDateFromBackend,
  convertDateToBackend,
} from 'src/app/core/utils/methods.calculations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';
import { ApplicantListsQuery } from '../../state/store/applicant-lists-store/applicant-lists.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { LicenseModel } from '../../state/model/cdl-information';
import { AnswerChoices } from '../../state/model/applicant-question.model';
import {
  CdlEndorsementResponse,
  CdlRestrictionResponse,
  CountryType,
  CreateApplicantCdlCommand,
  CreateApplicantCdlReviewCommand,
  EnumValue,
} from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit, OnDestroy {
  @ViewChildren('cmp') set content(content: QueryList<any>) {
    if (content) {
      const radioButtonsArray = content.toArray();

      this.permitRadios = radioButtonsArray[0]
        ? radioButtonsArray[0].buttons
        : null;
    }
  }

  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.REVIEW;

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
  public isReviewingCard: boolean = false;

  public formValuesToPatch: any;
  public previousFormValuesOnEdit: any;

  public canadaStates: any[] = [];
  public usStates: any[] = [];

  public countryTypes: EnumValue[] = [];
  public stateTypes: any[] = [];
  public classTypes: EnumValue[] = [];
  public restrictionsList: CdlRestrictionResponse[] = [];
  public endorsmentsList: CdlEndorsementResponse[] = [];

  public permitRadios: any;

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
  public hasIncorrectFields: boolean = false;
  public cardsWithIncorrectFields: boolean = false;
  public previousFormValuesOnReview: any;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private router: Router,
    private applicantActionsService: ApplicantActionsService,
    private applicantStore: ApplicantStore,
    private applicantQuery: ApplicantQuery,
    private applicantListsQuery: ApplicantListsQuery
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.getApplicantId();

    this.getStepValuesFromStore();

    this.getDropdownLists();
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

  public getStepValuesFromStore(): void {
    let stepValuesResponse: any;

    this.applicantQuery.cdlInformationList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        stepValuesResponse = res;
      });

    if (stepValuesResponse) {
      this.patchStepValues(stepValuesResponse);
    }
  }

  public patchStepValues(stepValues: any): void {
    console.log('stepValues', stepValues);
    const { cdlDenied, cdlDeniedExplanation, licences } = stepValues;

    const lastItemInLicenseArray = licences[licences.length - 1];

    const restOfTheItemsInLicenseArray = [...licences];

    restOfTheItemsInLicenseArray.pop();

    const filteredLicenseArray = restOfTheItemsInLicenseArray.map((item) => {
      return {
        isEditingLicense: false,
        licenseNumber: item.licenseNumber,
        country: item.country.name,
        state: item.state.stateShortName,
        classType: item.class.name,
        expDate: convertDateFromBackend(item.expDate).replace(/-/g, '/'),
        restrictions: item.cdlRestrictions,
        endorsments: item.cdlEndorsements,
        licenseReview: item.licenseReview ? item.licenseReview : null,
      };
    });

    const filteredLastItemInLicenseArray = {
      isEditingLicense: false,
      licenseNumber: lastItemInLicenseArray.licenseNumber,
      country: lastItemInLicenseArray.country.name,
      state: lastItemInLicenseArray.state.stateShortName,
      classType: lastItemInLicenseArray.class.name,
      expDate: convertDateFromBackend(lastItemInLicenseArray.expDate).replace(
        /-/g,
        '/'
      ),
      restrictions: lastItemInLicenseArray.cdlRestrictions,
      endorsments: lastItemInLicenseArray.cdlEndorsements,
      licenseReview: lastItemInLicenseArray.licenseReview
        ? lastItemInLicenseArray.licenseReview
        : null,
    };

    this.licenseArray = [...filteredLicenseArray];

    this.formValuesToPatch = filteredLastItemInLicenseArray;
    this.previousFormValuesOnReview = filteredLastItemInLicenseArray;
    this.previousFormValuesOnEdit = this.licenseArray.length
      ? filteredLastItemInLicenseArray
      : {
          licenseNumber: null,
          country: null,
          state: null,
          classType: null,
          expDate: null,
        };

    for (let i = 0; i < filteredLicenseArray.length; i++) {
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

    this.permitForm.patchValue({
      permit: cdlDenied,
      permitExplain: cdlDeniedExplanation,
    });

    setTimeout(() => {
      const permitValue = this.permitForm.get('permit').value;

      if (permitValue) {
        this.permitRadios[0].checked = true;
      } else {
        this.permitRadios[1].checked = true;
      }
    }, 100);
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

    this.formValuesToPatch = this.previousFormValuesOnEdit;
  }

  public saveEditedLicense(event: any): void {
    this.isEditing = false;
    this.licenseArray[this.selectedLicenseIndex].isEditingLicense = false;

    this.licenseArray[this.selectedLicenseIndex] = event;

    this.helperIndex = 2;
    this.selectedLicenseIndex = -1;

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
    this.lastLicenseCard = event;
  }

  public onHasIncorrectFields(event: any): void {
    if (event) {
      this.hasIncorrectFields = true;
    } else {
      this.hasIncorrectFields = false;
    }
  }

  public onGetOpenAnnotationArrayValues(event: any): void {
    this.previousFormValuesOnReview.licenseReview = {
      isLicenseNumberValid: !event[0].lineInputs[0],
      isCountryValid: !event[0].lineInputs[1],
      isStateValid: !event[1].lineInputs[0],
      isClassValid: !event[1].lineInputs[1],
      isExpDateValid: !event[1].lineInputs[2],
      isRestrictionsValid: !event[2].lineInputs[0],
      isEndorsmentsValid: !event[3].lineInputs[0],
    };
  }

  public onGetCardOpenAnnotationArrayValues(event: any): void {
    this.isReviewingCard = false;

    this.licenseArray[this.selectedLicenseIndex].isEditingLicense = false;

    this.licenseArray[this.selectedLicenseIndex].licenseReview = {
      isLicenseNumberValid: !event[0].lineInputs[0],
      isCountryValid: !event[0].lineInputs[1],
      isStateValid: !event[1].lineInputs[0],
      isClassValid: !event[1].lineInputs[1],
      isExpDateValid: !event[1].lineInputs[2],
      isRestrictionsValid: !event[2].lineInputs[0],
      isEndorsmentsValid: !event[3].lineInputs[0],
    };

    const hasInvalidFields = JSON.stringify(
      this.licenseArray[this.selectedLicenseIndex].licenseReview
    );

    if (hasInvalidFields.includes('false')) {
      this.openAnnotationArray[
        this.selectedLicenseIndex
      ].displayAnnotationButton = true;

      this.openAnnotationArray[this.selectedLicenseIndex].lineInputs[0] = true;

      this.cardsWithIncorrectFields = true;
    } else {
      this.openAnnotationArray[
        this.selectedLicenseIndex
      ].displayAnnotationButton = false;

      this.hasIncorrectFields = false;
    }

    this.helperIndex = 2;
    this.selectedLicenseIndex = -1;

    this.formValuesToPatch = this.previousFormValuesOnReview;
  }

  public cancelLicenseReview(event: any): void {
    this.isReviewingCard = false;

    this.licenseArray[this.selectedLicenseIndex].isEditingLicense = false;

    this.helperIndex = 2;
    this.selectedLicenseIndex = -1;

    this.formValuesToPatch = this.previousFormValuesOnReview;
  }

  public getDropdownLists(): void {
    this.applicantListsQuery.dropdownLists$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.countryTypes = res.countryTypes;

        this.usStates = res.usStates.map((item) => {
          return {
            id: item.id,
            name: item.stateShortName,
            stateName: item.stateName,
          };
        });

        this.canadaStates = res.canadaStates.map((item) => {
          return {
            id: item.id,
            name: item.stateShortName,
            stateName: item.stateName,
          };
        });

        this.classTypes = res.classTypes;

        this.restrictionsList = res.restrictions;
        this.endorsmentsList = res.endorsements;
      });
  }

  public getApplicantId(): void {
    this.applicantQuery.applicantId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.applicantId = res;
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

      Object.keys(this.licenseArray[lineIndex].licenseReview).forEach((key) => {
        this.licenseArray[lineIndex].licenseReview[key] = true;
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

        if (lineIndex === 14) {
          this.permitForm.get('fifthRowReview').patchValue(null);
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
    this.selectedLicenseIndex = index;

    this.licenseArray[index].isEditingLicense = true;

    this.isReviewingCard = true;

    const selectedLicense = this.licenseArray[index];

    this.formValuesToPatch = selectedLicense;
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
      const filteredStateType = this.usStates.find(
        (stateItem) => stateItem.name === item.state
      );

      const stateId = filteredStateType
        ? filteredStateType.id
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

    const filteredStateType = this.usStates.find(
      (stateItem) => stateItem.name === this.lastLicenseCard.state
    );

    const filteredLastLicenseCardStateId = filteredStateType
      ? filteredStateType.id
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

    const saveData: any = {
      applicantId: this.applicantId,
      cdlDenied: permit,
      cdlDeniedExplanation: permitExplain,
      licences: [...filteredLicenseArray, filteredLastLicenseCard],
    };

    const storeLicenceItems = saveData.licences.map((item) => {
      const filteredUsStateType = this.usStates.find(
        (stateItem) => stateItem.id === item.stateId
      );

      const filteredStateType = filteredUsStateType
        ? filteredUsStateType
        : this.canadaStates.find((stateItem) => stateItem.id === item.stateId);

      return {
        licenseNumber: item.licenseNumber,
        country: this.countryTypes.find(
          (countryItem) => countryItem.name === item.country
        ),
        state: {
          countryType: this.countryTypes.find(
            (countryItem) => countryItem.name === item.country
          ),
          id: filteredStateType.id,
          stateName: filteredStateType.stateName,
          stateShortName: filteredStateType.name,
        },
        class: this.classTypes.find(
          (classItem) => classItem.name === item.class
        ),
        expDate: item.expDate,
        cdlRestrictions: this.restrictionsList.filter((resItem) =>
          item.restrictions.includes(resItem.id)
        ),
        cdlEndorsements: this.endorsmentsList.filter((endItem) =>
          item.endorsements.includes(endItem.id)
        ),
      };
    });

    this.applicantActionsService
      .createCdlInformation(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/4`]);

          this.applicantStore.update(1, (entity) => {
            return {
              ...entity,
              cdlInformation: {
                ...entity.cdlInformation,
                cdlDenied: saveData.cdlDenied,
                cdlDeniedExplanation: saveData.cdlDeniedExplanation,
                licences: storeLicenceItems,
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
    const lastItemReview = this.previousFormValuesOnReview.licenseReview;

    const lastReviewedItemInLicenseArray = {
      isLicenseNumberValid: lastItemReview
        ? lastItemReview.isLicenseNumberValid
        : true,
      licenseCountryMessage: this.lastLicenseCard.firstRowReview,
      isExpDateValid: lastItemReview ? lastItemReview.isExpDateValid : true,
      stateClassExpDateMessage: this.lastLicenseCard.secondRowReview,
    };

    const saveData: CreateApplicantCdlReviewCommand = {
      applicantId: this.applicantId,
      isCdlDeniedExplanationValid: !this.openAnnotationArray[14].lineInputs[0],
      cdlDeniedExplanationMessage: this.permitForm.get('fifthRowReview').value,
      licenceReviews: [lastReviewedItemInLicenseArray],
    };

    console.log('save', saveData);
  }

  ngOnDestroy(): void {}
}
