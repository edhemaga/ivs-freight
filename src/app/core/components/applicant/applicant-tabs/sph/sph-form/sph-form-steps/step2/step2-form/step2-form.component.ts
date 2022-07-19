import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AnswerChoices } from 'src/app/core/components/applicant/state/model/applicant-question.model';
import { InputSwitchActions } from 'src/app/core/components/applicant/state/enum/input-switch-actions.enum';
import { Address } from 'src/app/core/components/applicant/state/model/address.model';

@Component({
  selector: 'app-sph-step2-form',
  templateUrl: './step2-form.component.html',
  styleUrls: ['./step2-form.component.scss'],
})
export class SphStep2FormComponent implements OnInit {
  @Output() formValuesEmitter = new EventEmitter<any>();

  public accidentForm: FormGroup;

  public selectedAddress: Address = null;

  public hazmatAnswerChoices: AnswerChoices[] = [
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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.accidentForm = this.formBuilder.group({
      accidentDate: [null, Validators.required],
      accidentLocation: [null, Validators.required],
      accidentDescription: [null, Validators.required],
      hazmatSpill: [null, Validators.required],
    });
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.ADDRESS:
        this.selectedAddress = event.address;

        if (!event.valid) {
          this.accidentForm
            .get('accidentLocation')
            .setErrors({ invalid: true });
        }

        break;
      case InputSwitchActions.HAZMAT_SPILL:
        const selectedHazmatCheckbox = event.find(
          (radio: { checked: boolean }) => radio.checked
        );

        this.accidentForm
          .get('hazmatSpill')
          .patchValue(selectedHazmatCheckbox.label);

        break;

      default:
        break;
    }
  }

  public fromValuesEmitter() {
    const accidentFormValues = this.accidentForm.value;

    this.formValuesEmitter.emit(accidentFormValues);
  }
}
