import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressEntity } from 'appcoretruckassist';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime } from 'rxjs';
import { tab_modal_animation } from 'src/app/core/components/shared/animations/tabs-modal.animation';
import {
  emailRegex,
  phoneRegex,
} from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-settings-parking-modal',
  templateUrl: './settings-parking-modal.component.html',
  styleUrls: ['./settings-parking-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
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

  public selectedAddress: AddressEntity = null;
  public selectedPayPeriod: any = null;
  public selectedDay: any = null;

  public isPhoneExtExist: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService
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
    this.selectedAddress = event.address;
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

  private parkingSlot() {
    this.parkingForm
      .get('parkingSlot')
      .valueChanges.pipe(debounceTime(1000), untilDestroyed(this))
      .subscribe((value) => {
        this.calculateParkingSlot(value, 0, 'parkingSlot');
      });
  }

  public fullParkingSlot() {
    this.parkingForm
      .get('fullParkingSlot')
      .valueChanges.pipe(debounceTime(1000), untilDestroyed(this))
      .subscribe((value) => {
        this.calculateParkingSlot(value, 1, 'fullParkingSlot');
      });
  }

  private updateParking(id: number) {}

  private addParking() {}

  private deleteParkingById(id: number) {}

  private calculateParkingSlot(
    value: string,
    index: number,
    controlName: string
  ) {
    let arrayStops: any[] = value.split(',');
    console.log('ITEMS AFTER SPLITTING BY , = ', arrayStops);
    if(arrayStops.includes(',') || arrayStops.includes('')) {
      arrayStops.pop();
            this.parkingForm
              .get(controlName)
              .patchValue(value.substring(0, value.lastIndexOf(',')));
              return;
    }
    this.parkingSlots = [...this.parkingSlots];
    this.parkingSlots[index].value = arrayStops
      .map((item: string, index: number) => {
        // First check if value has '-'
        if (item.includes('-')) {
          const doubleValues: string[] = item.split('-');
          console.log('Double values after splitting by - = ', doubleValues);
          const foundSameElements: boolean = arrayStops.some((array1) =>
            doubleValues.includes(array1)
          );
          console.log('Has duplicate values =  ', foundSameElements);
          // Second check if values exist, denided, delete, return
          if (foundSameElements) {
            arrayStops.pop();
            this.parkingForm
              .get(controlName)
              .patchValue(value.substring(0, value.lastIndexOf(',')));
            console.log('Found duplicate values');
            console.log(arrayStops)
            console.log(this.parkingForm
              .get(controlName).value)
            return;
          }
          console.log("No found dobule items ", doubleValues)
          // Third check if second value > first value
          if (!doubleValues.includes('')) {
            console.log('No empty values = ', doubleValues[0], doubleValues[1]);
            if (parseInt(doubleValues[1]) > parseInt(doubleValues[0])) {
              console.log('Second grather than first = ', doubleValues[0], doubleValues[1]);
              return parseInt(doubleValues[1]) - parseInt(doubleValues[0]);
            } else {
              arrayStops.pop();
              this.parkingForm
                .get(controlName)
                .patchValue(value.substring(0, value.lastIndexOf(',')));
                console.log('First grather than second');
                console.log(arrayStops)
                console.log(this.parkingForm
                  .get(controlName).value)
              return;
            }
          } 
          else {
            arrayStops.pop();
            this.parkingForm
              .get(controlName)
              .patchValue(value.substring(0, value.lastIndexOf(',')));
              console.log('One of two values has been empty');
              console.log(arrayStops)
              console.log(this.parkingForm
                .get(controlName).value)
            return;
          }
        } 
        else {
          console.log('NEMA  - ');
          if(arrayStops.length !== new Set(arrayStops).size) {
            console.log("HAS DUPLICATE ITEMS")
            arrayStops = [...new Set(arrayStops)]
            this.parkingForm
                .get(controlName)
                .patchValue(arrayStops.join(','))
            console.log("After Delete duplicate values ", arrayStops)
            return;
          }
          else {
            return 1;
          }
        }
      }).reduce((accumulator, item) => {
       return accumulator += item;
      }, 0);
      
  }

  ngOnDestroy(): void {}
}
