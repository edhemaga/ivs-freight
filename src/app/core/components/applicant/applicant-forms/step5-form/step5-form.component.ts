import {
  AfterViewInit,
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
export class Step5FormComponent
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
          const { id, location, isEditingViolation, ...previousFormValues } =
            this.formValuesToPatch;

          previousFormValues.location = location.address;

          this.editingCardAddress = location;

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

  ngAfterViewInit(): void {
    this.violationsForm.statusChanges.subscribe((res) => {
      this.formStatusEmitter.emit(res);
    });

    this.violationsForm.valueChanges.subscribe((res) => {
      this.lastFormValuesEmitter.emit(res);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.markFormInvalid?.currentValue) {
      this.inputService.markInvalid(this.violationsForm);

      this.markInvalidEmitter.emit(false);
    }
  }

  public createForm(): void {
    this.violationsForm = this.formBuilder.group({
      date: [null, Validators.required],
      vehicleType: [null, Validators.required],
      location: [null, [Validators.required, ...addressValidation]],
      description: [null, [Validators.required, ...descriptionValidation]],

      firstRowReview: [null],
      secondRowReview: [null],
    });
  }

  public patchForm(): void {
    this.violationsForm.patchValue({
      date: this.formValuesToPatch.date,
      vehicleType: this.formValuesToPatch.vehicleType,
      location: this.formValuesToPatch.location.address,
      description: this.formValuesToPatch.description,
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
          this.violationsForm.get('location').setErrors({ invalid: true });
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

    const { location, firstRowReview, secondRowReview, ...violationsForm } =
      this.violationsForm.value;

    const saveData: ViolationModel = {
      ...violationsForm,
      isEditingViolation: false,
      location: this.selectedAddress,
    };

    this.formValuesEmitter.emit(saveData);

    this.selectedVehicleType = null;

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
      location: this.selectedAddress
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
          if (item.id === 3) {
            return {
              ...item,
              name: 'Tow Truck',
              folder: 'common',
              subFolder: 'trucks',
            };
          }

          if (item.id === 4) {
            return {
              ...item,
              name: 'Car Hauler',
              folder: 'common',
              subFolder: 'trucks',
            };
          }

          if (item.id === 6) {
            return {
              ...item,
              name: 'Semi w/Sleeper',
              folder: 'common',
              subFolder: 'trucks',
            };
          }

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
