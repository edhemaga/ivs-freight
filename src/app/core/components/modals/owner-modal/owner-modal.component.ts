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
  ChangeDetectorRef,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OwnerModalService } from './owner-modal.service';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { Address } from '../../shared/ta-input-address/ta-input-address.component';
import { AddressEntity } from 'appcoretruckassist';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-owner-modal',
  templateUrl: './owner-modal.component.html',
  styleUrls: ['./owner-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
})
export class OwnerModalComponent implements OnInit, OnDestroy {
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

  public selectedAddress: Address | AddressEntity = null;
  public selectedBank: any = null;
  public isBankSelected: boolean = false;

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
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
        id: 3,
      };
      this.editOwnerById(this.editData.id);
    }
  }

  private createForm() {
    this.ownerForm = this.formBuilder.group({
      bussinesName: [null],
      firstName: [null],
      lastName: [null],
      ssn: [null],
      ein: [null],
      address: [null],
      addressUnit: [null],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)],
      ],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ],
      ],
      bankId: [null],
      accountNumber: [null],
      routingNumber: [null],
      note: [null],
    });
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    console.log(this.selectedTab);

    let dotAnimation = document.querySelector('.animation-two-tabs');
    this.animationObject = {
      value: this.selectedTab,
      params: { height: `${dotAnimation.getClientRects()[0].height}px` },
    };

    if ((this.selectedTab = 1)) {
      this.inputService.changeValidators(
        this.ownerForm.get('bussinesName'),
        true
      );
      this.inputService.changeValidators(this.ownerForm.get('ein'), true, [
        Validators.pattern(/^\d{2}\-\d{7}$/),
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
        Validators.required,
        Validators.pattern(/^\d{3}\-\d{2}\-\d{4}$/),
      ]);
    }
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    if (data.action === 'close') {
      this.ownerForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        if (this.ownerForm.invalid) {
          this.inputService.markInvalid(this.ownerForm);
          return;
        }
        if (this.editData) {
          this.updateOwner(this.editData.id);
        } else {
          this.addOwner();
        }
      }
      // Delete
      if (data.action === 'delete' && this.editData) {
        this.deleteOwnerById(this.editData.id);
      }

      this.ngbActiveModal.close();
    }
  }

  public onHandleAddress(event: Address) {
    this.selectedAddress = event;
  }

  public onSelectBank(event: any): void {
    this.selectedBank = event;
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
      bankId: 1, //this.selectedBank ? this.selectedBank.id : null,
      ...form,
    };
    console.log(newData);
    this.ownerModalService
      .updateOwner(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Owner successfully updated.',
            'Success:'
          );
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
      ownerType: this.selectedTab,
      name:
        this.selectedTab === 1 ? bussinesName : firstName.concat(' ', lastName),
      ssnEin: this.selectedTab === 1 ? ein : ssn,
      address: { ...this.selectedAddress, addressUnit: addressUnit },
      bankId: 1, //this.selectedBank ? this.selectedBank.id : null,
      ...form,
    };
    console.log(newData);
    this.ownerModalService
      .addOwner(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Owner successfully added.',
            'Success:'
          );
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
          const splitName = res.ownerType.includes('Proprietor')
            ? res.name.split(' ')
            : null;
          console.log(splitName);
          this.ownerForm.patchValue({
            bussinesName: !res.ownerType.includes('Proprietor')
              ? res.name
              : null,
            firstName: res.ownerType.includes('Proprietor')
              ? splitName[0]
              : null,
            lastName: res.ownerType.includes('Proprietor')
              ? splitName[1]
              : null,
            ssn: res.ownerType.includes('Proprietor') ? res.ssnEin : null,
            ein: !res.ownerType.includes('Proprietor') ? res.ssnEin : null,
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

          this.tabChange(
            this.tabs.find(
              (item) =>
                item.name.toLowerCase() === 'Sole Proprietor'.toLowerCase()
            )
          );
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
            [Validators.minLength(9), Validators.maxLength(9)]
          );
          this.inputService.changeValidators(
            this.ownerForm.get('accountNumber'),
            true,
            [Validators.minLength(4), Validators.maxLength(17)]
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

  ngOnDestroy(): void {}
}
