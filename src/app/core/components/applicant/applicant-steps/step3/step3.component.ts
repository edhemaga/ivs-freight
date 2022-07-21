import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { isFormValueEqual } from '../../state/utils/utils';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { Applicant } from '../../state/model/applicant.model';
import {
  License,
  CDLInformation,
  LicenseModel,
} from '../../state/model/cdl-information';
import { AnswerChoices } from '../../state/model/applicant-question.model';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.APPLICANT;

  public applicant: Applicant | undefined;

  private subscription: Subscription;

  public permitForm: FormGroup;
  public licenseForm: FormGroup;
  public licenseArray: LicenseModel[] = [
    {
      license: 'd263-540-92-166-0',
      countryType: 'USA',
      stateId: 'AL',
      classType: '1234',
      expDate: '01/18/20',
      endorsments: 'Endorsment 1',
      restrictions: 'Restriction 1',
      isEditingLicense: false,
    },
    {
      license: 'd263-540-92-166-0',
      countryType: 'USA',
      stateId: 'AL',
      classType: '1234',
      expDate: '01/18/20',
      endorsments: 'Endorsment 2',
      restrictions: 'Restriction 2',
      isEditingLicense: false,
    },
    {
      license: 'd263-540-92-166-0',
      countryType: 'USA',
      stateId: 'AL',
      classType: '1234',
      expDate: '01/18/20',
      endorsments: 'Endorsment 2',
      restrictions: 'Restriction 2',
      isEditingLicense: false,
    },
    {
      license: 'd263-540-92-166-0',
      countryType: 'USA',
      stateId: 'AL',
      classType: '1234',
      expDate: '01/18/20',
      endorsments: 'Endorsment 2',
      restrictions: 'Restriction 2',
      isEditingLicense: false,
    },
  ];

  public canadaStates: any[] = [];
  public usStates: any[] = [];

  public stateTypes: any[] = [];
  public countryTypes: any[] = [];
  public classTypes: any[] = [];
  public endorsmentsList: any[] = [];
  public restrictionsList: any[] = [];

  public selectedLicenseIndex: number;
  public selectedCountryType: any = null;
  public selectedStateType: any = null;
  public selectedClassType: any = null;
  public selectedEndorsments: any = null;
  public selectedRestrictions: any = null;

  public isEditing: boolean = false;
  public isLicenseEdited: boolean = false;

  public answerChoices: AnswerChoices[] = [
    {
      id: 1,
      label: 'YES',
      value: 'permitYes',
      name: 'permitYes',
      checked: false,
    },
    {
      id: 2,
      label: 'NO',
      value: 'permitNo',
      name: 'permitNo',
      checked: false,
    },
  ];

  public helperIndex: number = 2;

  //

  /*  public licenseArray: License[] = []; */

  public editLicense: number = -1;

  public cdlInformation: CDLInformation | undefined;

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

  private createForm(): void {
    this.licenseForm = this.formBuilder.group({
      license: [null, Validators.required],
      countryType: [null, Validators.required],
      stateId: [null, Validators.required],
      classType: [null, Validators.required],
      expDate: [null, Validators.required],
      endorsments: [null],
      restrictions: [null],
    });

    this.permitForm = this.formBuilder.group({
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
          this.inputService.changeValidators(
            this.permitForm.get('permitExplain')
          );
        } else {
          this.inputService.changeValidators(
            this.permitForm.get('permitExplain'),
            false
          );
        }

        this.permitForm.get('permit').patchValue(selectedCheckbox.label);

        break;
      default:
        break;
    }
  }

  public onAddLicense(): void {
    if (this.licenseForm.invalid) {
      this.inputService.markInvalid(this.licenseForm);
      return;
    }

    this.helperIndex = 2;

    this.inputResetService.resetInputSubject.next(true);

    /* const licenseForm = this.licenseForm.value;
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

    this.licenseArray.push(license);

    this.licenseForm.reset();
    this.editLicense = -1; */
  }

  public onDeleteLicense(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.licenseArray.splice(index, 1);
  }

  public onEditLicense(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.helperIndex = index;

    this.isLicenseEdited = false;

    this.isEditing = true;
    this.licenseArray[index].isEditingLicense = true;

    this.selectedLicenseIndex = index;

    const selectedLicense = this.licenseArray[index];

    this.licenseForm.patchValue({
      license: selectedLicense.license,
      countryType: selectedLicense.countryType,
      stateId: selectedLicense.stateId,
      classType: selectedLicense.classType,
      expDate: selectedLicense.expDate,
      endorsments: selectedLicense.endorsments,
      restrictions: selectedLicense.restrictions,
    });

    this.subscription = this.licenseForm.valueChanges.subscribe(
      (newFormValue) => {
        if (isFormValueEqual(selectedLicense, newFormValue)) {
          this.isLicenseEdited = false;
        } else {
          this.isLicenseEdited = true;
        }
      }
    );
  }

  public onSaveEditedLicense(): void {
    if (this.licenseForm.invalid) {
      this.inputService.markInvalid(this.licenseForm);
      return;
    }

    if (!this.isLicenseEdited) {
      return;
    }

    this.licenseArray[this.selectedLicenseIndex] = this.licenseForm.value;

    this.isEditing = false;
    this.licenseArray[this.selectedLicenseIndex].isEditingLicense = false;

    this.isLicenseEdited = false;

    this.helperIndex = 2;

    this.licenseForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }

  public onCancelEditLicense(): void {
    this.isEditing = false;
    this.licenseArray[this.selectedLicenseIndex].isEditingLicense = false;

    this.isLicenseEdited = false;

    this.helperIndex = 2;

    this.licenseForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }

  public onSubmitForm(): void {
    /* this.shared.clearNotifications();

        let isValid = true;

        if (!this.licenseArray.filter(a => !a.isDeleted).length) {
            if (!this.shared.markInvalid(this.licenseForm)) {
                isValid = false;
            }

            if (this.licenseArray.length < 1) {
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
    /*  const cdlInfo: CDLInformation = {
      id: this.cdlInformation?.id ? this.cdlInformation?.id : undefined,
      applicantId: this.applicant?.id,
      licences: this.licenseArray,
      permit: this.licenseForm.get('permit').value,
      explain: this.licenseForm.get('permitExplain').value,
    };
 */
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
