import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import {
  phoneFaxRegex,
  addressValidation,
  addressUnitValidation,
  descriptionValidation,
} from '../../../../shared/ta-input/ta-input.regex-validations';

import { ApplicantListsQuery } from '../../../state/store/applicant-lists-store/applicant-lists.query';

import {
  AnswerChoices,
  ApplicantQuestion,
} from '../../../state/model/applicant-question.model';
import { EnumValue } from 'appcoretruckassist/model/models';
import { TrailerType } from '../../../state/model/trailer-type.model';
import { VehicleType } from '../../../state/model/vehicle-type.model';

@Component({
  selector: 'app-sph-modal',
  templateUrl: './sph-modal.component.html',
  styleUrls: ['./sph-modal.component.scss'],
})
export class SphModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public prospectiveEmployerForm: FormGroup;
  public accidentHistoryForm: FormGroup;
  public drugAndAlcoholTestingHistoryForm: FormGroup;

  public vehicleType: VehicleType[] = [];
  public trailerType: TrailerType[] = [];

  public reasonsForLeaving: EnumValue[] = [];

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

  public drugAndAlcoholQuestions: ApplicantQuestion[] = [
    {
      title:
        'Has this person had an alcohol test with a result of 0.04 or higher alcohol concentration?',
      formControlName: 'alcoholTest',
      answerChoices: [
        {
          id: 19,
          label: 'YES',
          value: 'alcoholTestYes',
          name: 'alcoholTestYes',
          checked: false,
          index: 9,
        },
        {
          id: 20,
          label: 'NO',
          value: 'alcoholTestNo',
          name: 'alcoholTestNo',
          checked: false,
          index: 9,
        },
      ],
    },
    {
      title: 'Has this person tested positive for controlled substances?',
      formControlName: 'controledSubstances',
      answerChoices: [
        {
          id: 9,
          label: 'YES',
          value: 'controledSubstancesYes',
          name: 'controledSubstancesYes',
          checked: false,
          index: 4,
        },
        {
          id: 10,
          label: 'NO',
          value: 'controledSubstancesNo',
          name: 'controledSubstancesNo',
          checked: false,
          index: 4,
        },
      ],
    },
    {
      title:
        'Has this person refused to submit to a post-accident, random, reasonable suspicion, or follow up alcohol or controlled  substances test or adulterated or substituted a drug test specimen?',
      formControlName: 'refusedToSubmit',
      answerChoices: [
        {
          id: 11,
          label: 'YES',
          value: 'refusedToSubmitYes',
          name: 'refusedToSubmitYes',
          checked: false,
          index: 5,
        },
        {
          id: 12,
          label: 'NO',
          value: 'refusedToSubmitNo',
          name: 'refusedToSubmitNo',
          checked: false,
          index: 5,
        },
      ],
    },
    {
      title:
        'Has this person committed other violations of Subpart B of Part 382, or 49 CFR Part 40?',
      formControlName: 'otherViolations',
      answerChoices: [
        {
          id: 13,
          label: 'YES',
          value: 'otherViolationsYes',
          name: 'otherViolationsYes',
          checked: false,
          index: 6,
        },
        {
          id: 14,
          label: 'NO',
          value: 'otherViolationsNo',
          name: 'otherViolationsNo',
          checked: false,
          index: 6,
        },
      ],
    },
    {
      title:
        'If this person has violated a DOT drug and alcohol regulation, did this person complete an SAP-prescribed rehabilitation program while in your employ, including return-to-duty and follow up tests?',
      formControlName: 'drugAndAlcoholRegulation',
      answerChoices: [
        {
          id: 15,
          label: 'YES',
          value: 'drugAndAlcoholRegulationYes',
          name: 'drugAndAlcoholRegulationYes',
          checked: false,
          index: 7,
        },
        {
          id: 16,
          label: 'NO',
          value: 'drugAndAlcoholRegulationNo',
          name: 'drugAndAlcoholRegulationNo',
          checked: false,
          index: 7,
        },
      ],
    },
    {
      title:
        'For a driver who successfully completed an ASP’s rehabilitation referral and remained in your employ. Did this driver, subsequently, have an alcohol test result of 0.04 or greater, verified positive drug test, or refuse to be tested?',
      formControlName: 'aspRehabilitation',
      answerChoices: [
        {
          id: 17,
          label: 'YES',
          value: 'aspRehabilitationYes',
          name: 'aspRehabilitationYes',
          checked: false,
          index: 8,
        },
        {
          id: 18,
          label: 'NO',
          value: 'aspRehabilitationNo',
          name: 'aspRehabilitationNo',
          checked: false,
          index: 8,
        },
      ],
    },
  ];

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
    private applicantListsQuery: ApplicantListsQuery
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.getDropdownLists();
  }

  public trackByIdentity = (index: number, item: any): number => index;

  private createForm(): void {
    this.prospectiveEmployerForm = this.formBuilder.group({
      toPreviousEmployer: [null],
      phone: [null, phoneFaxRegex],
      email: [null],
      fax: [null, phoneFaxRegex],
      address: [null, [...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
    });

    this.accidentHistoryForm = this.formBuilder.group({
      applicantWorkForCompany: [null],
      applicantWorkForCompanyBeforeExplain: [null],
      applicantWorkForCompanyToExplain: [null],
      motorVehicleForCompany: [null],
      vehicleType: [null],
      trailerType: [null],
      reasonForLeaving: [null],
      consideredForEmploymentAgain: [null],
      noSafetyPerformance: [false],
      accidentDate: [null],
      accidentLocation: [null, [...addressValidation]],
      accidentDescription: [null, descriptionValidation],
      hazmatSpill: [null],
      fatalities: [0],
      injuries: [0],
    });

    this.drugAndAlcoholTestingHistoryForm = this.formBuilder.group({
      applicantNotSubject: [false],
      employmentFromDate: [null],
      employmentToDate: [null],
      alcoholTest: [null],
      controledSubstances: [null],
      refusedToSubmit: [null],
      otherViolations: [null],
      drugAndAlcoholRegulation: [null],
      sapName: [null],
      phone: [null, [phoneFaxRegex]],
      address: [null, [...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      aspRehabilitation: [null],
    });
  }

  public handleInputSelect(event: any): void {
    const selectedCheckbox = event.find(
      (radio: { checked: boolean }) => radio.checked
    );

    const selectedFormControlName =
      this.questions[selectedCheckbox.index].formControlName;

    this.accidentHistoryForm
      .get(selectedFormControlName)
      .patchValue(selectedCheckbox.label);
  }

  public handleCheckboxParagraphClick(): void {
    this.drugAndAlcoholTestingHistoryForm.patchValue({
      applicantNotSubject: !this.drugAndAlcoholTestingHistoryForm.get(
        'applicantNotSubject'
      ).value,
    });
  }

  public getDropdownLists(): void {
    this.applicantListsQuery.dropdownLists$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.reasonsForLeaving = res.reasonsForLeave;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
