import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { FormService } from '../../../../services/form/form.service';
import { FuelTService } from '../../../fuel/state/fuel.service';
import { NotificationService } from '../../../../services/notification/notification.service';
import { GetFuelModalResponse } from '../../../../../../../appcoretruckassist/model/getFuelModalResponse';
import {
  priceValidation,
  fullNameValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';

@Component({
  selector: 'app-fuel-purchase-modal',
  templateUrl: './fuel-purchase-modal.component.html',
  styleUrls: ['./fuel-purchase-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class FuelPurchaseModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public fuelForm: FormGroup;

  public truckType: any[] = [];
  public fuelStops: any[] = [
    {
      businessName: '7-11 STORE',
      count: 238,
      stores: [
        {
          id: 1,
          name: 15680,
          address: 'Chicago, IL 60656',
        },
        {
          id: 2,
          name: 16898,
          address: 'Carroltion, GA 23790',
        },
        {
          id: 3,
          name: 17000,
          address: 'Forest Parl, GA 65412',
        },
        {
          id: 4,
          name: 17000,
          address: 'Forest Parl, GA 65412',
        },
        {
          id: 5,
          name: 17000,
          address: 'Forest Parl, GA 65412',
        },
        {
          id: 6,
          name: 17000,
          address: 'Forest Parl, GA 65412',
        },
        {
          id: 7,
          name: 17000,
          address: 'Forest Parl, GA 65412',
        },
        {
          id: 8,
          name: 17000,
          address: 'Forest Parl, GA 65412',
        },
        {
          id: 9,
          name: 17000,
          address: 'Forest Parl, GA 65412',
        },
        {
          id: 10,
          name: 17000,
          address: 'Forest Parl, GA 65412',
        },
      ],
      open: false,
      hover: false,
      isFranchise: true,
    },
    {
      businessName: "LOVE'S",
      count: 18,
      stores: [
        {
          id: 1,
          name: 15680,
          address: 'Chicago, IL 60656',
        },
        {
          id: 2,
          name: 16898,
          address: 'Carroltion, GA 23790',
        },
      ],
      open: true,
      hover: false,
      isFranchise: true,
    },
    {
      businessName: 'RR HICORY HILLS (Manuelno dodat)',
      count: 0,
      stores: [],
      open: false,
      hover: false,
      isFranchise: false,
    },
  ];

  public fuelItemsDropdown: any[] = [];

  public selectedTruckType: any = null;
  public selectedFuelStop: any = null;

  public selectedFuelItemsFormArray: any[] = [];
  public fuelItemsCounter: number = 0;
  public subtotal: { id: number; value: number }[] = [];
  public quantity: any[] = [];

  public hoverRowTable: boolean[] = [];

  public documents: any[] = [];

  public isFormDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private formService: FormService,
    private fuelService: FuelTService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getModalDropdowns();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 1,
      };
      this.editFuel(this.editData.id);
    }
  }

  private createForm() {
    this.fuelForm = this.formBuilder.group({
      truckTypeId: [null, Validators.required],
      fullName: [null, fullNameValidation],
      date: [null, Validators.required],
      time: [null, Validators.required],
      fuelStopId: [null, Validators.required],
      fuelItems: this.formBuilder.array([]),
    });

    this.formService.checkFormChange(this.fuelForm);
    this.formService.formValueChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormChange: boolean) => {
        this.isFormDirty = isFormChange;
      });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        break;
      }
      case 'save': {
        if (this.fuelForm.invalid || !this.isFormDirty) {
          this.inputService.markInvalid(this.fuelForm);
          return;
        }
        if (this.editData) {
          this.updateFuel(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addFuel();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        this.deleteFuelById(this.editData.id);
        this.modalService.setModalSpinner({ action: 'delete', status: true });

        break;
      }
      default: {
        break;
      }
    }
  }

  public get fuelItems(): FormArray {
    return this.fuelForm.get('fuelItems') as FormArray;
  }

  private createFuelItems(data?: {
    id: number;
    itemId?: string;
    qty?: string;
    price?: string;
    subtotal?: string;
  }): FormGroup {
    return this.formBuilder.group({
      id: [data?.id ? data?.id : null],
      itemId: [data?.itemId ? data?.itemId : null, Validators.required],
      qty: [data?.qty ? data?.qty : null],
      price: [[data?.price ? data?.price : null], [...priceValidation]],
      subtotal: [[data?.subtotal ? data?.subtotal : null]],
    });
  }

  public addFuelItems(event: { check: boolean; action: string }) {
    if (event.check) {
      this.fuelItems.push(
        this.createFuelItems({ id: ++this.fuelItemsCounter })
      );
      this.subtotal = [
        ...this.subtotal,
        { id: this.fuelItemsCounter, value: 0 },
      ];
      this.hoverRowTable.push(false);
    }
  }

  public removeFuelItems(id: number) {
    this.fuelItems.removeAt(id);
    this.selectedFuelItemsFormArray.splice(id, 1);
    this.hoverRowTable.splice(id, 1);
    const afterDeleting = this.subtotal.splice(id, 1);

    this.subtotal = this.subtotal.filter(
      (item) => item.id !== afterDeleting[0].id
    );

    if (!this.subtotal.length) {
      this.selectedFuelItemsFormArray = [];
      this.hoverRowTable = [];
      this.subtotal = [];
      this.fuelItemsCounter = 0;
      this.quantity = [];
    }
  }

  public onChange(formControlName: string, index: number) {
    if (formControlName === 'qty') {
      this.fuelItems
        .at(index)
        .get(formControlName)
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.quantity[index] = value;
          this.subtotal = [...this.subtotal];
          const price = parseFloat(
            this.fuelItems
              .at(index)
              .get('price')
              .value?.toString()
              .replace(/,/g, '')
          );
          this.subtotal[index].value = this.quantity[index] * price;
        });
    } else {
      this.fuelItems
        .at(index)
        .get(formControlName)
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          if (!this.quantity[index] || this.quantity[index] === 0) {
            this.quantity[index] = 1;
            this.fuelItems.at(index).get('qty').patchValue(1);
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

  public onSelectDropDown(event: any, action: string, index?: number) {
    switch (action) {
      case 'truck': {
        this.selectedTruckType = event;
        break;
      }
      case 'fuel': {
        this.selectedFuelStop = event;
        break;
      }
      case 'fuel-items': {
        this.selectedFuelItemsFormArray[index] = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onFilesEvent(event: any) {
    this.documents = event.files;
  }

  public drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.fuelItems.controls,
      event.previousIndex,
      event.currentIndex
    );

    moveItemInArray(this.subtotal, event.previousIndex, event.currentIndex);
  }

  private updateFuel(id: number) {}

  private addFuel() {}

  private deleteFuelById(id: number) {}

  private editFuel(id: number) {}

  private getModalDropdowns() {
    this.fuelService
      .getFuelTransactionModalDropdowns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: GetFuelModalResponse) => {
          console.log(res);
        },
        error: (error: any) => {
          this.notificationService.error('Error', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
