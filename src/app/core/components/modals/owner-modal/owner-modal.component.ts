import {
  accountBankRegex,
  bankRoutingValidator,
} from './../../shared/ta-input/ta-input.regex-validations';
import { UpdateOwnerCommand } from './../../../../../../appcoretruckassist/model/updateOwnerCommand';
import { CreateOwnerCommand } from './../../../../../../appcoretruckassist/model/createOwnerCommand';
import { OwnerResponse } from './../../../../../../appcoretruckassist/model/ownerResponse';
import { NotificationService } from './../../../services/notification/notification.service';
import { OwnerModalResponse } from './../../../../../../appcoretruckassist/model/ownerModalResponse';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { OwnerModalService } from './owner-modal.service';
import { AddressEntity } from 'appcoretruckassist';
import { distinctUntilChanged } from 'rxjs';
import { TabSwitcherComponent } from '../../switchers/tab-switcher/tab-switcher.component';
import {
  einNumberRegex,
  emailRegex,
  phoneRegex,
  routingBankRegex,
  ssnNumberRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-owner-modal',
  templateUrl: './owner-modal.component.html',
  styleUrls: ['./owner-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OwnerModalComponent implements OnInit, OnDestroy {
  @ViewChild(TabSwitcherComponent) tabSwitcher: any;

  @Input() editData: any;

  public ownerForm: FormGroup;

  public selectedTab: number = 1;
  public tabs: any[] = [
    {
      id: 1,
      name: 'Company',
    },
    {
      id: 2,
      name: 'Sole Proprietor',
    },
  ];

  public labelsBank: any[] = [];

  public selectedAddress: AddressEntity = null;

  public selectedBank: any = null;
  public isBankSelected: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private ownerModalService: OwnerModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.onBankSelected();
    this.getOwnerDropdowns();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 8,
      };
      this.editOwnerById(this.editData.id);
    }
  }

  private createForm() {
    this.ownerForm = this.formBuilder.group({
      bussinesName: [null, Validators.required],
      firstName: [null],
      lastName: [null],
      ssn: [null],
      ein: [null, [Validators.required, einNumberRegex]],
      address: [null, Validators.required],
      addressUnit: [null, [Validators.maxLength(6)]],
      phone: [null, [Validators.required, phoneRegex]],
      email: [null, [Validators.required, emailRegex]],
      bankId: [null],
      accountNumber: [null],
      routingNumber: [null],
      note: [null],
    });
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    this.tabSwitcher.activeTab = this.selectedTab;

    if (this.selectedTab === 1) {
      this.inputService.changeValidators(
        this.ownerForm.get('bussinesName'),
        true
      );
      this.inputService.changeValidators(this.ownerForm.get('ein'), true, [
        einNumberRegex,
      ]);
      this.inputService.changeValidators(
        this.ownerForm.get('firstName'),
        false
      );
      this.inputService.changeValidators(this.ownerForm.get('lastName'), false);
      this.inputService.changeValidators(this.ownerForm.get('ssn'), false);
    } else {
      this.inputService.changeValidators(
        this.ownerForm.get('bussinesName'),
        false
      );
      this.inputService.changeValidators(this.ownerForm.get('ein'), false);
      this.inputService.changeValidators(this.ownerForm.get('firstName'), true);
      this.inputService.changeValidators(this.ownerForm.get('lastName'), true);
      this.inputService.changeValidators(this.ownerForm.get('ssn'), true, [
        ssnNumberRegex,
      ]);
    }
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.ownerForm.reset();
        break;
      }
      case 'save': {
        if (this.ownerForm.invalid) {
          this.inputService.markInvalid(this.ownerForm);
          return;
        }
        if (this.editData) {
          this.updateOwner(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addOwner();
          this.modalService.setModalSpinner({ action: null, status: true });
        }

        break;
      }
      case 'delete': {
        this.deleteOwnerById(this.editData.id);
        this.modalService.setModalSpinner({ action: 'delete', status: true });
        break;
      }
      default: {
        break;
      }
    }
  }

  public onHandleAddress(event: { address: AddressEntity; valid: boolean }) {
    this.selectedAddress = event.address;
    if (!event.valid) {
      this.ownerForm.setErrors({ invalid: event.valid });
    }
  }

  public onSelectBank(event: any): void {
    this.selectedBank = event;
  }

  private onBankSelected(): void {
    this.ownerForm
      .get('bankId')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.isBankSelected = true;
          this.inputService.changeValidators(
            this.ownerForm.get('routingNumber'),
            true,
            routingBankRegex
          );
          this.routingNumberTyping();
          this.inputService.changeValidators(
            this.ownerForm.get('accountNumber'),
            true,
            accountBankRegex
          );
        } else {
          this.isBankSelected = false;
          this.inputService.changeValidators(
            this.ownerForm.get('routingNumber'),
            false
          );
          this.inputService.changeValidators(
            this.ownerForm.get('accountNumber'),
            false
          );
        }
      });
  }

  private routingNumberTyping() {
    this.ownerForm
      .get('routingNumber')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          if (bankRoutingValidator(value)) {
            this.ownerForm.get('routingNumber').setErrors(null);
          } else {
            this.ownerForm.get('routingNumber').setErrors({ invalid: true });
          }
        }
      });
  }

  private updateOwner(id: number) {
    const {
      bussinesName,
      firstName,
      lastName,
      ssn,
      ein,
      address,
      addressUnit,
      ...form
    } = this.ownerForm.value;

    const newData: UpdateOwnerCommand = {
      id: id,
      ownerType: this.selectedTab,
      name:
        this.selectedTab === 1 ? bussinesName : firstName.concat(' ', lastName),
      ssnEin: this.selectedTab === 1 ? ein : ssn,
      address: { ...this.selectedAddress, addressUnit: addressUnit },
      bankId: this.selectedBank ? this.selectedBank.id : null,
      ...form,
    };

    this.ownerModalService
      .updateOwner(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Owner successfully updated.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Owner can't be updated.", 'Error:');
        },
      });
  }

  private deleteOwnerById(id: number) {
    this.ownerModalService
      .deleteOwnerById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Owner successfully deleted.',
            'Success:'
          );
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
        },
        error: () => {
          this.notificationService.error("Owner can't be deleted.", 'Error:');
        },
      });
  }

  private addOwner() {
    const {
      bussinesName,
      firstName,
      lastName,
      ssn,
      ein,
      address,
      addressUnit,
      ...form
    } = this.ownerForm.value;

    const newData: CreateOwnerCommand = {
      ...form,
      ownerType: this.selectedTab,
      name:
        this.selectedTab === 1 ? bussinesName : firstName.concat(' ', lastName),
      ssnEin: this.selectedTab === 1 ? ein : ssn,
      address: { ...this.selectedAddress, addressUnit: addressUnit },
      bankId: this.selectedBank ? this.selectedBank.id : null,
    };

    this.ownerModalService
      .addOwner(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Owner successfully added.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Owner can't be added.", 'Error:');
        },
      });
  }

  private editOwnerById(id: number) {
    this.ownerModalService
      .getOwnerById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: OwnerResponse) => {
          const splitName = res.ownerTypeId === 2 ? res.name.split(' ') : null;

          this.ownerForm.patchValue({
            bussinesName: res.ownerTypeId === 1 ? res.name : null,
            firstName: res.ownerTypeId === 2 ? splitName[0] : null,
            lastName: res.ownerTypeId === 2 ? splitName[1] : null,
            ssn: res.ownerTypeId === 2 ? res.ssnEin : null,
            ein: res.ownerTypeId === 1 ? res.ssnEin : null,
            address: res.address.address,
            addressUnit: res.address.addressUnit,
            phone: res.phone,
            email: res.email,
            bankId: res.bankName,
            accountNumber: res.accountNumber,
            routingNumber: res.routingNumber,
            note: res.note,
          });
          this.selectedAddress = res.address;
          this.selectedBank = res.bankName;
          this.tabChange(this.tabs.find((item) => item.id === res.ownerTypeId));
        },
        error: () => {
          this.notificationService.error("Owner can't be loaded.", 'Error:');
        },
      });
  }

  private getOwnerDropdowns() {
    this.ownerModalService
      .getOwnerDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: OwnerModalResponse) => {
          this.labelsBank = res.banks;
        },
        error: () => {
          this.notificationService.error(
            "Owner's dropdowns can't be loaded.",
            'Error:'
          );
        },
      });
  }

  ngOnDestroy(): void {}
}
