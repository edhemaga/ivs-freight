import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AddressEntity,
  CreateRepairShopCommand,
  RepairShopResponse,
} from 'appcoretruckassist';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { distinctUntilChanged } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { ShopTService } from '../../../repair/state/shop.service';
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
})
export class RepairShopModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;
  public repairShopForm: FormGroup;

  public isRepairShopFavourite: boolean = false;
  public isPhoneExtExist: boolean = false;

  public selectedAddress: AddressEntity = null;

  public labelsBank: any[] = [];
  public selectedBank: any = null;

  public services: any[] = [
    {
      id: 1,
      name: 'Truck',
      svg: 'assets/svg/common/ic_truck.svg',
      active: false,
    },
    {
      id: 2,
      name: 'Trailer',
      svg: 'assets/svg/common/ic_trailer.svg',
      active: false,
    },
    {
      id: 3,
      name: 'Mobile',
      svg: 'assets/svg/common/ic_mobile.svg',
      active: false,
    },
    {
      id: 4,
      name: 'Shop',
      svg: 'assets/svg/common/ic_shop.svg',
      active: false,
    },
    {
      id: 5,
      name: 'Towing',
      svg: 'assets/svg/common/ic_towing.svg',
      active: false,
    },
    {
      id: 6,
      name: 'Parts',
      svg: 'assets/svg/common/ic_parts.svg',
      active: false,
    },
    {
      id: 7,
      name: 'Tire',
      svg: 'assets/svg/common/ic_tire.svg',
      active: false,
    },
    {
      id: 8,
      name: 'Dealer',
      svg: 'assets/svg/common/ic_dealer.svg',
      active: false,
    },
  ];

  public openHoursDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private shopService: ShopTService,
    private modalService: ModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();

    if (this.editData) {
      this.editRepairShopById(this.editData.id);
    }

    for (let i = 0; i < this.openHoursDays.length; i++) {
      this.addOpenHours(this.openHoursDays[i], i !== 6);
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
      companyOwned: [null],
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

  private createOpenHour(day: string, isDay: boolean): FormGroup {
    return this.formBuilder.group({
      isDay: [isDay],
      dayLabel: [day],
      from: ['08:00 AM'],
      to: ['05:00 PM'],
    });
  }

  public addOpenHours(day: string, isDay: boolean = false) {
    this.openHours.push(this.createOpenHour(day, isDay));
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
            favourite: res.pinned,
            phone: res.phone,
            phoneExt: null,
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
    // name: [null, Validators.required],
    //   pinned: [null],
    //   phone: [null, [Validators.required, phoneRegex]],
    //   phoneExt: [null, [Validators.maxLength(3)]],
    //   email: [null, emailRegex],
    //   address: [null, [Validators.required]],
    //   addressUnit: [null, [Validators.maxLength(6)]],
    //   companyOwned: [null],
    //   openHours: this.formBuilder.array([]),
    //   bankId: [null],
    //   routing: [null],
    //   account: [null],
    //   note: [null],
    const { address, ...form } = this.repairShopForm.value;
    const newData: CreateRepairShopCommand = {
      ...form,
      address: this.selectedAddress,
    };
    this.shopService
      .addRepairShop(newData)
      .pipe(untilDestroyed(this))
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

  private updateRepairShop(id: number) {}

  private deleteRepairShopById(id: number) {}

  ngOnDestroy(): void {}
}
