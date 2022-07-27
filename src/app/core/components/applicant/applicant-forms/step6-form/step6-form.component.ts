import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Subscription } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { isFormValueEqual } from '../../state/utils/utils';

import { phoneRegex } from '../../../shared/ta-input/ta-input.regex-validations';

import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';

import { ContactModel } from '../../state/model/education.model';

@Component({
  selector: 'app-step6-form',
  templateUrl: './step6-form.component.html',
  styleUrls: ['./step6-form.component.scss'],
})
export class Step6FormComponent implements OnInit {
  @Input() isEditing: boolean;
  @Input() isContactEdited?: boolean;
  @Input() formValuesToPatch?: any;

  @Output() formValuesEmitter = new EventEmitter<any>();
  @Output() cancelFormEditingEmitter = new EventEmitter<any>();
  @Output() saveFormEditingEmitter = new EventEmitter<any>();

  public contactForm: FormGroup;

  public subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private inputResetService: TaInputResetService
  ) {}

  ngOnInit(): void {
    this.createForm();

    if (this.formValuesToPatch) {
      this.patchForm();

      this.subscription = this.contactForm.valueChanges.subscribe(
        (newFormValue) => {
          const { isEditingContact, ...previousFormValues } =
            this.formValuesToPatch;

          if (isFormValueEqual(previousFormValues, newFormValue)) {
            this.isContactEdited = false;
          } else {
            this.isContactEdited = true;
          }
        }
      );
    }
  }

  private createForm(): void {
    this.contactForm = this.formBuilder.group({
      contactName: [null, Validators.required],
      contactPhone: [null, [Validators.required, phoneRegex]],
      contactRelationship: [null, Validators.required],
    });
  }

  public patchForm(): void {
    this.contactForm.patchValue({
      contactName: this.formValuesToPatch.contactName,
      contactPhone: this.formValuesToPatch.contactPhone,
      contactRelationship: this.formValuesToPatch.contactRelationship,
    });
  }

  public onAddContact(): void {
    if (this.contactForm.invalid) {
      this.inputService.markInvalid(this.contactForm);
      return;
    }

    const contactForm = this.contactForm.value;

    const saveData: ContactModel = {
      ...contactForm,
      isEditingContact: false,
    };

    this.formValuesEmitter.emit(saveData);

    this.contactForm.reset();

    this.inputResetService.resetInputSubject.next(true);
  }

  public onSaveEditedContact(): void {
    if (this.contactForm.invalid) {
      this.inputService.markInvalid(this.contactForm);
      return;
    }

    if (!this.isContactEdited) {
      return;
    }

    const contactForm = this.contactForm.value;

    const saveData: ContactModel = {
      ...contactForm,
      isEditingContact: false,
    };

    this.saveFormEditingEmitter.emit(saveData);

    this.isContactEdited = false;

    this.contactForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }

  public onCancelEditContact(): void {
    this.cancelFormEditingEmitter.emit(1);

    this.isContactEdited = false;

    this.contactForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }
}
