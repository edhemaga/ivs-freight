import {
  convertDateFromBackend,
  convertThousanSepInNumber,
} from './../../../../utils/methods.calculations';
import { SumArraysPipe } from './../../../../pipes/sum-arrays.pipe';
import {
  convertDateToBackend,
  convertNumberInThousandSep,
} from 'src/app/core/utils/methods.calculations';
import { NotificationService } from './../../../../services/notification/notification.service';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RepairTService } from '../../../repair/state/repair.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import {
  CreateRepairCommand,
  RepairModalResponse,
  RepairResponse,
  RepairShopResponse,
  UpdateRepairCommand,
} from 'appcoretruckassist';
import { NgbActiveModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { RepairPmModalComponent } from '../repair-pm-modal/repair-pm-modal.component';
import { FormService } from 'src/app/core/services/form/form.service';

@UntilDestroy()
@Component({
  selector: 'app-repair-order-modal',
  templateUrl: './repair-order-modal.component.html',
  styleUrls: ['./repair-order-modal.component.scss'],
  providers: [SumArraysPipe, ModalService, FormService],
})
export class RepairOrderModalComponent implements OnInit, OnDestroy {
  @ViewChild('t2') public popoverRef: NgbPopover;

  @Input() editData: any;

  public repairOrderForm: FormGroup;
  public selectedHeaderTab: number = 1;
  public headerTabs = [
    {
      id: 1,
      name: 'Bill',
      checked: true,
    },
    {
      id: 2,
      name: 'Order',
      checked: false,
    },
  ];

  public typeOfRepair = [
    {
      id: 5231,
      name: 'Truck',
      checked: true,
    },
    {
      id: 5232,
      name: 'Trailer',
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
  public selectedPM: any[] = [];
  public selectedPMIndex: number;
  public pmOptions: any[] = []; // this array fill when truck/trailer switch change
  private pmTrucks: any[] = [];
  private pmTrailers: any[] = [];

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private repairService: RepairTService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private ngbActiveModal: NgbActiveModal,
    private sumArrayPipe: SumArraysPipe,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getRepairDropdowns();
    console.log('REPAIR');
    console.log(this.editData);
    if (this.editData?.type.includes('edit')) {
      this.editRepairById(this.editData.id);
    }

    const timeout = setTimeout(() => {
      if (this.editData?.type.includes('truck')) {
        this.onTypeOfRepair(
          this.typeOfRepair.find((item) => item.name === 'Truck'),
          'true'
        );
      } else {
        this.onTypeOfRepair(
          this.typeOfRepair.find((item) => item.name === 'Trailer'),
          'true'
        );
      }
      clearTimeout(timeout);
    }, 400);
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

    // this.formService.checkFormChange(this.repairOrderForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
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
          if (this.editData.type.includes('fo')) {
            this.finishOrder(this.editData.id);
            this.modalService.setModalSpinner({ action: null, status: true });
          } else {
            this.updateRepair(this.editData.id);
            this.modalService.setModalSpinner({ action: null, status: true });
          }
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

  private createItems(data?: {
    id: number;
    description?: any;
    price?: any;
    quantity?: any;
    subtotal?: any;
    pmTruckId?: any;
    pmTrailerId?: any;
  }): FormGroup {
    return this.formBuilder.group({
      id: [data?.id ? data.id : null],
      description: [data?.description ? data.description : null],
      price: [data?.price ? data.price : null],
      quantity: [data?.quantity ? data.quantity : null],
      subtotal: [data?.subtotal ? data.subtotal : null],
      pmTruckId: [data?.pmTruckId ? data.pmTruckId : null],
      pmTrailerId: [data?.pmTrailerId ? data.pmTrailerId : null],
    });
  }

  public addItems(event: { check: boolean; action: string }) {
    if (event.check) {
      this.items.push(this.createItems({ id: ++this.itemsCounter }));
      this.subtotal = [...this.subtotal, { id: this.itemsCounter, value: 0 }];
      this.selectedPM.push({
        id: null,
        logoName: 'assets/svg/common/repair-pm/ic_custom_pm.svg',
      });
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
          const price = convertThousanSepInNumber(
            this.items.at(index).get('price').value
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
          const price = convertThousanSepInNumber(
            this.items.at(index).get('price').value
          );
          this.subtotal = [...this.subtotal];
          this.subtotal[index].value = this.quantity[index] * price;
        });
    }
  }

  public onModalHeaderTabChange(event: any) {
    this.selectedHeaderTab = event.id;
    if (event.id === 2) {
      this.inputService.changeValidators(
        this.repairOrderForm.get('repairShopId'),
        false
      );
      this.inputService.changeValidators(
        this.repairOrderForm.get('date'),
        false,
        [],
        true
      );
      this.inputService.changeValidators(
        this.repairOrderForm.get('invoice'),
        false,
        [],
        true
      );
      this.repairOrderForm.get('repairType').patchValue('Order');
    } else {
      this.inputService.changeValidators(
        this.repairOrderForm.get('repairShopId')
      );
      this.inputService.changeValidators(this.repairOrderForm.get('date'));
      this.repairOrderForm.get('repairType').patchValue('Bill');
    }

    this.headerTabs = this.headerTabs.map((item) => {
      return {
        ...item,
        checked: item.id === event.id,
      };
    });
  }

  public onTypeOfRepair(event: any, action?: string) {
    this.typeOfRepair = this.typeOfRepair.map((item) => {
      if (item.id === event.id) {
        this.repairOrderForm.get('unitType').patchValue(item.name);
      }
      return {
        ...item,
        checked: item.id == event.id,
      };
    });

    if (this.repairOrderForm.get('unitType').value === 'Truck') {
      this.pmOptions = this.pmTrucks;
      this.labelsUnit = this.unitTrucks;
    } else {
      this.pmOptions = this.pmTrailers;
      this.labelsUnit = this.unitTrailers;
    }

    if (action) {
      return;
    }

    this.repairOrderForm.get('unit').patchValue(null);
    this.selectedUnit = null;
    this.selectedPM = [];
    this.selectedPM.push({
      id: null,
      logoName: 'assets/svg/common/repair-pm/ic_custom_pm.svg',
    });
    this.selectedPMIndex = null;
  }

  public onSelectDropDown(event: any, action: string) {
    switch (action) {
      case 'repair-unit': {
        this.selectedUnit = event;
        break;
      }
      case 'repair-shop': {
        this.selectedRepairShop = event;
        this.repairService
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
                pinned: res.pinned,
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
    this.documents = event.files;
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
          console.log('DROPDOWN ', res);
          // PM Trucks
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

          // PM Trailers
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

          // Unit Trucks
          this.unitTrucks = this.labelsUnit = res.trucks.map((item) => {
            return {
              ...item,
              name: item.truckNumber,
            };
          });

          // Unit Trailers
          this.unitTrailers = res.trailers.map((item) => {
            return {
              ...item,
              name: item.trailerNumber,
            };
          });

          // Services
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

  public onAction(action: any, index: number) {
    this.selectedPM[index] = action;
    this.selectedPMIndex = index;

    if (this.selectedPM[index].title !== 'Add New') {
      this.inputService.changeValidators(this.repairOrderForm.get('odometer'));
    } else {
      this.inputService.changeValidators(
        this.repairOrderForm.get('odometer'),
        false
      );
    }
    if (this.selectedPM[index].title === 'Add New') {
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
    const { repairShopId, items, date, unit, odometer, invoice, ...form } =
      this.repairOrderForm.value;

    let newData: CreateRepairCommand = null;

    if (this.selectedHeaderTab === 2) {
      newData = {
        ...form,
        truckId:
          this.repairOrderForm.get('unitType').value === 'Truck'
            ? this.selectedUnit.id
            : null,
        trailerId:
          this.repairOrderForm.get('unitType').value === 'Trailer'
            ? this.selectedUnit.id
            : null,
        repairShopId: this.selectedRepairShop
          ? this.selectedRepairShop.id
          : null,
        serviceTypes: this.services.map((item) => {
          return {
            serviceType: item.serviceType,
            active: item.active,
          };
        }),
        items: this.premmapedItems(),
      };
    } else {
      newData = {
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
        repairShopId: this.selectedRepairShop
          ? this.selectedRepairShop.id
          : null,
        odometer: odometer ? convertThousanSepInNumber(odometer) : null,
        invoice: invoice,
        total:
          this.repairOrderForm.get('repairType').value === 'Bill'
            ? this.sumArrayPipe.transform(this.subtotal)
            : null,
        serviceTypes: this.services.map((item) => {
          return {
            serviceType: item.serviceType,
            active: item.active,
          };
        }),
        items: this.premmapedItems(),
      };
    }

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

  private updateRepair(id: number) {
    const { repairShopId, items, date, unit, odometer, invoice, ...form } =
      this.repairOrderForm.value;
    let newData: UpdateRepairCommand = null;

    if (this.selectedHeaderTab === 2) {
      newData = {
        id: id,
        ...form,
        truckId:
          this.repairOrderForm.get('unitType').value === 'Truck'
            ? this.selectedUnit.id
            : null,
        trailerId:
          this.repairOrderForm.get('unitType').value === 'Trailer'
            ? this.selectedUnit.id
            : null,
        repairShopId: this.selectedRepairShop
          ? this.selectedRepairShop.id
          : null,
        serviceTypes: this.services.map((item) => {
          return {
            serviceType: item.serviceType,
            active: item.active,
          };
        }),
        items: this.premmapedItems(),
      };
    } else {
      newData = {
        id: id,
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
        repairShopId: this.selectedRepairShop
          ? this.selectedRepairShop.id
          : null,
        odometer: odometer
          ? convertThousanSepInNumber(
              this.repairOrderForm.get('odometer').value
            )
          : null,
        total:
          this.repairOrderForm.get('repairType').value === 'Bill'
            ? this.sumArrayPipe.transform(this.subtotal)
            : null,
        invoice: invoice,
        serviceTypes: this.services.map((item) => {
          return {
            serviceType: item.serviceType,
            active: item.active,
          };
        }),
        items: this.premmapedItems(),
      };
    }

    this.repairService
      .updateRepair(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Repair successfully updated.',
            'Success'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Repair can't be updated.", 'Error');
        },
      });
  }

  private deleteRepair(id: number) {
    this.repairService
      .deleteRepairById(
        id,
        this.editData.type === 'edit-trailer' ? 'inactive' : 'active'
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Repair successfully deleted.',
            'Success'
          );
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
        },
        error: () => {
          this.notificationService.error("Repair can't be deleted.", 'Error');
        },
      });
  }

  private editRepairById(id: number) {
    this.repairService
      .getRepairById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: RepairResponse) => {
          this.repairOrderForm.patchValue({
            repairType: res.repairType ? res.repairType.name : null,
            unitType: res.unitType ? res.unitType.name : null,
            unit:
              res.unitType.name === 'Truck'
                ? res.truck.truckNumber
                : res.trailer.trailerNumber,
            odometer: res.odometer
              ? convertNumberInThousandSep(res.odometer)
              : null,
            date: res.date ? convertDateFromBackend(res.date) : null,
            invoice: res.invoice,
            repairShopId: res.repairShop ? res.repairShop.id : null,
            items: [],
            note: res.note,
          });

          // Truck/Trailer Unit number
          this.selectedUnit =
            res.unitType.name === 'Truck' ? res.truck : res.trailer;

          // Repair Services
          this.services = res.serviceTypes.map((item) => {
            return {
              id: item.serviceType.id,
              serviceType: item.serviceType.name,
              svg: `assets/svg/common/repair-services/${item.logoName}`,
              active: item.active,
            };
          });

          // Repair Shop
          if (res.repairShop?.id) {
            this.repairService
              .getRepairShopById(res.repairShop.id)
              .pipe(untilDestroyed(this))
              .subscribe({
                next: (res: RepairShopResponse) => {
                  this.selectedRepairShop = {
                    id: res.id,
                    name: res.name,
                    phone: res.phone,
                    email: res.email,
                    address: res.address.address,
                    pinned: res.pinned,
                  };
                },
                error: () => {
                  this.notificationService.error(
                    `Cant' get repair shop by ${this.selectedRepairShop.id}`,
                    'Error'
                  );
                },
              });
          }
          if (!this.editData.type.includes('fo')) {
            this.onModalHeaderTabChange(
              this.headerTabs.find((item) => item.name === res.repairType.name)
            );
          }

          this.onTypeOfRepair(
            this.typeOfRepair.find((item) => item.name === res.unitType.name),
            'edit-mode'
          );

          // Repair Items
          if (res.items.length) {
            for (const iterator of res.items) {
              this.items.push(
                this.createItems({
                  id: iterator.id,
                  description: iterator.description,
                  price: iterator.price,
                  quantity: iterator.quantity,
                  subtotal: iterator.subtotal,
                  pmTruckId: iterator.pmTruck,
                  pmTrailerId: iterator.pmTrailer,
                })
              );
              this.subtotal = [
                ...this.subtotal,
                {
                  id: iterator.id,
                  value: iterator.subtotal,
                },
              ];

              if (res.unitType.name === 'Truck') {
                this.selectedPM.push({
                  id: iterator.pmTruck ? iterator.pmTruck.id : null,
                  logoName: `assets/svg/common/repair-pm/${
                    iterator.pmTruck
                      ? iterator.pmTruck.logoName
                      : 'ic_custom_pm.svg'
                  }`,
                });
              } else {
                this.selectedPM.push({
                  id: iterator.pmTrailer ? iterator.pmTrailer.id : null,
                  logoName: `assets/svg/common/repair-pm/${
                    iterator.pmTrailer
                      ? iterator.pmTrailer.logoName
                      : 'ic_custom_pm.svg'
                  }`,
                });
              }
            }
          }
        },
        error: () => {
          this.notificationService.error("Repair can't be loaded.", 'Error');
        },
      });
  }

  private finishOrder(id: number) {
    alert(`Finish Order ${id} - wait backend`);
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
              ? this.selectedPM[index].id
              : null
            : null,
        pmTrailerId:
          this.repairOrderForm.get('unitType').value === 'Trailer'
            ? this.selectedPM
              ? this.selectedPM[index].id
              : null
            : null,
      };
    });
  }

  ngOnDestroy(): void {}
}
