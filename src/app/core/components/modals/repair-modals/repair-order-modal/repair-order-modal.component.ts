import { NotificationService } from './../../../../services/notification/notification.service';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { RepairTService } from '../../../repair/state/repair.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { RepairModalResponse } from 'appcoretruckassist';
import { NgbActiveModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { RepairPmModalComponent } from '../repair-pm-modal/repair-pm-modal.component';

@Component({
  selector: 'app-repair-order-modal',
  templateUrl: './repair-order-modal.component.html',
  styleUrls: ['./repair-order-modal.component.scss'],
})
export class RepairOrderModalComponent implements OnInit, OnDestroy {
  @ViewChild('t2') public popoverRef: NgbPopover;

  @Input() editData: any;

  public repairOrderForm: FormGroup;

  public selectedTab: number = 1;
  public headerTabs = [
    {
      id: 1,
      label: 'Bill',
      value: 'Bill',
      name: 'header-tabs',
      checked: true,
    },
    {
      id: 2,
      label: 'Order',
      value: 'Order',
      name: 'header-tabs',
      checked: false,
    },
  ];

  public typeOfRepair = [
    {
      id: 5231,
      label: 'Truck',
      value: 'Truck',
      name: 'repair-type',
      checked: true,
    },
    {
      id: 5232,
      label: 'Trailer',
      value: 'Trailer',
      name: 'repair-type',
      checked: false,
    },
  ];

  public labelsUnit: any[] = [];
  public selectedUnit: any = null;

  public labelsRepairShop: any = [];
  public selectedRepairShop: any = null;

  public services: any[] = [];
  public documents: any[] = [];

  // Sum of items
  public subtotal: { id: number; value: number }[] = [];
  public quantity: any[] = [];
  public itemsCounter: number = 0;

  // PMs
  public selectedPM: any = {
    id: 0,
    logoName: 'assets/svg/common/repair-pm/ic_default_pm.svg',
    mileage: 0,
    passedMileage: null,
    status: { name: 'Active', id: 2 },
    title: 'Turbo',
  };
  public pmOptions: any[] = []; // this array fill when truck/trailer switch change
  private pmTrucks: any[] = [];
  private pmTrailers: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private repairService: RepairTService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.createForm();
    this.onTypeOfRepair(this.typeOfRepair);
    this.getRepairDropdowns();
  }

  private createForm() {
    this.repairOrderForm = this.formBuilder.group({
      repairType: [null],
      unit: [null, Validators.required],
      odometer: [null],
      date: [null, Validators.required],
      invoice: [null],
      repairShop: [null, Validators.required],
      items: this.formBuilder.array([]),
      note: [null],
    });
  }

  public onModalAction(data) {}

  public get items(): FormArray {
    return this.repairOrderForm.get('items') as FormArray;
  }

  private createItems(id: number): FormGroup {
    return this.formBuilder.group({
      id: [id],
      description: [null],
      pm: [null],
      price: [null],
      qty: [null],
      subtotal: [null],
    });
  }

  public addItems(event: any) {
    if (event) {
      this.items.push(this.createItems(++this.itemsCounter));
      this.subtotal = [...this.subtotal, { id: this.itemsCounter, value: 0 }];
    }
  }

  public removeItems(id: number) {
    this.items.removeAt(id);

    const afterDeleting = this.subtotal.splice(id, 1);

    this.subtotal = this.subtotal.filter(
      (item) => item.id !== afterDeleting[0].id
    );

    if (!this.subtotal.length) {
      this.subtotal = [];
      this.itemsCounter = 0;
      this.quantity = [];
    }
  }

  public onChange(formControlName: string, index: number) {
    if (formControlName === 'qty') {
      this.items
        .at(index)
        .get(formControlName)
        .valueChanges.pipe(untilDestroyed(this))
        .subscribe((value) => {
          this.quantity[index] = value;
          this.subtotal = [...this.subtotal];
          const price = parseFloat(
            this.items
              .at(index)
              .get('price')
              .value?.toString()
              .replace(/,/g, '')
          );
          this.subtotal[index].value = this.quantity[index] * price;
        });
    } else {
      this.items
        .at(index)
        .get(formControlName)
        .valueChanges.pipe(untilDestroyed(this))
        .subscribe((value) => {
          if (!this.quantity[index] || this.quantity[index] === 0) {
            this.quantity[index] = 1;
            this.items.at(index).get('qty').patchValue(1);
          }
          if (!value) {
            value = 0;
          }
          const price = parseFloat(value.toString().replace(/,/g, ''));
          this.subtotal = [...this.subtotal];
          this.subtotal[index].value = this.quantity[index] * price;
        });
    }
  }

  public onModalHeaderTabChange(event: any) {
    this.selectedTab = event.id;
  }

  public onTypeOfRepair(event: any) {
    this.typeOfRepair = [...event];
    this.typeOfRepair.forEach((item) => {
      if (item.checked) {
        this.repairOrderForm.get('repairType').patchValue(item.label);
      }
    });

    if (this.repairOrderForm.get('repairType')?.value === 'Truck') {
      this.pmOptions = this.pmTrucks;
      if (!this.pmOptions.find((item) => item.title === 'Add New')) {
        this.pmOptions.push({
          id: this.pmTrucks.length + 1,
          logoName: null,
          mileage: null,
          passedMileage: null,
          status: null,
          title: 'Add New',
        });
      }
    } else {
      this.pmOptions = this.pmTrailers;
      if (!this.pmOptions.find((item) => item.title === 'Add New')) {
        this.pmOptions.push({
          id: this.pmTrucks.length + 1,
          logoName: null,
          mileage: null,
          passedMileage: null,
          status: null,
          title: 'Add New',
        });
      }
    }
  }

  public onSelectDropDown(event: any, action: string) {
    switch (action) {
      case 'repair-unit': {
        this.selectedUnit = event;
        break;
      }
      case 'repair-shop': {
        this.selectedRepairShop = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  public pickedServices() {
    return this.services.filter((item) => item.active).length;
  }

  public onFilesEvent(event: any) {
    console.log(event);
  }

  public identity(index: number, item: any): string {
    return item.value;
  }

  private getRepairDropdowns() {
    this.repairService
      .getRepairModalDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: RepairModalResponse) => {
          console.log(res);
          this.pmTrucks = this.pmOptions = res.pmTrucks.map((item) => {
            return {
              ...item,
              logoName: `assets/svg/common/repair-pm/${item.logoName}`,
            };
          });
          if (!this.pmTrucks.find((item) => item.title === 'Add New')) {
            this.pmTrucks.push({
              id: this.pmTrucks.length + 1,
              logoName: null,
              mileage: null,
              passedMileage: null,
              status: null,
              title: 'Add New',
            });
          }
          this.pmTrailers = res.pmTrailers.map((item) => {
            return {
              ...item,
              logoName: `assets/svg/common/repair-pm/${item.logoName}`,
            };
          });
          if (!this.pmTrailers.find((item) => item.title === 'Add New')) {
            this.pmTrailers.push({
              id: this.pmTrailers.length + 1,
              logoName: null,
              mileage: null,
              passedMileage: null,
              status: null,
              title: 'Add New',
            });
          }
          this.services = res.serviceTypes.map((item) => {
            return {
              id: item.serviceType.id,
              serviceType: item.serviceType.name,
              svg: `assets/svg/common/repair-services/${item.logoName}`,
              active: false,
            };
          });
          this.labelsRepairShop = res.repairShops;
        },
        error: () => {
          this.notificationService.error("Repair Dropdowns can't be loaded");
        },
      });
  }

  public onAction(action: any) {
    this.selectedPM = action;

    if (
      this.selectedPM.id !== 0 &&
      this.selectedPM.id !== this.pmOptions[this.pmOptions.length - 1]
    ) {
      this.inputService.changeValidators(this.repairOrderForm.get('odometer'));
    } else {
      this.inputService.changeValidators(
        this.repairOrderForm.get('odometer'),
        false
      );
    }
    if (this.pmOptions[this.pmOptions.length - 1].title === 'Add New') {
      this.ngbActiveModal.close();
      const timeout = setTimeout(() => {
        this.modalService.openModal(
          RepairPmModalComponent,
          { size: 'small' },
          { type: 'new', action: 'generic' }
        );
        clearTimeout(timeout);
      }, 100);
    }
    this.popoverRef.close();
  }

  ngOnDestroy(): void {}
}
