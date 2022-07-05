import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { Applicant } from '../../state/model/applicant.model';
import { Address } from '../../state/model/address.model';
import { Accident, AccidentInfo } from '../../state/model/accident.model';
import { AnswerChoices } from '../../state/model/applicant-question.model';
import { TruckType } from '../../state/model/truck-type.model';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss'],
})
export class Step4Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.APPLICANT;
  public applicant: Applicant | undefined;

  public accidentForm: FormGroup;
  public accidentFormArray: Accident[] = [];
  public accidentInfo: AccidentInfo | undefined;

  public truckType: TruckType[] = [];

  public selectedAddress: Address = null;
  public selectedTruckType: any = null;

  public editAccident: number = -1;

  public answerChoices: AnswerChoices[] = [
    {
      id: 1,
      label: 'Yes',
      value: 'hazmatYes',
      name: 'hazmatYes',
      checked: false,
    },
    {
      id: 2,
      label: 'No',
      value: 'hazmatNo',
      name: 'hazmatNo',
      checked: false,
    },
  ];

  public isEditing: boolean = false;

  public trackByIdentity = (index: number, item: any): number => index;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formInit();
    this.isPastAccident();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  public formInit(): void {
    this.accidentForm = this.formBuilder.group({
      hasPastAccident: [false],
      accidentLocation: [null, Validators.required],
      accidentDate: [null, Validators.required],
      hazmatSpill: [null, Validators.required],
      truckType: [null, Validators.required],
      accidentDescription: [null, Validators.required],
    });
  }

  private isPastAccident(): void {
    this.accidentForm
      .get('hasPastAccident')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.accidentFormArray = this.accidentFormArray.map((a) => {
            a.isDeleted = false;

            return a;
          });
        } else {
          this.accidentFormArray = this.accidentFormArray.map((a) => {
            a.isDeleted = true;

            return a;
          });
        }
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

  public onAddAccident(): void {
    /*    this.shared.clearNotifications();

        let isValid = true;

        if (this.isHazmatSpill === undefined) {
            this.notification.warning(
                'Please answer hazmat spill.',
                'Warning:'
            );
            isValid = false;
        }

        if (!isValid) {
            return false;
        }
 */
    const accidentForm = this.accidentForm.value;
    const accident: Accident = new Accident();

    accident.accidentDate = accidentForm.accidentDate;
    accident.accidentLocation = accidentForm.accidentLocation;
    accident.hazmatSpill = accidentForm.hazmatSpill;
    accident.fatalities = accidentForm.fatalities;
    accident.injuries = accidentForm.injuries;
    accident.truckType = accidentForm.truckType;
    accident.accidentDescription = accidentForm.accidentDescription;

    this.accidentFormArray.push(accident);

    this.accidentForm.reset();
    this.editAccident = -1;
  }

  public onUpdateAccident(): void {
    /*  this.shared.clearNotifications();

        let isValid = true;

        if (this.isHazmatSpill === undefined) {
            this.notification.warning(
                'Please answer hazmat spill.',
                'Warning:'
            );
            isValid = false;
        }
        if (!isValid) {
            return false;
        } */

    if (this.accidentFormArray?.length) {
      const accidentForm = this.accidentForm.value;
      const accident: Accident = new Accident(
        this.accidentFormArray[this.editAccident]
      );

      accident.accidentDate = accidentForm.accidentDate;
      accident.accidentLocation = accidentForm.accidentLocation;
      accident.hazmatSpill = accidentForm.hazmatSpill;
      accident.fatalities = accidentForm.fatalities;
      accident.injuries = accidentForm.injuries;
      accident.truckType = accidentForm.truckType;
      accident.accidentDescription = accidentForm.accidentDescription;

      this.accidentFormArray[this.editAccident] = accident;
    }

    this.accidentForm.reset();
    this.editAccident = -1;
  }

  public onEditAccident(index: number): void {
    this.accidentForm.patchValue({
      accidentDate: this.accidentFormArray[index].accidentDate,
      accidentLocation: this.accidentFormArray[index].accidentLocation,
      hazmatSpill: this.accidentFormArray[index].hazmatSpill,
      fatalities: this.accidentFormArray[index].fatalities,
      injuries: this.accidentFormArray[index].injuries,
      truckType: this.accidentFormArray[index].truckType,
      accidentDescription: this.accidentFormArray[index].accidentDescription,
    });

    this.editAccident = index;
  }

  public onDeleteAccident(index: number): void {
    if (this.accidentFormArray?.length && this.accidentFormArray[index]) {
      if (this.accidentFormArray[index].id) {
        this.accidentFormArray[index].isDeleted = true;
      } else {
        this.accidentFormArray.splice(index, 1);
      }
    }
  }

  private formFilling(): void {
    this.accidentForm.patchValue({
      hasPastAccident: [
        this.accidentInfo?.hasPastAccident,
        Validators.required,
      ],
    });

    this.accidentFormArray = this.accidentInfo?.accidents
      ? this.accidentInfo?.accidents
      : [];
  }

  public onSubmitForm(): void {
    /* this.shared.clearNotifications();

        let isValid = true;

        if (!this.accidentForm.get('hasPastAccident').value) {
            if (this.editAccident !== -1) {
                this.onAddAccident();
            }

            if (!this.accidentFormArray?.length) {
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

    const accidentInfoData = new AccidentInfo(this.accidentInfo);

    accidentInfoData.accidents = this.accidentFormArray;
    accidentInfoData.applicantId = this.applicant?.id;
    accidentInfoData.hasPastAccident = this.accidentForm.value.hasPastAccident;
    accidentInfoData.isCompleted = true;
    accidentInfoData.isDeleted = false;

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
