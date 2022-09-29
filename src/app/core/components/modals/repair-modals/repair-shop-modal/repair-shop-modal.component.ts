import { RepairOrderModalComponent } from '../repair-order-modal/repair-order-modal.component';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AddressEntity,
  CreateRepairShopCommand,
  CreateResponse,
  RepairShopModalResponse,
  RepairShopResponse,
  UpdateRepairShopCommand,
} from 'appcoretruckassist';
import moment from 'moment';
import { distinctUntilChanged, takeUntil, Subject } from 'rxjs';
import { RepairTService } from '../../../repair/state/repair.service';
import {
  accountBankValidation,
  addressUnitValidation,
  addressValidation,
  bankValidation,
  phoneExtension,
  phoneFaxRegex,
  repairShopValidation,
  routingBankValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { BankVerificationService } from '../../../../services/BANK-VERIFICATION/bankVerification.service';
import { NotificationService } from '../../../../services/notification/notification.service';

@Component({
  selector: 'app-repair-shop-modal',
  templateUrl: './repair-shop-modal.component.html',
  styleUrls: ['./repair-shop-modal.component.scss'],
  providers: [ModalService, BankVerificationService],
})
export class RepairShopModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() editData: any;
  public repairShopForm: FormGroup;

  public isRepairShopFavourite: boolean = false;
  public isPhoneExtExist: boolean = false;

  public selectedAddress: AddressEntity = null;

  public labelsBank: any[] = [];
  public selectedBank: any = null;
  public isBankSelected: boolean = false;

  public services: any[] = [];
  public openHoursDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private shopService: RepairTService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private bankVerificationService: BankVerificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getRepairShopModalDropdowns();
    this.onBankSelected();

    if (this.editData?.id) {
      this.editRepairShopById(this.editData.id);
    }

    if (!this.editData || this.editData?.canOpenModal) {
      for (let i = 0; i < this.openHoursDays.length; i++) {
        this.addOpenHours(this.openHoursDays[i], i !== 0, i);
      }
    }
  }

  private createForm() {
    this.repairShopForm = this.formBuilder.group({
      name: [null, [Validators.required, ...repairShopValidation]],
      pinned: [null],
      phone: [null, [Validators.required, phoneFaxRegex]],
      phoneExt: [null, [...phoneExtension]],
      email: [null],
      address: [null, [Validators.required, ...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      companyOwned: [false],
      openHours: this.formBuilder.array([]),
      bankId: [null, [...bankValidation]],
      routing: [null, routingBankValidation],
      account: [null, accountBankValidation],
      note: [null],
    });

    this.inputService.customInputValidator(
      this.repairShopForm.get('email'),
      'email',
      this.destroy$
    );
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.repairShopForm.reset();
        break;
      }
      case 'save': {
        if (this.repairShopForm.invalid) {
          this.inputService.markInvalid(this.repairShopForm);
          return;
        }
        if (this.editData?.id) {
          this.updateRepairShop(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addRepairShop();
          this.modalService.setModalSpinner({
            action: null,
            status: true,
            clearTimeout: !!this.editData?.canOpenModal,
          });
        }
        break;
      }
      case 'delete': {
        if (this.editData) {
          this.deleteRepairShopById(this.editData.id);
          this.modalService.setModalSpinner({ action: 'delete', status: true });
        }
        break;
      }
      default: {
        break;
      }
    }

    if (this.editData?.canOpenModal) {
      switch (this.editData?.key) {
        case 'repair-modal': {
          this.modalService.setProjectionModal({
            action: 'close',
            payload: { key: this.editData?.key, value: null },
            component: RepairOrderModalComponent,
            size: 'large',
            type: this.editData?.type,
          });
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  public get openHours(): FormArray {
    return this.repairShopForm.get('openHours') as FormArray;
  }

  private createOpenHour(
    day: string,
    isDay: boolean,
    dayOfWeek: number,
    startTime: any = moment('8:00:00 AM', 'HH:mm:SS A').toDate(),
    endTime: any = moment('5:00:00 PM', 'HH:mm:SS A').toDate()
  ): FormGroup {
    return this.formBuilder.group({
      isDay: [isDay],
      dayOfWeek: [dayOfWeek],
      dayLabel: [day],
      startTime: [startTime],
      endTime: [endTime],
    });
  }

  public addOpenHours(
    day: string,
    isDay: boolean = false,
    dayOfWeek: number,
    startTime?: any,
    endTime?: any
  ) {
    if (!isDay) {
      this.openHours.push(this.createOpenHour(day, isDay, dayOfWeek));
    } else {
      this.openHours.push(
        this.createOpenHour(day, isDay, dayOfWeek, startTime, endTime)
      );
    }
  }

  public openHourDayAction(event: boolean, index: number) {
    this.openHours
      .at(index)
      .get('isDay')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (!value) {
          this.openHours
            .at(index)
            .get('startTime')
            .patchValue(moment('8:00:00 AM', 'HH:mm:SS A').toDate());
          this.openHours
            .at(index)
            .get('endTime')
            .patchValue(moment('8:00:00 AM', 'HH:mm:SS A').toDate());
        }
      });
  }

  public pickedServices() {
    return this.services.filter((item) => item.active).length;
  }

  public onHandleAddress(event: {
    address: AddressEntity | any;
    valid: boolean;
  }): void {
    if (event.valid) {
      this.selectedAddress = event.address;
    }
  }

  public favouriteRepairShop() {
    this.isRepairShopFavourite = !this.isRepairShopFavourite;
    this.repairShopForm.get('pinned').patchValue(this.isRepairShopFavourite);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'bank': {
        this.selectedBank = event;
        if (!event) {
          this.repairShopForm.get('bankId').patchValue(null);
        }
        break;
      }
      default: {
        break;
      }
    }
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
        error: () => {
          this.notificationService.error("Can't add new bank", 'Error');
        },
      });
  }

  private onBankSelected(): void {
    this.repairShopForm
      .get('bankId')
      .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.isBankSelected = this.bankVerificationService.onSelectBank(
          this.selectedBank ? this.selectedBank.name : value,
          this.repairShopForm.get('routing'),
          this.repairShopForm.get('account')
        );
      });
  }

  private editRepairShopById(id: number) {
    this.shopService
      .getRepairShopById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: RepairShopResponse) => {
          this.repairShopForm.patchValue({
            name: res.name,
            pinned: res.pinned,
            phone: res.phone,
            phoneExt: res.phoneExt,
            email: res.email,
            address: res.address.address,
            addressUnit: res.address.addressUnit,
            companyOwned: res.companyOwned,
            openHours: [],
            bankId: res.bank ? res.bank.name : null,
            routing: res.routing,
            account: res.account,
            note: res.note,
          });

          this.selectedAddress = res.address;
          this.selectedBank = res.bank;
          this.isPhoneExtExist = !!res.phoneExt;
          this.isRepairShopFavourite = res.pinned;

          this.services = res.serviceTypes.map((item) => {
            return {
              id: item.serviceType.id,
              serviceType: item.serviceType.name,
              svg: `assets/svg/common/repair-services/${item.logoName}`,
              active: item.active,
            };
          });

          res.openHours.forEach((el) => {
            this.addOpenHours(
              el.dayOfWeek,
              !!(el.startTime && el.endTime),
              this.openHoursDays.indexOf(el.dayOfWeek),
              moment(el.startTime, 'HH:mm:SS A').toDate(),
              moment(el.endTime, 'HH:mm:SS A').toDate()
            );
          });
        },
        error: () => {
          this.notificationService.error(
            "Repair shop can't be loaded",
            'Error: '
          );
        },
      });
  }

  private addRepairShop() {
    let { address, addressUnit, openHours, bankId, ...form } =
      this.repairShopForm.value;

    openHours = openHours.map((item) => {
      if (item.isDay) {
        return {
          dayOfWeek: item.dayOfWeek,
          startTime: item.startTime,
          endTime: item.endTime,
        };
      } else {
        return {
          dayOfWeek: item.dayOfWeek,
          startTime: null,
          endTime: null,
        };
      }
    });

    const newData: CreateRepairShopCommand = {
      ...form,
      address: { ...this.selectedAddress, addressUnit: addressUnit },
      bankId: this.selectedBank ? this.selectedBank.id : null,
      openHours: openHours,
      serviceTypes: this.services.map((item) => {
        return {
          serviceType: item.serviceType,
          active: item.active,
        };
      }),
    };

    this.shopService
      .addRepairShop(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Repair shop added', 'Success: ');
        },
        error: () => {
          this.notificationService.error(
            "Repair shop can't be added",
            'Error: '
          );
        },
      });
  }

  private updateRepairShop(id: number) {
    let { address, addressUnit, openHours, bankId, ...form } =
      this.repairShopForm.value;

    openHours = openHours.map((item) => {
      if (item.isDay) {
        return {
          dayOfWeek: item.dayOfWeek,
          startTime: item.startTime,
          endTime: item.endTime,
        };
      } else {
        return {
          dayOfWeek: item.dayOfWeek,
          startTime: null,
          endTime: null,
        };
      }
    });

    const newData: UpdateRepairShopCommand = {
      id: id,
      ...form,
      bankId: this.selectedBank ? this.selectedBank.id : null,
      address: { ...this.selectedAddress, addressUnit: addressUnit },
      openHours: openHours,
      serviceTypes: this.services.map((item) => {
        return {
          serviceType: item.serviceType,
          active: item.active,
        };
      }),
    };

    this.shopService
      .updateRepairShop(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Repair shop successfully updated',
            'Success: '
          );
        },
        error: () => {
          this.notificationService.error(
            "Repair shop can't be updated",
            'Error: '
          );
        },
      });
  }

  private deleteRepairShopById(id: number) {
    this.shopService
      .deleteRepairShopById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Repair shop successfully deleted',
            'Success: '
          );
        },
        error: () => {
          this.notificationService.error(
            "Repair shop can't be deleted",
            'Error: '
          );
        },
      });
  }

  private getRepairShopModalDropdowns() {
    return this.shopService
      .getRepairShopModalDropdowns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: RepairShopModalResponse) => {
          this.labelsBank = res.banks;

          this.services = res.serviceTypes.map((item) => {
            return {
              id: item.serviceType.id,
              serviceType: item.serviceType.name,
              svg: `assets/svg/common/repair-services/${item.logoName}`,
              active: false,
            };
          });
        },
        error: () => {
          this.notificationService.error(
            "Repair shop can't get dropdowns",
            'Error: '
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
