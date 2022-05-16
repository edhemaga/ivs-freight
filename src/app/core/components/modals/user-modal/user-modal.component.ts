import { emailRegex } from './../../shared/ta-input/ta-input.regex-validations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Address } from '../../shared/ta-input-address/ta-input-address.component';
import { AddressEntity } from 'appcoretruckassist';
import { phoneRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
})
export class UserModalComponent implements OnInit {
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
      label: 'User',
      value: 'user',
      name: 'employe',
      checked: true,
    },
    {
      label: 'Admin',
      value: 'admin',
      name: 'employe',
      checked: false,
    },
  ];

  public typeOfPayroll = [
    {
      label: '1099',
      value: '1099',
      name: 'payroll',
      checked: true,
    },
    {
      label: 'W-2',
      value: 'w-2',
      name: 'payroll',
      checked: false,
    },
  ];

  public selectedAddress: Address | AddressEntity = null;
  public isPhoneExtExist: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.createForm();

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
      addressUnit: [null],
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

  public onHandleAddress(event: any): void {
    this.selectedAddress = event;
  }

  public openCloseCheckboxCard(event: any) {
    if (this.userForm.get('isIncludePayroll').value) {
      event.preventDefault();
      event.stopPropagation();
      this.userForm.get('isIncludePayroll').setValue(false);
    }
  }

  public onTypeOfEmploye(event: any) {}

  public onTypeOfPayroll(event: any) {}

  public onSelectDepartment(event: any) {}

  public onSelectOffice(event: any) {}

  private updateUser(id: number) {}

  private addUser() {}

  private deleteUserById(id: number) {}

  private editUserById(id: number) {}
}
