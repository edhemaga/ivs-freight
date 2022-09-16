import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription, Subject, takeUntil } from 'rxjs';

import { FormService } from './../../../../services/form/form.service';
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
  CdlRestrictionResponse,
  EnumValue,
} from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step3-form',
  templateUrl: './step3-form.component.html',
  styleUrls: ['./step3-form.component.scss'],
})
export class Step3FormComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  @Input() isEditing: boolean;
  @Input() formValuesToPatch?: any;
  @Input() markFormInvalid?: boolean;

  @Output() formValuesEmitter = new EventEmitter<any>();
  @Output() cancelFormEditingEmitter = new EventEmitter<any>();
  @Output() saveFormEditingEmitter = new EventEmitter<any>();
  @Output() formStatusEmitter = new EventEmitter<any>();
  @Output() markInvalidEmitter = new EventEmitter<any>();
  @Output() lastFormValuesEmitter = new EventEmitter<any>();

  private destroy$ = new Subject<void>();

  public selectedMode = SelectedMode.APPLICANT;

  private subscription: Subscription;

  public licenseForm: FormGroup;

  public isLicenseEdited: boolean;

  public canadaStates: any[] = [];
  public usStates: any[] = [];

  public countryTypes: EnumValue[] = [];
  public stateTypes: any[] = [];
  public classTypes: EnumValue[] = [];
  public restrictionsList: CdlRestrictionResponse[] = [];
  public endorsmentsList: CdlEndorsementResponse[] = [];

  public selectedCountryType: EnumValue = null;
  public selectedStateType: any = null;
  public selectedClassType: EnumValue = null;
  public selectedRestrictions: CdlRestrictionResponse[] = [];
  public selectedEndorsments: CdlEndorsementResponse[] = [];

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
    private formService: FormService,
    private applicantListsService: ApplicantListsService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.getDropdownLists();

    if (this.formValuesToPatch) {
      this.patchForm();

      this.subscription = this.licenseForm.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((updatedFormValues) => {
          const { endorsments, isEditingLicense, ...previousFormValues } =
            this.formValuesToPatch;

          const {
            endorsments: asd,
            firstRowReview,
            secondRowReview,
            thirdRowReview,
            fourthRowReview,
            ...newFormValues
          } = updatedFormValues;

          previousFormValues.licenseNumber =
            previousFormValues.licenseNumber.toUpperCase();

          if (newFormValues.licenseNumber) {
            newFormValues.licenseNumber =
              newFormValues.licenseNumber.toUpperCase();
          }

          previousFormValues.restrictions = JSON.stringify(
            previousFormValues.restrictions.map((item) => item.id)
          );
          newFormValues.restrictions = JSON.stringify(
            this.selectedRestrictions.map((item) => item.id)
          );

          /* newFormValues.endorsments = this.selectedEndorsments; */

          console.log('prev', previousFormValues);
          console.log('new', newFormValues);
          console.log(
            'restrictions',
            this.licenseForm.get('restrictions').value
          );

          if (isFormValueEqual(previousFormValues, newFormValues)) {
            this.isLicenseEdited = false;
          } else {
            this.isLicenseEdited = true;
          }
        });
    }
  }

  ngAfterViewInit(): void {
    this.licenseForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.formStatusEmitter.emit(res);
      });

    this.licenseForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        res.restrictions = this.selectedRestrictions;
        res.endorsments = this.selectedEndorsments;

        this.lastFormValuesEmitter.emit(res);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.markFormInvalid?.currentValue) {
      this.inputService.markInvalid(this.licenseForm);

      this.markInvalidEmitter.emit(false);
    }
  }

  private createForm(): void {
    this.licenseForm = this.formBuilder.group({
      licenseNumber: [null, Validators.required],
      country: [null, Validators.required],
      state: [null, Validators.required],
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
      state: this.formValuesToPatch.state,
      classType: this.formValuesToPatch.classType,
      expDate: this.formValuesToPatch.expDate,
    });

    setTimeout(() => {
      if (this.formValuesToPatch.country.toLowerCase() === 'us') {
        this.stateTypes = this.usStates;
      } else {
        this.stateTypes = this.canadaStates;
      }

      this.selectedCountryType = this.countryTypes.find(
        (item) => item.name === this.formValuesToPatch.country
      );

      const filteredStateType = this.usStates.find(
        (stateItem) => stateItem.name === this.formValuesToPatch.state
      );

      this.selectedStateType = filteredStateType
        ? filteredStateType
        : this.canadaStates.find(
            (stateItem) => stateItem.name === this.formValuesToPatch.state
          );

      this.selectedClassType = this.classTypes.find(
        (item) => item.name === this.formValuesToPatch.classType
      );

      this.selectedRestrictions = this.formValuesToPatch.restrictions;

      this.selectedEndorsments = this.formValuesToPatch.endorsments;
    }, 150);
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.COUNTRY_TYPE:
        const previousSelectedCountry = this.selectedCountryType;

        this.selectedCountryType = event;

        if (this.selectedCountryType !== previousSelectedCountry) {
          this.selectedStateType = null;

          this.licenseForm.patchValue({
            state: null,
          });
        }

        if (this.selectedCountryType?.name.toLowerCase() === 'us') {
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
      case InputSwitchActions.RESTRICTIONS:
        this.selectedRestrictions = event;

        this.licenseForm
          .get('restrictions')
          .patchValue(this.selectedRestrictions);

        /*    this.cdref.detectChanges(); */

        console.log('inputchangerestrictions', this.selectedRestrictions);

        break;
      case InputSwitchActions.ENDORSMENTS:
        this.selectedEndorsments = event;

        this.licenseForm
          .get('endorsments')
          .patchValue(this.selectedEndorsments);

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
      restrictions,
      endorsments,
      firstRowReview,
      secondRowReview,
      thirdRowReview,
      fourthRowReview,
      ...licenseForm
    } = this.licenseForm.value;

    const saveData: LicenseModel = {
      ...licenseForm,
      restrictions: this.selectedRestrictions,
      endorsments: this.selectedEndorsments,
      isEditingLicense: false,
    };

    this.formValuesEmitter.emit(saveData);

    this.selectedCountryType = null;
    this.selectedStateType = null;
    this.selectedClassType = null;
    this.selectedEndorsments = [];
    this.selectedRestrictions = [];

    this.licenseForm.reset();

    this.formService.resetForm(this.licenseForm);
  }

  public onCancelEditLicense(): void {
    this.cancelFormEditingEmitter.emit(1);

    this.isLicenseEdited = false;

    this.licenseForm.reset();

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
      restrictions,
      endorsments,
      firstRowReview,
      secondRowReview,
      thirdRowReview,
      fourthRowReview,
      ...licenseForm
    } = this.licenseForm.value;

    const saveData: LicenseModel = {
      ...licenseForm,
      restrictions: this.selectedRestrictions,
      endorsments: this.selectedEndorsments,
      isEditingLicense: false,
    };

    this.saveFormEditingEmitter.emit(saveData);

    this.isLicenseEdited = false;

    this.selectedCountryType = null;
    this.selectedStateType = null;
    this.selectedClassType = null;
    this.selectedEndorsments = [];
    this.selectedRestrictions = [];

    this.licenseForm.reset();

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
