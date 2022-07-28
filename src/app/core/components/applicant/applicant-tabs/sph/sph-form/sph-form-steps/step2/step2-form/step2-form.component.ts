import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { TaInputRadiobuttonsComponent } from 'src/app/core/components/shared/ta-input-radiobuttons/ta-input-radiobuttons.component';

import { isFormValueEqual } from 'src/app/core/components/applicant/state/utils/utils';

import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { TaInputResetService } from 'src/app/core/components/shared/ta-input/ta-input-reset.service';

import { AnswerChoices } from 'src/app/core/components/applicant/state/model/applicant-question.model';
import { InputSwitchActions } from 'src/app/core/components/applicant/state/enum/input-switch-actions.enum';
import { Address } from 'src/app/core/components/applicant/state/model/address.model';
import { SphFormAccidentModel } from 'src/app/core/components/applicant/state/model/accident.model';

@Component({
  selector: 'app-sph-step2-form',
  templateUrl: './step2-form.component.html',
  styleUrls: ['./step2-form.component.scss'],
})
export class SphStep2FormComponent implements OnInit {
  @ViewChild(TaInputRadiobuttonsComponent)
  component: TaInputRadiobuttonsComponent;

  @Input() isEditing: boolean;
  @Input() isAccidentEdited?: boolean;
  @Input() formValuesToPatch?: any;

  @Output() formValuesEmitter = new EventEmitter<any>();
  @Output() cancelFormEditingEmitter = new EventEmitter<any>();
  @Output() saveFormEditingEmitter = new EventEmitter<any>();

  public accidentForm: FormGroup;
  public accidentArray: SphFormAccidentModel[] = [];

  public subscription: Subscription;

  public selectedAddress: Address = null;

  public injuriesCounter: number = 0;
  public fatalitiesCounter: number = 0;

  public hazmatSpillRadios: any;

  public hazmatAnswerChoices: AnswerChoices[] = [
    {
      id: 7,
      label: 'YES',
      value: 'hazmatYes',
      name: 'hazmatYes',
      checked: false,
    },
    {
      id: 8,
      label: 'NO',
      value: 'hazmatNo',
      name: 'hazmatNo',
      checked: false,
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
        (newFormValue) => {
          const {
            address,
            accidentState,
            isEditingAccident,
            ...previousFormValues
          } = this.formValuesToPatch;

          if (isFormValueEqual(previousFormValues, newFormValue)) {
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

  private createForm(): void {
    this.accidentForm = this.formBuilder.group({
      accidentDate: [null, Validators.required],
      accidentLocation: [null, Validators.required],
      accidentDescription: [null, Validators.required],
      hazmatSpill: [null, Validators.required],
      injuries: [null],
      fatalities: [null],
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

  public onIncrementDecrementCounter(event: any, type: string) {
    if (type === 'fatalities') {
      this.fatalitiesCounter = event;
      this.accidentForm.patchValue({
        fatalities: event,
      });
    }

    if (type === 'injuries') {
      this.injuriesCounter = event;
      this.accidentForm.patchValue({
        injuries: event,
      });
    }
  }

  public patchForm(): void {
    this.accidentForm.patchValue({
      accidentDate: this.formValuesToPatch.accidentDate,
      accidentLocation: this.formValuesToPatch.accidentLocation,
      accidentDescription: this.formValuesToPatch.accidentDescription,
      hazmatSpill: this.formValuesToPatch.hazmatSpill,
      fatalities: this.formValuesToPatch.fatalities,
      injuries: this.formValuesToPatch.injuries,
    });

    this.injuriesCounter = this.formValuesToPatch.injuries;
    this.fatalitiesCounter = this.formValuesToPatch.fatalities;

    setTimeout(() => {
      const hazmatSpillValue = this.accidentForm.get('hazmatSpill').value;

      if (hazmatSpillValue === 'YES') {
        this.hazmatSpillRadios[0].checked = true;
      } else {
        this.hazmatSpillRadios[1].checked = true;
      }
    }, 1);
  }

  public onAddAnotherAccident() {
    if (this.accidentForm.invalid) {
      this.inputService.markInvalid(this.accidentForm);
      return;
    }

    const { address, ...registerForm } = this.accidentForm.value;

    const saveData: SphFormAccidentModel = {
      ...registerForm,
      address: this.selectedAddress,
      accidentState: this.selectedAddress.state,
      injuries: this.injuriesCounter,
      fatalities: this.fatalitiesCounter,
      isEditingAccident: false,
    };

    this.formValuesEmitter.emit(saveData);

    this.hazmatSpillRadios[0].checked = false;
    this.hazmatSpillRadios[1].checked = false;

    this.injuriesCounter = 0;
    this.fatalitiesCounter = 0;

    this.accidentForm.reset();

    this.inputResetService.resetInputSubject.next(true);
  }

  public onSaveEditedAccident(): void {
    if (this.accidentForm.invalid) {
      this.inputService.markInvalid(this.accidentForm);
      return;
    }

    if (!this.isAccidentEdited) {
      return;
    }

    const { address, ...registerForm } = this.accidentForm.value;

    const saveData: SphFormAccidentModel = {
      ...registerForm,
      address: this.selectedAddress,
      accidentState: this.selectedAddress.state,
      injuries: this.injuriesCounter,
      fatalities: this.fatalitiesCounter,
      isEditingAccident: false,
    };

    this.saveFormEditingEmitter.emit(saveData);

    this.isAccidentEdited = false;

    this.fatalitiesCounter = 0;
    this.injuriesCounter = 0;

    this.accidentForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }

  public onCancelEditAccident(): void {
    this.cancelFormEditingEmitter.emit(1);

    this.isAccidentEdited = false;

    this.hazmatSpillRadios[0].checked = false;
    this.hazmatSpillRadios[1].checked = false;

    this.fatalitiesCounter = 0;
    this.injuriesCounter = 0;

    this.accidentForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }
}
