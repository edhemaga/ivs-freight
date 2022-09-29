import { SettingsLocationService } from '../../../state/location-state/settings-location.service';
import { FormArray, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import {
  AddressEntity,
  CompanyOfficeModalResponse,
  CompanyOfficeResponse,
  CreateCompanyOfficeCommand,
  UpdateCompanyOfficeCommand,
} from 'appcoretruckassist';

import { Subject, takeUntil } from 'rxjs';
import { tab_modal_animation } from '../../../../shared/animations/tabs-modal.animation';
import { ModalService } from '../../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../../shared/ta-input/ta-input.service';
import { NotificationService } from '../../../../../services/notification/notification.service';
import { rentValidation } from '../../../../shared/ta-input/ta-input.regex-validations';
import {
  addressValidation,
  addressUnitValidation,
  phoneFaxRegex,
  phoneExtension,
  departmentValidation,
  officeNameValidation,
} from '../../../../shared/ta-input/ta-input.regex-validations';
import {
  convertThousanSepInNumber,
  convertNumberInThousandSep,
} from '../../../../../utils/methods.calculations';

@Component({
  selector: 'app-settings-office-modal',
  templateUrl: './settings-office-modal.component.html',
  styleUrls: ['./settings-office-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
  providers: [ModalService],
})
export class SettingsOfficeModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public officeForm: FormGroup;

  public selectedTab: number = 1;

  public selectedAddress: AddressEntity = null;
  public isPhoneExtExist: boolean = false;

  public payPeriods: any[] = [];
  public selectedPayPeriod: any = null;

  public weeklyDays: any[] = [];
  public monthlyDays: any[] = [];
  public selectedDay: any = null;

  public isContactCardsScrolling: boolean = false;

  public departments: any[] = [];
  public selectedDepartmentFormArray: any[] = [];
  public isDepartmentContactCardOpen: boolean = false;

  public isDirty: boolean;

  public officeName: string = null;

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

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private settingsLocationService: SettingsLocationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getCompanyOfficeDropdowns();

    if (this.editData?.type === 'edit') {
      this.editCompanyOfficeById(this.editData.id);
    }
  }

  private createForm() {
    this.officeForm = this.formBuilder.group({
      isOwner: [false],
      name: [null, [Validators.required, ...officeNameValidation]],
      address: [null, [Validators.required, ...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      phone: [null, [Validators.required, phoneFaxRegex]],
      extensionPhone: [null, [...phoneExtension]],
      email: [null],
      departmentContacts: this.formBuilder.array([]),
      rent: [null, rentValidation],
      payPeriod: [null],
      monthlyDay: [null],
      weeklyDay: [null],
    });

    this.inputService.customInputValidator(
      this.officeForm.get('email'),
      'email',
      this.destroy$
    );
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
        if (this.officeForm.invalid) {
          this.inputService.markInvalid(this.officeForm);
          return;
        }
        if (this.editData?.type === 'edit') {
          this.updateCompanyOffice(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addCompanyOffice();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        this.deleteCompanyOfficeById(this.editData.id);
        this.modalService.setModalSpinner({ action: 'delete', status: true });

        break;
      }
      default: {
        break;
      }
    }
  }

  public get departmentContacts(): FormArray {
    return this.officeForm.get('departmentContacts') as FormArray;
  }

  private createDepartmentContacts(data?: {
    id: any;
    departmentId: any;
    phone: any;
    extensionPhone: any;
    email: any;
  }): FormGroup {
    return this.formBuilder.group({
      id: [data?.id ? data.id : 0],
      departmentId: [
        data?.departmentId ? data.departmentId : null,
        [Validators.required, ...departmentValidation],
      ],
      phone: [
        data?.phone ? data.phone : null,
        [Validators.required, phoneFaxRegex],
      ],
      extensionPhone: [data?.extensionPhone ? data.extensionPhone : null],
      email: [data?.email ? data.email : null, [Validators.required]],
    });
  }

  public addDepartmentContacts(event: { check: boolean; action: string }) {
    const form = this.createDepartmentContacts();
    if (event.check) {
      this.departmentContacts.push(this.createDepartmentContacts());
    }

    this.inputService.customInputValidator(
      form.get('email'),
      'email',
      this.destroy$
    );
  }

  public removeDepartmentContacts(id: number) {
    this.departmentContacts.removeAt(id);
    this.selectedDepartmentFormArray.splice(id, 1);
  }

  public onSelectContactDepartment(event: any, index: number) {
    this.selectedDepartmentFormArray[index] = event;
  }

  public onHandleAddress(event: {
    address: AddressEntity | any;
    valid: boolean;
  }): void {
    if (event.valid) this.selectedAddress = event.address;
  }

  public onScrollingDepartmentContacts(event: any) {
    this.isContactCardsScrolling = event.target.scrollLeft > 1;
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'pay-period': {
        this.selectedPayPeriod = event;

        this.officeForm.get('monthlyDay').patchValue(null);
        this.officeForm.get('weeklyDay').patchValue(null);
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

  private updateCompanyOffice(id: number) {
    const { address, addressUnit, departmentContacts, rent, ...form } =
      this.officeForm.value;

    let newData: UpdateCompanyOfficeCommand = {
      id: id,
      ...form,
      address: { ...this.selectedAddress, addressUnit: addressUnit },
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
      rent: rent ? convertThousanSepInNumber(rent) : null,
    };

    for (let index = 0; index < departmentContacts.length; index++) {
      departmentContacts[index].departmentId =
        this.selectedDepartmentFormArray[index].id;
    }

    newData = {
      ...newData,
      departmentContacts,
    };

    this.settingsLocationService
      .updateCompanyOffice(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfuly updated company office',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            "Can't update company office",
            'Error'
          );
        },
      });
  }

  private addCompanyOffice() {
    const { address, addressUnit, departmentContacts, rent, ...form } =
      this.officeForm.value;

    let newData: CreateCompanyOfficeCommand = {
      ...form,
      address: { ...this.selectedAddress, addressUnit: addressUnit },
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
      rent: rent ? convertThousanSepInNumber(rent) : null,
    };

    for (let index = 0; index < departmentContacts.length; index++) {
      departmentContacts[index].departmentId =
        this.selectedDepartmentFormArray[index].id;
    }

    newData = {
      ...newData,
      departmentContacts,
    };

    this.settingsLocationService
      .addCompanyOffice(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfuly created company office',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            "Can't create company office",
            'Error'
          );
        },
      });
  }

  private deleteCompanyOfficeById(id: number) {
    this.settingsLocationService
      .deleteCompanyOfficeById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfuly delete company office',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            "Can't delete company office",
            'Error'
          );
        },
      });
  }

  private editCompanyOfficeById(id: number) {
    this.settingsLocationService
      .getCompanyOfficeById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CompanyOfficeResponse) => {
          this.officeForm.patchValue({
            isOwner: res.isOwner,
            name: res.name,
            address: res.address.address,
            addressUnit: res.address.addressUnit,
            phone: res.phone,
            extensionPhone: res.extensionPhone,
            email: res.email,
            rent: res.rent ? convertNumberInThousandSep(res.rent) : null,
            payPeriod: res.payPeriod ? res.payPeriod.name : null,
            monthlyDay: res.payPeriod?.name
              ? res.payPeriod.name === 'Monthly'
                ? res.monthlyDay.name
                : res.weeklyDay.name
              : null,
          });
          this.officeName = res.name;
          this.selectedAddress = res.address;
          this.selectedPayPeriod = res.payPeriod;

          this.selectedDay = res.payPeriod
            ? res.payPeriod.name === 'Monthly'
              ? res.monthlyDay
              : res.weeklyDay
            : null;

          if (res.extensionPhone) {
            this.isPhoneExtExist = true;
          }

          for (let index = 0; index < res.departmentContacts.length; index++) {
            this.departmentContacts.push(
              this.createDepartmentContacts({
                id: res.departmentContacts[index].id,
                departmentId: res.departmentContacts[index].department.name,
                phone: res.departmentContacts[index].phone,
                extensionPhone: res.departmentContacts[index].extensionPhone,
                email: res.departmentContacts[index].email,
              })
            );

            this.selectedDepartmentFormArray[index] =
              res.departmentContacts[index].department;
          }
        },
        error: () => {
          this.notificationService.error("Can't load company office ", 'Error');
        },
      });
  }

  private getCompanyOfficeDropdowns() {
    this.settingsLocationService
      .getModalDropdowns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CompanyOfficeModalResponse) => {
          this.monthlyDays = res.payPeriodMonthly;
          this.payPeriods = res.payPeriod;
          this.departments = res.departments;
          this.weeklyDays = res.dayOfWeek;
        },
        error: () => {
          this.notificationService.error(
            "Can't load company office dropdowns",
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
