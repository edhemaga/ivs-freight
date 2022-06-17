import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { Applicant } from '../../state/model/applicant.model';
import { License, CDLInformation } from '../../state/model/cdl-information';
import { AnswerChoices } from '../../state/model/applicant-question.model';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.APPLICANT;

  public applicant: Applicant | undefined;

  public licenseForm: FormGroup;

  public canadaStates: any[] = [];
  public usStates: any[] = [];

  public stateTypes: any[] = [];
  public countryTypes: any[] = [];
  public classTypes: any[] = [];
  public endorsmentsList: any[] = [];
  public restrictionsList: any[] = [];

  public selectedCountryType: any = null;
  public selectedStateType: any = null;
  public selectedClassType: any = null;
  public selectedEndorsments: any = null;
  public selectedRestrictions: any = null;

  public editLicense: number = -1;
  public licenseFormArray: License[] = [];

  public cdlInformation: CDLInformation | undefined;

  public answerChoices: AnswerChoices[] = [
    {
      id: 1,
      label: 'Yes',
      value: 'permitYes',
      name: 'permitYes',
      checked: false,
    },
    {
      id: 2,
      label: 'No',
      value: 'permitNo',
      name: 'permitNo',
      checked: false,
    },
  ];

  public trackByIdentity = (index: number, item: any): number => index;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService
  ) {}

  ngOnInit(): void {
    this.formInit();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  private formInit(): void {
    this.licenseForm = this.formBuilder.group({
      id: [null],
      license: [null, Validators.required],
      countryType: [null, Validators.required],
      stateId: [null, Validators.required],
      classType: [null, Validators.required],
      expDate: [null, Validators.required],
      endorsments: [null],
      restrictions: [null],
      permit: [null, Validators.required],
      permitExplain: [null],
    });
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.COUNTRY_TYPE:
        this.selectedCountryType = event;

        this.inputService.changeValidators(
          this.licenseForm.get('stateId'),
          false
        );

        if (this.selectedCountryType.name.toLowerCase() === 'us') {
          this.stateTypes = this.usStates;
        } else {
          this.stateTypes = this.canadaStates;
        }

        break;
      case InputSwitchActions.STATE_TYPE:
        this.selectedStateType = event;

        break;
      case InputSwitchActions.CLASS_TYPE:
        this.selectedClassType = event;

        break;
      case InputSwitchActions.ENDORSMENTS:
        this.selectedEndorsments = event;

        break;
      case InputSwitchActions.RESTRICTIONS:
        this.selectedRestrictions = event;

        break;
      case InputSwitchActions.PERMIT:
        const selectedCheckbox = event.find(
          (radio: { checked: boolean }) => radio.checked
        );

        if (selectedCheckbox.label === 'Yes') {
          this.inputService.changeValidators(this.licenseForm.get('permit'));
        } else {
          this.inputService.changeValidators(
            this.licenseForm.get('permit'),
            false
          );
        }

        this.licenseForm.get('permit').patchValue(selectedCheckbox.label);

        break;
      default:
        break;
    }
  }

  public onAddLicense(): void {
    /*  this.shared.clearNotifications(); */

    const licenseForm = this.licenseForm.value;
    const license = new License();

    license.license = licenseForm.license;
    license.countryType = licenseForm.countryType;
    license.stateId = licenseForm.stateId;
    license.classType = licenseForm.classType;
    license.expDate = licenseForm.expDate;

    license.endorsments = licenseForm.endorsments
      .map((item: any) => {
        return item['name'];
      })
      .join(',');

    license.restrictions = licenseForm.restrictions
      .map((item: any) => {
        return item['name'];
      })
      .join(',');

    this.licenseFormArray.push(license);

    this.licenseForm.reset();
    this.editLicense = -1;
  }

  public onUpdateLicense(): void {
    /*  this.shared.clearNotifications();
     */
    if (this.licenseFormArray?.length) {
      const licenseForm = this.licenseForm.value;
      const license: License = new License(
        this.licenseFormArray[this.editLicense]
      );

      license.license = licenseForm.license;
      license.countryType = licenseForm.countryType;
      license.stateId = licenseForm.stateId;
      license.classType = licenseForm.classType;
      license.expDate = licenseForm.expDate;

      license.endorsments = licenseForm.endorsments
        .map((item: any) => {
          return item['name'];
        })
        .join(',');

      license.restrictions = licenseForm.restrictions
        .map((item: any) => {
          return item['name'];
        })
        .join(',');

      this.licenseFormArray[this.editLicense] = license;
    }

    this.licenseForm.reset();
    this.editLicense = -1;
  }

  public onEditLicense(index: number): void {
    this.licenseForm.patchValue({
      id: this.licenseFormArray[index].id,
      license: this.licenseFormArray[index].license,
      countryType: this.licenseFormArray[index].countryType,
      stateId: this.licenseFormArray[index].stateId,
      classType: this.licenseFormArray[index].classType,
      expDate: this.licenseFormArray[index].expDate,
      endorsments: this.licenseFormArray[index].endorsments
        .split(',')
        .map((a: any) => {
          let endorsment: any = { name: a };
          return endorsment;
        }),
      restrictions: this.licenseFormArray[index].restrictions
        .split(',')
        .map((a: any) => {
          let restriction: any = { name: a };
          return restriction;
        }),
    });

    this.editLicense = index;
  }

  public onDeleteLicense(index: number): void {
    if (this.licenseFormArray[index].id) {
      this.licenseFormArray[index].isDeleted = true;
    } else {
      this.licenseFormArray.splice(index, 1);
    }
  }

  public onSubmitForm(): void {
    /* this.shared.clearNotifications();

        let isValid = true;

        if (!this.licenseFormArray.filter(a => !a.isDeleted).length) {
            if (!this.shared.markInvalid(this.licenseForm)) {
                isValid = false;
            }

            if (this.licenseFormArray.length < 1) {
                if (this.shared.markInvalid(this.licenseForm)) {
                    this.onAddLicense();
                } else {
                    isValid = false;
                }
            }
        }

        if (this.isPermit === -1) {
            this.notification.warning('Please answer permit.', 'Warning:');
            isValid = false;
        }

        if (this.isPermit === 1) {
            if (!this.shared.markInvalid(this.permitForm)) {
                isValid = false;
            }
        }

        if (!isValid) {
            return false;
        } */

    const cdlInfo: CDLInformation = {
      id: this.cdlInformation?.id ? this.cdlInformation?.id : undefined,
      applicantId: this.applicant?.id,
      licences: this.licenseFormArray,
      permit: this.licenseForm.get('permit').value,
      explain: this.licenseForm.get('permitExplain').value,
    };

    // REDUX

    // this.apppEntityServices.CDLInformationService.upsert(
    //   cdlInfo
    // ).subscribe(
    //   (response) => {
    //     this.notification.success('CDL is updated');
    //   },
    //   (error) => {
    //     this.shared.handleError(error);
    //   }
    // );
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      this.onSubmitForm();
    }
  }

  public onSubmitReview(data: any): void {}

  ngOnDestroy(): void {}
}
