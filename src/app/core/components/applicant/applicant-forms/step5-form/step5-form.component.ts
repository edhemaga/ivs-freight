import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { isFormValueEqual } from '../../state/utils/utils';

import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';

import { TruckType } from '../../state/model/truck-type.model';
import { Address } from '../../state/model/address.model';
import { ViolationModel } from '../../state/model/violations.model';

@Component({
  selector: 'app-step5-form',
  templateUrl: './step5-form.component.html',
  styleUrls: ['./step5-form.component.scss'],
})
export class Step5FormComponent implements OnInit {
  @Input() isEditing: boolean;
  @Input() truckType: TruckType[];
  @Input() formValuesToPatch?: any;
  @Input() isViolationEdited?: boolean;

  @Output() formValuesEmitter = new EventEmitter<any>();
  @Output() cancelFormEditingEmitter = new EventEmitter<any>();
  @Output() saveFormEditingEmitter = new EventEmitter<any>();

  public violationsForm: FormGroup;

  private subscription: Subscription;

  public selectedTruckType: any = null;
  public selectedAddress: Address = null;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private inputResetService: TaInputResetService
  ) {}

  ngOnInit(): void {
    this.createForm();

    if (this.formValuesToPatch) {
      this.patchForm();

      this.subscription = this.violationsForm.valueChanges.subscribe(
        (newFormValue) => {
          const { isEditingViolation, ...previousFormValues } =
            this.formValuesToPatch;

          if (isFormValueEqual(previousFormValues, newFormValue)) {
            this.isViolationEdited = false;
          } else {
            this.isViolationEdited = true;
          }
        }
      );
    }
  }

  public createForm(): void {
    this.violationsForm = this.formBuilder.group({
      violationDate: [null, Validators.required],
      truckType: [null, Validators.required],
      violationLocation: [null, Validators.required],
      violationDescription: [null, Validators.required],
    });
  }

  public patchForm(): void {
    this.violationsForm.patchValue({
      violationDate: this.formValuesToPatch.violationDate,
      truckType: this.formValuesToPatch.truckType,
      violationLocation: this.formValuesToPatch.violationLocation,
      violationDescription: this.formValuesToPatch.violationDescription,
    });
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.TRUCK_TYPE:
        this.selectedTruckType = event;

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

    /*  const violationForm = this.violationsForm.value;

   const saveData: ViolationModel = {
      ...violationForm,
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

    const violationForm = this.violationsForm.value;

    const saveData: ViolationModel = {
      ...violationForm,
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
}
