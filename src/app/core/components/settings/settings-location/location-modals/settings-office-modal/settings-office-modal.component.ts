import { FormArray, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import {
  emailRegex,
  phoneRegex,
} from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';
import { AddressEntity } from 'appcoretruckassist';
import { tab_modal_animation } from 'src/app/core/components/shared/animations/tabs-modal.animation';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';

@Component({
  selector: 'app-settings-office-modal',
  templateUrl: './settings-office-modal.component.html',
  styleUrls: ['./settings-office-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsOfficeModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public officeForm: FormGroup;

  public selectedTab: number = 1;
  public selectedAddress: AddressEntity = null;
  public isPhoneExtExist: boolean = false;

  public selectedPayPeriod: any = null;
  public selectedDay: any = null;

  public isContactCardsScrolling: boolean = false;
  public selectedDepartmentFormArray: any[] = [];

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
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.isCheckedCompanyOwned();
  }

  private createForm() {
    this.officeForm = this.formBuilder.group({
      companyOwned: [false],
      officeName: [null, Validators.required],
      address: [null, Validators.required],
      addressUnit: [null, Validators.maxLength(6)],
      phone: [null, Validators.required, phoneRegex],
      phoneExtension: [null],
      email: [null, emailRegex],
      departmentContacts: this.formBuilder.array([]),
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
    switch (data.action) {
      case 'clsoe': {
        this.officeForm.reset();
        break;
      }
      case 'save': {
        if (this.officeForm.invalid) {
          this.inputService.markInvalid(this.officeForm);
          return;
        }
        if (this.editData) {
          this.updateOffice(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addOffice();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        if (this.editData) {
          this.deleteOfficeById(this.editData.id);
          this.modalService.setModalSpinner({ action: 'delete', status: true });
        }
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

  private createDepartmentContacts(): FormGroup {
    return this.formBuilder.group({
      departmentId: [null],
      phone: [null, phoneRegex],
      extensionPhone: [null],
      email: [null, emailRegex],
    });
  }

  public addDepartmentContacts(event: any) {
    if (event) {
      this.departmentContacts.push(this.createDepartmentContacts());
    }
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
    this.selectedAddress = event.address;
  }

  public onScrollingDepartmentContacts(event: any) {
    if (event.target.scrollLeft > 1) {
      this.isContactCardsScrolling = true;
    } else {
      this.isContactCardsScrolling = false;
    }
  }

  public openCloseCheckboxCard(event: any) {
    if (this.officeForm.get('companyOwned').value) {
      event.preventDefault();
      event.stopPropagation();
      this.officeForm.get('companyOwned').setValue(false);
    }
  }

  private isCheckedCompanyOwned() {
    this.officeForm
      .get('companyOwned')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(this.officeForm.get('officeName'));
          this.inputService.changeValidators(this.officeForm.get('address'));
          this.inputService.changeValidators(
            this.officeForm.get('phone'),
            true,
            [phoneRegex]
          );
        } else {
          this.inputService.changeValidators(
            this.officeForm.get('officeName'),
            false
          );
          this.inputService.changeValidators(
            this.officeForm.get('address'),
            false
          );
          this.inputService.changeValidators(
            this.officeForm.get('phone'),
            false
          );
        }
      });
  }

  public onAction(event: any, action: string) {
    switch (action) {
      case 'pay-period': {
        this.selectedPayPeriod = event;
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

  private updateOffice(id: number) {}

  private addOffice() {}

  private deleteOfficeById(id: number) {}

  ngOnDestroy(): void {}
}
