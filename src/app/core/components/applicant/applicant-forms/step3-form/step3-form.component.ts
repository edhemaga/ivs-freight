import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription, Subject, takeUntil } from 'rxjs';

import { convertDateToBackend } from 'src/app/core/utils/methods.calculations';

import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantListsService } from '../../state/services/applicant-lists.service';

import {
  anyInputInLineIncorrect,
  isFormValueEqual,
} from '../../state/utils/utils';

import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { LicenseModel } from '../../state/model/cdl-information';
import {
  CdlEndorsementResponse,
  CdlLicenseCommand,
  CdlRestrictionResponse,
  EnumValue,
  StateResponse,
} from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step3-form',
  templateUrl: './step3-form.component.html',
  styleUrls: ['./step3-form.component.scss'],
})
export class Step3FormComponent implements OnInit, OnDestroy {
  @Input() isEditing: boolean;
  @Input() formValuesToPatch?: any;

  @Output() formValuesEmitter = new EventEmitter<any>();
  @Output() cancelFormEditingEmitter = new EventEmitter<any>();
  @Output() saveFormEditingEmitter = new EventEmitter<any>();

  private destroy$ = new Subject<void>();

  public selectedMode = SelectedMode.APPLICANT;

  private subscription: Subscription;

  public licenseForm: FormGroup;

  public isLicenseEdited: boolean;

  public licenseId: number = 0;

  public canadaStates: StateResponse[] = [];
  public usStates: StateResponse[] = [];

  public countryTypes: EnumValue[] = [];
  public stateTypes: StateResponse[] = [];
  public classTypes: EnumValue[] = [];
  public restrictionsList: CdlRestrictionResponse[] = [];
  public endorsmentsList: CdlEndorsementResponse[] = [];

  public selectedCountryType: any = null;
  public selectedStateType: any = null;
  public selectedClassType: any = null;
  public selectedEndorsments: any[] = [];
  public selectedRestrictions: any[] = [];

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
    {
      lineIndex: 10,
      lineInputs: [false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 11,
      lineInputs: [false, false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 12,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 13,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private inputResetService: TaInputResetService,
    private applicantListsService: ApplicantListsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.getDropdownLists();

    if (this.formValuesToPatch) {
      this.patchForm();

      this.subscription = this.licenseForm.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((updatedFormValues) => {
          const { isEditingLicense, ...previousFormValues } =
            this.formValuesToPatch;

          const {
            firstRowReview,
            secondRowReview,
            thirdRowReview,
            fourthRowReview,
            ...newFormValues
          } = updatedFormValues;

          previousFormValues.licenseNumber =
            previousFormValues.licenseNumber.toUpperCase();
          newFormValues.licenseNumber =
            newFormValues.licenseNumber.toUpperCase();

          if (isFormValueEqual(previousFormValues, newFormValues)) {
            this.isLicenseEdited = false;
          } else {
            this.isLicenseEdited = true;
          }
        });
    }
  }

  private createForm(): void {
    this.licenseForm = this.formBuilder.group({
      licenseNumber: [null, Validators.required],
      country: [null, Validators.required],
      stateId: [null, Validators.required],
      classType: [null, Validators.required],
      expDate: [null, Validators.required],
      restrictions: [null],
      endorsments: [null],

      firstRowReview: [null],
      secondRowReview: [null],
      thirdRowReview: [null],
      fourthRowReview: [null],
    });
  }

  public patchForm(): void {
    this.licenseForm.patchValue({
      licenseNumber: this.formValuesToPatch.licenseNumber,
      country: this.formValuesToPatch.country,
      stateId: this.formValuesToPatch.stateId,
      classType: this.formValuesToPatch.classType,
      expDate: this.formValuesToPatch.expDate,
      restrictions: this.formValuesToPatch.restrictions,
      endorsments: this.formValuesToPatch.endorsments,
    });

    setTimeout(() => {
      this.selectedCountryType = this.countryTypes.find(
        (item) => item.name === this.formValuesToPatch.country
      );

      this.selectedStateType = { id: 2, name: 'AK', stateName: 'Alaska' };

      /*     this.selectedStateType = this.usStates.find(
        (item) => item.name === this.formValuesToPatch.stateId
      ) ||
        this.canadaStates.find(
          (item) => item.name === this.formValuesToPatch.stateId
        ); */
    }, 1);
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.COUNTRY_TYPE:
        this.selectedCountryType = event;

        this.inputService.changeValidators(
          this.licenseForm.get('stateId'),
          false
        );

        if (this.selectedCountryType.name.toLowerCase() === 'us') {
          this.stateTypes = this.usStates;
        } else {
          this.stateTypes = this.canadaStates;
        }

        break;
      case InputSwitchActions.STATE_TYPE:
        this.selectedStateType = event;

        break;
      case InputSwitchActions.CLASS_TYPE:
        this.selectedClassType = event;

        break;
      case InputSwitchActions.ENDORSMENTS:
        this.selectedEndorsments = event;
        break;
      case InputSwitchActions.RESTRICTIONS:
        this.selectedRestrictions = event;
        break;
      default:
        break;
    }
  }

  public onAddLicense(): void {
    if (this.licenseForm.invalid) {
      this.inputService.markInvalid(this.licenseForm);
      return;
    }

    const {
      firstRowReview,
      secondRowReview,
      thirdRowReview,
      fourthRowReview,
      restrictions,
      endorsments,
      ...licenseForm
    } = this.licenseForm.value;

    this.licenseId++;

    const saveData: LicenseModel = {
      ...licenseForm,
      id: this.licenseId,
      restrictions: this.selectedRestrictions
        ? this.selectedRestrictions.map((item) => item.id)
        : [],
      endorsements: this.selectedEndorsments
        ? this.selectedEndorsments.map((item) => item.id)
        : [],
      isEditingLicense: false,
    };

    /* const saveData: CdlLicenseCommand = {
      ...licenseForm,
      id: this.licenseId,
      country: this.selectedCountryType ? this.selectedCountryType.name : null,
      stateId: this.selectedStateType ? this.selectedStateType.id : null,
      classType: this.selectedClassType ? this.selectedClassType.name : null,
      expDate: convertDateToBackend(expDate),
      restrictions: this.selectedRestrictions
        ? this.selectedRestrictions.map((item) => item.id)
        : [],
      endorsements: this.selectedEndorsments
        ? this.selectedEndorsments.map((item) => item.id)
        : [],
      isEditingLicense: false,
    }; */

    this.formValuesEmitter.emit(saveData);

    this.licenseForm.reset();

    this.selectedEndorsments = null;
    this.selectedRestrictions = null;

    this.inputResetService.resetInputSubject.next(true);
  }

  public onCancelEditLicense(): void {
    this.cancelFormEditingEmitter.emit(1);

    this.isLicenseEdited = false;

    this.licenseForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }

  public onSaveEditedLicense(): void {
    if (this.licenseForm.invalid) {
      this.inputService.markInvalid(this.licenseForm);
      return;
    }

    if (!this.isLicenseEdited) {
      return;
    }

    const {
      firstRowReview,
      secondRowReview,
      thirdRowReview,
      fourthRowReview,
      ...licenseForm
    } = this.licenseForm.value;

    const saveData: LicenseModel = {
      ...licenseForm,
      isEditingLicense: false,
    };

    this.saveFormEditingEmitter.emit(saveData);

    this.isLicenseEdited = false;

    this.licenseForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
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
        this.countryTypes = data.countryTypes;

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

        this.classTypes = data.classTypes;

        this.restrictionsList = data.restrictions;
        this.endorsmentsList = data.endorsements;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
