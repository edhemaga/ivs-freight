import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';

@Component({
  selector: 'app-repair-order-modal',
  templateUrl: './repair-order-modal.component.html',
  styleUrls: ['./repair-order-modal.component.scss'],
})
export class RepairOrderModalComponent implements OnInit, OnDestroy {
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
  public labelsRepairShop: any = [];

  public services: any[] = [
    {
      id: 1,
      serviceType: 'Mobile',
      svg: 'assets/svg/common/repair-services/ic_mobile.svg',
      active: false,
    },
    {
      id: 2,
      serviceType: 'Shop',
      svg: 'assets/svg/common/repair-services/ic_shop.svg',
      active: false,
    },
    {
      id: 3,
      serviceType: 'Towing',
      svg: 'assets/svg/common/repair-services/ic_towing.svg',
      active: false,
    },
    {
      id: 4,
      serviceType: 'Parts',
      svg: 'assets/svg/common/repair-services/ic_parts.svg',
      active: false,
    },
    {
      id: 5,
      serviceType: 'Tire',
      svg: 'assets/svg/common/repair-services/ic_tire.svg',
      active: false,
    },
    {
      id: 6,
      serviceType: 'Dealer',
      svg: 'assets/svg/common/repair-services/ic_dealer.svg',
      active: false,
    },
  ];

  public documents: any[] = [];

  public selectedUnit: any = null;
  public selectedRepairShop: any = null;

  public subtotal: { id: number; value: number }[] = [];
  public quantity: any[] = [];
  public itemsCounter: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService
  ) {}

  ngOnInit() {
    this.createForm();
    this.onTypeOfRepair(this.typeOfRepair);
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

  public onModalAction(data) {}

  public onTypeOfRepair(event: any) {
    this.typeOfRepair = [...event];
    this.typeOfRepair.forEach((item) => {
      if (item.checked) {
        this.repairOrderForm.get('repairType').patchValue(item.label);
      }
    });

    if (this.repairOrderForm.get('repairType')?.value === 'Truck') {
      this.inputService.changeValidators(
        this.repairOrderForm.get('repairType')
      );
    } else {
      this.inputService.changeValidators(
        this.repairOrderForm.get('repairType'),
        false
      );
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

  ngOnDestroy(): void {}
}
