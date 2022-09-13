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
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription, Subject, takeUntil } from 'rxjs';

import {
  addressValidation,
  descriptionValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';

import {
  anyInputInLineIncorrect,
  isFormValueEqual,
} from '../../state/utils/utils';

import { AnswerChoices } from '../../state/model/applicant-question.model';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { AddressEntity, TruckTypeResponse } from 'appcoretruckassist';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { AccidentModel } from '../../state/model/accident.model';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';
import { ApplicantListsService } from '../../state/services/applicant-lists.service';

import { TaInputRadiobuttonsComponent } from '../../../shared/ta-input-radiobuttons/ta-input-radiobuttons.component';

@Component({
  selector: 'app-step4-form',
  templateUrl: './step4-form.component.html',
  styleUrls: ['./step4-form.component.scss'],
})
export class Step4FormComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  @ViewChild(TaInputRadiobuttonsComponent)
  component: TaInputRadiobuttonsComponent;

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

  public accidentForm: FormGroup;

  public selectedAddress: AddressEntity;
  public selectedVehicleType: any = null;

  public isAccidentEdited: boolean;

  public editingCardAddress: any;

  public vehicleType: TruckTypeResponse[] = [];

  public hazmatSpillRadios: any;

  public answerChoices: AnswerChoices[] = [
    {
      id: 1,
      label: 'YES',
      value: 'hazmatYes',
      name: 'hazmatYes',
      checked: false,
    },
    {
      id: 2,
      label: 'NO',
      value: 'hazmatNo',
      name: 'hazmatNo',
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
    {
      lineIndex: 10,
      lineInputs: [false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 11,
      lineInputs: [false, false],
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

      this.subscription = this.accidentForm.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((updatedFormValues) => {
          const {
            location,
            accidentState,
            isEditingAccident,
            ...previousFormValues
          } = this.formValuesToPatch;

          previousFormValues.location = location.address;

          this.editingCardAddress = location;

          const { firstRowReview, secondRowReview, ...newFormValues } =
            updatedFormValues;

          if (isFormValueEqual(previousFormValues, newFormValues)) {
            this.isAccidentEdited = false;
          } else {
            this.isAccidentEdited = true;
          }
        });
    }
  }

  ngAfterViewInit(): void {
    this.hazmatSpillRadios = this.component.buttons;

    this.accidentForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.formStatusEmitter.emit(res);
      });

    this.accidentForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.lastFormValuesEmitter.emit(res);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.markFormInvalid?.currentValue) {
      this.inputService.markInvalid(this.accidentForm);

      this.markInvalidEmitter.emit(false);
    }
  }

  public createForm(): void {
    this.accidentForm = this.formBuilder.group({
      location: [null, [Validators.required, ...addressValidation]],
      date: [null, Validators.required],
      fatalities: [0],
      injuries: [0],
      hazmatSpill: [null, Validators.required],
      vehicleType: [null, Validators.required],
      description: [null, [Validators.required, ...descriptionValidation]],

      firstRowReview: [null],
      secondRowReview: [null],
    });
  }

  public patchForm(): void {
    this.accidentForm.patchValue({
      location: this.formValuesToPatch.location.address,
      date: this.formValuesToPatch.date,
      hazmatSpill: this.formValuesToPatch.hazmatSpill,
      fatalities: this.formValuesToPatch.fatalities,
      injuries: this.formValuesToPatch.injuries,
      vehicleType: this.formValuesToPatch.vehicleType,
      description: this.formValuesToPatch.description,
    });

    setTimeout(() => {
      const hazmatSpillValue = this.accidentForm.get('hazmatSpill').value;

      if (hazmatSpillValue) {
        this.hazmatSpillRadios[0].checked = true;
      } else {
        this.hazmatSpillRadios[1].checked = true;
      }
    }, 1);
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.HAZMAT_SPILL:
        const selectedCheckbox = event.find(
          (radio: { checked: boolean }) => radio.checked
        );

        if (selectedCheckbox.label === 'YES') {
          this.accidentForm.get('hazmatSpill').patchValue(true);
        } else {
          this.accidentForm.get('hazmatSpill').patchValue(false);
        }

        break;
      case InputSwitchActions.TRUCK_TYPE:
        this.selectedVehicleType = event;

        break;
      case InputSwitchActions.ADDRESS:
        this.selectedAddress = event.address;

        if (!event.valid) {
          this.accidentForm.get('location').setErrors({ invalid: true });
        }

        break;
      default:
        break;
    }
  }

  public onAddAccident(): void {
    if (this.accidentForm.invalid) {
      this.inputService.markInvalid(this.accidentForm);
      return;
    }

    const { location, firstRowReview, secondRowReview, ...accidentForm } =
      this.accidentForm.value;

    const saveData: AccidentModel = {
      ...accidentForm,
      location: this.selectedAddress,
      accidentState: this.selectedAddress.state,
      isEditingAccident: false,
    };

    console.log(saveData);

    this.formValuesEmitter.emit(saveData);

    this.hazmatSpillRadios[0].checked = false;
    this.hazmatSpillRadios[1].checked = false;

    this.selectedVehicleType = null;

    this.accidentForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.accidentForm.patchValue({
      fatalities: 0,
      injuries: 0,
    });
  }

  public onCancelEditAccident(): void {
    this.cancelFormEditingEmitter.emit(1);

    this.isAccidentEdited = false;

    this.hazmatSpillRadios[0].checked = false;
    this.hazmatSpillRadios[1].checked = false;

    this.accidentForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }

  public onSaveEditedAccident(): void {
    if (this.accidentForm.invalid) {
      this.inputService.markInvalid(this.accidentForm);
      return;
    }

    if (!this.isAccidentEdited) {
      return;
    }

    const { location, firstRowReview, secondRowReview, ...accidentForm } =
      this.accidentForm.value;

    const saveData: AccidentModel = {
      ...accidentForm,
      location: this.selectedAddress
        ? this.selectedAddress
        : this.editingCardAddress,
      accidentState: this.selectedAddress
        ? this.selectedAddress.state
        : this.editingCardAddress.state,
      isEditingAccident: false,
    };

    this.saveFormEditingEmitter.emit(saveData);

    this.isAccidentEdited = false;

    this.accidentForm.reset();

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
