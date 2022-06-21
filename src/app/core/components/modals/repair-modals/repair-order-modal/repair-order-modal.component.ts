import { convertThousanSepInNumber } from './../../../../utils/methods.calculations';
import { SumArraysPipe } from './../../../../pipes/sum-arrays.pipe';
import { convertDateToBackend } from 'src/app/core/utils/methods.calculations';
import { NotificationService } from './../../../../services/notification/notification.service';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { RepairTService } from '../../../repair/state/repair.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import {
  CreateRepairCommand,
  RepairModalResponse,
  RepairResponse,
  RepairShopResponse,
} from 'appcoretruckassist';
import { NgbActiveModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { RepairPmModalComponent } from '../repair-pm-modal/repair-pm-modal.component';
import { ShopTService } from '../../../repair/state/shop.service';

@Component({
  selector: 'app-repair-order-modal',
  templateUrl: './repair-order-modal.component.html',
  styleUrls: ['./repair-order-modal.component.scss'],
  providers: [SumArraysPipe],
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

  // Unit
  public labelsUnit: any[] = [];
  public unitTrucks: any[] = [];
  public unitTrailers: any[] = [];
  public selectedUnit: any = null;

  // Repair Shop
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
    private repairShopService: ShopTService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private ngbActiveModal: NgbActiveModal,
    private sumArrayPipe: SumArraysPipe
  ) {}

  ngOnInit() {
    this.createForm();
    this.getRepairDropdowns();

    const timeout = setTimeout(() => {
      if (this.editData?.type) {
        if (this.editData.type.includes('truck')) {
          this.onTypeOfRepair(this.typeOfRepair);
        } else {
          this.onTypeOfRepair(
            this.typeOfRepair.map((item) => {
              if (item.label === 'Trailer') {
                item.checked = true;
              } else {
                item.checked = false;
              }
              return item;
            })
          );
        }
      } else {
        this.onTypeOfRepair(this.typeOfRepair);
      }
      clearTimeout(timeout);
    }, 150);

    if (this.editData?.type.includes('edit')) {
      this.editData = {
        ...this.editData,
        id: 1,
      };
      this.editRepairById(this.editData.id);
    }
  }

  private createForm() {
    this.repairOrderForm = this.formBuilder.group({
      repairType: ['Bill'],
      unitType: ['Truck'],
      unit: [null, Validators.required],
      odometer: [null],
      date: [null, Validators.required],
      invoice: [null],
      repairShopId: [null, Validators.required],
      items: this.formBuilder.array([]),
      note: [null],
    });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    console.log(this.editData);
    switch (data.action) {
      case 'close': {
        this.repairOrderForm.reset();
        break;
      }
      case 'save': {
        if (this.repairOrderForm.invalid) {
          this.inputService.markInvalid(this.repairOrderForm);
          return;
        }
        if (this.editData.type.includes('edit')) {
          this.updateRepair(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addRepair();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        if (this.editData) {
          this.deleteRepair(this.editData.id);
          this.modalService.setModalSpinner({ action: 'delete', status: true });
        }
        break;
      }
      default: {
        break;
      }
    }
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
      quantity: [null],
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
    if (formControlName === 'quantity') {
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
            this.items.at(index).get('quantity').patchValue(1);
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
    if (this.selectedTab === 2) {
      this.inputService.changeValidators(
        this.repairOrderForm.get('repairShopId'),
        false
      );
      this.repairOrderForm.get('repairType').patchValue('Bill');
    } else {
      this.inputService.changeValidators(
        this.repairOrderForm.get('repairShopId')
      );
      this.repairOrderForm.get('repairType').patchValue('Order');
    }
  }

  public onTypeOfRepair(event: any) {
    this.typeOfRepair = [...event];
    this.typeOfRepair.forEach((item) => {
      if (item.checked) {
        this.repairOrderForm.get('unitType').patchValue(item.label);
      }
    });

    if (this.repairOrderForm.get('unitType')?.value === 'Truck') {
      this.pmOptions = this.pmTrucks;
      this.labelsUnit = this.unitTrucks;
    } else {
      this.pmOptions = this.pmTrailers;
      this.labelsUnit = this.unitTrailers;
    }

    this.selectedPM = {
      id: 0,
      logoName: 'assets/svg/common/repair-pm/ic_default_pm.svg',
      mileage: 0,
      passedMileage: null,
      status: { name: 'Active', id: 2 },
      title: 'Turbo',
    };
  }

  public onSelectDropDown(event: any, action: string) {
    switch (action) {
      case 'repair-unit': {
        this.selectedUnit = event;
        break;
      }
      case 'repair-shop': {
        this.selectedRepairShop = event;
        console.log(this.selectedRepairShop);
        this.repairShopService
          .getRepairShopById(this.selectedRepairShop.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: RepairShopResponse) => {
              this.selectedRepairShop = {
                id: res.id,
                name: res.name,
                phone: res.phone,
                email: res.email,
                address: res.address.address,
              };
            },
            error: () => {
              this.notificationService.error(
                `Cant' get repair shop by ${this.selectedRepairShop.id}`,
                'Error'
              );
            },
          });
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

          this.unitTrucks = this.labelsUnit = res.trucks.map((item) => {
            return {
              id: item.id,
              name: item.truckNumber,
            };
          });

          this.unitTrailers = res.trailers.map((item) => {
            return {
              id: item.id,
              name: item.trailerNumber,
            };
          });

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
    if (this.selectedPM.title === 'Add New') {
      this.ngbActiveModal.close();
      const timeout = setTimeout(() => {
        this.modalService.openModal(
          RepairPmModalComponent,
          { size: 'small' },
          {
            type: 'new',
            header: this.repairOrderForm.get('unitType').value,
            action: 'generic-pm',
          }
        );
        clearTimeout(timeout);
      }, 100);
    }
    this.popoverRef.close();
  }

  private addRepair() {
    const { repairShopId, items, date, unit, odometer, ...form } =
      this.repairOrderForm.value;

    const newData: CreateRepairCommand = {
      ...form,
      date: convertDateToBackend(date),
      truckId:
        this.repairOrderForm.get('unitType').value === 'Truck'
          ? this.selectedUnit.id
          : null,
      trailerId:
        this.repairOrderForm.get('unitType').value === 'Trailer'
          ? this.selectedUnit.id
          : null,
      repairShopId: this.selectedRepairShop.id,
      odometer: odometer ? convertThousanSepInNumber(odometer) : null,
      total: this.sumArrayPipe.transform(this.subtotal),
      serviceTypes: this.services.map((item) => {
        return {
          serviceType: item.serviceType,
          active: item.active,
        };
      }),
      items: this.premmapedItems(),
    };

    console.log(newData);

    this.repairService
      .addRepair(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Repair successfully created.',
            'Success'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Repair can't be created.", 'Error');
        },
      });
  }

  private updateRepair(id: number) {}

  private deleteRepair(id: number) {}

  private editRepairById(id: number) {
    console.log(id);
    this.repairService
      .getRepairById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: RepairResponse) => {
          // this.repairOrderForm.patchValue({
          //   repairType: res.repairType,
          //   unitType: res.unitType,
          //   unit: [null, Validators.required],
          //   odometer: [null],
          //   date: [null, Validators.required],
          //   invoice: [null],
          //   repairShopId: [null, Validators.required],
          //   items: this.formBuilder.array([]),
          //   note: [null],
          // });
        },
        error: () => {
          this.notificationService.error("Repair can't be loaded.", 'Error');
        },
      });
  }

  private premmapedItems() {
    return this.items.controls.map((item, index) => {
      return {
        description: item.get('description').value,
        price: item.get('price').value
          ? convertThousanSepInNumber(item.get('price').value)
          : null,
        quantity: item.get('quantity').value,
        subtotal: this.subtotal[index].value
          ? this.subtotal[index].value
          : null,
        pmTruckId:
          this.repairOrderForm.get('unitType').value === 'Truck'
            ? this.selectedPM
              ? this.selectedPM.id
              : null
            : null,
        pmTrailerId:
          this.repairOrderForm.get('unitType').value === 'Trailer'
            ? this.selectedPM
              ? this.selectedPM.id
              : null
            : null,
      };
    });
  }

  ngOnDestroy(): void {}
}
