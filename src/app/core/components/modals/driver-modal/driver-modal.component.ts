import { FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { card_modal_animation } from '../../shared/animations/card-modal.animation';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import {
  AddressEntity,
  CheckOwnerSsnEinResponse,
  CreateDriverCommand,
  DriverResponse,
  GetDriverModalResponse,
  UpdateDriverCommand,
} from 'appcoretruckassist';
import {
  accountBankRegex,
  einNumberRegex,
  routingBankRegex,
  ssnNumberRegex,
  emailRegex,
  phoneRegex,
  bankRoutingValidator,
  mileValidation,
  perStopValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TaUploadFileService } from '../../shared/ta-upload-files/ta-upload-file.service';
import { DriverTService } from '../../driver/state/driver.service';
import { HttpResponseBase } from '@angular/common/http';
import {
  convertDateFromBackend,
  convertDateToBackend,
  convertNumberInThousandSep,
  convertThousanSepInNumber,
} from 'src/app/core/utils/methods.calculations';
import {
  createBase64,
  getStringFromBase64,
} from 'src/app/core/utils/base64.image';
import { TaTabSwitchComponent } from '../../shared/ta-tab-switch/ta-tab-switch.component';
import { DropZoneConfig } from '../../shared/ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { FormService } from 'src/app/core/services/form/form.service';
import { TaInputResetService } from '../../shared/ta-input/ta-input-reset.service';
@Component({
  selector: 'app-driver-modal',
  templateUrl: './driver-modal.component.html',
  styleUrls: ['./driver-modal.component.scss'],
  animations: [
    tab_modal_animation('animationTabsModal'),
    card_modal_animation('showHidePayroll', '6px'),
  ],
  providers: [ModalService, FormService],
})
export class DriverModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;
  @ViewChild(TaTabSwitchComponent) tabSwitch: TaTabSwitchComponent;
  public driverForm: FormGroup;
  public labelsBank: any[] = [];
  public labelsPayType: any[] = [];

  public isOwner: boolean = false;

  public selectedTab: number = 1;
  public selectedOwnerTab: any = null;
  public selectedAddress: AddressEntity = null;
  public selectedBank: any = null;
  public isBankSelected: boolean = false;
  public selectedPayType: any = null;

  public driverFullName: string = null;

  public owner: CheckOwnerSsnEinResponse = null;

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

  public driverStatus: boolean = true;

  public documents: any[] = [];

  public dropZoneConfig: DropZoneConfig = {
    dropZoneType: 'files',
    dropZoneSvg: 'assets/svg/common/ic_files_dropzone.svg',
    dropZoneAvailableFiles: 'application/pdf, application/png, application/jpg',
    multiple: true,
    globalDropZone: false,
  };

  public isDirty: boolean;

  public addNewAfterSave: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private inputServiceReset: TaInputResetService,
    private driverTService: DriverTService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private uploadFileService: TaUploadFileService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.onPayTypeSelected();
    this.onTwicTypeSelected();
    this.getDriverDropdowns();
    this.validateMiles();
    this.isCheckedOwner();

    if (this.editData) {
      this.editDriverById(this.editData.id);
    } else {
      this.onIncludePayroll();
    }
  }

  public onModalAction(data: { action: string; bool: boolean }): void {
    if (data.action === 'close') {
      this.driverForm.reset();
    }
    // Change Driver Status
    if (data.action === 'deactivate' && this.editData) {
      this.driverTService
        .changeDriverStatus(
          this.editData.id,
          !this.driverStatus ? 'active' : 'inactive'
        )
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res: HttpResponseBase) => {
            if (res.status === 200 || res.status === 204) {
              this.driverStatus = !this.driverStatus;

              this.modalService.changeModalStatus({
                name: 'deactivate',
                status: this.driverStatus,
              });

              this.notificationService.success(
                `Driver status changed to ${
                  this.driverStatus ? 'deactivate' : 'activate'
                }.`,
                'Success:'
              );

              this.modalService.setModalSpinner({
                action: null,
                status: false,
              });
            }
          },
          error: () => {
            this.notificationService.error(
              "Driver status can't be changed.",
              'Error:'
            );
          },
        });
    } else if (data.action === 'save and add new') {
      this.addDriver();
      this.modalService.setModalSpinner({
        action: 'save and add new',
        status: true,
      });
      this.addNewAfterSave = true;
    } else if (data.action === 'save') {
      // Save & Update
      if (this.driverForm.invalid) {
        this.inputService.markInvalid(this.driverForm);
        return;
      }
      if (this.editData) {
        this.updateDriver(this.editData.id);
        this.modalService.setModalSpinner({ action: null, status: true });
      } else {
        this.addDriver();
        this.modalService.setModalSpinner({ action: null, status: true });
      }
    }
    // Delete
    else if (data.action === 'delete' && this.editData) {
      this.deleteDriverById(this.editData.id);
      this.modalService.setModalSpinner({ action: 'delete', status: true });
    }
  }

  private createForm(): void {
    this.driverForm = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phone: [null, [Validators.required, phoneRegex]],
      email: [null, [Validators.required, emailRegex]],
      address: [null, [Validators.required]],
      addressUnit: [null, [Validators.maxLength(6)]],
      dateOfBirth: [null, [Validators.required]],
      ssn: [null, [Validators.required, ssnNumberRegex]],
      mvrExpiration: [5, Validators.required],
      bankId: [null],
      account: [null],
      routing: [null],
      payType: [null, Validators.required],
      useTruckAssistAch: [false],
      soloEmptyMile: [null, mileValidation],
      soloLoadedMile: [null, mileValidation],
      soloPerStop: [null, perStopValidation],
      teamEmptyMile: [null, mileValidation],
      teamLoadedMile: [null, mileValidation],
      teamPerStop: [null, perStopValidation],
      commissionSolo: [25],
      commissionTeam: [25],
      isOwner: [false],
      ownerId: [null],
      ownerType: ['Sole Proprietor'],
      ein: [null],
      bussinesName: [null],
      offDutyLocations: this.formBuilder.array([]),
      emergencyContactName: [null, Validators.required],
      emergencyContactPhone: [null, [phoneRegex, Validators.required]],
      emergencyContactRelationship: [null],
      note: [null],
      avatar: [null],
      twic: [false],
      twicExpDate: [null],
      fuelCard: [null],
      mailNotificationGeneral: [true],
      pushNotificationGeneral: [false],
      smsNotificationGeneral: [false],
      mailNotificationPayroll: [true],
      pushNotificationPayroll: [false],
      smsNotificationPayroll: [false],
    });

    this.formService.checkFormChange(this.driverForm);

    this.formService.formValueChange$
      .pipe(untilDestroyed(this))
      .subscribe((isFormChange: boolean) => {
        isFormChange ? (this.isDirty = false) : (this.isDirty = true);
      });
  }

  public get offDutyLocations(): FormArray {
    return this.driverForm.get('offDutyLocations') as FormArray;
  }

  private createOffDutyLocation(): FormGroup {
    return this.formBuilder.group({
      id: [0],
      nickname: [null],
      address: [null],
      city: [null],
      state: [null],
      stateShortName: [null],
      country: [null],
      zipCode: [null],
      addressUnit: [null],
      street: [null],
      streetNumber: [null],
    });
  }

  public addOffDutyLocation(event: any) {
    if (event) {
      this.offDutyLocations.push(this.createOffDutyLocation());
    }
  }

  public removeOffDutyLocation(id: number) {
    this.offDutyLocations.removeAt(id);
  }

  private onIncludePayroll(): void {
    this.driverForm
      .get('useTruckAssistAch')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(
            this.driverForm.get('bankId'),
            true,
            [Validators.required]
          );
        } else {
          this.inputService.changeValidators(
            this.driverForm.get('bankId'),
            false
          );
        }
      });
  }

  private onBankSelected(): void {
    this.driverForm
      .get('bankId')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.isBankSelected = true;
          this.inputService.changeValidators(
            this.driverForm.get('routing'),
            true,
            routingBankRegex
          );
          this.routingNumberTyping();
          this.inputService.changeValidators(
            this.driverForm.get('account'),
            true,
            accountBankRegex
          );
        } else {
          this.isBankSelected = false;
          this.inputService.changeValidators(
            this.driverForm.get('routing'),
            false
          );
          this.inputService.changeValidators(
            this.driverForm.get('account'),
            false
          );
        }
      });
  }

  private routingNumberTyping() {
    this.driverForm
      .get('routing')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value && value.split('').length > 8) {
          if (bankRoutingValidator(value)) {
            this.driverForm.get('routing').setErrors(null);
          } else {
            this.driverForm.get('routing').setErrors({ invalid: true });
          }
        }
      });
  }

  private onPayTypeSelected(): void {
    this.driverForm
      .get('payType')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value?.toLowerCase() === 'per mile') {
          this.inputService.changeValidators(
            this.driverForm.get('soloEmptyMile')
          );
          this.inputService.changeValidators(
            this.driverForm.get('soloLoadedMile')
          );

          this.inputService.changeValidators(
            this.driverForm.get('teamEmptyMile')
          );
          this.inputService.changeValidators(
            this.driverForm.get('teamLoadedMile')
          );

          this.driverForm.get('commissionSolo').patchValue(null);
          this.driverForm.get('commissionTeam').patchValue(null);
        } else {
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

          this.driverForm.get('commissionSolo').patchValue(25);
          this.driverForm.get('commissionTeam').patchValue(25);
        }
      });
  }

  private onTwicTypeSelected(): void {
    this.driverForm
      .get('twic')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
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

  public onHandleAddressFormArray(
    event: { address: AddressEntity | any; valid: boolean },
    index: number
  ) {
    const address: AddressEntity = event.address;
    if (!event.valid) {
      this.offDutyLocations.at(index).setErrors({ invalid: true });
    } else {
      this.offDutyLocations.at(index).patchValue({
        address: address.address,
        city: address.city,
        state: address.state,
        stateShortName: address.stateShortName,
        country: address.country,
        zipCode: address.zipCode,
        addressUnit: this.offDutyLocations.at(index).get('addressUnit').value,
        street: address.street,
        streetNumber: address.streetNumber,
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

  private isCheckedOwner() {
    this.driverForm
      .get('isOwner')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value && !this.driverForm.get('ownerType').value) {
          this.driverForm.get('ownerType').patchValue('Sole Proprietor');
        }
      });
  }

  public onFilesEvent(event: any) {
    this.documents = event.files;
  }

  private einNumberChange() {
    this.driverForm
      .get('ein')
      .valueChanges.pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe((value) => {
        if (value) {
          this.driverTService
            .checkOwnerEinNumber(value)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: CheckOwnerSsnEinResponse) => {
                this.owner = res?.name ? res : null;

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
        }
      });
  }

  public openCloseCheckboxCard(event: any) {
    if (this.driverForm.get('ownerId').value) {
      event.preventDefault();
      event.stopPropagation();
      this.driverForm.get('ownerId').setValue(false);
    }
  }

  private getDriverDropdowns(): void {
    this.driverTService
      .getDriverDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: GetDriverModalResponse) => {
          this.labelsBank = data.banks;
          this.labelsPayType = data.payTypes;
        },
        error: (err) => {
          this.notificationService.error(
            "Driver's dropdowns can't be loaded.",
            'Error:'
          );
        },
      });
  }

  public validateMiles() {
    this.driverForm
      .get('soloEmptyMile')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value > 10) {
          this.driverForm.get('soloEmptyMile').setErrors({ invalid: true });
        } else {
          this.driverForm.get('soloEmptyMile').setErrors(null);
        }
      });

    this.driverForm
      .get('soloLoadedMile')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value > 10) {
          this.driverForm.get('soloLoadedMile').setErrors({ invalid: true });
        } else {
          this.driverForm.get('soloLoadedMile').setErrors(null);
        }
      });

    this.driverForm
      .get('teamEmptyMile')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value > 10) {
          this.driverForm.get('teamEmptyMile').setErrors({ invalid: true });
        } else {
          this.driverForm.get('teamEmptyMile').setErrors(null);
        }
      });

    this.driverForm
      .get('teamLoadedMile')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value > 10) {
          this.driverForm.get('teamLoadedMile').setErrors({ invalid: true });
        } else {
          this.driverForm.get('teamLoadedMile').setErrors(null);
        }
      });
  }

  private addDriver(): void {
    const {
      soloEmptyMile,
      soloLoadedMile,
      soloPerStop,

      teamEmptyMile,
      teamLoadedMile,
      teamPerStop,

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
        addressUnit: this.driverForm.get('addressUnit').value,
      },
      bankId: this.selectedBank ? this.selectedBank.id : null,
      payType: this.selectedPayType ? this.selectedPayType.id : null,
      solo: {
        emptyMile: soloEmptyMile
          ? convertThousanSepInNumber(soloEmptyMile)
          : null,
        loadedMile: soloLoadedMile
          ? convertThousanSepInNumber(soloLoadedMile)
          : null,
        perStop: soloPerStop ? convertThousanSepInNumber(soloPerStop) : null,
      },
      team: {
        emptyMile: teamEmptyMile
          ? convertThousanSepInNumber(teamEmptyMile)
          : null,
        loadedMile: teamLoadedMile
          ? convertThousanSepInNumber(teamLoadedMile)
          : null,
        perStop: teamPerStop ? convertThousanSepInNumber(teamPerStop) : null,
      },
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
      commissionSolo: parseInt(this.driverForm.get('commissionSolo').value),
      commissionTeam: parseInt(this.driverForm.get('commissionTeam').value),
      twicExpDate: this.driverForm.get('twic').value
        ? convertDateToBackend(this.driverForm.get('twicExpDate').value)
        : null,
      offDutyLocations: this.premmapedOffDutyLocation(),
    };
    console.log(newData);
    this.driverTService
      .addDriver(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Driver successfully added.',
            'Success:'
          );

          this.modalService.setModalSpinner({
            action: this.addNewAfterSave ? 'save and add new' : null,
            status: false,
          });

          if (this.addNewAfterSave) {
            this.driverForm.reset();
            this.inputServiceReset.resetInputSubject.next(true);
            this.driverForm.get('ownerType').patchValue(null);
            this.driverForm.get('payType').patchValue(null);
            this.driverForm.get('commissionSolo').patchValue(25);
            this.driverForm.get('commissionTeam').patchValue(25);
            this.driverForm.get('mvrExpiration').patchValue(5);
            this.driverForm.get('mailNotificationGeneral').patchValue(true);
            this.driverForm.get('mailNotificationPayroll').patchValue(true);
            this.driverForm.get('smsNotificationGeneral').patchValue(false);
            this.driverForm.get('smsNotificationPayroll').patchValue(false);
            this.driverForm.get('pushNotificationGeneral').patchValue(false);
            this.driverForm.get('pushNotificationPayroll').patchValue(false);
            this.driverForm.get('useTruckAssistAch').patchValue(false);
            this.driverForm.get('twic').patchValue(false);
            this.driverForm.get('isOwner').patchValue(false);

            this.offDutyLocations.clear();
            this.selectedPayType = null;
            this.addNewAfterSave = false;
          }
        },
        error: () =>
          this.notificationService.error("Driver can't be added.", 'Error:'),
      });
  }

  private updateDriver(id: number): void {
    const {
      soloEmptyMile,
      soloLoadedMile,
      soloPerStop,
      teamEmptyMile,
      teamLoadedMile,
      teamPerStop,

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
        emptyMile: soloEmptyMile
          ? convertThousanSepInNumber(soloEmptyMile)
          : null,
        loadedMile: soloLoadedMile
          ? convertThousanSepInNumber(soloLoadedMile)
          : null,
        perStop: soloPerStop ? convertThousanSepInNumber(soloPerStop) : null,
      },
      team: {
        emptyMile: teamEmptyMile
          ? convertThousanSepInNumber(teamEmptyMile)
          : null,
        loadedMile: teamLoadedMile
          ? convertThousanSepInNumber(teamLoadedMile)
          : null,
        perStop: teamPerStop ? convertThousanSepInNumber(teamPerStop) : null,
      },
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
      commissionSolo: parseInt(this.driverForm.get('commissionSolo').value),
      commissionTeam: parseInt(this.driverForm.get('commissionTeam').value),
      twicExpDate: this.driverForm.get('twic').value
        ? convertDateToBackend(this.driverForm.get('twicExpDate').value)
        : null,
      offDutyLocations: this.premmapedOffDutyLocation(),
    };

    this.driverTService
      .updateDriver(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Driver successfully updated.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () =>
          this.notificationService.error("Driver can't be updated.", 'Error:'),
      });
  }

  private editDriverById(id: number): void {
    this.driverTService
      .getDriverById(id)
      .pipe(untilDestroyed(this))
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
            useTruckAssistAch: res.useTruckAssistAch,
            soloEmptyMile: res.solo ? res.solo.emptyMile : null,
            soloLoadedMile: res.solo ? res.solo.loadedMile : null,
            soloPerStop: res.solo.perStop
              ? convertNumberInThousandSep(res.solo.perStop)
              : null,
            teamEmptyMile: res.team ? res.team.emptyMile : null,
            teamLoadedMile: res.team ? res.team.loadedMile : null,
            teamPerStop: res.team.perStop
              ? convertNumberInThousandSep(res.team.perStop)
              : null,
            commissionSolo: res.commissionSolo,
            commissionTeam: res.commissionTeam,
            isOwner: res.owner ? true : false,
            ownerId: res.owner ? res.owner.id : null,
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

          if (res.owner) {
            if (this.driverForm.get('ein').value) {
              this.driverTService
                .checkOwnerEinNumber(this.driverForm.get('ein').value)
                .pipe(untilDestroyed(this))
                .subscribe({
                  next: (res: CheckOwnerSsnEinResponse) => {
                    this.owner = res?.name ? res : null;

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
              console.log(activeOwnerTab);
              this.tabOwnerChange(activeOwnerTab);
            }
          }

          if (res.offDutyLocations.length) {
            for (const offDuty of res.offDutyLocations) {
              this.offDutyLocations.push(
                this.formBuilder.group({
                  id: offDuty.id,
                  nickname: offDuty.nickname,
                  address: offDuty.address.address,
                  city: offDuty.address.city,
                  state: offDuty.address.state,
                  stateShortName: offDuty.address.stateShortName,
                  country: offDuty.address.country,
                  zipCode: offDuty.address.zipCode,
                  addressUnit: offDuty.address.addressUnit,
                  street: offDuty.address.street,
                  streetNumber: offDuty.address.streetNumber,
                })
              );
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
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Driver successfully deleted.',
            'Success:'
          );
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
        },
        error: () => {
          this.notificationService.error("Driver can't be deleted.", 'Error:');
        },
      });
  }

  public onSelectDropdown(event: any, action: string): void {
    switch (action) {
      case 'bank': {
        this.selectedBank = event;
        if (this.selectedBank) {
          this.onBankSelected();
        }
        break;
      }
      case 'paytype': {
        this.selectedPayType = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onUploadImage(event: any) {
    this.driverForm.get('avatar').patchValue(event);
  }

  public onImageValidation(event: boolean) {
    if (event) {
      this.inputService.changeValidators(this.driverForm.get('avatar'));
    } else {
      this.inputService.changeValidators(this.driverForm.get('avatar'), false);
    }
  }

  ngOnDestroy(): void {}
}
