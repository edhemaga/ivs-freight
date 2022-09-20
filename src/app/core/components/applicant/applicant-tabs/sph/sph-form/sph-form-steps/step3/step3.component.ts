import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import {
  phoneFaxRegex,
  addressValidation,
  addressUnitValidation,
} from '../../../../../../shared/ta-input/ta-input.regex-validations';

import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { ApplicantActionsService } from 'src/app/core/components/applicant/state/services/applicant-actions.service';

import { ApplicantQuestion } from '../../../../../state/model/applicant-question.model';
import { InputSwitchActions } from '../../../../../state/enum/input-switch-actions.enum';
import { AddressEntity } from './../../../../../../../../../../appcoretruckassist/model/addressEntity';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit, AfterViewInit {
  @ViewChildren('cmp') components: QueryList<any>;

  private destroy$ = new Subject<void>();

  public radioButtonsArray: any;

  public drugAndAlcoholTestingHistoryForm: FormGroup;

  public selectedAddress: AddressEntity = null;

  public questions: ApplicantQuestion[] = [
    {
      title:
        'Has this person had an alcohol test with a result of 0.04 or higher alcohol concentration?',
      formControlName: 'alcoholTest',
      answerChoices: [
        {
          id: 1,
          label: 'YES',
          value: 'alcoholTestYes',
          name: 'alcoholTestYes',
          checked: false,
          index: 0,
        },
        {
          id: 2,
          label: 'NO',
          value: 'alcoholTestNo',
          name: 'alcoholTestNo',
          checked: false,
          index: 0,
        },
      ],
    },
    {
      title: 'Has this person tested positive for controlled substances?',
      formControlName: 'controledSubstances',
      answerChoices: [
        {
          id: 3,
          label: 'YES',
          value: 'controledSubstancesYes',
          name: 'controledSubstancesYes',
          checked: false,
          index: 1,
        },
        {
          id: 4,
          label: 'NO',
          value: 'controledSubstancesNo',
          name: 'controledSubstancesNo',
          checked: false,
          index: 1,
        },
      ],
    },
    {
      title:
        'Has this person refused to submit to a post-accident, random, reasonable suspicion, or follow up alcohol or controlled  substances test or adulterated or substituted a drug test specimen?',
      formControlName: 'refusedToSubmit',
      answerChoices: [
        {
          id: 5,
          label: 'YES',
          value: 'refusedToSubmitYes',
          name: 'refusedToSubmitYes',
          checked: false,
          index: 2,
        },
        {
          id: 6,
          label: 'NO',
          value: 'refusedToSubmitNo',
          name: 'refusedToSubmitNo',
          checked: false,
          index: 2,
        },
      ],
    },
    {
      title:
        'Has this person committed other violations of Subpart B of Part 382, or 49 CFR Part 40?',
      formControlName: 'otherViolations',
      answerChoices: [
        {
          id: 7,
          label: 'YES',
          value: 'otherViolationsYes',
          name: 'otherViolationsYes',
          checked: false,
          index: 3,
        },
        {
          id: 8,
          label: 'NO',
          value: 'otherViolationsNo',
          name: 'otherViolationsNo',
          checked: false,
          index: 3,
        },
      ],
    },
    {
      title:
        'If this person has violated a DOT drug and alcohol regulation, did this person complete an SAP-prescribed rehabilitation program while in your employ, including return-to-duty and follow up tests?',
      formControlName: 'drugAndAlcoholRegulation',
      answerChoices: [
        {
          id: 9,
          label: 'YES',
          value: 'drugAndAlcoholRegulationYes',
          name: 'drugAndAlcoholRegulationYes',
          checked: false,
          index: 4,
        },
        {
          id: 10,
          label: 'NO',
          value: 'drugAndAlcoholRegulationNo',
          name: 'drugAndAlcoholRegulationNo',
          checked: false,
          index: 4,
        },
      ],
    },
    {
      title:
        'For a driver who successfully completed an ASP’s rehabilitation referral and remained in your employ. Did this driver, subsequently, have an alcohol test result of 0.04 or greater, verified positive drug test, or refuse to be tested?',
      formControlName: 'aspRehabilitation',
      answerChoices: [
        {
          id: 11,
          label: 'YES',
          value: 'aspRehabilitationYes',
          name: 'aspRehabilitationYes',
          checked: false,
          index: 5,
        },
        {
          id: 12,
          label: 'NO',
          value: 'aspRehabilitationNo',
          name: 'aspRehabilitationNo',
          checked: false,
          index: 5,
        },
      ],
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private inputService: TaInputService,
    private applicantActionsService: ApplicantActionsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.isNotSubjectToTesting();
  }

  ngAfterViewInit(): void {
    this.radioButtonsArray = this.components.toArray();
  }

  public trackByIdentity = (index: number, item: any): number => index;

  private createForm(): void {
    this.drugAndAlcoholTestingHistoryForm = this.formBuilder.group({
      applicantNotSubject: [false],
      employmentFromDate: [null, Validators.required],
      employmentToDate: [null, Validators.required],
      alcoholTest: [null, Validators.required],
      controledSubstances: [null, Validators.required],
      refusedToSubmit: [null, Validators.required],
      otherViolations: [null, Validators.required],
      drugAndAlcoholRegulation: [null, Validators.required],
      sapName: [null, Validators.required],
      phone: [null, [Validators.required, phoneFaxRegex]],
      address: [null, [Validators.required, ...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      aspRehabilitation: [null, Validators.required],
    });
  }

  private isNotSubjectToTesting(): void {
    this.drugAndAlcoholTestingHistoryForm
      .get('applicantNotSubject')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('employmentFromDate'),
            false
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('employmentToDate'),
            false
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('alcoholTest'),
            false
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('controledSubstances'),
            false
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('refusedToSubmit'),
            false
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('otherViolations'),
            false
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get(
              'drugAndAlcoholRegulation'
            ),
            false
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('sapName'),
            false
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('phone'),
            false
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('address'),
            false
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('aspRehabilitation'),
            false
          );

          this.drugAndAlcoholTestingHistoryForm.patchValue({
            employmentFromDate: null,
            employmentToDate: null,
            alcoholTest: null,
            controledSubstances: null,
            refusedToSubmit: null,
            otherViolations: null,
            drugAndAlcoholRegulation: null,
            sapName: null,
            phone: null,
            address: null,
            addressUnit: null,
            aspRehabilitation: null,
          });

          this.radioButtonsArray.forEach((item) => {
            item.buttons[0].checked = false;
            item.buttons[1].checked = false;
          });
        } else {
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('employmentFromDate')
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('employmentToDate')
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('alcoholTest')
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('controledSubstances')
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('refusedToSubmit')
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('otherViolations')
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get(
              'drugAndAlcoholRegulation'
            )
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('sapName')
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('phone')
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('address')
          );
          this.inputService.changeValidators(
            this.drugAndAlcoholTestingHistoryForm.get('aspRehabilitation')
          );
        }
      });
  }

  public handleCheckboxParagraphClick(): void {
    this.drugAndAlcoholTestingHistoryForm.patchValue({
      applicantNotSubject: !this.drugAndAlcoholTestingHistoryForm.get(
        'applicantNotSubject'
      ).value,
    });
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.ADDRESS:
        if (!event.valid) {
          this.drugAndAlcoholTestingHistoryForm
            .get('address')
            .setErrors({ invalid: true });
        }

        this.selectedAddress = event.address;

        break;
      case InputSwitchActions.ANSWER_CHOICE:
        const selectedCheckbox = event.find(
          (radio: { checked: boolean }) => radio.checked
        );

        const selectedFormControlName =
          this.questions[selectedCheckbox.index].formControlName;

        if (selectedCheckbox.label === 'YES') {
          this.drugAndAlcoholTestingHistoryForm
            .get(selectedFormControlName)
            .patchValue(true);
        } else {
          this.drugAndAlcoholTestingHistoryForm
            .get(selectedFormControlName)
            .patchValue(false);
        }

        break;

      default:
        break;
    }
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      this.onSubmit();
    }

    if (event.action === 'back-step') {
      this.router.navigate(['/sph-form/2']);
    }
  }

  public onSubmit(): void {
    if (this.drugAndAlcoholTestingHistoryForm.invalid) {
      this.inputService.markInvalid(this.drugAndAlcoholTestingHistoryForm);
      return;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
