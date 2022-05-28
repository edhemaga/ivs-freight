import {
  accountBankRegex,
  bankRoutingValidator,
  emailRegex,
  routingBankRegex,
} from './../../shared/ta-input/ta-input.regex-validations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Address } from '../../shared/ta-input-address/ta-input-address.component';
import { AddressEntity } from 'appcoretruckassist';
import { phoneRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { distinctUntilChanged } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
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
      id: 1,
      label: 'User',
      value: 'user',
      name: 'employe',
      checked: true,
    },
    {
      id: 2,
      label: 'Admin',
      value: 'admin',
      name: 'employe',
      checked: false,
    },
  ];

  public typeOfPayroll = [
    {
      id: 3,
      label: '1099',
      value: '1099',
      name: 'payroll',
      checked: true,
    },
    {
      id: 4,
      label: 'W-2',
      value: 'w-2',
      name: 'payroll',
      checked: false,
    },
  ];

  public departments: any[] = [];
  public offices: any[] = [];

  public selectedDepartment: any = null;
  public selectedOffice: any = null;
  public selectedBank: any = null;

  public selectedAddress: Address | AddressEntity = null;
  public isPhoneExtExist: boolean = false;

  public isBankSelected: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal
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
  }

  public onModalAction(data: { action: string; bool: boolean }): void {
    if (data.action === 'close') {
      this.userForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        if (this.userForm.invalid) {
          this.inputService.markInvalid(this.userForm);
          return;
        }
        if (this.editData) {
          this.updateUser(this.editData.id);
        } else {
          this.addUser();
        }
      }

      // Delete
      if (data.action === 'delete' && this.editData) {
        this.deleteUserById(this.editData.id);
      }

      this.ngbActiveModal.close();
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

  public onHandleAddress(event: { address: Address; valid: boolean }): void {
    this.selectedAddress = event.address;
    if (!event.valid) {
      this.userForm.get('address').setErrors({ invalid: true });
    }
  }

  public openCloseCheckboxCard(event: any) {
    if (this.userForm.get('isIncludePayroll').value) {
      event.preventDefault();
      event.stopPropagation();
      this.userForm.get('isIncludePayroll').setValue(false);
    }
  }

  private onBankSelected(): void {
    this.userForm
      .get('bankId')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.isBankSelected = true;
          this.inputService.changeValidators(
            this.userForm.get('routingNumber'),
            true,
            routingBankRegex
          );
          this.routingNumberTyping();
          this.inputService.changeValidators(
            this.userForm.get('accountNumber'),
            true,
            accountBankRegex
          );
        } else {
          this.isBankSelected = false;
          this.inputService.changeValidators(
            this.userForm.get('routingNumber'),
            false
          );
          this.inputService.changeValidators(
            this.userForm.get('accountNumber'),
            false
          );
        }
      });
  }

  private routingNumberTyping() {
    this.userForm
      .get('routingNumber')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          if (bankRoutingValidator(value)) {
            this.userForm.get('routingNumber').setErrors(null);
          } else {
            this.userForm.get('routingNumber').setErrors({ invalid: true });
            this.inputService.triggerInvalidRoutingNumber$.next(true);
          }
        }
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

  private updateUser(id: number) {}

  private addUser() {}

  private deleteUserById(id: number) {}

  private editUserById(id: number) {}

  private getUserDropdowns() {}

  ngOnDestroy(): void {}
}
