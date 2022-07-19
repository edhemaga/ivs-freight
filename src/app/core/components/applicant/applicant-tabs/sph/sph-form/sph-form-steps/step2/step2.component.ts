import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApplicantQuestion } from 'src/app/core/components/applicant/state/model/applicant-question.model';
import { TrailerType } from 'src/app/core/components/applicant/state/model/trailer-type.model';
import { TruckType } from 'src/app/core/components/applicant/state/model/truck-type.model';
import { InputSwitchActions } from 'src/app/core/components/applicant/state/enum/input-switch-actions.enum';
import { ReasonForLeaving } from 'src/app/core/components/applicant/state/model/reason-for-leaving.model';
import { Address } from 'src/app/core/components/applicant/state/model/address.model';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit {
  public accidentHistoryForm: FormGroup;
  public accidentForm: FormGroup;

  public truckType: TruckType[] = [];
  public trailerType: TrailerType[] = [];

  public selectedTruckType: any = null;
  public selectedTrailerType: any = null;
  public selectedReasonForLeaving: any = null;
  /*  public selectedAddress: Address = null; */

  public isEditing: boolean = false;

  public questions: ApplicantQuestion[] = [
    {
      title: 'Did the above applicant work for your company?',
      formControlName: 'applicantWorkForCompany',
      formControlNameExplain: 'applicantWorkForCompanyExplain',
      answerChoices: [
        {
          id: 1,
          label: 'YES',
          value: 'applicantWorkForCompanyYes',
          name: 'applicantWorkForCompanyYes',
          checked: false,
          index: 0,
        },
        {
          id: 2,
          label: 'NO',
          value: 'applicantWorkForCompanyNo',
          name: 'applicantWorkForCompanyNo',
          checked: false,
          index: 0,
        },
      ],
    },
    {
      title: 'Did he/she drive a motor vehicle for your company?',
      formControlName: 'motorVehicleForCompany',
      formControlNameExplain: 'motorVehicleForCompanyExplain',
      answerChoices: [
        {
          id: 3,
          label: 'YES',
          value: 'motorVehicleForCompanyYes',
          name: 'motorVehicleForCompanyYes',
          checked: false,
          index: 1,
        },
        {
          id: 4,
          label: 'NO',
          value: 'motorVehicleForCompanyNo',
          name: 'motorVehicleForCompanyNo',
          checked: false,
          index: 1,
        },
      ],
    },
    {
      title:
        'Would this applicant be considered for employment with your company again?',
      formControlName: 'consideredForEmploymentAgain',
      formControlNameExplain: 'consideredForEmploymentAgainExplain',
      answerChoices: [
        {
          id: 5,
          label: 'YES',
          value: 'consideredForEmploymentAgainYes',
          name: 'consideredForEmploymentAgainYes',
          checked: false,
          index: 2,
        },
        {
          id: 6,
          label: 'NO',
          value: 'consideredForEmploymentAgainNo',
          name: 'consideredForEmploymentAgainNo',
          checked: false,
          index: 2,
        },
      ],
    },
    {
      title: '',
      formControlName: 'hazmatSpill',
      formControlNameExplain: '',
      answerChoices: [
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
      ],
    },
  ];

  public reasonsForLeaving: ReasonForLeaving[] = [
    { id: 1, name: 'Better opportunity' },
    { id: 2, name: 'Illness' },
    { id: 3, name: 'Company went out of business' },
    { id: 4, name: 'Fired or terminated' },
    { id: 5, name: 'Family obligations' },
    { id: 6, name: 'Other' },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  public trackByIdentity = (index: number, item: any): number => index;

  private createForm(): void {
    this.accidentHistoryForm = this.formBuilder.group({
      applicantWorkForCompany: [null, Validators.required],
      applicantWorkForCompanyBeforeExplain: [null, Validators.required],
      applicantWorkForCompanyToExplain: [null, Validators.required],
      motorVehicleForCompany: [null, Validators.required],
      truckType: [null, Validators.required],
      trailerType: [null, Validators.required],
      reasonForLeaving: [null, Validators.required],
      consideredForEmploymentAgain: [null, Validators.required],
      noSafetyPerformance: [false],
      accidentDate: [null, Validators.required],
      accidentLocation: [null, Validators.required],
      accidentDescription: [null, Validators.required],
      hazmatSpill: [null, Validators.required],
    });
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.TRUCK_TYPE:
        this.selectedTruckType = event;

        break;
      case InputSwitchActions.TRAILER_TYPE:
        this.selectedTrailerType = event;

        break;

      case InputSwitchActions.ANSWER_CHOICE:
        const selectedCheckbox = event.find(
          (radio: { checked: boolean }) => radio.checked
        );

        const selectedFormControlName =
          this.questions[selectedCheckbox.index].formControlName;

        this.accidentHistoryForm
          .get(selectedFormControlName)
          .patchValue(selectedCheckbox.label);
        break;
      case InputSwitchActions.REASON_FOR_LEAVING:
        this.selectedReasonForLeaving = event;

        break;

      default:
        break;
    }
  }

  public asd(event: any) {
    console.log(event);
  }
}
