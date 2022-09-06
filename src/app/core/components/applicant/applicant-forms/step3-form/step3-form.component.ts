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

import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';

import {
  anyInputInLineIncorrect,
  isFormValueEqual,
} from '../../state/utils/utils';

import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { LicenseModel } from '../../state/model/cdl-information';

@Component({
  selector: 'app-step3-form',
  templateUrl: './step3-form.component.html',
  styleUrls: ['./step3-form.component.scss'],
})
export class Step3FormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() isEditing: boolean;
  @Input() formValuesToPatch?: any;

  @Output() formValuesEmitter = new EventEmitter<any>();
  @Output() cancelFormEditingEmitter = new EventEmitter<any>();
  @Output() saveFormEditingEmitter = new EventEmitter<any>();

  public selectedMode = SelectedMode.FEEDBACK;

  private subscription: Subscription;

  public licenseForm: FormGroup;

  public isLicenseEdited: boolean;

  public canadaStates: any[] = [];
  public usStates: any[] = [];

  public stateTypes: any[] = [];
  public countryTypes: any[] = [];
  public classTypes: any[] = [];
  public endorsmentsList: any[] = [];
  public restrictionsList: any[] = [];

  public selectedCountryType: any = null;
  public selectedStateType: any = null;
  public selectedClassType: any = null;
  public selectedEndorsments: any = null;
  public selectedRestrictions: any = null;

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
    private inputResetService: TaInputResetService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.createForm();

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

          previousFormValues.license = previousFormValues.license.toUpperCase();
          newFormValues.license = newFormValues.license.toUpperCase();

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
      license: [null, Validators.required],
      countryType: [null, Validators.required],
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
      license: this.formValuesToPatch.license,
      countryType: this.formValuesToPatch.countryType,
      stateId: this.formValuesToPatch.stateId,
      classType: this.formValuesToPatch.classType,
      expDate: this.formValuesToPatch.expDate,
      endorsments: this.formValuesToPatch.endorsments,
      restrictions: this.formValuesToPatch.restrictions,
    });
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
    /*
      const {firstRowReview,
      secondRowReview,
      thirdRowReview,
      fourthRowReview,...licenseForm} = this.licenseForm.value;

    const saveData: LicenseModel = {
      ...licenseForm,
      isEditingLicense: false,
    };

    this.formValuesEmitter.emit(saveData);*/

    this.licenseForm.reset();

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
}
