import { FormArray } from '@angular/forms';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { card_modal_animation } from '../../shared/animations/card-modal.animation';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import {
  AddressEntity,
  CheckOwnerSsnEinResponse,
  CreateDriverCommand,
  CreateResponse,
  DriverResponse,
  GetDriverModalResponse,
  UpdateDriverCommand,
} from 'appcoretruckassist';
import {
  einNumberRegex,
  ssnNumberRegex,
  phoneFaxRegex,
  mileValidation,
  perStopValidation,
  addressValidation,
  addressUnitValidation,
  firstNameValidation,
  lastNameValidation,
  bankValidation,
  accountBankValidation,
  routingBankValidation,
  fuelCardValidation,
  name2_24Validation,
  nicknameValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TaUploadFileService } from '../../shared/ta-upload-files/ta-upload-file.service';
import { DriverTService } from '../../driver/state/driver.service';
import { HttpResponseBase } from '@angular/common/http';

import { TaTabSwitchComponent } from '../../shared/ta-tab-switch/ta-tab-switch.component';
import { DropZoneConfig } from '../../shared/ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { TaInputResetService } from '../../shared/ta-input/ta-input-reset.service';
import { BankVerificationService } from '../../../services/BANK-VERIFICATION/bankVerification.service';
import { FormService } from '../../../services/form/form.service';
import { NotificationService } from '../../../services/notification/notification.service';
import {
  convertNumberInThousandSep,
  convertDateToBackend,
  convertThousanSepInNumber,
  convertDateFromBackend,
} from '../../../utils/methods.calculations';

@Component({
  selector: 'app-driver-modal',
  templateUrl: './driver-modal.component.html',
  styleUrls: ['./driver-modal.component.scss'],
  animations: [
    tab_modal_animation('animationTabsModal'),
    card_modal_animation('showHidePayroll', '6px'),
  ],
  providers: [ModalService, FormService, BankVerificationService],
})
export class DriverModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild(TaTabSwitchComponent) tabSwitch: TaTabSwitchComponent;

  @Input() editData: any;

  public driverForm: FormGroup;

  public labelsBank: any[] = [];
  public labelsPayType: any[] = [];

  public isOwner: boolean = false;

  public selectedTab: number = 1;
  public selectedOwnerTab: any = null;
  public selectedAddress: AddressEntity = null;
  public selectedOffDutyAddressArray: AddressEntity[] = [];
  public selectedBank: any = null;
  public isBankSelected: boolean = false;
  public selectedPayType: any = null;

  public driverFullName: string = null;

  public owner: CheckOwnerSsnEinResponse = null;

  public disablePayType: boolean = false;

  public driverStatus: boolean = true;

  public documents: any[] = [];

  public isDirty: boolean;

  public addNewAfterSave: boolean = false;

  // Delete when back coming
  public hasMilesSameRate: boolean = false;
  public fleetType: string = 'Solo';

  public payrollCompany: any;

  public loadingOwnerEin: boolean = false;

  public logoOptions: Options = {
    floor: 0.1,
    ceil: 1.5,
    step: 0.1,
    animate: false,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  public slideInit = 0.5;

  public tabs: any[] = [
    {
      id: 1,
      name: 'Basic',
    },
    {
      id: 2,
      name: 'Additional',
    },
  ];

  public ownerTabs: any[] = [
    {
      id: 'sole',
      name: 'Sole Proprietor',
      checked: true,
    },
    {
      id: 'company',
      name: 'Company',
      checked: false,
    },
  ];

  public soloSliderOptions: Options = {
    floor: 10,
    ceil: 50,
    step: 1,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  public teamSliderOptions: Options = {
    floor: 10,
    ceil: 50,
    step: 1,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public dropZoneConfig: DropZoneConfig = {
    dropZoneType: 'files',
    dropZoneSvg: 'assets/svg/common/ic_files_dropzone.svg',
    dropZoneAvailableFiles: 'application/pdf, application/png, application/jpg',
    multiple: true,
    globalDropZone: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private inputServiceReset: TaInputResetService,
    private driverTService: DriverTService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private uploadFileService: TaUploadFileService,
    private bankVerificationService: BankVerificationService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getDriverDropdowns();
    this.onIncludePayroll();
    this.onTwicTypeSelected();

    if (this.editData) {
      this.editDriverById(this.editData.id);
    }

    this.isCheckedOwner();
  }

  public onModalAction(data: { action: string; bool: boolean }): void {
    if (data.action === 'close') {
      this.driverForm.reset();
    }
    // Change Driver Status

    let fullName =
      this.driverForm.get('firstName').value +
      ' ' +
      this.driverForm.get('lastName').value;

    let successMessage = `"${fullName}" ${
      data.action === 'deactivate' ? 'Deactivated' : 'Activated'
    }`;
    let errorMessage = `Failed to ${
      data.action === 'deactivate' ? 'Deactivate' : 'Activate'
    } "${fullName}"`;

    if (data.action === 'deactivate' && this.editData) {
      this.driverTService
        .changeDriverStatus(
          this.editData.id,
          !this.driverStatus ? 'active' : 'inactive'
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: HttpResponseBase) => {
            if (res.status === 200 || res.status === 204) {
              this.driverStatus = !this.driverStatus;

              this.modalService.changeModalStatus({
                name: 'deactivate',
                status: this.driverStatus,
              });

              this.notificationService.success(successMessage, 'Success');
            }
          },
          error: () => {
            this.notificationService.error(errorMessage, 'Error');
          },
        });
    }
    // Save And Add New
    else if (data.action === 'save and add new') {
      this.addDriver();
      this.modalService.setModalSpinner({
        action: 'save and add new',
        status: true,
      });
      this.addNewAfterSave = true;
    }
    // Save or Update and Close
    else if (data.action === 'save') {
      if (this.driverForm.invalid) {
        this.inputService.markInvalid(this.driverForm);
        return;
      }
      // Update
      if (this.editData?.id) {
        this.updateDriver(this.editData.id);
        this.modalService.setModalSpinner({ action: null, status: true });
      }
      // Save
      else {
        this.addDriver();
        this.modalService.setModalSpinner({ action: null, status: true });
      }
    }
    // Delete
    else if (data.action === 'delete' && this.editData?.id) {
      this.deleteDriverById(this.editData.id);
      this.modalService.setModalSpinner({ action: 'delete', status: true });
    }
  }

  private createForm(): void {
    this.driverForm = this.formBuilder.group({
      firstName: [null, [Validators.required, ...firstNameValidation]],
      lastName: [null, [Validators.required, ...lastNameValidation]],
      phone: [null, [Validators.required, phoneFaxRegex]],
      email: [null, [Validators.required]],
      address: [null, [Validators.required, ...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      dateOfBirth: [null],
      ssn: [null, [Validators.required, ssnNumberRegex]],
      mvrExpiration: [5, Validators.required],
      bankId: [null, [...bankValidation]],
      account: [null, accountBankValidation],
      routing: [null, routingBankValidation],
      payType: [null, Validators.required],
      useTruckAssistAch: [false],
      soloDriver: [false],
      teamDriver: [false],
      soloEmptyMile: [null],
      soloLoadedMile: [null],
      soloPerStop: [null, perStopValidation],
      perMileSolo: [null],
      teamEmptyMile: [null],
      teamLoadedMile: [null],
      teamPerStop: [null, perStopValidation],
      perMileTeam: [null],
      commissionSolo: [25],
      commissionTeam: [25],
      isOwner: [false],
      ownerId: [null],
      ownerType: ['Sole Proprietor'],
      ein: [null, einNumberRegex],
      bussinesName: [null],
      offDutyLocations: this.formBuilder.array([]),
      emergencyContactName: [
        null,
        [Validators.required, ...name2_24Validation],
      ],
      emergencyContactPhone: [null, [phoneFaxRegex, Validators.required]],
      emergencyContactRelationship: [null, name2_24Validation],
      note: [{ value: null, disabled: true }],
      avatar: [null],
      twic: [false],
      twicExpDate: [null],
      fuelCard: [null, [...fuelCardValidation]],
      mailNotificationGeneral: [true],
      pushNotificationGeneral: [false],
      smsNotificationGeneral: [false],
      mailNotificationPayroll: [true],
      pushNotificationPayroll: [false],
      smsNotificationPayroll: [false],
    });

    this.inputService.customInputValidator(
      this.driverForm.get('email'),
      'email',
      this.destroy$
    );
    // this.formService.checkFormChange(this.driverForm);

    // this.formService.formValueChange$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  public get offDutyLocations(): FormArray {
    return this.driverForm.get('offDutyLocations') as FormArray;
  }

  private createOffDutyLocation(data?: {
    id: number;
    nickname: string;
    address: string;
    city: string;
    state: string;
    stateShortName: string;
    country: string;
    zipCode: string;
    addressUnit: string;
    street: string;
    streetNumber: string;
  }): FormGroup {
    return this.formBuilder.group({
      id: [data?.id ? data.id : 0],
      nickname: [data?.nickname ? data.nickname : null, nicknameValidation],
      address: [data?.address ? data.address : null, [...addressValidation]],
      city: [data?.city ? data.city : null],
      state: [data?.state ? data.state : null],
      stateShortName: [data?.stateShortName ? data.stateShortName : null],
      country: [data?.country ? data.country : null],
      zipCode: [data?.zipCode ? data.zipCode : null],
      addressUnit: [
        data?.addressUnit ? data.addressUnit : null,
        [...addressUnitValidation],
      ],
      street: [data?.street ? data.street : null],
      streetNumber: [data?.streetNumber ? data.streetNumber : null],
    });
  }

  public addOffDutyLocation(event: { check: boolean; action: string }) {
    if (event.check) {
      this.offDutyLocations.push(this.createOffDutyLocation());
    }
  }

  public removeOffDutyLocation(id: number) {
    this.offDutyLocations.removeAt(id);
    this.selectedOffDutyAddressArray.slice(id, 1);
  }

  private onIncludePayroll(): void {
    this.driverForm
      .get('useTruckAssistAch')
      .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(this.driverForm.get('bankId'));
        } else {
          this.inputService.changeValidators(
            this.driverForm.get('bankId'),
            false,
            [],
            false
          );
        }
      });
  }

  private onBankSelected() {
    this.driverForm
      .get('bankId')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.isBankSelected = this.bankVerificationService.onSelectBank(
          this.selectedBank ? this.selectedBank.name : value,
          this.driverForm.get('routing'),
          this.driverForm.get('account')
        );
      });
  }

  public onSaveNewBank(bank: { data: any; action: string }) {
    this.selectedBank = bank.data;

    this.bankVerificationService
      .createBank({ name: this.selectedBank.name })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreateResponse) => {
          this.notificationService.success(
            'Successfuly add new bank',
            'Success'
          );
          this.selectedBank = {
            id: res.id,
            name: this.selectedBank.name,
          };
          this.labelsBank = [...this.labelsBank, this.selectedBank];
        },
        error: (err) => {
          this.notificationService.error("Can't add new bank", 'Error');
        },
      });
  }

  private onPayTypeSelected(payType: number): void {
    console.log(payType);
    if (payType === 1) {
      if (['Solo', 'Combined'].includes(this.fleetType)) {
        if (!this.hasMilesSameRate) {
          this.inputService.changeValidators(
            this.driverForm.get('soloEmptyMile'),
            true,
            [...mileValidation],
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('soloLoadedMile'),
            true,
            [...mileValidation],
            false
          );
        } else {
          this.inputService.changeValidators(
            this.driverForm.get('perMileSolo'),
            true,
            [...mileValidation],
            false
          );
        }
      }
      if (['Team', 'Combined'].includes(this.fleetType)) {
        if (!this.hasMilesSameRate) {
          this.inputService.changeValidators(
            this.driverForm.get('teamEmptyMile'),
            true,
            [...mileValidation],
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('teamLoadedMile'),
            true,
            [...mileValidation],
            false
          );
        } else {
          this.inputService.changeValidators(
            this.driverForm.get('perMileTeam'),
            true,
            [...mileValidation],
            false
          );
        }
      }

      this.validateMiles();

      this.driverForm.get('commissionSolo').patchValue(null);
      this.driverForm.get('commissionTeam').patchValue(null);
    }

    if (payType === 2) {
      this.inputService.changeValidators(
        this.driverForm.get('soloEmptyMile'),
        false
      );
      this.inputService.changeValidators(
        this.driverForm.get('soloLoadedMile'),
        false
      );
      this.inputService.changeValidators(
        this.driverForm.get('soloPerStop'),
        false
      );

      this.inputService.changeValidators(
        this.driverForm.get('teamEmptyMile'),
        false
      );
      this.inputService.changeValidators(
        this.driverForm.get('teamLoadedMile'),
        false
      );
      this.inputService.changeValidators(
        this.driverForm.get('teamPerStop'),
        false
      );

      this.driverForm
        .get('commissionSolo')
        .patchValue(this.payrollCompany.solo.commissionSolo);
      this.driverForm
        .get('commissionTeam')
        .patchValue(this.payrollCompany.team.commissionTeam);
    }
  }

  private onTwicTypeSelected(): void {
    this.driverForm
      .get('twic')
      .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(
            this.driverForm.get('twicExpDate')
          );
        } else {
          this.inputService.changeValidators(
            this.driverForm.get('twicExpDate'),
            false
          );
        }
      });
  }

  public onHandleAddress(event: {
    address: AddressEntity | any;
    valid: boolean;
  }): void {
    if (event.valid) {
      this.selectedAddress = event.address;
    }
  }

  public handlingPayrollFleetType(
    fleetType: string,
    dropdownsInit: boolean = false
  ) {
    if (fleetType === 'Combined') {
      if (dropdownsInit) {
        this.driverForm.get('teamDriver').patchValue(true);
        this.driverForm.get('soloDriver').patchValue(true);
      }

      this.driverForm
        .get('soloDriver')
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((val) => {
          if (!val && !this.driverForm.get('isOwner').value) {
            this.driverForm.get('teamDriver').patchValue(true);
            this.inputService.changeValidators(
              this.driverForm.get('soloEmptyMile'),
              false
            );
            this.inputService.changeValidators(
              this.driverForm.get('soloLoadedMile'),
              false
            );
          }
        });

      this.driverForm
        .get('teamDriver')
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((val) => {
          if (!val && !this.driverForm.get('isOwner').value) {
            this.driverForm.get('soloDriver').patchValue(true);
            this.inputService.changeValidators(
              this.driverForm.get('teamEmptyMile'),
              false
            );
            this.inputService.changeValidators(
              this.driverForm.get('teamLoadedMile'),
              false
            );
          }
        });
    }
  }

  public onHandleAddressFormArray(
    event: { address: AddressEntity | any; valid: boolean },
    index: number
  ) {
    this.selectedOffDutyAddressArray[index] = event.address;

    if (!event.valid) {
      this.offDutyLocations.at(index).setErrors({ invalid: true });
    } else {
      this.offDutyLocations.at(index).patchValue({
        address: this.selectedOffDutyAddressArray[index].address,
        city: this.selectedOffDutyAddressArray[index].city,
        state: this.selectedOffDutyAddressArray[index].state,
        stateShortName: this.selectedOffDutyAddressArray[index].stateShortName,
        country: this.selectedOffDutyAddressArray[index].country,
        zipCode: this.selectedOffDutyAddressArray[index].zipCode,
        addressUnit: this.offDutyLocations.at(index).get('addressUnit').value,
        street: this.selectedOffDutyAddressArray[index].street,
        streetNumber: this.selectedOffDutyAddressArray[index].streetNumber,
      });
    }
  }

  public premmapedOffDutyLocation() {
    return this.offDutyLocations.controls.map((item) => {
      return {
        id: item.get('id').value ? item.get('id').value : 0,
        nickname: item.get('nickname').value,
        address: {
          address: item.get('address').value,
          city: item.get('city').value,
          state: item.get('state').value,
          stateShortName: item.get('stateShortName').value,
          country: item.get('country').value,
          zipCode: item.get('zipCode').value,
          addressUnit: item.get('addressUnit').value,
          street: item.get('street').value,
          streetNumber: item.get('streetNumber').value,
        },
      };
    });
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;

    this.uploadFileService.visibilityDropZone(this.selectedTab === 2);

    let dotAnimation = document.querySelector('.animation-two-tabs');

    this.animationObject = {
      value: this.selectedTab,
      params: { height: `${dotAnimation.getClientRects()[0].height}px` },
    };

    if (this.selectedTab === 1) {
      this.dropZoneConfig = {
        dropZoneType: 'files',
        dropZoneSvg: 'assets/svg/common/ic_files_dropzone.svg',
        dropZoneAvailableFiles:
          'application/pdf, application/png, application/jpg',
        multiple: true,
        globalDropZone: false,
      };
    } else {
      this.dropZoneConfig = {
        dropZoneType: 'image',
        dropZoneAvailableFiles: 'image/gif, image/jpeg, image/jpg, image/png',
        dropZoneSvg: 'assets/svg/common/ic_image_dropzone.svg',
        multiple: false,
        globalDropZone: true,
      };
    }
  }

  public tabOwnerChange(event: any): void {
    if (event) {
      this.selectedOwnerTab = event;
      this.driverForm.get('ownerType').patchValue(this.selectedOwnerTab.name);
      if (
        this.driverForm.get('isOwner').value &&
        this.selectedOwnerTab?.name.toLowerCase() === 'company'
      ) {
        this.inputService.changeValidators(this.driverForm.get('ein'), true, [
          einNumberRegex,
        ]);
        this.einNumberChange();
      } else {
        this.inputService.changeValidators(this.driverForm.get('ein'), false);
      }
    }

    this.ownerTabs = this.ownerTabs.map((item) => {
      return { ...item, checked: item.id === this.selectedOwnerTab.id };
    });
  }

  public onSelectDropdown(event: any, action: string): void {
    console.log(event);
    switch (action) {
      case 'bank': {
        this.selectedBank = event;
        if (!event) {
          this.driverForm.get('bankId').patchValue(null);
        }
        this.onBankSelected();
        break;
      }
      case 'paytype': {
        this.selectedPayType = event;
        if (!event) {
          return;
        }
        this.onPayTypeSelected(this.selectedPayType.id);
        break;
      }
      default: {
        break;
      }
    }
  }

  public onUploadImage(event: any) {
    this.driverForm.get('avatar').patchValue(event);
    this.driverForm.get('avatar').setErrors(null);
  }

  public onImageValidation(event: boolean) {
    if (!event) {
      this.driverForm.get('avatar').setErrors({ invalid: true });
    } else {
      this.inputService.changeValidators(this.driverForm.get('avatar'), false);
    }
  }

  private isCheckedOwner() {
    this.driverForm
      .get('isOwner')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value && !this.driverForm.get('ownerType').value) {
          this.driverForm.get('ownerType').patchValue('Sole Proprietor');
        }

        if (value) {
          this.disablePayType = true;
          this.inputService.changeValidators(
            this.driverForm.get('payType'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('soloEmptyMile'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('soloLoadedMile'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('soloPerStop'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('soloPerMile'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('teamEmptyMile'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('teamLoadedMile'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('teamPerStop'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('teamPerMile'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('commissionSolo'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('commissionTeam'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('bankId'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('routing'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('account'),
            false
          );
          this.driverForm.get('soloDriver').patchValue(false);
          this.driverForm.get('teamDriver').patchValue(false);
          this.driverForm.get('useTruckAssistAch').patchValue(false);
          this.isBankSelected = false;
          this.selectedBank = null;
          this.selectedPayType = null;
        } else {
          this.disablePayType = false;
          this.inputService.changeValidators(this.driverForm.get('payType'));
        }
      });
  }

  public onFilesEvent(event: any) {
    this.documents = event.files;
  }

  private einNumberChange() {
    this.driverForm
      .get('ein')
      .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value?.length === 10) {
          this.loadingOwnerEin = true;
          this.driverTService
            .checkOwnerEinNumber(value.toString())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res: CheckOwnerSsnEinResponse) => {
                this.owner = res?.name ? res : null;
                this.loadingOwnerEin = false;
                if (this.owner?.name) {
                  this.driverForm
                    .get('bussinesName')
                    .patchValue(this.owner.name);
                }
              },
              error: () => {
                this.notificationService.error(
                  "Owner can't be loaded.",
                  'Error:'
                );
              },
            });
        } else {
          this.driverForm.get('bussinesName').patchValue(null);
        }
      });
  }

  public validateMiles() {
    if (['Solo', 'Combined'].includes(this.fleetType)) {
      this.driverForm
        .get('soloEmptyMile')
        .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
        .subscribe((value) => {
          if (value > 10) {
            this.driverForm.get('soloEmptyMile').setErrors({ invalid: true });
          } else {
            this.driverForm.get('soloEmptyMile').setErrors(null);
          }
        });

      this.driverForm
        .get('soloLoadedMile')
        .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
        .subscribe((value) => {
          if (value > 10) {
            this.driverForm.get('soloLoadedMile').setErrors({ invalid: true });
          } else {
            this.driverForm.get('soloLoadedMile').setErrors(null);

            this.driverForm.get('soloEmptyMile').patchValue(value);
          }
        });
    }

    if (['Team', 'Combined'].includes(this.fleetType)) {
      this.driverForm
        .get('teamEmptyMile')
        .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
        .subscribe((value) => {
          if (value > 10) {
            this.driverForm.get('teamEmptyMile').setErrors({ invalid: true });
          } else {
            this.driverForm.get('teamEmptyMile').setErrors(null);
          }
        });

      this.driverForm
        .get('teamLoadedMile')
        .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
        .subscribe((value) => {
          if (value > 10) {
            this.driverForm.get('teamLoadedMile').setErrors({ invalid: true });
          } else {
            this.driverForm.get('teamLoadedMile').setErrors(null);

            this.driverForm.get('teamEmptyMile').patchValue(value);
          }
        });
    }
  }

  private getDriverDropdowns(): void {
    this.driverTService
      .getDriverDropdowns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: GetDriverModalResponse) => {
          this.labelsBank = data.banks;
          this.labelsPayType = data.payTypes;
          this.driverForm.get('mvrExpiration').patchValue(data.mvrExpiration);
          this.fleetType = data.fleetType;
          this.hasMilesSameRate = data.loadedAndEmptySameRate;
          console.log('DROPDOWNMS');
          console.log(data);
          if (['Solo', 'Combined'].includes(this.fleetType)) {
            this.driverForm
              .get('soloEmptyMile')
              .patchValue(data.solo?.emptyMile ? data.solo.emptyMile : null, {
                emitEvent: false,
              });
            this.driverForm
              .get('soloLoadedMile')
              .patchValue(data.solo?.loadedMile ? data.solo.loadedMile : null, {
                emitEvent: false,
              });
            this.driverForm
              .get('soloPerStop')
              .patchValue(
                data.solo?.perStop
                  ? convertNumberInThousandSep(data.solo.perStop)
                  : null,
                {
                  emitEvent: false,
                }
              );
            this.driverForm
              .get('perMileSolo')
              .patchValue(data.perMileSolo, { emitEvent: false });
            this.driverForm
              .get('commissionSolo')
              .patchValue(data.defaultSoloDriverCommission, {
                emitEvent: false,
              });
          }

          if (['Team', 'Combined'].includes(this.fleetType)) {
            this.driverForm
              .get('teamEmptyMile')
              .patchValue(data.team?.emptyMile ? data.team.emptyMile : null, {
                emitEvent: false,
              });
            this.driverForm
              .get('teamLoadedMile')
              .patchValue(data.team?.loadedMile ? data.team.loadedMile : null, {
                emitEvent: false,
              });
            this.driverForm
              .get('teamPerStop')
              .patchValue(
                data.team?.perStop
                  ? convertNumberInThousandSep(data.team.perStop)
                  : null,
                {
                  emitEvent: false,
                }
              );
            this.driverForm
              .get('perMileTeam')
              .patchValue(data.perMileTeam, { emitEvent: false });
            this.driverForm
              .get('commissionTeam')
              .patchValue(data.defaultTeamDriverCommission, {
                emitEvent: false,
              });
          }

          this.payrollCompany = {
            solo: {
              ...data.solo,
              perMileSolo: data.perMileSolo,
              commissionSolo: data.defaultSoloDriverCommission,
            },
            team: {
              ...data.team,
              perMileTeam: data.perMileTeam,
              commissionTeam: data.defaultTeamDriverCommission,
            },
            mvrExpiration: data.mvrExpiration,
          };

          this.handlingPayrollFleetType(this.fleetType, true);
        },
        error: (err) => {
          let retryStatus = false;
          if ( err.status == 500 )
            {
              retryStatus = true;
            }
          this.notificationService.error(
            "Driver's dropdowns can't be loaded.",
            'Error:',
            retryStatus,
          );
        },
      });
  }

  private addDriver(): void {
    const {
      soloEmptyMile,
      soloLoadedMile,
      soloPerStop,
      perMileSolo,
      commissionSolo,

      teamEmptyMile,
      teamLoadedMile,
      teamPerStop,
      perMileTeam,
      commissionTeam,

      soloDriver,
      teamDriver,

      mailNotificationGeneral,
      pushNotificationGeneral,
      smsNotificationGeneral,

      mailNotificationPayroll,
      pushNotificationPayroll,
      smsNotificationPayroll,

      address,
      addressUnit,
      bussinesName,
      ...form
    } = this.driverForm.value;

    const newData: CreateDriverCommand = {
      ...form,
      dateOfBirth: convertDateToBackend(
        this.driverForm.get('dateOfBirth').value
      ),
      ownerId:
        this.driverForm.get('ownerType').value === 'Sole Proprietor'
          ? null
          : this.owner
          ? this.owner.id
          : null,
      ownerType: !this.driverForm.get('isOwner').value
        ? null
        : this.driverForm.get('ownerType').value === 'Sole Proprietor'
        ? 2
        : 1,
      bussinesName: this.owner
        ? null
        : this.driverForm.get('bussinesName').value,
      address: {
        ...this.selectedAddress,
        addressUnit: addressUnit,
      },
      bankId: this.selectedBank ? this.selectedBank.id : null,
      payType: this.selectedPayType ? this.selectedPayType.id : null,
      solo: {
        emptyMile: !this.hasMilesSameRate
          ? ['Solo', 'Combined'].includes(this.fleetType)
            ? this.fleetType === 'Combined'
              ? soloDriver
                ? soloEmptyMile
                  ? parseFloat(soloEmptyMile)
                  : null
                : null
              : soloEmptyMile
              ? parseFloat(soloEmptyMile)
              : null
            : null
          : null,
        loadedMile: !this.hasMilesSameRate
          ? ['Solo', 'Combined'].includes(this.fleetType)
            ? this.fleetType === 'Combined'
              ? soloDriver
                ? soloLoadedMile
                  ? parseFloat(soloLoadedMile)
                  : null
                : null
              : soloLoadedMile
              ? parseFloat(soloLoadedMile)
              : null
            : null
          : null,
        perStop: !this.hasMilesSameRate
          ? ['Solo', 'Combined'].includes(this.fleetType)
            ? this.fleetType === 'Combined'
              ? soloDriver
                ? soloPerStop
                  ? convertThousanSepInNumber(soloPerStop)
                  : null
                : null
              : soloPerStop
              ? convertThousanSepInNumber(soloPerStop)
              : null
            : null
          : null,
      },
      perMileSolo: this.hasMilesSameRate
        ? ['Solo', 'Combined'].includes(this.fleetType)
          ? this.fleetType === 'Combined'
            ? soloDriver
              ? perMileSolo
                ? parseFloat(perMileSolo)
                : null
              : null
            : perMileSolo
            ? parseFloat(perMileSolo)
            : null
          : null
        : null,
      team: {
        emptyMile: !this.hasMilesSameRate
          ? ['Team', 'Combined'].includes(this.fleetType)
            ? this.fleetType === 'Combined'
              ? teamDriver
                ? teamEmptyMile
                  ? parseFloat(teamEmptyMile)
                  : null
                : null
              : teamEmptyMile
              ? parseFloat(teamEmptyMile)
              : null
            : null
          : null,
        loadedMile: !this.hasMilesSameRate
          ? ['Team', 'Combined'].includes(this.fleetType)
            ? this.fleetType === 'Combined'
              ? teamDriver
                ? teamLoadedMile
                  ? parseFloat(teamLoadedMile)
                  : null
                : null
              : teamLoadedMile
              ? parseFloat(teamLoadedMile)
              : null
            : null
          : null,
        perStop: !this.hasMilesSameRate
          ? ['Team', 'Combined'].includes(this.fleetType)
            ? this.fleetType === 'Combined'
              ? teamDriver
                ? teamPerStop
                  ? convertThousanSepInNumber(teamPerStop)
                  : null
                : null
              : teamPerStop
              ? convertThousanSepInNumber(teamPerStop)
              : null
            : null
          : null,
      },
      perMileTeam: this.hasMilesSameRate
        ? ['Team', 'Combined'].includes(this.fleetType)
          ? this.fleetType === 'Combined'
            ? teamDriver
              ? perMileTeam
                ? parseFloat(perMileTeam)
                : null
              : null
            : perMileTeam
            ? parseFloat(perMileTeam)
            : null
          : null
        : null,
      commissionSolo: ['Solo', 'Combined'].includes(this.fleetType)
        ? this.fleetType === 'Combined'
          ? soloDriver
            ? commissionSolo
              ? parseFloat(commissionSolo)
              : null
            : null
          : commissionSolo
          ? parseFloat(commissionSolo)
          : null
        : null,
      commissionTeam: ['Team', 'Combined'].includes(this.fleetType)
        ? this.fleetType === 'Combined'
          ? commissionTeam
            ? commissionTeam
              ? parseFloat(commissionTeam)
              : null
            : null
          : commissionTeam
          ? parseFloat(commissionTeam)
          : null
        : null,
      general: {
        mailNotification: mailNotificationGeneral,
        pushNotification: pushNotificationGeneral,
        smsNotification: smsNotificationGeneral,
      },
      payroll: {
        mailNotification: mailNotificationPayroll,
        pushNotification: pushNotificationPayroll,
        smsNotification: smsNotificationPayroll,
      },
      twicExpDate: this.driverForm.get('twic').value
        ? convertDateToBackend(this.driverForm.get('twicExpDate').value)
        : null,
      offDutyLocations: this.premmapedOffDutyLocation(),
      fleetType: this.fleetType,
      soloDriver: !this.driverForm.get('isOwner').value
        ? this.fleetType === 'Combined'
          ? soloDriver
          : false
        : null,
      teamDriver: !this.driverForm.get('isOwner').value
        ? this.fleetType === 'Combined'
          ? teamDriver
          : false
        : null,
    };

    let driverFullName = newData.firstName + ' ' + newData.lastName;

    this.driverTService
      .addDriver(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `${driverFullName}`,
            'CREATED DRIVER'
          );

          // If clicked Save and Add New, reset form and fields
          if (this.addNewAfterSave) {
            this.formService.resetForm(this.driverForm);
            this.modalService.setModalSpinner({
              action: 'save and add new',
              status: false,
            });
            this.driverForm.get('ownerType').patchValue(null);
            this.driverForm.get('payType').patchValue(null);

            this.driverForm
              .get('soloEmptyMile')
              .patchValue(this.payrollCompany.solo.emptyMile);
            this.driverForm
              .get('soloLoadedMile')
              .patchValue(this.payrollCompany.solo.loadedMile);
            this.driverForm
              .get('soloPerStop')
              .patchValue(this.payrollCompany.solo.perStop);
            this.driverForm
              .get('perMileSolo')
              .patchValue(this.payrollCompany.solo.perMileSolo);
            this.driverForm
              .get('commissionSolo')
              .patchValue(this.payrollCompany.solo.commissionSolo);

            this.driverForm
              .get('teamEmptyMile')
              .patchValue(this.payrollCompany.team.emptyMile);
            this.driverForm
              .get('teamLoadedMile')
              .patchValue(this.payrollCompany.team.loadedMile);
            this.driverForm
              .get('teamPerStop')
              .patchValue(this.payrollCompany.team.perStop);
            this.driverForm
              .get('perMileTeam')
              .patchValue(this.payrollCompany.team.perMileTeam);
            this.driverForm
              .get('commissionTeam')
              .patchValue(this.payrollCompany.team.commissionTeam);

            this.driverForm
              .get('mvrExpiration')
              .patchValue(this.payrollCompany.mvrExpiration);

            this.driverForm.get('mailNotificationGeneral').patchValue(true);
            this.driverForm.get('mailNotificationPayroll').patchValue(true);
            this.driverForm.get('smsNotificationGeneral').patchValue(false);
            this.driverForm.get('smsNotificationPayroll').patchValue(false);
            this.driverForm.get('pushNotificationGeneral').patchValue(false);
            this.driverForm.get('pushNotificationPayroll').patchValue(false);

            this.driverForm.get('useTruckAssistAch').patchValue(false);

            this.driverForm.get('twic').patchValue(false);

            this.driverForm.get('isOwner').patchValue(false);

            if (this.fleetType === 'Combined') {
              this.driverForm.get('teamDriver').patchValue(true);
              this.driverForm.get('soloDriver').patchValue(true);
            }

            this.offDutyLocations.clear();
            this.addNewAfterSave = false;
            this.selectedPayType = null;
            this.selectedBank = null;
            this.selectedOffDutyAddressArray = [];
            this.selectedAddress = null;
          }
        },
        error: () =>
          this.notificationService.error(
            `${driverFullName}`,
            'FAILED TO CREATE DRIVER'
          ),
      });
  }

  private updateDriver(id: number): void {
    const {
      soloEmptyMile,
      soloLoadedMile,
      soloPerStop,
      perMileSolo,
      commissionSolo,

      teamEmptyMile,
      teamLoadedMile,
      teamPerStop,
      perMileTeam,
      commissionTeam,

      soloDriver,
      teamDriver,

      mailNotificationGeneral,
      pushNotificationGeneral,
      smsNotificationGeneral,

      mailNotificationPayroll,
      pushNotificationPayroll,
      smsNotificationPayroll,

      address,
      addressUnit,
      bussinesName,
      ...form
    } = this.driverForm.value;

    const newData: UpdateDriverCommand = {
      id: id,
      ...form,
      dateOfBirth: convertDateToBackend(
        this.driverForm.get('dateOfBirth').value
      ),
      ownerId:
        this.driverForm.get('ownerType').value === 'Sole Proprietor'
          ? null
          : this.owner
          ? this.owner.id
          : null,
      ownerType: !this.driverForm.get('isOwner').value
        ? null
        : this.driverForm.get('ownerType').value === 'Sole Proprietor'
        ? 2
        : 1,
      bussinesName:
        this.driverForm.get('ownerType').value === 'Sole Proprietor'
          ? null
          : this.driverForm.get('bussinesName').value,
      address: {
        ...this.selectedAddress,
        addressUnit: this.driverForm.get('addressUnit').value,
      },
      bankId: this.selectedBank ? this.selectedBank.id : null,
      payType: this.selectedPayType ? this.selectedPayType.id : null,
      solo: {
        emptyMile: !this.hasMilesSameRate
          ? ['Solo', 'Combined'].includes(this.fleetType)
            ? this.fleetType === 'Combined'
              ? soloDriver
                ? soloEmptyMile
                  ? parseFloat(soloEmptyMile)
                  : null
                : null
              : soloEmptyMile
              ? parseFloat(soloEmptyMile)
              : null
            : null
          : null,
        loadedMile: !this.hasMilesSameRate
          ? ['Solo', 'Combined'].includes(this.fleetType)
            ? this.fleetType === 'Combined'
              ? soloDriver
                ? soloLoadedMile
                  ? parseFloat(soloLoadedMile)
                  : null
                : null
              : soloEmptyMile
              ? parseFloat(soloEmptyMile)
              : null
            : null
          : null,
        perStop: !this.hasMilesSameRate
          ? ['Solo', 'Combined'].includes(this.fleetType)
            ? this.fleetType === 'Combined'
              ? soloDriver
                ? soloPerStop
                  ? convertThousanSepInNumber(soloPerStop)
                  : null
                : null
              : soloPerStop
              ? convertThousanSepInNumber(soloPerStop)
              : null
            : null
          : null,
      },
      perMileSolo: this.hasMilesSameRate
        ? ['Solo', 'Combined'].includes(this.fleetType)
          ? this.fleetType === 'Combined'
            ? soloDriver
              ? perMileSolo
                ? parseFloat(perMileSolo)
                : null
              : null
            : perMileSolo
            ? parseFloat(perMileSolo)
            : null
          : null
        : null,
      team: {
        emptyMile: !this.hasMilesSameRate
          ? ['Team', 'Combined'].includes(this.fleetType)
            ? this.fleetType === 'Combined'
              ? teamDriver
                ? teamEmptyMile
                  ? parseFloat(teamEmptyMile)
                  : null
                : null
              : teamEmptyMile
              ? parseFloat(teamEmptyMile)
              : null
            : null
          : null,
        loadedMile: !this.hasMilesSameRate
          ? ['Team', 'Combined'].includes(this.fleetType)
            ? this.fleetType === 'Combined'
              ? teamDriver
                ? teamLoadedMile
                  ? parseFloat(teamLoadedMile)
                  : null
                : null
              : teamLoadedMile
              ? parseFloat(teamLoadedMile)
              : null
            : null
          : null,
        perStop: !this.hasMilesSameRate
          ? ['Team', 'Combined'].includes(this.fleetType)
            ? this.fleetType === 'Combined'
              ? teamDriver
                ? teamPerStop
                  ? convertThousanSepInNumber(teamPerStop)
                  : null
                : null
              : teamPerStop
              ? convertThousanSepInNumber(teamPerStop)
              : null
            : null
          : null,
      },
      perMileTeam: this.hasMilesSameRate
        ? ['Team', 'Combined'].includes(this.fleetType)
          ? this.fleetType === 'Combined'
            ? teamDriver
              ? perMileTeam
                ? parseFloat(perMileTeam)
                : null
              : null
            : perMileTeam
            ? parseFloat(perMileTeam)
            : null
          : null
        : null,
      commissionSolo: ['Solo', 'Combined'].includes(this.fleetType)
        ? this.fleetType === 'Combined'
          ? soloDriver
            ? commissionSolo
              ? parseFloat(commissionSolo)
              : null
            : null
          : commissionSolo
          ? parseFloat(commissionSolo)
          : null
        : null,
      commissionTeam: ['Team', 'Combined'].includes(this.fleetType)
        ? this.fleetType === 'Combined'
          ? teamDriver
            ? commissionTeam
              ? parseFloat(commissionTeam)
              : null
            : null
          : commissionTeam
          ? parseFloat(commissionTeam)
          : null
        : null,
      general: {
        mailNotification: mailNotificationGeneral,
        pushNotification: pushNotificationGeneral,
        smsNotification: smsNotificationGeneral,
      },
      payroll: {
        mailNotification: mailNotificationPayroll,
        pushNotification: pushNotificationPayroll,
        smsNotification: smsNotificationPayroll,
      },
      twicExpDate: this.driverForm.get('twic').value
        ? convertDateToBackend(this.driverForm.get('twicExpDate').value)
        : null,
      offDutyLocations: this.premmapedOffDutyLocation(),
      fleetType: this.fleetType,
      soloDriver: !this.driverForm.get('isOwner').value
        ? this.fleetType === 'Combined'
          ? soloDriver
          : false
        : null,
      teamDriver: !this.driverForm.get('isOwner').value
        ? this.fleetType === 'Combined'
          ? teamDriver
          : false
        : null,
    };

    let driverFullName =
      this.driverForm.get('firstName').value +
      ' ' +
      this.driverForm.get('lastName').value;

    this.driverTService
      .updateDriver(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Changes saved for "${driverFullName}" `,
            'Success'
          );
        },
        error: () =>
          this.notificationService.error(
            `Failed to save changes for "${driverFullName}" `,
            'Error'
          ),
      });
  }

  private editDriverById(id: number): void {
    this.driverTService
      .getDriverById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DriverResponse) => {
          this.driverForm.patchValue({
            firstName: res.firstName,
            lastName: res.lastName,
            phone: res.phone,
            email: res.email,
            address: res.address ? res.address.address : null,
            addressUnit: res.address ? res.address.addressUnit : null,
            dateOfBirth: convertDateFromBackend(res.dateOfBirth),
            ssn: res.ssn,
            mvrExpiration: res.mvrExpiration,
            bankId: res.bank ? res.bank.name : null,
            account: res.account,
            routing: res.routing,
            payType: res.payType ? res.payType.name : null,
            soloPerStop: res.solo.perStop
              ? convertNumberInThousandSep(res.solo.perStop)
              : null,
            soloDriver: res.soloDriver,
            teamPerStop: res.team.perStop
              ? convertNumberInThousandSep(res.team.perStop)
              : null,
            teamDriver: res.teamDriver,
            commissionSolo: res.commissionSolo,
            commissionTeam: res.commissionTeam,
            ownerId: res.owner ? res.owner.id : null,
            useTruckAssistAch: res.useTruckAssistAch,
            isOwner: res.owner ? true : false,
            ownerType: res.owner
              ? res.owner?.ownerType?.name
                ? res.owner?.ownerType?.name.includes('Proprietor')
                  ? 'Sole'.concat(' ', res.owner?.ownerType?.name)
                  : res.owner?.ownerType?.name
                : null
              : null,
            ein: res.owner
              ? res.owner?.ownerType?.name.includes('Proprietor')
                ? null
                : res.owner?.ssnEin
              : null,
            bussinesName: res.owner
              ? res.owner?.ownerType?.name.includes('Proprietor')
                ? null
                : res.owner?.name
              : null,
            emergencyContactName: res.emergencyContactName,
            emergencyContactPhone: res.emergencyContactPhone,
            emergencyContactRelationship: res.emergencyContactRelationship,

            note: res.note,
            avatar: res.avatar,

            twic: res.twic,
            twicExpDate: convertDateFromBackend(res.twicExpDate),
            fuelCard: res.fuelCard,

            mailNotificationGeneral: res.general.mailNotification,
            pushNotificationGeneral: res.general.pushNotification,
            smsNotificationGeneral: res.general.smsNotification,

            mailNotificationPayroll: res.payroll.mailNotification,
            pushNotificationPayroll: res.payroll.pushNotification,
            smsNotificationPayroll: res.payroll.smsNotification,
          });

          this.driverForm
            .get('soloLoadedMile')
            .patchValue(res.solo.loadedMile, { emitEvent: false });

          this.driverForm
            .get('teamLoadedMile')
            .patchValue(res.team.loadedMile, { emitEvent: false });

          this.driverForm
            .get('soloEmptyMile')
            .patchValue(res.solo.emptyMile, { emitEvent: false });

          this.driverForm
            .get('teamEmptyMile')
            .patchValue(res.team.emptyMile, { emitEvent: false });

          res.firstName =
            res.firstName.charAt(0).toUpperCase() + res.firstName.slice(1);

          res.lastName =
            res.lastName.charAt(0).toUpperCase() + res.lastName.slice(1);

          this.driverFullName = res.firstName.concat(' ', res.lastName);

          this.selectedBank = res.bank ? res.bank : null;

          this.selectedPayType = res.payType
            ? res.payType.id === 0
              ? null
              : res.payType
            : null;

          this.onHandleAddress({
            address: res.address,
            valid: res.address ? true : false,
          });

          this.modalService.changeModalStatus({
            name: 'deactivate',
            status: res.status === 1 ? false : true,
          });

          this.driverStatus = res.status === 1 ? false : true;

          this.fleetType = res.fleetType.name;

          this.handlingPayrollFleetType(this.fleetType);

          if (res.owner) {
            if (this.driverForm.get('ein').value) {
              this.einNumberChange();
            }

            const activeOwnerTab = this.ownerTabs
              .map((item) => {
                return {
                  ...item,
                  checked: res.owner?.ownerType.name === item.name,
                };
              })
              .find((item) => item.checked);

            if (activeOwnerTab) {
              this.tabOwnerChange(activeOwnerTab);
            }
          }

          if (res.offDutyLocations.length) {
            for (let index = 0; index < res.offDutyLocations.length; index++) {
              this.offDutyLocations.push(
                this.createOffDutyLocation({
                  id: res.offDutyLocations[index].id,
                  nickname: res.offDutyLocations[index].nickname,
                  address: res.offDutyLocations[index].address.address,
                  city: res.offDutyLocations[index].address.city,
                  state: res.offDutyLocations[index].address.state,
                  stateShortName:
                    res.offDutyLocations[index].address.stateShortName,
                  country: res.offDutyLocations[index].address.country,
                  zipCode: res.offDutyLocations[index].address.zipCode,
                  addressUnit: res.offDutyLocations[index].address.addressUnit,
                  street: res.offDutyLocations[index].address.street,
                  streetNumber:
                    res.offDutyLocations[index].address.streetNumber,
                })
              );
              this.selectedOffDutyAddressArray[index] = res.address;
            }
          }
        },
        error: () => {
          this.notificationService.error("Driver can't be loaded.", 'Error:');
        },
      });
  }

  private deleteDriverById(id: number): void {
    this.driverTService
      .deleteDriverById(id, !this.driverStatus ? 'active' : 'inactive')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Driver successfully deleted.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Driver can't be deleted.", 'Error:');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
