import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { isFormValueEqual } from '../../state/utils/utils';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { Applicant } from '../../state/model/applicant.model';
import { Address } from '../../state/model/address.model';
import {
  Accident,
  AccidentInfo,
  AccidentModel,
} from '../../state/model/accident.model';
import { AnswerChoices } from '../../state/model/applicant-question.model';
import { TruckType } from '../../state/model/truck-type.model';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss'],
})
export class Step4Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.APPLICANT;

  public applicant: Applicant | undefined;

  private subscription: Subscription;

  public accidentForm: FormGroup;
  public accidentArray: AccidentModel[] = [
    {
      accidentDate: '01/09/2012',
      accidentLocation: 'Nw 27th Ave, Ocala, 23450 FL, USA',
      accidentState: 'AL',
      fatalities: 1,
      injuries: 1,
      hazmatSpill: 'YES',
      truckType: 'Truck',
      accidentDescription: 'Lorem ipsum dolor sir ametiblablabla',
    },
    {
      accidentDate: '21/09/2012',
      accidentLocation: 'Nw 27th Ave, Ocala, 23450 FL, USA',
      accidentState: 'AL',
      fatalities: 1,
      injuries: 1,
      hazmatSpill: 'YES',
      truckType: 'Truck',
      accidentDescription: 'Lorem ipsum dolor sir ametiblablabla',
    },
  ];

  public selectedAccidentIndex: number;
  public selectedAddress: Address = null;
  public selectedTruckType: any = null;

  public truckType: TruckType[] = [];

  public isEditing: boolean = false;
  public isAccidentEdited: boolean = false;

  public totalFatalities: number = 0;
  public totalInjuries: number = 0;

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

  public fatalitiesCounter: number = 0;
  public injuriesCounter: number = 0;

  //

  /* public accidentArray: Accident[] = []; */

  public accidentInfo: AccidentInfo | undefined;

  public editAccident: number = -1;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private inputResetService: TaInputResetService
  ) {}

  ngOnInit(): void {
    this.createForm();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  public trackByIdentity = (index: number, item: any): number => index;

  public createForm(): void {
    this.accidentForm = this.formBuilder.group({
      hasPastAccident: [false],
      accidentLocation: [null, Validators.required],
      accidentDate: [null, Validators.required],
      hazmatSpill: [null, Validators.required],
      truckType: [null, Validators.required],
      accidentDescription: [null, Validators.required],
    });
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

  public onIncrementDecrementCounter(event: any, type: string) {
    if (type === 'fatalities') {
      this.fatalitiesCounter = event;
    }

    if (type === 'injuries') {
      this.injuriesCounter = event;
    }
  }

  public onAddAccident(): void {
    if (this.accidentForm.invalid) {
      this.inputService.markInvalid(this.accidentForm);
      return;
    }

    this.inputResetService.resetInputSubject.next(true);

    /*  const accidentForm = this.accidentForm.value;
    const accident: Accident = new Accident();

    accident.accidentDate = accidentForm.accidentDate;
    accident.accidentLocation = accidentForm.accidentLocation;
    accident.hazmatSpill = accidentForm.hazmatSpill;
    accident.fatalities = accidentForm.fatalities;
    accident.injuries = accidentForm.injuries;
    accident.truckType = accidentForm.truckType;
    accident.accidentDescription = accidentForm.accidentDescription;

    this.accidentArray.push(accident);

    this.accidentForm.reset();
    this.editAccident = -1; */
  }

  public onDeleteAccident(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.accidentArray.splice(index, 1);
  }

  public onEditAccident(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.isAccidentEdited = false;

    this.isEditing = true;

    this.selectedAccidentIndex = index;

    const selectedAccident = this.accidentArray[index];

    this.accidentForm.patchValue({
      accidentLocation: selectedAccident.accidentLocation,
      accidentDate: selectedAccident.accidentDate,
      hazmatSpill: selectedAccident.hazmatSpill,
      truckType: selectedAccident.truckType,
      accidentDescription: selectedAccident.accidentDescription,
    });

    this.fatalitiesCounter = selectedAccident.fatalities;
    this.injuriesCounter = selectedAccident.injuries;

    this.subscription = this.accidentForm.valueChanges.subscribe(
      (newFormValue) => {
        if (isFormValueEqual(selectedAccident, newFormValue)) {
          this.isAccidentEdited = false;
        } else {
          this.isAccidentEdited = true;
        }
      }
    );
  }

  public onSaveEditedAccident(): void {
    if (this.accidentForm.invalid) {
      this.inputService.markInvalid(this.accidentForm);
      return;
    }

    if (!this.isAccidentEdited) {
      return;
    }

    this.accidentArray[this.selectedAccidentIndex] = this.accidentForm.value;

    this.isEditing = false;

    this.isAccidentEdited = false;

    this.fatalitiesCounter = 0;
    this.injuriesCounter = 0;

    this.accidentForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }

  public onCancelEditAccident(): void {
    this.isEditing = false;

    this.isAccidentEdited = false;

    this.fatalitiesCounter = 0;
    this.injuriesCounter = 0;

    this.accidentForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }

  private formFilling(): void {
    /*   this.accidentForm.patchValue({
      hasPastAccident: [
        this.accidentInfo?.hasPastAccident,
        Validators.required,
      ],
    });

    this.accidentArray = this.accidentInfo?.accidents
      ? this.accidentInfo?.accidents
      : []; */
  }

  public onSubmitForm(): void {
    /* this.shared.clearNotifications();

        let isValid = true;

        if (!this.accidentForm.get('hasPastAccident').value) {
            if (this.editAccident !== -1) {
                this.onAddAccident();
            }

            if (!this.accidentArray?.length) {
                if (this.accidentForm.get('hazmatSpill').value === undefined) {
                    this.notification.warning(
                        'Please answer hazmat spill.',
                        'Warning:'
                    );
                    isValid = false;
                }
            }
            if (!isValid) {
                return false;
            }
        } */
    /*   const accidentInfoData = new AccidentInfo(this.accidentInfo);

    accidentInfoData.accidents = this.accidentArray;
    accidentInfoData.applicantId = this.applicant?.id;
    accidentInfoData.hasPastAccident = this.accidentForm.value.hasPastAccident;
    accidentInfoData.isCompleted = true;
    accidentInfoData.isDeleted = false;
 */
    /* REDUX
        this.apppEntityServices.AccidentService.upsert(
          accidentInfoData
        ).subscribe(
          (response) => {
            this.notification.success('Accident Info is updated');
          },
          (error) => {
            this.shared.handleError(error);
          }
        ); */
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      this.onSubmitForm();
    }
  }

  public onSubmitReview(data: any): void {}

  ngOnDestroy(): void {}
}
