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
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged } from 'rxjs';
import { BankVerificationService } from 'src/app/core/services/bank-verification/bankVerification.service';
import { FormService } from 'src/app/core/services/form/form.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { RepairTService } from '../../../repair/state/repair.service';
import {
  emailRegex,
  phoneRegex,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';

@UntilDestroy()
@Component({
  selector: 'app-repair-shop-modal',
  templateUrl: './repair-shop-modal.component.html',
  styleUrls: ['./repair-shop-modal.component.scss'],
  providers: [ModalService, FormService, BankVerificationService],
})
export class RepairShopModalComponent implements OnInit, OnDestroy {
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
    private formService: FormService,
    private bankVerificationService: BankVerificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getRepairShopModalDropdowns();

    if (this.editData) {
      this.editData = {
        ...this.editData,
        id: 1,
      };
      this.editRepairShopById(this.editData.id);
    }

    if (!this.editData) {
      for (let i = 0; i < this.openHoursDays.length; i++) {
        this.addOpenHours(this.openHoursDays[i], i !== 0, i);
      }
    }
  }

  private createForm() {
    this.repairShopForm = this.formBuilder.group({
      name: [null, Validators.required],
      pinned: [null],
      phone: [null, [Validators.required, phoneRegex]],
      phoneExt: [null, [Validators.maxLength(3)]],
      email: [null, emailRegex],
      address: [null, [Validators.required]],
      addressUnit: [null, [Validators.maxLength(6)]],
      companyOwned: [false],
      openHours: this.formBuilder.array([]),
      bankId: [null],
      routing: [null],
      account: [null],
      note: [null],
    });

    // this.formService.checkFormChange(this.repairShopForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
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
        if (this.editData) {
          this.updateRepairShop(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addRepairShop();
          this.modalService.setModalSpinner({ action: null, status: true });
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
      .valueChanges.pipe(untilDestroyed(this))
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

  public removeOpenHour(id: number) {
    this.openHours.removeAt(id);
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
        if (this.selectedBank) {
          this.onBankSelected();
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public onSaveNewBank(bank: any) {
    this.selectedBank = bank;

    if (this.selectedBank) {
      this.onBankSelected();
    }

    this.bankVerificationService
      .createBank({ name: bank.name })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CreateResponse) => {
          this.notificationService.success(
            'Successfuly add new bank',
            'Success'
          );
          this.selectedBank = {
            id: res.id,
            name: bank.name,
          };
        },
        error: (err) => {
          this.notificationService.error("Can't add new bank", 'Error');
        },
      });
  }

  private onBankSelected(): void {
    this.repairShopForm
      .get('bankId')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        this.isBankSelected = this.bankVerificationService.onSelectBank(
          value,
          this.repairShopForm.get('routing'),
          this.repairShopForm.get('account')
        );
      });
  }

  private editRepairShopById(id: number) {
    this.shopService
      .getRepairShopById(id)
      .pipe(untilDestroyed(this))
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
          this.isPhoneExtExist = res.phoneExt ? true : false;
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

          this.onBankSelected();
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
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success('Repair shop added', 'Success: ');
          this.modalService.setModalSpinner({ action: null, status: false });
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
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Repair shop successfully updated',
            'Success: '
          );
          this.modalService.setModalSpinner({ action: null, status: false });
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
      .deleteRepairById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Repair shop successfully deleted',
            'Success: '
          );
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
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
      .pipe(untilDestroyed(this))
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

  ngOnDestroy(): void {}
}
