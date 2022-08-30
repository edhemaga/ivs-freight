import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TruckModalComponent } from './../truck-modal/truck-modal.component';
import { UpdateOwnerCommand } from './../../../../../../appcoretruckassist/model/updateOwnerCommand';
import { CreateOwnerCommand } from './../../../../../../appcoretruckassist/model/createOwnerCommand';
import { OwnerResponse } from './../../../../../../appcoretruckassist/model/ownerResponse';
import { NotificationService } from './../../../services/notification/notification.service';
import { OwnerModalResponse } from './../../../../../../appcoretruckassist/model/ownerModalResponse';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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
import { AddressEntity, CreateResponse } from 'appcoretruckassist';
import { TabSwitcherComponent } from '../../switchers/tab-switcher/tab-switcher.component';
import {
  businessNameValidation,
  einNumberRegex,
  emailRegex,
  phoneRegex,
  ssnNumberRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';
import { BankVerificationService } from 'src/app/core/services/bank-verification/bankVerification.service';
import { OwnerTService } from '../../owner/state/owner.service';
import { TrailerModalComponent } from '../trailer-modal/trailer-modal.component';

@UntilDestroy()
@Component({
  selector: 'app-owner-modal',
  templateUrl: './owner-modal.component.html',
  styleUrls: ['./owner-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ModalService, FormService, BankVerificationService],
})
export class OwnerModalComponent implements OnInit, OnDestroy {
  @ViewChild(TabSwitcherComponent) tabSwitcher: any;

  @Input() editData: any;

  public isDirty: boolean;

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
    private ownerModalService: OwnerTService,
    private notificationService: NotificationService,
    private formService: FormService,
    private bankVerificationService: BankVerificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getOwnerDropdowns();
    this.onBankSelected();

    if (this.editData?.id) {
      this.editOwnerById(this.editData.id);
    }
  }

  private createForm() {
    this.ownerForm = this.formBuilder.group({
      bussinesName: [null, [Validators.required, ...businessNameValidation]],
      firstName: [null],
      lastName: [null],
      ssn: [null, ssnNumberRegex],
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

    // this.formService.checkFormChange(this.ownerForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;

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

      this.tabs = this.tabs.map((item) => {
        return {
          ...item,
          checked: item.id === event.id,
        };
      });
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
        if (this.editData?.id) {
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

    if (this.editData?.canOpenModal) {
      switch (this.editData?.key) {
        case 'truck-modal': {
          this.modalService.setProjectionModal({
            action: 'close',
            payload: { key: this.editData?.key, value: null },
            component: TruckModalComponent,
            size: 'small',
          });
          break;
        }
        case 'trailer-modal': {
          this.modalService.setProjectionModal({
            action: 'close',
            payload: { key: this.editData?.key, value: null },
            component: TrailerModalComponent,
            size: 'small',
          });
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  public onHandleAddress(event: { address: AddressEntity; valid: boolean }) {
    if (event.valid) this.selectedAddress = event.address;
  }

  public onSelectBank(event: any): void {
    this.selectedBank = event;
    if (!event) {
      this.ownerForm.get('bankId').patchValue(null);
    }
  }

  public onSaveNewBank(bank: { data: any; action: string }) {
    this.selectedBank = bank.data;

    this.bankVerificationService
      .createBank({ name: this.selectedBank.name })
      .pipe(untilDestroyed(this))
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

  private onBankSelected() {
    this.ownerForm
      .get('bankId')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        this.isBankSelected = this.bankVerificationService.onSelectBank(
          this.selectedBank ? this.selectedBank.name : value,
          this.ownerForm.get('routingNumber'),
          this.ownerForm.get('accountNumber')
        );
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
      ...form,
      ownerType: this.selectedTab,
      name:
        this.selectedTab === 1 ? bussinesName : firstName.concat(' ', lastName),
      ssnEin: this.selectedTab === 1 ? ein : ssn,
      address: { ...this.selectedAddress, addressUnit: addressUnit },
      bankId: this.selectedBank ? this.selectedBank.id : null,
    };

    this.ownerModalService
      .updateOwner(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Changes saved for "${bussinesName}"`,
            'Success'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error(
            `Failed to save changes for "${bussinesName}"`,
            'Error'
          );
        },
      });
  }

  private deleteOwnerById(id: number) {
    let bussinesName = this.ownerForm.get('bussinesName')?.value;
    this.ownerModalService
      .deleteOwnerById(id, this.editData.selectedTab)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `"${bussinesName}" deleted`,
            'Success'
          );
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
        },
        error: () => {
          this.notificationService.error(
            `Failed to delete "${bussinesName}"`,
            'Error'
          );
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
            `"${bussinesName}" added`,
            'Success'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error(
            `Failed to add "${bussinesName}"`,
            'Error'
          );
        },
      });
  }

  private editOwnerById(id: number) {
    this.ownerModalService
      .getOwnerById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: OwnerResponse) => {
          const splitName = res.ownerType.id === 2 ? res.name.split(' ') : null;

          this.ownerForm.patchValue({
            bussinesName: res.ownerType.id === 1 ? res.name : null,
            firstName: res.ownerType.id === 2 ? splitName[0] : null,
            lastName: res.ownerType.id === 2 ? splitName[1] : null,
            ssn: res.ownerType.id === 2 ? res.ssnEin : null,
            ein: res.ownerType.id === 1 ? res.ssnEin : null,
            address: res.address.address,
            addressUnit: res.address.addressUnit,
            phone: res.phone,
            email: res.email,
            bankId: res?.bank?.name ? res.bank.name : null,
            accountNumber: res.accountNumber,
            routingNumber: res.routingNumber,
            note: res.note,
          });
          this.selectedAddress = res.address;
          this.selectedBank = res.bank;
          this.tabChange(
            this.tabs.find((item) => item.id === res.ownerType.id)
          );
        },
        error: () => {
          this.notificationService.error("Owner can't be loaded", 'Error');
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
            "Owner's dropdowns can't be loaded",
            'Error'
          );
        },
      });
  }

  ngOnDestroy(): void {}
}
