import {
  convertDateFromBackend,
  convertDateToBackend,
  convertNumberInThousandSep,
} from './../../../utils/methods.calculations';
import { Options } from '@angular-slider/ngx-slider';
import { HttpResponseBase } from '@angular/common/http';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CreateTruckCommand,
  GetTruckModalResponse,
  TruckResponse,
  UpdateTruckCommand,
  VinDecodeResponse,
} from 'appcoretruckassist';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormService } from 'src/app/core/services/form/form.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { VinDecoderService } from 'src/app/core/services/vin-decoder/vindecoder.service';
import { convertThousanSepInNumber } from 'src/app/core/utils/methods.calculations';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import {
  insurancePolicyRegex,
  yearValidRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TruckTService } from '../../truck/state/truck.service';
import { OwnerModalComponent } from '../owner-modal/owner-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RepairOrderModalComponent } from '../repair-modals/repair-order-modal/repair-order-modal.component';

@UntilDestroy()
@Component({
  selector: 'app-truck-modal',
  templateUrl: './truck-modal.component.html',
  styleUrls: ['./truck-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
  providers: [ModalService, FormService],
})
export class TruckModalComponent implements OnInit, OnDestroy {
  @ViewChild('appNote', { static: false }) public appNote: any;

  @Input() editData: any;

  public truckForm: FormGroup;
  public truckType: any[] = [];
  public truckMakeType: any[] = [];
  public colorType: any[] = [];
  public ownerType: any[] = [];
  public grossWeight: any[] = [];
  public engineType: any[] = [];
  public tireSize: any[] = [];
  public shifters: any[] = [];

  public selectedShifter: any = null;
  public selectedTruckType: any = null;
  public selectedTruckMake: any = null;
  public selectedColor: any = null;
  public selectedOwner: any = null;
  public selectedTruckGrossWeight: any = null;
  public selectedEngineType: any = null;
  public selectedTireSize: any = null;

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

  public commissionOptions: Options = {
    floor: 2,
    ceil: 25,
    step: 0.5,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public truckStatus: boolean = true;
  public loadingVinDecoder: boolean = false;
  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private truckModalService: TruckTService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private formService: FormService,
    private ngbActiveModal: NgbActiveModal,
    private vinDecoderService: VinDecoderService
  ) {}

  ngOnInit() {
    this.createForm();
    this.isCompanyOwned();
    this.getTruckDropdowns();
    this.vinDecoder();

    if (this.editData?.id) {
      this.editTruckById(this.editData.id);
    }

    if (this.editData?.storageData) {
      this.populateStorageData(this.editData.storageData);
    }
  }

  private createForm(): void {
    this.truckForm = this.formBuilder.group({
      truckNumber: [null, [Validators.required, Validators.maxLength(6)]],
      truckTypeId: [null, Validators.required],
      vin: [
        null,
        [
          Validators.required,
          Validators.minLength(17),
          Validators.maxLength(17),
        ],
      ],
      truckMakeId: [null, Validators.required],
      model: [null, [Validators.required, Validators.maxLength(22)]],
      year: [
        null,
        [Validators.required, Validators.maxLength(4), yearValidRegex],
      ],
      colorId: [null],
      companyOwned: [true],
      ownerId: [null],
      commission: [14.5],
      note: [null],
      purchaseDate: [null],
      purchasePrice: [null],
      shifter: [null],
      fhwaexp: [12, Validators.required],
      truckGrossWeightId: [null],
      emptyWeight: [null, Validators.maxLength(6)],
      truckEngineTypeId: [null],
      tireSizeId: [null],
      axles: [null, Validators.maxLength(1)],
      insurancePolicy: [null, insurancePolicyRegex],
      mileage: [null, Validators.maxLength(10)],
      ipasEzpass: [null, Validators.maxLength(14)],
    });

    // this.formService.checkFormChange(this.truckForm);

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

  public onModalAction(data: { action: string; bool: boolean }): void {
    if (data.action === 'close') {
      this.truckForm.reset();
    } else {
      if (data.action === 'deactivate' && this.editData) {
        this.truckModalService
          .changeTruckStatus(this.editData.id, this.editData.tabSelected)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: HttpResponseBase) => {
              if (res.status === 200 || res.status === 204) {
                this.truckStatus = !this.truckStatus;

                this.modalService.changeModalStatus({
                  name: 'deactivate',
                  status: this.truckStatus,
                });
                this.notificationService.success(
                  `Truck status changed to ${
                    this.truckStatus ? 'deactivate' : 'activate'
                  }.`,
                  'Success:'
                );
              }
            },
            error: () => {
              this.notificationService.error(
                "Truck status can't be changed.",
                'Error:'
              );
            },
          });
      } else {
        // Save & Update
        if (data.action === 'save') {
          if (this.truckForm.invalid) {
            this.inputService.markInvalid(this.truckForm);
            return;
          }
          if (this.editData?.id) {
            this.updateTruck(this.editData.id);
            this.modalService.setModalSpinner({ action: null, status: true });
          } else {
            this.addTruck();
            this.modalService.setModalSpinner({ action: null, status: true });
          }
        }

        // Delete
        if (data.action === 'delete' && this.editData) {
          this.deleteTruckById(this.editData.id);
          this.modalService.setModalSpinner({ action: 'delete', status: true });
        }
      }
    }

    if (this.editData?.canOpenModal) {
      switch (this.editData?.key) {
        case 'repair-modal': {
          this.modalService.setProjectionModal({
            action: 'close',
            payload: { key: this.editData?.key, value: null },
            component: RepairOrderModalComponent,
            size: 'large',
            type: 'Truck',
          });
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  private isCompanyOwned() {
    this.truckForm
      .get('companyOwned')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(this.truckForm.get('ownerId'));
        } else {
          this.inputService.changeValidators(
            this.truckForm.get('ownerId'),
            false
          );
        }
      });
  }

  public editTruckById(id: number) {
    this.truckModalService
      .getTruckById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: TruckResponse) => {
          this.truckForm.patchValue({
            truckNumber: res.truckNumber,
            truckTypeId: res.truckType ? res.truckType.name : null,
            truckMakeId: res.truckMake ? res.truckMake.name : null,
            model: res.model,
            year: res.year,
            colorId: res.color ? res.color.name : null,
            companyOwned: res.companyOwned,
            ownerId: res.companyOwned
              ? null
              : res.owner
              ? res.owner.name
              : null,
            commission: res.commission,
            note: res.note,
            truckGrossWeightId: res.truckGrossWeight
              ? res.truckGrossWeight.name
              : null,
            emptyWeight: res.emptyWeight,
            truckEngineTypeId: res.truckEngineType
              ? res.truckEngineType.name
              : null,
            tireSizeId: res.tireSize ? res.tireSize.name : null,
            axles: res.axles,
            insurancePolicy: res.insurancePolicy,
            mileage: res.mileage,
            ipasEzpass: res.ipasEzpass,
          });
          this.truckForm.get('vin').patchValue(res.vin, { emitEvent: false });

          this.selectedTruckType = res.truckType ? res.truckType : null;
          this.selectedTruckMake = res.truckMake ? res.truckMake : null;
          this.selectedColor = res.color ? res.color : null;
          this.selectedOwner = res.owner ? res.owner : null;

          this.selectedTruckGrossWeight = res.truckGrossWeight
            ? res.truckGrossWeight
            : null;
          this.selectedEngineType = res.truckEngineType
            ? res.truckEngineType
            : null;
          this.selectedTireSize = res.tireSize ? res.tireSize : null;
          this.truckStatus = res.status === 1 ? false : true;

          this.modalService.changeModalStatus({
            name: 'deactivate',
            status: this.truckStatus,
          });
        },
        error: () => {
          this.notificationService.error("Cant't get truck.", 'Error:');
        },
      });
  }

  private populateStorageData(res: any) {
    const timeout = setTimeout(() => {
      this.truckForm.patchValue({
        truckNumber: res.truckNumber,
        truckTypeId: res.truckTypeId,
        truckMakeId: res.truckMakeId,
        model: res.model,
        year: res.year,
        colorId: res.colorId,
        companyOwned: res.companyOwned,
        ownerId: res.ownerId,
        commission: res.commission,
        note: res.note,
        truckGrossWeightId: res.truckGrossWeightId,
        emptyWeight: res.emptyWeight,
        truckEngineTypeId: res.truckEngineTypeId,
        tireSizeId: res.tireSizeId,
        axles: res.axles,
        insurancePolicy: res.insurancePolicy,
        mileage: res.mileage,
        ipasEzpass: res.ipasEzpass,
      });
      if (res.id) {
        this.editData = { ...this.editData, id: res.id };
      }
      this.truckForm.get('vin').patchValue(res.vin, { emitEvent: false });
      this.selectedTruckType = res.selectedTruckType;
      this.selectedTruckMake = res.selectedTruckMake;
      this.selectedColor = res.selectedColor;
      this.selectedOwner = res.selectedOwner;

      this.selectedTruckGrossWeight = res.selectedTruckGrossWeight;
      this.selectedEngineType = res.selectedEngineType;
      this.selectedTireSize = res.selectedTireSize;
      this.truckStatus = res.truckStatus;

      this.modalService.changeModalStatus({
        name: 'deactivate',
        status: this.truckStatus,
      });

      clearTimeout(timeout);
    }, 50);
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'truck-type': {
        this.selectedTruckType = event;
        break;
      }
      case 'truck-make': {
        this.selectedTruckMake = event;
        break;
      }
      case 'color': {
        this.selectedColor = event;
        break;
      }
      case 'owner': {
        if (event?.canOpenModal) {
          this.ngbActiveModal.close();

          this.modalService.setProjectionModal({
            action: 'open',
            payload: {
              key: 'truck-modal',
              value: {
                ...this.truckForm.value,
                selectedTruckType: this.selectedTruckType,
                selectedTruckMake: this.selectedTruckMake,
                selectedColor: this.selectedColor,
                selectedOwner: this.selectedOwner,
                selectedTruckGrossWeight: this.selectedTruckGrossWeight,
                selectedEngineType: this.selectedEngineType,
                selectedTireSize: this.selectedTireSize,
                truckStatus: this.truckStatus,
                id: this.editData?.id,
              },
            },
            component: OwnerModalComponent,
            size: 'small',
          });
        } else {
          this.selectedOwner = event;
        }
        break;
      }
      case 'gross-weight': {
        this.selectedTruckGrossWeight = event;
        break;
      }
      case 'engine-type': {
        this.selectedEngineType = event;
        break;
      }
      case 'tire-size': {
        this.selectedTireSize = event;
        break;
      }
      case 'shifter': {
        this.selectedShifter = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  private vinDecoder() {
    this.truckForm
      .get('vin')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value?.length === 17) {
          this.loadingVinDecoder = true;
          this.vinDecoderService
            .getVINDecoderData(value.toString(), 1)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: VinDecodeResponse) => {
                this.truckForm.patchValue({
                  model: res?.model ? res.model : null,
                  year: res?.year ? res.year : null,
                  truckMakeId: res.truckMake?.name ? res.truckMake.name : null,
                  truckEngineTypeId: res.engineType?.name
                    ? res.engineType.name
                    : null,
                });
                this.loadingVinDecoder = false;
                this.selectedTruckMake = res.truckMake;
                this.selectedEngineType = res.engineType;
              },
              error: (error: any) => {
                this.notificationService.error(
                  `Can't get data for that ${value} VIN.`,
                  'Error:'
                );
              },
            });
        }
      });
  }

  public getTruckDropdowns() {
    this.truckModalService
      .getTruckDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: GetTruckModalResponse) => {
          this.truckType = res.truckTypes.map((item) => {
            return {
              ...item,
              folder: 'common',
              subFolder: 'trucks',
            };
          });
          this.truckMakeType = res.truckMakes;
          this.colorType = res.colors.map((item) => {
            return {
              ...item,
              folder: 'common',
              subFolder: 'colors',
              logoName: 'ic_color.svg',
            };
          });
          this.ownerType = res.owners;
          this.grossWeight = res.truckGrossWeights;
          this.engineType = res.truckEngineTypes;
          this.tireSize = res.tireSizes;
          this.shifters = res.shifters;
        },
        error: (err) => {
          this.notificationService.error(
            "Cant't get truck dropdown items.",
            'Error:'
          );
        },
      });
  }

  public addTruck() {
    const newData: CreateTruckCommand = {
      ...this.truckForm.value,
      truckTypeId: this.selectedTruckType ? this.selectedTruckType.id : null,
      truckMakeId: this.selectedTruckMake ? this.selectedTruckMake.id : null,
      colorId: this.selectedColor ? this.selectedColor.id : null,
      ownerId: this.selectedOwner ? this.selectedOwner.id : null,
      truckGrossWeightId: this.selectedTruckGrossWeight
        ? this.selectedTruckGrossWeight.id
        : null,
      truckEngineTypeId: this.selectedEngineType
        ? this.selectedEngineType.id
        : null,
      tireSizeId: this.selectedTireSize ? this.selectedTireSize.id : null,
      mileage: this.truckForm.get('mileage').value
        ? convertThousanSepInNumber(this.truckForm.get('mileage').value)
        : null,
      axles: this.truckForm.get('axles').value
        ? parseInt(this.truckForm.get('axles').value)
        : null,
      emptyWeight: this.truckForm.get('emptyWeight').value
        ? convertThousanSepInNumber(this.truckForm.get('emptyWeight').value)
        : null,
      commission: this.truckForm.get('commission').value
        ? parseFloat(
            this.truckForm.get('commission').value.toString().replace(/,/g, '')
          )
        : null,
      year: parseInt(this.truckForm.get('year').value),
      shifter: this.selectedShifter ? this.selectedShifter.id : null,
      purchaseDate: this.truckForm.get('companyOwned').value
        ? this.truckForm.get('purchaseDate').value
          ? convertDateToBackend(this.truckForm.get('purchaseDate').value)
          : null
        : null,
      purchasePrice: this.truckForm.get('companyOwned').value
        ? this.truckForm.get('purchasePrice').value
          ? convertThousanSepInNumber(this.truckForm.get('purchasePrice').value)
          : null
        : null,
    };

    this.truckModalService
      .addTruck(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Truck successfully created.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () =>
          this.notificationService.error("Truck can't be created.", 'Error:'),
      });
  }

  public updateTruck(id: number) {
    const newData: UpdateTruckCommand = {
      id: id,
      ...this.truckForm.value,
      truckTypeId: this.selectedTruckType ? this.selectedTruckType.id : null,
      truckMakeId: this.selectedTruckMake ? this.selectedTruckMake.id : null,
      colorId: this.selectedColor ? this.selectedColor.id : null,
      ownerId: this.truckForm.get('companyOwned').value
        ? null
        : this.selectedOwner
        ? this.selectedOwner.id
        : null,
      truckGrossWeightId: this.selectedTruckGrossWeight
        ? this.selectedTruckGrossWeight.id != 0
          ? this.selectedTruckGrossWeight.id
          : null
        : null,
      truckEngineTypeId: this.selectedEngineType
        ? this.selectedEngineType.id != 0
          ? this.selectedEngineType.id
          : null
        : null,
      tireSizeId: this.selectedTireSize
        ? this.selectedTireSize.id != 0
          ? this.selectedTireSize.id
          : null
        : null,
      mileage: this.truckForm.get('mileage').value
        ? convertThousanSepInNumber(this.truckForm.get('mileage').value)
        : null,
      axles: this.truckForm.get('axles').value
        ? parseInt(this.truckForm.get('axles').value)
        : null,
      emptyWeight: this.truckForm.get('emptyWeight').value
        ? convertThousanSepInNumber(this.truckForm.get('emptyWeight').value)
        : null,
      commission: this.truckForm.get('commission').value
        ? parseFloat(
            this.truckForm.get('commission').value.toString().replace(/,/g, '')
          )
        : null,
      year: parseInt(this.truckForm.get('year').value),
      shifter: this.selectedShifter ? this.selectedShifter.id : null,
      purchaseDate: this.truckForm.get('companyOwned').value
        ? this.truckForm.get('purchaseDate').value
          ? convertDateToBackend(this.truckForm.get('purchaseDate').value)
          : null
        : null,
      purchasePrice: this.truckForm.get('companyOwned').value
        ? this.truckForm.get('purchasePrice').value
          ? convertThousanSepInNumber(this.truckForm.get('purchasePrice').value)
          : null
        : null,
    };
    this.truckModalService
      .updateTruck(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Truck successfully updated.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () =>
          this.notificationService.error("Truck can't be updated.", 'Error:'),
      });
  }

  public deleteTruckById(id: number) {
    this.truckModalService
      .deleteTruckById(id, this.editData.tabSelected)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Truck successfully deleted.',
            'Success:'
          );
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
        },
        error: () =>
          this.notificationService.error("Truck can't be deleted.", 'Error:'),
      });
  }

  ngOnDestroy(): void {}
}
