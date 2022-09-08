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

import {
  anyInputInLineIncorrect,
  isFormValueEqual,
} from '../../state/utils/utils';

import {
  addressValidation,
  descriptionValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';

import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantListsService } from '../../state/services/applicant-lists.service';

import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { Address } from '../../state/model/address.model';
import { ViolationModel } from '../../state/model/violations.model';
import { TruckTypeResponse } from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step5-form',
  templateUrl: './step5-form.component.html',
  styleUrls: ['./step5-form.component.scss'],
})
export class Step5FormComponent implements OnInit, OnDestroy {
  @Input() isEditing: boolean;
  @Input() formValuesToPatch?: any;

  @Output() formValuesEmitter = new EventEmitter<any>();
  @Output() cancelFormEditingEmitter = new EventEmitter<any>();
  @Output() saveFormEditingEmitter = new EventEmitter<any>();

  private destroy$ = new Subject<void>();

  public selectedMode = SelectedMode.APPLICANT;

  private subscription: Subscription;

  public violationsForm: FormGroup;

  public isViolationEdited: boolean;

  public editingCardAddress: any;

  public selectedVehicleType: any = null;
  public selectedAddress: Address = null;

  public vehicleType: TruckTypeResponse[] = [];

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
      lineInputs: [false, false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 11,
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

      this.subscription = this.violationsForm.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((updatedFormValues) => {
          const {
            violationLocation,
            isEditingViolation,
            ...previousFormValues
          } = this.formValuesToPatch;

          previousFormValues.violationLocation = violationLocation.address;

          this.editingCardAddress = violationLocation;

          const { firstRowReview, secondRowReview, ...newFormValues } =
            updatedFormValues;

          if (isFormValueEqual(previousFormValues, newFormValues)) {
            this.isViolationEdited = false;
          } else {
            this.isViolationEdited = true;
          }
        });
    }
  }

  public createForm(): void {
    this.violationsForm = this.formBuilder.group({
      violationDate: [null, Validators.required],
      vehicleType: [null, Validators.required],
      violationLocation: [null, [Validators.required, ...addressValidation]],
      violationDescription: [
        null,
        [Validators.required, ...descriptionValidation],
      ],

      firstRowReview: [null],
      secondRowReview: [null],
    });
  }

  public patchForm(): void {
    this.violationsForm.patchValue({
      violationDate: this.formValuesToPatch.violationDate,
      vehicleType: this.formValuesToPatch.vehicleType,
      violationLocation: this.formValuesToPatch.violationLocation.address,
      violationDescription: this.formValuesToPatch.violationDescription,
    });
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.TRUCK_TYPE:
        this.selectedVehicleType = event;

        break;
      case InputSwitchActions.ADDRESS:
        this.selectedAddress = event.address;

        if (!event.valid) {
          this.violationsForm
            .get('violationLocation')
            .setErrors({ invalid: true });
        }

        break;
      default:
        break;
    }
  }

  public onAddViolation(): void {
    if (this.violationsForm.invalid) {
      this.inputService.markInvalid(this.violationsForm);
      return;
    }

    /*  const {violationLocation, firstRowReview,
      secondRowReview,...violationsForm} = this.violationsForm.value;

   const saveData: ViolationModel = {
      ...violationsForm,
      violationLocation: this.selectedAddress,
      isEditingViolation: false,
    };

    this.formValuesEmitter.emit(saveData); */

    this.violationsForm.reset();

    this.inputResetService.resetInputSubject.next(true);
  }

  public onSaveEditedViolation(): void {
    if (this.violationsForm.invalid) {
      this.inputService.markInvalid(this.violationsForm);
      return;
    }

    if (!this.isViolationEdited) {
      return;
    }

    const { firstRowReview, secondRowReview, ...violationsForm } =
      this.violationsForm.value;

    const saveData: ViolationModel = {
      ...violationsForm,
      violationLocation: this.selectedAddress
        ? this.selectedAddress
        : this.editingCardAddress,
      isEditingViolation: false,
    };

    this.saveFormEditingEmitter.emit(saveData);

    this.isViolationEdited = false;

    this.violationsForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }

  public onCancelEditAccident(): void {
    this.cancelFormEditingEmitter.emit(1);

    this.isViolationEdited = false;

    this.violationsForm.reset();

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
        this.vehicleType = data.truckTypes.map((item) => {
          return {
            ...item,
            folder: 'common',
            subFolder: 'trucks',
          };
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
