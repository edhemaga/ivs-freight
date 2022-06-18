import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { untilDestroyed } from 'ngx-take-until-destroy';

import {
  phoneRegex,
  emailRegex,
} from '../../../shared/ta-input/ta-input.regex-validations';

import { Applicant } from '../../state/model/applicant.model';
import { WorkHistory } from '../../state/model/work-history.model';
import { Address } from '../../state/model/address.model';
import { ApplicantQuestion } from '../../state/model/applicant-question.model';
import { ReasonForLeaving } from '../../state/model/reason-for-leaving.model';
import { TruckType } from '../../state/model/truck-type.model';
import { TrailerType } from '../../state/model/trailer-type.model';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Step2Component implements OnInit, OnDestroy {
  public applicant: Applicant;

  public workExperienceForm!: FormGroup;
  public workExperienceArray: WorkHistory[] | undefined;

  public truckType: TruckType[] = [];
  public trailerType: TrailerType[] = [];
  public trailerLengthType: any[] = [];

  public selectedAddress: Address = null;
  public selectedTruckType: any = null;
  public selectedTrailerType: any = null;
  public selectedTrailerLength: any = null;
  public selectedReasonForLeaving: any = null;
  public selectedItemIndex: number = -1;

  public questions: ApplicantQuestion[] = [
    {
      title: 'CFR Part 40?',
      formControlName: 'cfrPart',
      answerChoices: [
        {
          id: 1,
          label: 'Yes',
          value: 'cfrPartYes',
          name: 'cfrPartYes',
          checked: false,
          index: 0,
        },
        {
          id: 2,
          label: 'No',
          value: 'cfrPartNo',
          name: 'cfrPartNo',
          checked: false,
          index: 0,
        },
      ],
    },
    {
      title: 'FMCSA Regulated',
      formControlName: 'fmCSA',
      answerChoices: [
        {
          id: 3,
          label: 'Yes',
          value: 'fmcsaYes',
          name: 'fmcsaYes',
          checked: false,
          index: 1,
        },
        {
          id: 4,
          label: 'No',
          value: 'fmcsaNo',
          name: 'fmcsaNo',
          checked: false,
          index: 1,
        },
      ],
    },
  ];

  public reasonsForLeaving: ReasonForLeaving[] = [
    { id: 1, name: 'Better opportunity' },
    { id: 2, name: 'Illness' },
    { id: 3, name: 'Personal problems' },
    { id: 4, name: 'Company went out of business' },
    { id: 5, name: 'Fired or terminated' },
    { id: 6, name: 'Had to relocate' },
  ];

  public trackByIdentity = (index: number, item: any): number => index;

  public get showAddNew(): boolean {
    /* return this.workHistories?.length &&
        this.workHistories[this.workHistories?.length - 1]?.id
        ? true
        : false; */
    return true;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private inputService: TaInputService
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.isDriverPosition();
    this.isNoExperience();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  private formInit(): void {
    this.workExperienceForm = this.formBuilder.group({
      employer: [null, Validators.required],
      jobDescription: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      phone: [null, [Validators.required, phoneRegex]],
      email: [null, [Validators.required, emailRegex]],
      address: [null, Validators.required],
      addressUnit: [null, Validators.maxLength(6)],
      isDrivingPosition: [false, Validators.requiredTrue],
      truckType: [null, Validators.required],
      trailerType: [null, Validators.required],
      trailerLength: [null, Validators.required],
      cfrPart: [null, Validators.required],
      fmCSA: [null, Validators.required],
      reasonForLeaving: [null, Validators.required],
      accountForPeriod: [null],
      noWorkExperience: [false, Validators.requiredTrue],
    });
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.ADDRESS:
        this.selectedAddress = event.address;

        if (!event.valid) {
          this.workExperienceForm.get('address').setErrors({ invalid: true });
        }

        break;
      case InputSwitchActions.TRUCK_TYPE:
        this.selectedTruckType = event;

        break;
      case InputSwitchActions.TRAILER_TYPE:
        this.selectedTrailerType = event;

        break;
      case InputSwitchActions.TRAILER_LENGTH:
        this.selectedTrailerLength = event;

        break;
      case InputSwitchActions.ANSWER_CHOICE:
        const selectedCheckbox = event.find(
          (radio: { checked: boolean }) => radio.checked
        );

        const selectedFormControlName =
          this.questions[selectedCheckbox.index].formControlName;

        this.workExperienceForm
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

  public onAddWorkExperience(): any {
    /*   this.shared.clearNotifications(); */

    const workExperienceForm = this.workExperienceForm.value;
    const workExperience = new WorkHistory();

    workExperience.id = this.workExperienceForm[this.selectedItemIndex].id;
    workExperience.applicantId = this.applicant?.id ? this.applicant?.id : null;
    workExperience.employer = workExperienceForm.employer;
    workExperience.jobDescription = workExperienceForm.jobDescription;
    workExperience.fromDate = workExperienceForm.fromDate;
    workExperience.toDate = workExperienceForm.toDate;
    workExperience.employerPhone = workExperienceForm.phone;
    workExperience.employerEmail = workExperienceForm.email;
    workExperience.employerAddress = workExperienceForm.address;
    workExperience.employerAddressUnit = workExperienceForm.addressUnit;
    workExperience.truckType = workExperienceForm.truckType;
    workExperience.trailerType = workExperienceForm.trailerType;
    workExperience.trailerLength = workExperienceForm.trailerLength;
    workExperience.cfrPart = workExperienceForm.cfrPart;
    workExperience.fmCSA = workExperienceForm.fmCSA;
    workExperience.reasonForLeaving = workExperienceForm.reasonForLeaving;
    workExperience.accountForPeriod = workExperienceForm.accountForPeriod;
    workExperience.isDrivingPosition = workExperienceForm.isDrivingPosition;
    workExperience.isExpanded = false;
    workExperience.isDeleted = false;
    workExperience.isCompleted = true;

    /*  this.apppEntityServices.WorkHistoryService.upsert(workExperience).subscribe(
            (response) => {
              this.notification.success(
                'Work Experience has been deleted!',
                'Success'
              );
            },
            (error) => {
              this.shared.handleError(error);
            }
          ); */
  }

  public onDeleteWorkExperience(index: number): void {
    /*   if (this.workExperienceArray?.length) {
            if (!this.workExperienceArray[index].isCompleted) {
                this.workExperienceArray?.splice(index, 1);
            } else {
                this.workExperienceArray[index].isDeleted = true;
                this.apppEntityServices.workHistoryService
                    .delete(this.workExperienceArray[index])
                    .subscribe(
                        response => {
                            this.notification.success(
                                'Work Experience has been deleted!',
                                'Success'
                            );
                        },
                        error => {
                            this.shared.handleError(error);
                        }
                    );
            }
        } */
  }

  public onAddSecondOrLastEmployer(): void {
    const workHistory = new WorkHistory(undefined);

    workHistory.isExpanded = true;

    this.workExperienceArray?.push(workHistory);

    this.formFilling(
      this.workExperienceArray?.length
        ? this.workExperienceArray?.length - 1
        : -1
    );
  }

  private isDriverPosition(): void {
    this.workExperienceForm
      .get('isDrivingPosition')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(
            this.workExperienceForm.get('truckType'),
            false
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('trailerType'),
            false
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('trailerLength'),
            false
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('cfrPart'),
            false
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('fmCSA'),
            false
          );
        } else {
          this.inputService.changeValidators(
            this.workExperienceForm.get('trucktype')
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('trailerType')
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('trailerLength')
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('cfrPart')
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('fmCSA')
          );
        }
      });
  }

  private isNoExperience(): void {
    this.workExperienceForm
      .get('noWorkExperience')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.workExperienceArray = this.workExperienceArray?.map((wh) => {
            wh.isDeleted = false;
            wh.isExpanded = false;

            return wh;
          });

          if (!this.workExperienceArray?.length) {
            let workHistory = new WorkHistory(undefined);

            workHistory.isExpanded = true;

            this.workExperienceArray?.push(workHistory);
          }

          this.selectedItemIndex = this.workExperienceArray?.length
            ? this.workExperienceArray.length - 1
            : -1;
        } else {
          this.workExperienceArray = this.workExperienceArray?.map((wh) => {
            wh.isDeleted = true;
            wh.isExpanded = false;

            return wh;
          });
        }
      });
  }

  public hideForm(): void {
    if (this.workExperienceArray?.length) {
      this.workExperienceArray[this.selectedItemIndex].isExpanded = false;
      this.selectedItemIndex = -1;
    }
  }

  private formFilling(index: number): void {
    this.selectedItemIndex = index;

    if (this.workExperienceArray?.length) {
      this.workExperienceArray?.forEach((wh, key) => {
        wh.isExpanded = key === index ? true : false;
      });

      const workExperience: WorkHistory = new WorkHistory(
        this.workExperienceArray[index]
      );

      this.workExperienceForm = this.formBuilder.group({
        employer: [workExperience.employer, Validators.required],
        jobDescription: [workExperience.jobDescription, Validators.required],
        fromDate: [workExperience.fromDate, Validators.required],
        toDate: [workExperience.toDate, Validators.required],
        phone: [workExperience.employerPhone, Validators.required],
        email: [workExperience.employerEmail, Validators.required],
        address: [workExperience.employerAddress, Validators.required],
        addressUnit: [
          workExperience.employerAddressUnit,
          Validators.maxLength(6),
        ],
        isDrivingPosition: [workExperience.isDrivingPosition],
        truckType: [
          workExperience.truckType && this.truckType.length
            ? this.truckType.find((b) => b.name === workExperience.truckType)
                ?.id
            : null,
          workExperience.isDrivingPosition
            ? Validators.required
            : Validators.nullValidator,
        ],
        trailerType: [
          workExperience.trailerType && this.trailerType.length
            ? this.trailerType.find(
                (b) => b.name === workExperience.trailerType
              )?.id
            : null,
          workExperience.isDrivingPosition
            ? Validators.required
            : Validators.nullValidator,
        ],
        trailerLength: [
          this.trailerLengthType.find(
            (a) => a.value === workExperience.trailerLength
          ),
          workExperience.isDrivingPosition
            ? Validators.required
            : Validators.nullValidator,
        ],
        cfrPart: [
          workExperience.cfrPart,
          workExperience.isDrivingPosition
            ? Validators.required
            : Validators.nullValidator,
        ],
        fmCSA: [
          workExperience.fmCSA,
          workExperience.isDrivingPosition
            ? Validators.required
            : Validators.nullValidator,
        ],
        reasonForLeaving: [
          this.reasonsForLeaving.find(
            (a) => workExperience.reasonForLeaving === a.name
          ),
          Validators.required,
        ],
        accountForPeriod: [workExperience.accountForPeriod],
      });

      this.workExperienceForm.get('noWorkExperience').patchValue(true);
    } else {
      this.workExperienceForm.get('noWorkExperience').patchValue(true);
    }
  }

  public onSubmitForm(): void {
    this.onAddWorkExperience();
  }

  public goBack(): void {
    this.router.navigateByUrl(`/applicant/${this.applicant.id}/1`);
  }

  public onStepAction(event: any): void {
    if (event.action === 'back-step') {
      this.goBack();
    } /*  else if (event.action === 'next-step') {
            if (this.showAddNew) {
                if (this.workExperienceForm.get('noWorkExperience').value) {
                    if (this.workExperienceArray?.length) {
                        this.workExperienceArray.forEach(element => {
                            element.isDeleted = true;
                            element.applicantId = this.applicant.id;
                            this.apppEntityServices.workHistoryService
                                .upsert(element)
                                .subscribe(
                                    response => {
                                        this.notification.success(
                                            'Work Experience has been deleted!',
                                            'Success'
                                        );
                                    },
                                    error => {
                                        this.shared.handleError(error);
                                    }
                                );
                        });
                    }
                } else {
                    this.router.navigateByUrl(
                        `/applicant/${this.applicant.id}/3`
                    );
                }
            } else {
                this.onAddWorkExperience();
            }
        } */
  }

  ngOnDestroy(): void {}
}
