import {
  phoneFaxRegex,
  phoneExtension,
  addressValidation,
  addressUnitValidation,
} from '../../../../shared/ta-input/ta-input.regex-validations';
import { Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AddressEntity,
  CreateRepairShopCommand,
  RepairShopModalResponse,
  RepairShopResponse,
  UpdateRepairShopCommand,
} from 'appcoretruckassist';

import { Subject, takeUntil } from 'rxjs';
import { tab_modal_animation } from '../../../../shared/animations/tabs-modal.animation';
import { ModalService } from '../../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../../shared/ta-input/ta-input.service';
import { NotificationService } from '../../../../../services/notification/notification.service';
import { RepairTService } from '../../../../repair/state/repair.service';
import { FormService } from '../../../../../services/form/form.service';
import {
  repairShopValidation,
  rentValidation,
} from '../../../../shared/ta-input/ta-input.regex-validations';
import {
  convertThousanSepInNumber,
  convertNumberInThousandSep,
} from '../../../../../utils/methods.calculations';

@Component({
  selector: 'app-settings-repairshop-modal',
  templateUrl: './settings-repairshop-modal.component.html',
  styleUrls: ['./settings-repairshop-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  providers: [ModalService, FormService],
})
export class SettingsRepairshopModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public repairShopForm: FormGroup;

  public selectedTab: number = 1;
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

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public selectedAddress: AddressEntity = null;

  public payPeriods: any[] = [];
  public selectedPayPeriod: any = null;

  public weeklyDays: any[] = [];
  public monthlyDays: any[] = [];
  public selectedDay: any = null;

  public isPhoneExtExist: boolean = false;

  public services: any[] = [];

  public isFormDirty: boolean;

  public repairShopName: string = null;

  public isServiceCardOpen: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private repairService: RepairTService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getModalDropdowns();

    if (this.editData?.type === 'edit') {
      this.editRepairShopById(this.editData.id);
    }
  }

  private createForm() {
    this.repairShopForm = this.formBuilder.group({
      companyOwned: [false],
      name: [null, [Validators.required, ...repairShopValidation]],
      address: [null, [Validators.required, ...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      phone: [null, [Validators.required, phoneFaxRegex]],
      phoneExt: [null, [...phoneExtension]],
      email: [null],
      rent: [null, rentValidation],
      payPeriod: [null],
      weeklyDay: [null],
      monthlyDay: [null],
    });

    this.inputService.customInputValidator(
      this.repairShopForm.get('email'),
      'email',
      this.destroy$
    );

    this.formService.checkFormChange(this.repairShopForm);
    this.formService.formValueChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormChange: boolean) => {
        this.isFormDirty = isFormChange;
      });
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    let dotAnimation = document.querySelector('.animation-two-tabs');
    this.animationObject = {
      value: this.selectedTab,
      params: { height: `${dotAnimation.getClientRects()[0].height}px` },
    };
  }

  public onModalAction(data: { action: string; bool: boolean }): void {
    switch (data.action) {
      case 'close': {
        break;
      }
      case 'save': {
        if (this.repairShopForm.invalid || !this.isFormDirty) {
          this.inputService.markInvalid(this.repairShopForm);
          return;
        }
        if (this.editData?.type === 'edit') {
          this.updateRepariShop(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addRepairShop();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        this.deleteRepairShopById(this.editData.id);
        this.modalService.setModalSpinner({ action: 'delete', status: true });
        break;
      }
      default: {
        break;
      }
    }
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'pay-period': {
        this.selectedPayPeriod = event;
        this.repairShopForm.get('weeklyDay').patchValue(null);
        this.repairShopForm.get('monthlyDay').patchValue(null);
        this.selectedDay = null;
        break;
      }
      case 'day': {
        this.selectedDay = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  public pickedServices() {
    return this.services.filter((item) => item.active).length;
  }

  public onHandleAddress(event: {
    address: AddressEntity | any;
    valid: boolean;
  }): void {
    if (event.valid) this.selectedAddress = event.address;
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  private updateRepariShop(id: number) {
    const { address, addressUnit, rent, ...form } = this.repairShopForm.value;

    const newData: UpdateRepairShopCommand = {
      id: id,
      ...form,
      address: { ...this.selectedAddress, addressUnit: addressUnit },
      rent: rent ? convertThousanSepInNumber(rent) : null,
      payPeriod: this.selectedPayPeriod ? this.selectedPayPeriod.id : null,
      monthlyDay:
        this.selectedPayPeriod?.name === 'Monthly'
          ? this.selectedDay
            ? this.selectedDay.id
            : null
          : null,
      weeklyDay:
        this.selectedPayPeriod?.name === 'Weekly'
          ? this.selectedDay
            ? this.selectedDay.id
            : null
          : null,
      serviceTypes: this.services.map((item) => {
        return {
          serviceType: item.serviceType,
          active: item.active,
        };
      }),
    };

    this.repairService
      .updateRepairShop(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfuly updated company repair shop.',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            "Can't update company repair shop.",
            'Error'
          );
        },
      });
  }

  private addRepairShop() {
    const { address, addressUnit, rent, ...form } = this.repairShopForm.value;

    const newData: CreateRepairShopCommand = {
      ...form,
      address: { ...this.selectedAddress, addressUnit: addressUnit },
      rent: rent ? convertThousanSepInNumber(rent) : null,
      payPeriod: this.selectedPayPeriod ? this.selectedPayPeriod.id : null,
      monthlyDay:
        this.selectedPayPeriod?.name === 'Monthly'
          ? this.selectedDay
            ? this.selectedDay.id
            : null
          : null,
      weeklyDay:
        this.selectedPayPeriod?.name === 'Weekly'
          ? this.selectedDay
            ? this.selectedDay.id
            : null
          : null,
      serviceTypes: this.services.map((item) => {
        return {
          serviceType: item.serviceType,
          active: item.active,
        };
      }),
    };

    this.repairService
      .addRepairShop(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfuly added company repair shop.',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            "Can't add company repair shop.",
            'Error'
          );
        },
      });
  }

  private deleteRepairShopById(id: number) {
    this.repairService
      .deleteRepairShopById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfuly deleted company repair shop.',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            "Can't delete company repair shop.",
            'Error'
          );
        },
      });
  }

  private editRepairShopById(id: number) {
    this.repairService
      .getRepairShopById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: RepairShopResponse) => {
          this.repairShopForm.patchValue({
            companyOwned: res.companyOwned,
            name: res.name,
            address: res.address.address,
            addressUnit: res.address.addressUnit,
            phone: res.phone,
            phoneExt: res.phoneExt,
            email: res.email,
            rent: res.rent ? convertNumberInThousandSep(res.rent) : null,
            payPeriod: res.payPeriod ? res.payPeriod.name : null,
            monthlyDay: res.payPeriod?.name
              ? res.payPeriod.name === 'Monthly'
                ? res.monthlyDay.name
                : res.weeklyDay.name
              : null,
          });
          this.repairShopName = res.name;
          this.selectedAddress = res.address;
          this.selectedPayPeriod = res.payPeriod;

          this.selectedDay =
            res.payPeriod?.name === 'Monthly' ? res.monthlyDay : res.weeklyDay;

          this.services = res.serviceTypes.map((item) => {
            return {
              id: item.serviceType.id,
              serviceType: item.serviceType.name,
              svg: `assets/svg/common/repair-services/${item.logoName}`,
              active: item.active,
            };
          });

          if (res.phoneExt) {
            this.isPhoneExtExist = true;
          }
        },
        error: () => {
          this.notificationService.error(
            "Can't load company repair shop.",
            'Error'
          );
        },
      });
  }

  private getModalDropdowns() {
    this.repairService
      .getRepairShopModalDropdowns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: RepairShopModalResponse) => {
          this.payPeriods = res.payPeriods;
          this.monthlyDays = res.monthlyDays;
          this.weeklyDays = res.daysOfWeek;
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
            "Can't load modal dropdowns.",
            'Error'
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
