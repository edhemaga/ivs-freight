import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressEntity } from 'appcoretruckassist';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs';
import { tab_modal_animation } from 'src/app/core/components/shared/animations/tabs-modal.animation';
import {
  emailRegex,
  phoneRegex,
} from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { calculateParkingSlot } from 'src/app/core/utils/methods.calculations';

@UntilDestroy()
@Component({
  selector: 'app-settings-parking-modal',
  templateUrl: './settings-parking-modal.component.html',
  styleUrls: ['./settings-parking-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  providers: [ModalService, FormService],
})
export class SettingsParkingModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public parkingForm: FormGroup;

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

  public gateBtns = [
    {
      id: 511,
      label: 'Yes',
      value: 'yes',
      name: 'gate',
      checked: false,
    },
    {
      id: 522,
      label: 'No',
      value: 'no',
      name: 'gate',
      checked: false,
    },
  ];

  public cameraBtns = [
    {
      id: 363,
      label: 'Yes',
      value: 'yes',
      name: 'camera',
      checked: false,
    },
    {
      id: 367,
      label: 'No',
      value: 'no',
      name: 'camera',
      checked: false,
    },
  ];

  public parkingSlots: any[] = [
    {
      id: 1,
      value: 0,
    },
    {
      id: 2,
      value: 0,
    },
  ];

  public selectedAddress: AddressEntity = null;
  public selectedPayPeriod: any = null;
  public selectedDay: any = null;

  public isPhoneExtExist: boolean = false;

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();
    this.isCheckedCompanyOwned();
    this.parkingSlot();
    this.fullParkingSlot();
  }

  private createForm() {
    this.parkingForm = this.formBuilder.group({
      companyOwned: [false],
      parkingName: [null, Validators.required],
      address: [null, Validators.required],
      addressUnit: [null, Validators.maxLength(6)],
      phone: [null, phoneRegex],
      phoneExtension: [null],
      email: [null, emailRegex],
      parkingSlot: [null],
      fullParkingSlot: [null],
      gate: [null],
      securityCamera: [null],
      rent: [null],
      payPeriod: [null],
      day: [null],
    });

    // this.formService.checkFormChange(this.parkingForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    let dotAnimation = document.querySelector('.animation-two-tabs');
    this.animationObject = {
      value: this.selectedTab,
      params: { height: `${dotAnimation.getClientRects()[0].height}px` },
    };
  }

  public openCloseCheckboxCard(event: any) {
    if (this.parkingForm.get('companyOwned').value) {
      event.preventDefault();
      event.stopPropagation();
      this.parkingForm.get('companyOwned').setValue(false);
    }
  }

  public isCheckedCompanyOwned() {
    this.parkingForm
      .get('companyOwned')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(
            this.parkingForm.get('parkingName')
          );
          this.inputService.changeValidators(this.parkingForm.get('address'));
        } else {
          this.inputService.changeValidators(
            this.parkingForm.get('parkingName'),
            false
          );
          this.inputService.changeValidators(
            this.parkingForm.get('address'),
            false
          );
        }
      });
  }

  public onModalAction(data: { action: string; bool: boolean }): void {
    switch (data.action) {
      case 'close': {
        this.parkingForm.reset();
        break;
      }
      case 'save': {
        if (this.parkingForm.invalid) {
          this.inputService.markInvalid(this.parkingForm);
          return;
        }
        if (this.editData) {
          this.updateParking(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addParking();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        if (this.editData) {
          this.deleteParkingById(this.editData.id);
          this.modalService.setModalSpinner({ action: 'delete', status: true });
        }

        break;
      }
      default: {
        break;
      }
    }
  }

  public onHandleAddress(event: {
    address: AddressEntity | any;
    valid: boolean;
  }): void {
    if (event.valid) this.selectedAddress = event.address;
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'pay-period': {
        this.selectedPayPeriod = event;
        break;
      }
      case 'day': {
        this.selectedDay = event;
        break;
      }
      case 'gate': {
        this.gateBtns = [...event];
        this.gateBtns.forEach((item) => {
          if (item.checked) {
            this.parkingForm.get('gate').patchValue(item.label);
          }
        });
        break;
      }
      case 'camera': {
        this.cameraBtns = [...event];
        this.cameraBtns.forEach((item) => {
          if (item.checked) {
            this.parkingForm.get('securityCamera').patchValue(item.label);
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  private parkingSlot() {
    this.parkingForm
      .get('parkingSlot')
      .valueChanges.pipe(debounceTime(1000), untilDestroyed(this))
      .subscribe((value) => {
        this.parkingSlots = [...this.parkingSlots];
        this.parkingSlots[0].value = calculateParkingSlot(
          value,
          this.parkingForm.get('parkingSlot')
        );
      });
  }

  private fullParkingSlot() {
    this.parkingForm
      .get('fullParkingSlot')
      .valueChanges.pipe(debounceTime(1000), untilDestroyed(this))
      .subscribe((value) => {
        this.parkingSlots = [...this.parkingSlots];
        this.parkingSlots[1].value = calculateParkingSlot(
          value,
          this.parkingForm.get('fullParkingSlot')
        );
      });
  }

  private updateParking(id: number) {}

  private addParking() {}

  private deleteParkingById(id: number) {}

  ngOnDestroy(): void {}
}
