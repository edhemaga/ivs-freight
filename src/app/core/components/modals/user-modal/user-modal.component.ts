import { emailRegex } from './../../shared/ta-input/ta-input.regex-validations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AddressEntity, CreateResponse } from 'appcoretruckassist';
import { phoneRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { distinctUntilChanged } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';
import { BankVerificationService } from 'src/app/core/services/bank-verification/bankVerification.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@UntilDestroy()
@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
  providers: [ModalService, FormService, BankVerificationService],
})
export class UserModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public userForm: FormGroup;

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

  public typeOfEmploye = [
    {
      id: 998,
      label: 'employe',
      value: 'user',
      name: 'User',
      checked: true,
    },
    {
      id: 999,
      label: 'employe',
      value: 'admin',
      name: 'Admin',
      checked: false,
    },
  ];

  public typeOfPayroll = [
    {
      id: 300,
      label: 'payroll',
      value: '1099',
      name: '1099',
      checked: true,
    },
    {
      id: 301,
      label: 'payroll',
      value: 'W-2',
      name: 'W-2',
      checked: false,
    },
  ];

  public departments: any[] = [];
  public offices: any[] = [];

  public selectedDepartment: any = null;
  public selectedOffice: any = null;
  public selectedBank: any = null;

  public selectedAddress: AddressEntity = null;
  public isPhoneExtExist: boolean = false;

  public isBankSelected: boolean = false;

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private formService: FormService,
    private bankVerificationService: BankVerificationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.onBankSelected();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 1,
      };
      this.editUserById(this.editData.id);
    }
  }

  private createForm() {
    this.userForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      address: [null],
      addressUnit: [null, Validators.maxLength(6)],
      personalPhone: [null, phoneRegex],
      personalEmail: [null, emailRegex],
      departmentId: [null, Validators.required],
      mainOfficeId: [null],
      userType: [null],
      employePhone: [null, phoneRegex],
      employePhoneExt: [null],
      employeEmail: [null, [Validators.required, emailRegex]],
      isIncludePayroll: [false],
      salary: [null],
      startDate: [null],
      payrollType: [null],
      bankId: [null],
      routingNumber: [null],
      accountNumber: [null],
      note: [null],
    });

    // this.formService.checkFormChange(this.userForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  public onModalAction(data: { action: string; bool: boolean }): void {
    switch (data.action) {
      case 'close': {
        this.userForm.reset();
        break;
      }
      case 'save': {
        if (this.userForm.invalid) {
          this.inputService.markInvalid(this.userForm);
          return;
        }
        if (this.editData) {
          this.updateUser(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addUser();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        if (this.editData) {
          this.deleteUserById(this.editData.id);
          this.modalService.setModalSpinner({ action: 'delete', status: true });
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    let dotAnimation = document.querySelector('.animation-two-tabs');
    this.animationObject = {
      value: this.selectedTab,
      params: { height: `${dotAnimation.getClientRects()[0].height}px` },
    };
  }

  public onHandleAddress(event: {
    address: AddressEntity;
    valid: boolean;
  }): void {
    if (event.valid) this.selectedAddress = event.address;
  }

  private onBankSelected(): void {
    this.userForm
      .get('bankId')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        this.isBankSelected = this.bankVerificationService.onSelectBank(
          value,
          this.userForm.get('routingNumber'),
          this.userForm.get('accountNumber')
        );
      });
  }

  public onTypeOfEmploye(event: any) {}

  public onTypeOfPayroll(event: any) {}

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'department': {
        this.selectedDepartment = event;
        break;
      }
      case 'office': {
        this.selectedOffice = event;
        break;
      }
      case 'bank': {
        this.selectedBank = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onSaveNewBank(bank: any) {
    this.selectedBank = bank;

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

  private updateUser(id: number) {}

  private addUser() {}

  private deleteUserById(id: number) {}

  private editUserById(id: number) {}

  private getUserDropdowns() {}

  ngOnDestroy(): void {}
}
