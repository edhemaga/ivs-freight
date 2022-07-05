import {
  phoneRegex,
  emailRegex,
} from './../../../../shared/ta-input/ta-input.regex-validations';
import { Validators } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddressEntity } from 'appcoretruckassist';
import { tab_modal_animation } from 'src/app/core/components/shared/animations/tabs-modal.animation';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';

@Component({
  selector: 'app-settings-repairshop-modal',
  templateUrl: './settings-repairshop-modal.component.html',
  styleUrls: ['./settings-repairshop-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  providers: [ModalService],
})
export class SettingsRepairshopModalComponent implements OnInit, OnDestroy {
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
  public selectedPayPeriod: any = null;
  public selectedDay: any = null;

  public isPhoneExtExist: boolean = false;

  public services: any[] = [
    {
      id: 1,
      name: 'Truck',
      svg: 'assets/svg/common/repair-services/ic_truck.svg',
      active: false,
    },
    {
      id: 2,
      name: 'Trailer',
      svg: 'assets/svg/common/repair-services/ic_trailer.svg',
      active: false,
    },
    {
      id: 3,
      name: 'Mobile',
      svg: 'assets/svg/common/repair-services/ic_mobile.svg',
      active: false,
    },
    {
      id: 4,
      name: 'Shop',
      svg: 'assets/svg/common/repair-services/ic_shop.svg',
      active: false,
    },
    {
      id: 5,
      name: 'Towing',
      svg: 'assets/svg/common/repair-services/ic_towing.svg',
      active: false,
    },
    {
      id: 6,
      name: 'Parts',
      svg: 'assets/svg/common/repair-services/ic_parts.svg',
      active: false,
    },
    {
      id: 7,
      name: 'Tire',
      svg: 'assets/svg/common/repair-services/ic_tire.svg',
      active: false,
    },
    {
      id: 8,
      name: 'Dealer',
      svg: 'assets/svg/common/repair-services/ic_dealer.svg',
      active: false,
    },
  ];

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private formService: FormService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.isCheckedCompanyOwned();
  }

  private createForm() {
    this.repairShopForm = this.formBuilder.group({
      companyOwned: [false],
      shopName: [null, Validators.required],
      address: [null, Validators.required],
      addressUnit: [null, Validators.maxLength(6)],
      phone: [null, phoneRegex],
      phoneExtension: [null],
      email: [null, emailRegex],
      rent: [null],
      payPeriod: [null],
      day: [null],
    });

    this.formService.checkFormChange(this.repairShopForm);

    this.formService.formValueChange$
      .pipe(untilDestroyed(this))
      .subscribe((isFormChange: boolean) => {
        isFormChange ? (this.isDirty = false) : (this.isDirty = true);
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
        this.repairShopForm.reset();
        break;
      }
      case 'save': {
        if (this.repairShopForm.invalid) {
          this.inputService.markInvalid(this.repairShopForm);
          return;
        }
        if (this.editData) {
          this.updateRepariShop(this.editData.id);
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

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'pay-period': {
        this.selectedPayPeriod = event;
      }
      case 'day': {
        this.selectedDay = event;
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
    this.selectedAddress = event.address;
  }

  public openCloseCheckboxCard(event: any) {
    if (this.repairShopForm.get('companyOwned').value) {
      event.preventDefault();
      event.stopPropagation();
      this.repairShopForm.get('companyOwned').setValue(false);
    }
  }

  public isCheckedCompanyOwned() {
    this.repairShopForm
      .get('companyOwned')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(
            this.repairShopForm.get('shopName')
          );
          this.inputService.changeValidators(
            this.repairShopForm.get('address')
          );
          this.inputService.changeValidators(
            this.repairShopForm.get('phone'),
            true,
            [phoneRegex]
          );
        } else {
          this.inputService.changeValidators(
            this.repairShopForm.get('shopName'),
            false
          );
          this.inputService.changeValidators(
            this.repairShopForm.get('address'),
            false
          );
          this.inputService.changeValidators(
            this.repairShopForm.get('phone'),
            false
          );
        }
      });
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  private updateRepariShop(id: number) {}

  private addRepairShop() {}

  private deleteRepairShopById(id: number) {}

  ngOnDestroy(): void {}
}
