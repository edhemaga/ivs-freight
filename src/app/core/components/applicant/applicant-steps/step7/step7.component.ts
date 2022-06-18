import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { Applicant } from '../../state/model/applicant.model';
import { Address } from '../../state/model/address.model';
import { ApplicantQuestion } from '../../state/model/applicant-question.model';
import { SevenDaysHos } from '../../state/model/seven-days-hos.model';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-step7',
  templateUrl: './step7.component.html',
  styleUrls: ['./step7.component.scss'],
})
export class Step7Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.APPLICANT;
  public applicant: Applicant | undefined;

  public sevenDaysHosForm: FormGroup;
  public sevenDaysHosInfo: SevenDaysHos | undefined;

  public selectedAddress: Address = null;

  public questions: ApplicantQuestion[] = [
    {
      title: 'Are you currently working for another employer?',
      formControlName: 'anotherEmployer',
      answerChoices: [
        {
          id: 1,
          label: 'Yes',
          value: 'anotherEmployerYes',
          name: 'anotherEmployerYes',
          checked: false,
          index: 0,
        },
        {
          id: 2,
          label: 'No',
          value: 'anotherEmployerNo',
          name: 'anotherEmployerNo',
          checked: false,
          index: 0,
        },
      ],
    },
    {
      title:
        'At this time do you intend to work for another employer while still employed by this company?',
      formControlName: 'intendToWorkAnotherEmployer',
      answerChoices: [
        {
          id: 3,
          label: 'Yes',
          value: 'intendToWorkAnotherEmployerYes',
          name: 'intendToWorkAnotherEmployerYes',
          checked: false,
          index: 1,
        },
        {
          id: 4,
          label: 'No',
          value: 'intendToWorkAnotherEmployerNo',
          name: 'intendToWorkAnotherEmployerNo',
          checked: false,
          index: 1,
        },
      ],
    },
  ];
  public sevenDaysHosDaysData: string[] = [
    'Day',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
  ];
  public sevenDaysHosDateData: string[] = [
    'Date',
    '01/22/21',
    '01/21/21',
    '01/20/21',
    '01/19/21',
    '01/18/21',
    '01/17/21',
    '01/16/21',
  ];

  public hosArrayData!: FormArray;

  public get hosArray(): FormArray {
    return this.sevenDaysHosForm.get('hosArray') as FormArray;
  }

  public totalHours: { id: number; value: number }[] = [];
  public totalHoursCounter: number = 0;

  public trackByIdentity = (index: number, item: any): number => index;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formInit();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  public formInit(): void {
    this.sevenDaysHosForm = this.formBuilder.group({
      isValidHos: [false, Validators.requiredTrue],
      startDate: [null, Validators.required],
      address: [null, Validators.required],
      anotherEmployer: [null, Validators.required],
      intendToWorkAnotherEmployer: [null, Validators.required],
      isValidAnotherEmployer: [null, Validators.requiredTrue],

      number: [null],

      hosArray: this.formBuilder.array([]),
    });

    this.createSevenDaysHos();
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.ADDRESS:
        this.selectedAddress = event.address;

        if (!event.valid) {
          this.sevenDaysHosForm.get('address').setErrors({ invalid: true });
        }

        break;
      case InputSwitchActions.ANSWER_CHOICE:
        const selectedCheckbox = event.find(
          (radio: { checked: boolean }) => radio.checked
        );

        const selectedFormControlName =
          this.questions[selectedCheckbox.index].formControlName;

        this.sevenDaysHosForm
          .get(selectedFormControlName)
          .patchValue(selectedCheckbox.label);

        break;

      default:
        break;
    }
  }

  public createSevenDaysHos(): void {
    for (let i = 0; i < 7; i++) {
      this.hosArray.push(this.createHos());

      this.totalHours = [
        ...this.totalHours,
        { id: ++this.totalHoursCounter, value: 0 },
      ];
    }
  }

  public createHos(): FormGroup {
    return this.formBuilder.group({
      hos: [null, Validators.required],
    });
  }

  private formFilling(): void {
    if (this.sevenDaysHosInfo?.hosData?.length) {
      this.sevenDaysHosForm.patchValue({
        isValidHos: this.sevenDaysHosInfo?.isValidHos,
        startDate: this.sevenDaysHosInfo.startDate,
        address: this.sevenDaysHosInfo?.address,
        anotherEmployer: this.sevenDaysHosInfo?.anotherEmployer,
        intendToWorkAnotherEmployer:
          this.sevenDaysHosInfo?.intendToWorkAnotherEmployer,
        isValidAnotherEmployer: this.sevenDaysHosInfo?.isValidAnotherEmployer,
      });

      this.hosArray.clear();

      /*  this.sevenDaysHosInfo?.hosData.forEach(s => {
          this.hosArray.push(this.createHos(s?.value, s.id))
        });
  
        this.countTotal(); */
    }
  }

  public countTotalHours(index: number): void {
    this.hosArray
      .at(index)
      .get('hos')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        this.totalHours = [...this.totalHours];
        this.totalHours[index].value = +value;
      });
  }

  public onSubmitForm(): void {
    /*  this.shared.clearNotifications();

        let isValid = true;

        if (this.isQuestionOne === undefined) {
            this.notification.warning(
                'Please answer are you working for another employer',
                'Warning:'
            );
            isValid = false;
        }

        if (this.isQuestionTwo === undefined) {
            this.notification.warning(
                'Please answer are you intending to work for another employer',
                'Warning:'
            );
            isValid = false;
        }

        if (!isValid) {
            return false;
        } */

    const sevenDaysHosForm = this.sevenDaysHosForm.value;
    const sevenDaysHos = new SevenDaysHos(this.sevenDaysHosInfo);

    sevenDaysHos.applicantId = this.applicant?.id;

    sevenDaysHos.isValidHos = sevenDaysHosForm.isValidHos;
    sevenDaysHos.startDate = sevenDaysHosForm.startDate;
    sevenDaysHos.address = sevenDaysHosForm.address;
    sevenDaysHos.anotherEmployer = sevenDaysHosForm.anotherEmployer;
    sevenDaysHos.intendToWorkAnotherEmployer =
      sevenDaysHosForm.intendToWorkAnotherEmployer;
    sevenDaysHos.isValidAnotherEmployer =
      sevenDaysHosForm.isValidAnotherEmployer;
    sevenDaysHos.hosData = [];

    /*  this.hosArray.controls.forEach(
            (control: AbstractControl, key: number) => {
                sevendayshos.hosData.push({
                    id: control.value?.id ? control.value.id : undefined,
                    name: (key + 1).toString(),
                    value: control.value.hos,
                    isCompleted: true,
                });
            }
        ); */

    /* this.apppEntityServices.SevenDaysHosService.upsert(
            sevendayshos
        ).subscribe(
            () => {
                this.notification.success('7 Days Hos is updated');
            },
            (error: any) => {
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
