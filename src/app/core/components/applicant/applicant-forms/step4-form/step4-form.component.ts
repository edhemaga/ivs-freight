import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import {
  anyInputInLineIncorrect,
  isFormValueEqual,
} from '../../state/utils/utils';

import { TruckType } from '../../state/model/truck-type.model';
import { AnswerChoices } from '../../state/model/applicant-question.model';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { AddressEntity } from 'appcoretruckassist';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { AccidentModel } from '../../state/model/accident.model';

import { TaInputRadiobuttonsComponent } from '../../../shared/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { addressValidation } from '../../../shared/ta-input/ta-input.regex-validations';

@Component({
  selector: 'app-step4-form',
  templateUrl: './step4-form.component.html',
  styleUrls: ['./step4-form.component.scss'],
})
export class Step4FormComponent implements OnInit, AfterViewInit {
  @ViewChild(TaInputRadiobuttonsComponent)
  component: TaInputRadiobuttonsComponent;

  @Input() isEditing: boolean;
  @Input() formValuesToPatch?: any;

  @Output() formValuesEmitter = new EventEmitter<any>();
  @Output() cancelFormEditingEmitter = new EventEmitter<any>();
  @Output() saveFormEditingEmitter = new EventEmitter<any>();

  public selectedMode = SelectedMode.FEEDBACK;

  private subscription: Subscription;

  public accidentForm: FormGroup;

  public selectedAddress: AddressEntity;
  public selectedTruckType: any = null;

  public isAccidentEdited: boolean;
  public editingCardAddress: any;

  public truckType: TruckType[] = [];
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

  public hazmatSpillRadios: any;

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
    private inputResetService: TaInputResetService
  ) {}

  ngOnInit(): void {
    this.createForm();

    if (this.formValuesToPatch) {
      this.patchForm();

      this.subscription = this.accidentForm.valueChanges.subscribe(
        (updatedFormValues) => {
          const {
            accidentLocation,
            accidentState,
            isEditingAccident,
            ...previousFormValues
          } = this.formValuesToPatch;

          previousFormValues.accidentLocation = accidentLocation.address;

          this.editingCardAddress = accidentLocation;

          const { firstRowReview, secondRowReview, ...newFormValues } =
            updatedFormValues;

          if (isFormValueEqual(previousFormValues, newFormValues)) {
            this.isAccidentEdited = false;
          } else {
            this.isAccidentEdited = true;
          }
        }
      );
    }
  }

  ngAfterViewInit(): void {
    this.hazmatSpillRadios = this.component.buttons;
  }

  public createForm(): void {
    this.accidentForm = this.formBuilder.group({
      accidentLocation: [null, [Validators.required, ...addressValidation]],
      accidentDate: [null, Validators.required],
      fatalities: [0],
      injuries: [0],
      hazmatSpill: [null, Validators.required],
      truckType: [null, Validators.required],
      accidentDescription: [null, Validators.required],

      firstRowReview: [null],
      secondRowReview: [null],
    });
  }

  public patchForm(): void {
    this.accidentForm.patchValue({
      accidentLocation: this.formValuesToPatch.accidentLocation.address,
      accidentDate: this.formValuesToPatch.accidentDate,
      hazmatSpill: this.formValuesToPatch.hazmatSpill,
      fatalities: this.formValuesToPatch.fatalities,
      injuries: this.formValuesToPatch.injuries,
      truckType: this.formValuesToPatch.truckType,
      accidentDescription: this.formValuesToPatch.accidentDescription,
    });

    setTimeout(() => {
      const hazmatSpillValue = this.accidentForm.get('hazmatSpill').value;

      if (hazmatSpillValue === 'YES') {
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

        this.accidentForm.get('hazmatSpill').patchValue(selectedCheckbox.label);

        break;
      case InputSwitchActions.TRUCK_TYPE:
        this.selectedTruckType = event;

        break;
      case InputSwitchActions.ADDRESS:
        this.selectedAddress = event.address;

        if (!event.valid) {
          this.accidentForm
            .get('accidentLocation')
            .setErrors({ invalid: true });
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

    const {
      accidentLocation,
      firstRowReview,
      secondRowReview,
      ...accidentForm
    } = this.accidentForm.value;

    const saveData: AccidentModel = {
      ...accidentForm,
      accidentLocation: this.selectedAddress,
      accidentState: this.selectedAddress.state,
      isEditingAccident: false,
    };

    this.hazmatSpillRadios[0].checked = false;
    this.hazmatSpillRadios[1].checked = false;

    this.formValuesEmitter.emit(saveData);

    this.accidentForm.reset();

    this.inputResetService.resetInputSubject.next(true);
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

    const {
      accidentLocation,
      firstRowReview,
      secondRowReview,
      ...accidentForm
    } = this.accidentForm.value;

    const saveData: AccidentModel = {
      ...accidentForm,
      accidentLocation: this.selectedAddress
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
}
