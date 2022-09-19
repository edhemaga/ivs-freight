import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { ApplicantListsService } from 'src/app/core/components/applicant/state/services/applicant-lists.service';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { ApplicantActionsService } from 'src/app/core/components/applicant/state/services/applicant-actions.service';

import { ApplicantQuestion } from 'src/app/core/components/applicant/state/model/applicant-question.model';
import { InputSwitchActions } from 'src/app/core/components/applicant/state/enum/input-switch-actions.enum';
import { SphFormAccidentModel } from './../../../../../state/model/accident.model';
import {
  EnumValue,
  TrailerTypeResponse,
  TruckTypeResponse,
} from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('cmp') components: QueryList<any>;

  private destroy$ = new Subject<void>();

  public accidentHistoryForm: FormGroup;

  public formStatus: string = 'INVALID';
  public markFormInvalid: boolean;

  public accidentArray: SphFormAccidentModel[] = [];

  public lastAccidentCard: any;

  public vehicleType: TruckTypeResponse[] = [];
  public trailerType: TrailerTypeResponse[] = [];

  public reasonsForLeaving: EnumValue[] = [];

  public selectedVehicleType: any = null;
  public selectedTrailerType: any = null;
  public selectedReasonForLeaving: any = null;

  public selectedAccidentIndex: number;
  public helperIndex: number = 2;

  public isEditing: boolean = false;

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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private inputService: TaInputService,
    private applicantListsService: ApplicantListsService,
    private applicantActionsService: ApplicantActionsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.getDropdownLists();
  }

  ngAfterViewInit(): void {
    const radioButtonsArray = this.components.toArray();

    this.workForCompanyRadios = radioButtonsArray[0].buttons;
  }

  public trackByIdentity = (index: number, item: any): number => index;

  private createForm(): void {
    this.accidentHistoryForm = this.formBuilder.group({
      applicantWorkForCompany: [null, Validators.required],
      applicantWorkForCompanyExplain: [null],
      applicantWorkForCompanyBeforeExplain: [null],
      applicantWorkForCompanyToExplain: [null],
      motorVehicleForCompany: [null, Validators.required],
      motorVehicleForCompanyExplain: [null],
      vehicleType: [null],
      trailerType: [null],
      reasonForLeaving: [null, Validators.required],
      consideredForEmploymentAgain: [null, Validators.required],
      noSafetyPerformance: [false],
    });
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.TRUCK_TYPE:
        this.selectedVehicleType = event;

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

        const selectedExplainFormControlName =
          this.questions[selectedCheckbox.index].formControlNameExplain;

        if (selectedCheckbox.label === 'YES') {
          this.accidentHistoryForm
            .get(selectedFormControlName)
            .patchValue(true);

          if (selectedCheckbox.index === 0) {
            this.accidentHistoryForm
              .get(selectedExplainFormControlName)
              .patchValue(selectedCheckbox.label);

            this.inputService.changeValidators(
              this.accidentHistoryForm.get(
                'applicantWorkForCompanyBeforeExplain'
              )
            );

            this.inputService.changeValidators(
              this.accidentHistoryForm.get('applicantWorkForCompanyToExplain')
            );
          }

          if (selectedCheckbox.index === 1) {
            this.inputService.changeValidators(
              this.accidentHistoryForm.get('vehicleType')
            );

            this.inputService.changeValidators(
              this.accidentHistoryForm.get('trailerType')
            );
          }
        } else {
          this.accidentHistoryForm
            .get(selectedFormControlName)
            .patchValue(false);

          if (selectedCheckbox.index === 0) {
            this.accidentHistoryForm
              .get(selectedExplainFormControlName)
              .patchValue(selectedCheckbox.label);

            this.inputService.changeValidators(
              this.accidentHistoryForm.get(
                'applicantWorkForCompanyBeforeExplain'
              ),
              false
            );

            this.inputService.changeValidators(
              this.accidentHistoryForm.get('applicantWorkForCompanyToExplain'),
              false
            );
          }

          if (selectedCheckbox.index === 1) {
            this.inputService.changeValidators(
              this.accidentHistoryForm.get('vehicleType'),
              false
            );

            this.inputService.changeValidators(
              this.accidentHistoryForm.get('trailerType'),
              false
            );
          }
        }
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
    this.selectedAccidentIndex = index;

    this.isEditing = true;
    this.accidentArray[index].isEditingAccident = true;

    const selectedAccident = this.accidentArray[index];

    this.formValuesToPatch = selectedAccident;
  }

  public onCloseWarningBox(): void {
    this.accidentHistoryForm
      .get('applicantWorkForCompanyExplain')
      .patchValue(null);

    this.workForCompanyRadios[0].checked = false;
    this.workForCompanyRadios[1].checked = false;
  }

  public onSelectNoWarningBox(): void {
    this.accidentHistoryForm.get('applicantWorkForCompany').patchValue(true);
    this.accidentHistoryForm
      .get('applicantWorkForCompanyExplain')
      .patchValue('YES');

    this.inputService.changeValidators(
      this.accidentHistoryForm.get('applicantWorkForCompanyBeforeExplain')
    );

    this.inputService.changeValidators(
      this.accidentHistoryForm.get('applicantWorkForCompanyToExplain')
    );

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
    this.isEditing = false;
    this.accidentArray[this.selectedAccidentIndex].isEditingAccident = false;

    this.accidentArray[this.selectedAccidentIndex] = event;

    this.helperIndex = 2;
    this.selectedAccidentIndex = -1;
  }

  public onGetFormStatus(status: string): void {
    this.formStatus = status;
  }

  public onMarkInvalidEmit(event: any): void {
    if (!event) {
      this.markFormInvalid = false;
    }
  }

  public onGetLastFormValues(event: any): void {
    this.lastAccidentCard = event;
  }

  public getDropdownLists(): void {
    this.applicantListsService
      .getDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.vehicleType = data.truckTypes.map((item) => {
          return {
            ...item,
            folder: 'common',
            subFolder: 'trucks',
          };
        });

        this.trailerType = data.trailerTypes.map((item) => {
          return {
            ...item,
            folder: 'common',
            subFolder: 'trailers',
          };
        });

        this.reasonsForLeaving = data.reasonsForLeave;
      });
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      this.onSubmit();
    }

    if (event.action === 'back-step') {
      this.router.navigate(['/sph-form/1']);
    }
  }

  public onSubmit(): void {
    if (this.accidentHistoryForm.invalid) {
      this.inputService.markInvalid(this.accidentHistoryForm);
      return;
    }

    if (this.formStatus === 'INVALID') {
      this.markFormInvalid = true;
      return;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
