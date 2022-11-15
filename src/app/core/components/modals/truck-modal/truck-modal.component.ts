import {
  convertDateToBackend,
  convertDateFromBackend,
  convertNumberInThousandSep,
} from '../../../utils/methods.calculations';
import { Options } from '@angular-slider/ngx-slider';
import { HttpResponseBase } from '@angular/common/http';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
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

import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import {
  axlesValidation,
  emptyWeightValidation,
  insurancePolicyValidation,
  mileageValidation,
  truckTrailerModelValidation,
  vehicleUnitValidation,
  vinNumberValidation,
  yearValidation,
  yearValidRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TruckTService } from '../../truck/state/truck.service';
import { OwnerModalComponent } from '../owner-modal/owner-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RepairOrderModalComponent } from '../repair-modals/repair-order-modal/repair-order-modal.component';
import { Subject, takeUntil, skip, tap } from 'rxjs';
import { NotificationService } from '../../../services/notification/notification.service';
import { VinDecoderService } from '../../../services/VIN-DECODER/vindecoder.service';
import { convertThousanSepInNumber } from '../../../utils/methods.calculations';
import { FormService } from '../../../services/form/form.service';

@Component({
  selector: 'app-truck-modal',
  templateUrl: './truck-modal.component.html',
  styleUrls: ['./truck-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
  providers: [ModalService, TaInputService, FormService],
})
export class TruckModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() editData: any;

  public truckForm: FormGroup;
  public truckType: any[] = [];
  public truckMakeType: any[] = [];
  public colorType: any[] = [];
  public ownerType: any[] = [];
  public grossWeight: any[] = [];
  public tireSize: any[] = [];
  public frontWheels: any[] = [];
  public rearWheels: any[] = [];
  public shifters: any[] = [];
  public engineModels: any[] = [];
  public engineOilTypes: any[] = [];
  public apUnits: any[] = [];
  public brakes: any[] = [];
  public gearRatios: any[] = [];
  public fuelTypes: any[] = [];
  public tollTransponders: any[] = [
    {
      groupName: 'Grupa 1',
      items: [
        {
          id: 1,
          name: 'Item 1',
        },
        {
          id: 2,
          name: 'Item 2',
        },
      ],
    },
    {
      groupName: 'Grupa 2',
      items: [
        {
          id: 1,
          name: 'Item 2',
        },
        {
          id: 2,
          name: 'Item 2',
        },
      ],
    },
  ];

  public selectedBrakes: any = null;
  public selectedShifter: any = null;
  public selectedTruckType: any = null;
  public selectedTruckMake: any = null;
  public selectedColor: any = null;
  public selectedOwner: any = null;
  public selectedTruckGrossWeight: any = null;

  public selectedTireSize: any = null;
  public selectedtruckEngineModelId: any = null;
  public selectedEngineOilType: any = null;
  public selectedAPUnit: any = null;
  public selectedGearRatio: any = null;
  public selectedTollTransponders: any = null;

  public selectedFrontWheels: any = null;
  public selectedRearWheels: any = null;

  public selectedFuelType: any = null;

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
  public isFormDirty: boolean;
  public skipVinDecocerEdit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private truckModalService: TruckTService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private ngbActiveModal: NgbActiveModal,
    private vinDecoderService: VinDecoderService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();
    this.isCompanyOwned();

    if (this.editData?.storageData) {
      this.skipVinDecocerEdit = true;
      this.populateStorageData(this.editData.storageData);
    } else {
      this.getTruckDropdowns();
    }

    if (this.editData?.id) {
      this.skipVinDecocerEdit = true;
      this.editTruckById(this.editData.id);
    }

    this.vinDecoder();
  }

  private createForm(): void {
    this.truckForm = this.formBuilder.group({
      // Basic Tab
      companyOwned: [true],
      truckNumber: [null, [Validators.required, ...vehicleUnitValidation]],
      truckTypeId: [null, Validators.required],
      vin: [null, [Validators.required, ...vinNumberValidation]],
      truckMakeId: [null, Validators.required],
      model: [null, [Validators.required, ...truckTrailerModelValidation]],
      year: [null, [Validators.required, ...yearValidation, yearValidRegex]],
      colorId: [null],
      ownerId: [null],
      commission: [14.5],
      note: [null],
      // Additional Tab
      purchaseDate: [null],
      purchasePrice: [null],
      truckGrossWeightId: [null],
      emptyWeight: [null, emptyWeightValidation],
      truckEngineModelId: [null],
      tireSizeId: [null],
      fuelTankSize: [null],
      brakes: [null],
      frontWheels: [null],
      rearWheels: [null],
      transmissionModel: [null],
      fuelType: [null],
      shifter: [null],
      axles: [null, axlesValidation],
      fhwaExp: [null, Validators.required],
      insurancePolicy: [null, insurancePolicyValidation],
      mileage: [null, mileageValidation],
      engineOilType: [null],
      gearRatio: [null],
      apUnit: [null],
      tollTransponder: [null],
      tollTransponderDeviceNo: [null],
      doubleBunk: [false],
      refrigerator: [false],
      dcInverter: [false],
      blower: [false],
      pto: [false],
    });

    this.formService.checkFormChange(this.truckForm);

    this.formService.formValueChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormChange: boolean) => {
        this.isFormDirty = isFormChange;
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
    if (data.action === 'close') {
      return;
    } else {
      if (data.action === 'deactivate' && this.editData) {
        this.truckModalService
          .changeTruckStatus(this.editData.id, this.editData.tabSelected)
          .pipe(takeUntil(this.destroy$))
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
          if (this.truckForm.invalid || !this.isFormDirty) {
            this.inputService.markInvalid(this.truckForm);
            return;
          }
          if (this.editData?.id) {
            this.updateTruck(this.editData.id);
            this.modalService.setModalSpinner({ action: null, status: true });
          } else {
            this.addTruck();
            this.modalService.setModalSpinner({
              action: null,
              status: true,
              clearTimeout: !!this.editData?.canOpenModal,
            });
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
      .valueChanges.pipe(takeUntil(this.destroy$))
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
                selectedAPUnit: this.selectedAPUnit,
                selectedBrakes: this.selectedBrakes,
                selectedColor: this.selectedColor,
                selectedEngineOilType: this.selectedEngineOilType,
                selectedFrontWheels: this.selectedFrontWheels,
                selectedGearRatio: this.selectedGearRatio,
                selectedOwner: this.selectedOwner,
                selectedRearWheels: this.selectedRearWheels,
                selectedShifter: this.selectedShifter,
                selectedTireSize: this.selectedTireSize,
                selectedTollTransponders: this.selectedTollTransponders,
                selectedTruckGrossWeight: this.selectedTruckGrossWeight,
                selectedTruckMake: this.selectedTruckMake,
                selectedTruckType: this.selectedTruckType,
                selectedtruckEngineModelId: this.selectedtruckEngineModelId,
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
      case 'tire-size': {
        this.selectedTireSize = event;
        break;
      }
      case 'shifter': {
        this.selectedShifter = event;
        break;
      }
      case 'engine-model': {
        this.selectedtruckEngineModelId = event;
        break;
      }
      case 'engine-oil-type': {
        this.selectedEngineOilType = event;
        break;
      }
      case 'ap-unit': {
        this.selectedAPUnit = event;
        break;
      }
      case 'gear-ratio': {
        this.selectedGearRatio = event;
        break;
      }
      case 'toll-transponder': {
        this.selectedTollTransponders = event;
        break;
      }
      case 'brakes': {
        this.selectedBrakes = event;
        break;
      }
      case 'front-wheels': {
        this.selectedFrontWheels = event;
        break;
      }
      case 'rear-wheels': {
        this.selectedRearWheels = event;
        break;
      }
      case 'fuel-type': {
        this.selectedFuelType = event;
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
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        this.skipVinDecocerEdit ? skip(1) : tap()
      )
      .subscribe((value) => {
        this.skipVinDecocerEdit = false;
        if (value?.length > 13 && value?.length < 17) {
          this.truckForm.get('vin').setErrors({ invalid: true });
        }

        if (value?.length === 17) {
          this.loadingVinDecoder = true;
          this.vinDecoderService
            .getVINDecoderData(value.toString(), 1)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res: VinDecodeResponse) => {
                this.truckForm.patchValue({
                  model: res?.model ? res.model : null,
                  year: res?.year ? res.year.toString() : null,
                  truckMakeId: res.truckMake ? res.truckMake.name : null,
                  truckEngineModelId: res.engineModel?.name
                    ? res.engineModel.name
                    : null,
                  fuelType: this.fuelTypes.find(
                    (item) => item.name === res.fuelType
                  ).name,
                });
                this.loadingVinDecoder = false;
                this.selectedTruckMake = res.truckMake;
                this.selectedtruckEngineModelId = res.engineModel;
                this.selectedFuelType = this.fuelTypes.find(
                  (item) => item.name === res.fuelType
                );
              },
              error: () => {
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: GetTruckModalResponse) => {
          this.apUnits = res.apUnits;
          this.brakes = res.brakes;
          this.colorType = res.colors.map((item) => {
            return {
              ...item,
              folder: 'common',
              subFolder: 'colors',
              logoName: 'ic_color.svg',
            };
          });
          this.engineOilTypes = res.engineOilTypes;
          this.tollTransponders = res.ezPass.map((item) => {
            return {
              ...item,
              items: item.tollTransponders,
            };
          });
          this.gearRatios = res.gearRatios;
          this.ownerType = res.owners;
          this.shifters = res.shifters;
          this.tireSize = res.tireSizes;
          this.engineModels = res.truckEngineModels;
          this.grossWeight = res.truckGrossWeights;
          this.truckMakeType = res.truckMakes;
          this.truckType = res.truckTypes.map((item) => {
            return {
              ...item,
              folder: 'common',
              subFolder: 'trucks',
            };
          });
          this.rearWheels = this.frontWheels = res.wheelsTypes;
          this.fuelTypes = res.fuelTypes;
          this.truckForm.get('fhwaExp').patchValue(res.fhwaExp);
        },
        error: () => {
          this.notificationService.error(
            "Cant't get truck dropdown items.",
            'Error:'
          );
        },
      });
  }

  public editTruckById(id: number) {
    this.truckModalService
      .getTruckById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TruckResponse) => {
          this.truckForm.patchValue({
            // Basic Tab
            companyOwned: res.companyOwned,
            truckNumber: res.truckNumber,
            truckTypeId: res.truckType ? res.truckType.name : null,
            vin: res.vin,
            truckMakeId: res.truckMake ? res.truckMake.name : null,
            model: res.model,
            year: res.year.toString(),
            colorId: res.color ? res.color.name : null,
            ownerId: res.owner ? res.owner.name : null,
            commission: res.commission,
            note: res.note,
            // Additional Tab
            purchaseDate: res.purchaseDate
              ? convertDateFromBackend(res.purchaseDate)
              : null,
            purchasePrice: res.purchasePrice
              ? convertNumberInThousandSep(res.purchasePrice)
              : null,
            truckGrossWeightId: res.truckGrossWeight
              ? res.truckGrossWeight.name
              : null,
            emptyWeight: res.emptyWeight
              ? convertNumberInThousandSep(res.emptyWeight)
              : null,
            truckEngineModelId: res.truckEngineModel
              ? res.truckEngineModel.name
              : null,
            tireSizeId: res.tireSize ? res.tireSize.name : null,
            fuelTankSize: res.fuelTankSize
              ? convertNumberInThousandSep(res.fuelTankSize)
              : null,
            brakes: res.brakes ? res.brakes.name : null,
            frontWheels: res.frontWheels ? res.frontWheels.name : null,
            rearWheels: res.rearWheels ? res.rearWheels.name : null,
            transmissionModel: res.transmissionModel,
            shifter: res.shifter ? res.shifter.name : null,
            axles: res.axles,
            insurancePolicy: res.insurancePolicy,
            mileage: res.mileage
              ? convertNumberInThousandSep(res.mileage)
              : null,
            fuelType: res.fuelType ? res.fuelType.name : null,
            engineOilType: res.engineOilType ? res.engineOilType.name : null,
            gearRatio: res.gearRatio ? res.gearRatio.name : null,
            apUnit: res.apUnit ? res.apUnit.name : null,
            tollTransponder: res.tollTransponder
              ? res.tollTransponder.name
              : null,
            tollTransponderDeviceNo: res.tollTransponderDeviceNo,
            doubleBunk: res.doubleBunk,
            refrigerator: res.refrigerator,
            dcInverter: res.dcInverter,
            blower: res.blower,
            pto: res.pto,
            fhwaExp: res.fhwaExp ? res.fhwaExp : 12,
          });

          this.selectedAPUnit = res.apUnit ? res.apUnit : null;
          this.selectedBrakes = res.brakes ? res.brakes : null;
          this.selectedColor = res.color ? res.color : null;
          this.selectedEngineOilType = res.engineOilType
            ? res.engineOilType
            : null;
          this.selectedFrontWheels = res.frontWheels ? res.frontWheels : null;
          this.selectedGearRatio = res.gearRatio ? res.gearRatio : null;
          this.selectedOwner = res.owner ? res.owner : null;
          this.selectedRearWheels = res.rearWheels ? res.rearWheels : null;
          this.selectedShifter = res.shifter ? res.shifter : null;
          this.selectedTireSize = res.tireSize ? res.tireSize : null;
          this.selectedTollTransponders = res.tollTransponder
            ? res.tollTransponder
            : null;
          this.selectedTruckGrossWeight = res.truckGrossWeight
            ? res.truckGrossWeight
            : null;
          this.selectedTruckMake = res.truckMake ? res.truckMake : null;
          this.selectedTruckType = res.truckType ? res.truckType : null;
          this.selectedtruckEngineModelId = res.truckEngineModel
            ? res.truckEngineModel
            : null;
          this.selectedFuelType = res.fuelType;
          this.truckStatus = res.status !== 1;

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
      this.getTruckDropdowns();
      this.truckForm.patchValue({
        companyOwned: res.companyOwned,
        truckNumber: res.truckNumber,
        truckTypeId: res.truckTypeId,
        vin: res.vin,
        truckMakeId: res.truckMakeId,
        model: res.model,
        year: res.year,
        colorId: res.colorId,
        ownerId: res.ownerId,
        commission: res.commission,
        note: res.note,
        // Additional Tab
        purchaseDate: res.purchaseDate,
        purchasePrice: res.purchasePrice,
        truckGrossWeightId: res.truckGrossWeightId,
        emptyWeight: res.emptyWeight,
        truckEngineModelId: res.truckEngineModelId,
        tireSizeId: res.tireSizeId,
        fuelTankSize: res.fuelTankSize,
        brakes: res.brakes,
        frontWheels: res.frontWheels,
        rearWheels: res.rearWheels,
        transmissionModel: res.transmissionModel,
        shifter: res.shifter,
        axles: res.axles,
        fhwaExp: res.fhwaExp,
        fuelType: res.fuelType,
        insurancePolicy: res.insurancePolicy,
        mileage: res.mileage,
        engineOilType: res.engineOilType,
        gearRatio: res.gearRatio,
        apUnit: res.apUnit,
        tollTransponder: res.tollTransponder,
        tollTransponderDeviceNo: res.tollTransponderDeviceNo,
        doubleBunk: res.doubleBunk,
        refrigerator: res.refrigerator,
        dcInverter: res.dcInverter,
        blower: res.blower,
        pto: res.pto,
      });

      if (res.id) {
        this.editData = { ...this.editData, id: res.id };
      }

      this.selectedAPUnit = res.selectedAPUnit;
      this.selectedBrakes = res.selectedBrakes;
      this.selectedColor = res.selectedColor;
      this.selectedEngineOilType = res.selectedEngineOilType;
      this.selectedFrontWheels = res.selectedFrontWheels;
      this.selectedGearRatio = res.selectedGearRatio;
      this.selectedOwner = res.selectedOwner;
      this.selectedRearWheels = res.selectedRearWheels;
      this.selectedShifter = res.selectedShifter;
      this.selectedTireSize = res.selectedTireSize;
      this.selectedTollTransponders = res.selectedTollTransponders;
      this.selectedTruckGrossWeight = res.selectedTruckGrossWeight;
      this.selectedTruckMake = res.selectedTruckMake;
      this.selectedTruckType = res.selectedTruckType;
      this.selectedtruckEngineModelId = res.selectedtruckEngineModelId;
      this.truckStatus = res.truckStatus;
      this.selectedFuelType = res.selectedFuelType;

      this.modalService.changeModalStatus({
        name: 'deactivate',
        status: this.truckStatus,
      });

      clearTimeout(timeout);
    }, 150);
  }

  public addTruck() {
    const newData: CreateTruckCommand = {
      ...this.truckForm.value,

      apUnit: this.selectedAPUnit ? this.selectedAPUnit.name : null,
      brakes: this.selectedBrakes ? this.selectedBrakes.name : null,
      colorId: this.selectedColor ? this.selectedColor.id : null,
      engineOilType: this.selectedEngineOilType
        ? this.selectedEngineOilType.id
        : null,
      truckTypeId: this.selectedTruckType ? this.selectedTruckType.id : null,
      truckMakeId: this.selectedTruckMake ? this.selectedTruckMake.id : null,
      tollTransponder: this.selectedTollTransponders
        ? this.selectedTollTransponders.id
        : null,
      ownerId: this.selectedOwner ? this.selectedOwner.id : null,
      gearRatio: this.selectedGearRatio ? this.selectedGearRatio.id : null,
      shifter: this.selectedShifter ? this.selectedShifter.id : null,
      tireSizeId: this.selectedTireSize ? this.selectedTireSize.id : null,
      truckEngineModelId: this.selectedtruckEngineModelId
        ? this.selectedtruckEngineModelId.id
        : null,
      truckGrossWeightId: this.selectedTruckGrossWeight
        ? this.selectedTruckGrossWeight.id
        : null,
      frontWheels: this.selectedFrontWheels
        ? this.selectedFrontWheels.name
        : null,
      rearWheels: this.selectedRearWheels ? this.selectedRearWheels.name : null,
      fuelTankSize: this.truckForm.get('fuelTankSize').value
        ? convertThousanSepInNumber(this.truckForm.get('fuelTankSize').value)
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
      fuelType: this.selectedFuelType ? this.selectedFuelType.id : null,
      year: parseInt(this.truckForm.get('year').value),
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Truck successfully created.',
            'Success:'
          );
        },
        error: () =>
          this.notificationService.error("Truck can't be created.", 'Error:'),
      });
  }

  public updateTruck(id: number) {
    const newData: UpdateTruckCommand = {
      id: id,
      ...this.truckForm.value,
      apUnit: this.selectedAPUnit ? this.selectedAPUnit.name : null,
      brakes: this.selectedBrakes ? this.selectedBrakes.name : null,
      colorId: this.selectedColor ? this.selectedColor.id : null,
      engineOilType: this.selectedEngineOilType
        ? this.selectedEngineOilType.id
        : null,
      truckTypeId: this.selectedTruckType ? this.selectedTruckType.id : null,
      truckMakeId: this.selectedTruckMake ? this.selectedTruckMake.id : null,
      tollTransponder: this.selectedTollTransponders
        ? this.selectedTollTransponders.id
        : null,
      ownerId: this.truckForm.get('companyOwned').value
        ? null
        : this.selectedOwner
        ? this.selectedOwner.id
        : null,
      gearRatio: this.selectedGearRatio ? this.selectedGearRatio.id : null,
      shifter: this.selectedShifter ? this.selectedShifter.id : null,
      tireSizeId: this.selectedTireSize ? this.selectedTireSize.id : null,
      truckEngineModelId: this.selectedtruckEngineModelId
        ? this.selectedtruckEngineModelId.id
        : null,
      truckGrossWeightId: this.selectedTruckGrossWeight
        ? this.selectedTruckGrossWeight.id
        : null,
      frontWheels: this.selectedFrontWheels
        ? this.selectedFrontWheels.name
        : null,
      rearWheels: this.selectedRearWheels ? this.selectedRearWheels.name : null,
      fuelTankSize: this.truckForm.get('fuelTankSize').value
        ? convertThousanSepInNumber(this.truckForm.get('fuelTankSize').value)
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
      fuelType: this.selectedFuelType ? this.selectedFuelType.id : null,
      year: parseInt(this.truckForm.get('year').value),
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Truck successfully updated.',
            'Success:'
          );
        },
        error: () =>
          this.notificationService.error("Truck can't be updated.", 'Error:'),
      });
  }

  public deleteTruckById(id: number) {
    this.truckModalService
      .deleteTruckById(id, this.editData.tabSelected)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Truck successfully deleted.',
            'Success:'
          );
        },
        error: () =>
          this.notificationService.error("Truck can't be deleted.", 'Error:'),
      });
  }

  // Checkbox Card
  public companyOwnedCheckboxCard: boolean = true;
  public toggleCheckboxCard() {
    this.companyOwnedCheckboxCard = !this.companyOwnedCheckboxCard;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
