import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressEntity } from 'appcoretruckassist';
import { tab_modal_animation } from 'src/app/core/components/shared/animations/tabs-modal.animation';
import { Address } from 'src/app/core/components/shared/model/address';
import { emailRegex, phoneRegex } from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-settings-parking-modal',
  templateUrl: './settings-parking-modal.component.html',
  styleUrls: ['./settings-parking-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')]
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
      id: 3,
      label: 'Yes',
      value: 'yes',
      name: 'camera',
      checked: false,
    },
    {
      id: 4,
      label: 'No',
      value: 'no',
      name: 'camera',
      checked: false,
    },
  ];

  public selectedAddress: Address | AddressEntity = null;
  public selectedPayPeriod: any = null;
  public selectedDay: any = null;

  public isPhoneExtExist: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private notificationService: NotificationService
  ) { }
 

  ngOnInit() {
    this.createForm();
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
      day: [null]
    })
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

  public onModalAction(data: { action: string; bool: boolean }): void {
    if (data.action === 'close') {
      this.parkingForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        if (this.parkingForm.invalid) {
          this.inputService.markInvalid(this.parkingForm);
          return;
        }
        if (this.editData) {
          this.updateParking(this.editData.id);
        } else {
          this.addParking();
        }
      }

      // Delete
      if (data.action === 'delete' && this.editData) {
        this.deleteParkingById(this.editData.id);
      }

      this.ngbActiveModal.close();
    }
  }

  public onHandleAddress(event: {
    address: Address | any;
    valid: boolean;
  }): void {
    this.selectedAddress = event.address;
    if (!event.valid) {
      this.parkingForm.get('addres').setErrors({ invalid: true });
    }
  }

  public onSelectPayPeriod(event) {
    this.selectedPayPeriod = event;
  }

  public onSelectDay(event) {
    this.selectedDay = event;
  }

  public changeGate(event: any) {
    this.gateBtns = [...event];
    this.gateBtns.forEach((item) => {
      if (item.checked) {
        this.parkingForm.get('gate').patchValue(item.label);
      }
    });
  }

  public changeCamera(event: any) {
    this.cameraBtns = [...event];
    this.cameraBtns.forEach((item) => {
      if (item.checked) {
        this.parkingForm.get('securityCamera').patchValue(item.label);
      }
    });
  }

  private updateParking(id: number) {}

  private addParking() {}

  private deleteParkingById(id: number) {}

  ngOnDestroy(): void {}
}
