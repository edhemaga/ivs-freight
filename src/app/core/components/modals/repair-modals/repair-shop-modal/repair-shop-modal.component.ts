import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AddressEntity,
  CreateRepairShopCommand,
  RepairShopModalResponse,
  RepairShopResponse,
  UpdateRepairShopCommand,
} from 'appcoretruckassist';
import moment from 'moment';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { distinctUntilChanged } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { RepairTService } from '../../../repair/state/repair.service';
import {
  accountBankRegex,
  bankRoutingValidator,
  emailRegex,
  phoneRegex,
  routingBankRegex,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-repair-shop-modal',
  templateUrl: './repair-shop-modal.component.html',
  styleUrls: ['./repair-shop-modal.component.scss'],
  providers: [ModalService],
})
export class RepairShopModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;
  public repairShopForm: FormGroup;

  public isRepairShopFavourite: boolean = false;
  public isPhoneExtExist: boolean = false;

  public selectedAddress: AddressEntity = null;

  public labelsBank: any[] = [];
  public selectedBank: any = null;

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

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private shopService: RepairTService,
    private modalService: ModalService,
    private notificationService: NotificationService
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

    for (let i = 0; i < this.openHoursDays.length; i++) {
      this.addOpenHours(this.openHoursDays[i], i !== 0, i);
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
    dayOfWeek: number
  ): FormGroup {
    return this.formBuilder.group({
      isDay: [isDay],
      dayOfWeek: [dayOfWeek],
      dayLabel: [day],
      startTime: [moment("10:50:00 AM", "HH:mm:SS A").toDate()],
      endTime: [moment("3:28:00 PM", "HH:mm:SS A").toDate()],
    });
  }

  public addOpenHours(day: string, isDay: boolean = false, dayOfWeek: number) {
    this.openHours.push(this.createOpenHour(day, isDay, dayOfWeek));
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

  private onBankSelected(): void {
    this.repairShopForm
      .get('bankId')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (this.selectedBank) {
          this.inputService.changeValidators(
            this.repairShopForm.get('routing'),
            true,
            routingBankRegex
          );
          this.routingNumberTyping();
          this.inputService.changeValidators(
            this.repairShopForm.get('account'),
            true,
            accountBankRegex
          );
        } else {
          this.inputService.changeValidators(
            this.repairShopForm.get('routing'),
            false
          );
          this.inputService.changeValidators(
            this.repairShopForm.get('account'),
            false
          );
        }
      });
  }

  private routingNumberTyping() {
    this.repairShopForm
      .get('routing')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value && value.split('').length > 8) {
          if (bankRoutingValidator(value)) {
            this.repairShopForm.get('routing').setErrors(null);
          } else {
            this.repairShopForm.get('routing').setErrors({ invalid: true });
          }
        }
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
          console.log(res);
          this.selectedAddress = res.address;
          this.selectedBank = res.bank;
          this.isPhoneExtExist = res.phoneExt ? true : false;
          this.isRepairShopFavourite = res.pinned;
          this.services = res.serviceTypes.map((item) => {
            return {
              id: item.serviceType.id,
              serviceType: item.serviceType.name,
              svg: `assets/svg/common/repair-service/${item.logoName}`,
              active: item.active,
            };
          });

          res.openHours.forEach((el, index) => {
            this.openHours.at(index).patchValue({
              isDay: el.startTime && el.endTime,
              dayOfWeek: this.openHoursDays.indexOf(el.dayOfWeek),
              dayLabel: el.dayOfWeek,
              startTime: el.startTime,
              endTime: el.endTime,
            });
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

    this.services = this.services.map((item) => {
      return {
        serviceType: item.serviceType,
        active: item.active,
      };
    });

    const newData: CreateRepairShopCommand = {
      ...form,
      address: { ...this.selectedAddress, addressUnit: addressUnit },
      bankId: this.selectedBank ? this.selectedBank.id : null,
      openHours: openHours,
      serviceTypes: this.services,
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

    this.services = this.services.map((item) => {
      return {
        serviceType: item.serviceType,
        active: item.active,
      };
    });

    const newData: UpdateRepairShopCommand = {
      id: id,
      ...form,
      bankId: this.selectedBank ? this.selectedBank.id : null,
      address: { ...this.selectedAddress, addressUnit: addressUnit },
      openHours: openHours,
      serviceTypes: this.services,
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
          this.labelsBank = res.banks.map((item) => {
            return {
              ...item,
              folder: 'common',
              subFolder: 'banks',
            };
          });
          this.services = res.serviceTypes.map((item) => {
            return {
              id: item.serviceType.id,
              serviceType: item.serviceType.name,
              svg: `assets/svg/common/repair-services/${item.logoName}`,
              active: false,
            };
          });
          console.log(res);
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
