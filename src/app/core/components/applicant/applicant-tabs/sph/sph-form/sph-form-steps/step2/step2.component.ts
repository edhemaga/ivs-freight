import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApplicantQuestion } from 'src/app/core/components/applicant/state/model/applicant-question.model';
import { TrailerType } from 'src/app/core/components/applicant/state/model/trailer-type.model';
import { TruckType } from 'src/app/core/components/applicant/state/model/truck-type.model';
import { InputSwitchActions } from 'src/app/core/components/applicant/state/enum/input-switch-actions.enum';
import { ReasonForLeaving } from 'src/app/core/components/applicant/state/model/reason-for-leaving.model';
import { SphFormAccidentModel } from './../../../../../state/model/accident.model';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit {
  @ViewChildren('cmp') components: QueryList<any>;

  public accidentHistoryForm: FormGroup;
  public accidentArray: SphFormAccidentModel[] = [];

  public truckType: TruckType[] = [];
  public trailerType: TrailerType[] = [];

  public selectedTruckType: any = null;
  public selectedTrailerType: any = null;
  public selectedReasonForLeaving: any = null;
  public selectedAccidentIndex: number;

  public isEditing: boolean = false;
  public isAccidentEdited: boolean = false;

  public helperIndex: number = 2;

  public workForCompanyRadios: any;

  public formValuesToPatch: any;

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
  ];

  public reasonsForLeaving: ReasonForLeaving[] = [
    { id: 1, name: 'Better opportunity' },
    { id: 2, name: 'Illness' },
    { id: 3, name: 'Company went out of business' },
    { id: 4, name: 'Fired or terminated' },
    { id: 5, name: 'Family obligations' },
    { id: 6, name: 'Other' },
  ];

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.createForm();
  }

  ngAfterViewInit(): void {
    const radioButtonsArray = this.components.toArray();

    this.workForCompanyRadios = radioButtonsArray[0].buttons;
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

    this.helperIndex = index;

    this.isAccidentEdited = false;

    this.isEditing = true;
    this.accidentArray[index].isEditingAccident = true;

    this.selectedAccidentIndex = index;

    const selectedAccident = this.accidentArray[index];

    this.formValuesToPatch = selectedAccident;
  }

  public onCloseWarningBox(): void {
    this.accidentHistoryForm.get('applicantWorkForCompany').patchValue(null);

    this.workForCompanyRadios[0].checked = false;
    this.workForCompanyRadios[1].checked = false;
  }

  public onSelectNoWarningBox(): void {
    this.accidentHistoryForm.get('applicantWorkForCompany').patchValue('YES');

    this.workForCompanyRadios[0].checked = true;
    this.workForCompanyRadios[1].checked = false;
  }

  public onSelectYesWarningBox(): void {
    this.router.navigate(['/sph-form-end']);
  }

  public getAccidentFormValues(event: any): void {
    this.accidentArray = [...this.accidentArray, event];

    this.helperIndex = 2;
  }

  public cancelAccidentEditing(event: any): void {
    this.isEditing = false;
    this.accidentArray[this.selectedAccidentIndex].isEditingAccident = false;

    this.helperIndex = 2;
    this.selectedAccidentIndex = -1;
  }

  public saveEditedAccident(event: any): void {
    this.accidentArray[this.selectedAccidentIndex] = event;

    this.isEditing = false;

    this.helperIndex = 2;
  }
}
