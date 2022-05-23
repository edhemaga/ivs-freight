import {
  phoneRegex,
  emailRegex,
} from './../../../../shared/ta-input/ta-input.regex-validations';
import { Validators } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressEntity } from 'appcoretruckassist';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { tab_modal_animation } from 'src/app/core/components/shared/animations/tabs-modal.animation';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';

@Component({
  selector: 'app-settings-repairshop-modal',
  templateUrl: './settings-repairshop-modal.component.html',
  styleUrls: ['./settings-repairshop-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
})
export class SettingsRepairshopModalComponent implements OnInit {
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

  public selectedAddress: Address | AddressEntity = null;
  public selectedPayPeriod: any = null;
  public selectedDay: any = null;

  public isPhoneExtExist: boolean = false;

  public services: any[] = [
    {
      id: 1,
      name: 'Truck',
      svg: 'assets/svg/common/ic_truck.svg',
      active: false
    },
    {
      id: 2,
      name: 'Trailer',
      svg: 'assets/svg/common/ic_trailer.svg',
      active: false
    },
    {
      id: 3,
      name: 'Mobile',
      svg: 'assets/svg/common/ic_mobile.svg',
      active: false
    },
    {
      id: 4,
      name: 'Shop',
      svg: 'assets/svg/common/ic_shop.svg',
      active: false
    },
    {
      id: 5,
      name: 'Towing',
      svg: 'assets/svg/common/ic_towing.svg',
      active: false
    },
    {
      id: 6,
      name: 'Parts',
      svg: 'assets/svg/common/ic_parts.svg',
      active: false
    },
    {
      id: 7,
      name: 'Tire',
      svg: 'assets/svg/common/ic_tire.svg',
      active: false
    },
    {
      id: 8,
      name: 'Dealer',
      svg: 'assets/svg/common/ic_dealer.svg',
      active: false
    }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.repairShopForm = this.formBuilder.group({
      companyOwned: [false],
      shopName: [null, Validators.required],
      address: [null, Validators.required],
      addressUnit: [null, Validators.maxLength(6)],
      phone: [null, [Validators.required, phoneRegex]],
      phoneExtension: [null],
      email: [null, emailRegex],
      rent: [null],
      payPeriod: [null],
      day: [null],
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
    if (data.action === 'close') {
      this.repairShopForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        if (this.repairShopForm.invalid) {
          this.inputService.markInvalid(this.repairShopForm);
          return;
        }
        if (this.editData) {
          this.updateRepariShop(this.editData.id);
        } else {
          this.addRepairShop();
        }
      }

      // Delete
      if (data.action === 'delete' && this.editData) {
        this.deleteRepairShopById(this.editData.id);
      }

      this.ngbActiveModal.close();
    }
  }

  public onSelectPayPeriod(event) {
    this.selectedPayPeriod = event;
  }

  public onSelectDay(event) {
    this.selectedDay = event;
  }

  public onPickService(repair: any) {
    repair.active = !repair.active;
  }

  public pickedServices() {
    return this.services.filter(item => item.active).length;
  }

  public onHandleAddress(event: {
    address: Address | any;
    valid: boolean;
  }): void {
    this.selectedAddress = event.address;
    if (!event.valid) {
      this.repairShopForm.get('addres').setErrors({ invalid: true });
    }
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  private updateRepariShop(id: number) {}

  private addRepairShop() {}

  private deleteRepairShopById(id: number) {}
}
