import { CommonModule } from '@angular/common';
import { Options } from '@angular-slider/ngx-slider';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { Subject, takeUntil, skip, tap } from 'rxjs';

import { AngularSvgIconModule } from 'angular-svg-icon';

// bootstrap
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { TruckService } from '@shared/services/truck.service';
import { VinDecoderService } from '@shared/services/vin-decoder.service';
import { FormService } from '@shared/services/form.service';
import { EditTagsService } from '@shared/services/edit-tags.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';

// animations
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// validations
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
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// components
import { OwnerModalComponent } from '@pages/owner/pages/owner-modal/owner-modal.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaNgxSliderComponent } from '@shared/components/ta-ngx-slider/ta-ngx-slider.component';
import {
    CaInputComponent,
    CaInputDropdownComponent,
    CaInputNoteComponent,
    CaModalComponent,
    InputTestComponent,
} from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// models
import { GetTruckModalResponse, VinDecodeResponse } from 'appcoretruckassist';

// Enums
import { TruckModalForm } from '@pages/truck/pages/truck-modal/enums';
import { ContactsModalStringEnum } from '@pages/contacts/pages/contacts-modal/enums';

// Const
import { TruckModalConstants } from '@pages/truck/pages/truck-modal/const';

// Pipes
import { FormatDatePipe } from '@shared/pipes';
import { SharedSvgRoutes } from '@shared/utils/svg-routes';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TableStringEnum } from '@shared/enums';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

@Component({
    selector: 'app-truck-modal',
    templateUrl: './truck-modal.component.html',
    styleUrls: ['./truck-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, TaInputService, FormService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // components
        CaModalComponent,
        TaTabSwitchComponent,
        CaInputComponent,
        CaInputDropdownComponent,
        TaCheckboxCardComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        CaInputNoteComponent,
        TaCheckboxComponent,
        TaNgxSliderComponent,
        TaAppTooltipV2Component,
        InputTestComponent,

        // Pipes
        FormatDatePipe,
    ],
})
export class TruckModalComponent implements OnInit, OnDestroy {
    public truckTypesWithLength = TruckModalConstants.truckTypesWithLength;
    @Input() editData: any;

    public truckForm: UntypedFormGroup;
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
    public truckLengths: any[] = [];
    public tollTransponders: any[] = [];

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
    public selectedTruckLengthId: any = null;
    public selectedFrontWheels: any = null;
    public selectedRearWheels: any = null;
    public selectedFuelType: any = null;

    public selectedTab: number = 1;
    public tabs: any[] = [
        {
            id: 1,
            name: 'Basic',
            checked: true,
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

    public documents: any[] = [];
    public filesForDelete: any[] = [];
    public fileModified: boolean = false;
    public tags: any[] = [];

    public addNewAfterSave: boolean = false;

    public svgRoutes = SharedSvgRoutes;
    private destroy$ = new Subject<void>();
    public taModalActionEnum = TaModalActionEnum;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private truckModalService: TruckService,
        private modalService: ModalService,
        private ngbActiveModal: NgbActiveModal,
        private vinDecoderService: VinDecoderService,
        private formService: FormService,
        private tagsService: EditTagsService,
        private confirmationService: ConfirmationService,
        private confirmationActivationService: ConfirmationActivationService
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

        this.vinDecoder();
        this.confirmationActivationSubscribe();
        this.confirmationDeactivationSubscribe();
    }

    private confirmationDeactivationSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.ngbActiveModal?.close();
            });
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res.action !== TableStringEnum.CLOSE)
                    this.ngbActiveModal?.close();
            });
    }

    private createForm(): void {
        this.truckForm = this.formBuilder.group({
            // Basic Tab
            companyOwned: [true],
            truckNumber: [
                null,
                [Validators.required, ...vehicleUnitValidation],
            ],
            truckTypeId: [null, Validators.required],
            truckLengthId: [null],
            vin: [null, [Validators.required, ...vinNumberValidation]],
            truckMakeId: [null, Validators.required],
            model: [
                null,
                [Validators.required, ...truckTrailerModelValidation],
            ],
            year: [
                null,
                [Validators.required, ...yearValidation, yearValidRegex],
            ],
            volume: [null],
            excludeFromIftaFuelTaxReport: [null],
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
            wheelBase: [null],
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
            headacheRack: [false],
            dashCam: [false],
            files: [null],
            tags: [null],
        });
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;
        this.tabs = this.tabs.map((item) => {
            return {
                ...item,
                checked: item.id === event.id,
            };
        });
        let dotAnimation = document.querySelector('.animation-two-tabs');
        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };
    }

    public onModalAction(action: string): void {
        switch (action) {
            case TaModalActionEnum.CLOSE:
                if (this.editData?.canOpenModal) {
                    switch (this.editData?.key) {
                        case 'repair-modal':
                            this.modalService.setProjectionModal({
                                action: 'close',
                                payload: {
                                    key: this.editData?.key,
                                    value: null,
                                },
                                component: RepairOrderModalComponent,
                                size: 'large',
                                type: 'Truck',
                                closing: 'fastest',
                            });
                            break;
                        default:
                            break;
                    }
                } else {
                    this.ngbActiveModal.close();
                }
                break;

            case TaModalActionEnum.DEACTIVATE:
                this.modalService.openModal(
                    ConfirmationActivationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...this.truckForm.value,
                        array: [
                            {
                                ...this.editData.data,
                                data: {
                                    ...this.truckForm.value.value,
                                    number: this.truckForm.value.truckNumber,
                                    avatar: `assets/svg/common/trucks/${this.editData.data?.truckType?.logoName}`,
                                },
                                modalTitle: this.truckForm.value.truckNumber,
                                modalSecondTitle: this.truckForm.value.vin,
                            },
                        ],
                        template: TableStringEnum.TRUCK,
                        subType: TableStringEnum.TRUCK,
                        type: TableStringEnum.DEACTIVATE,
                        tableType: TableStringEnum.TRUCK,
                        modalTitle: ' Unit ' + this.truckForm.value.truckNumber,
                        modalSecondTitle: this.truckForm.value.vin,
                        svg: true,
                    }
                );
                break;

            case TaModalActionEnum.SAVE_AND_ADD_NEW:
                if (this.truckForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.truckForm);
                    return;
                }
                this.addTruck();
                this.addNewAfterSave = true;
                break;

            case TaModalActionEnum.SAVE:
                if (this.truckForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.truckForm);
                    return;
                }
                if (this.editData?.id) {
                    this.updateTruck(this.editData.id);
                } else {
                    this.addTruck();
                }
                break;

            case TaModalActionEnum.DELETE:
                if (this.editData) {
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            ...this.editData,
                            template: TableStringEnum.TRUCK_2,
                            type: TableStringEnum.DELETE,
                            svg: true,
                        }
                    );
                }
                break;

            default:
                break;
        }
    }

    private isCompanyOwned() {
        this.truckForm
            .get(TruckModalForm.COMPANY_OWNED)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.truckForm.get(TruckModalForm.PURCHASE_DATE).setValue(null);
                this.truckForm
                    .get(TruckModalForm.PURCHASE_PRICE)
                    .setValue(null);
                if (!value) {
                    this.inputService.changeValidators(
                        this.truckForm.get('ownerId'),
                        true,
                        [],
                        false
                    );
                } else {
                    this.inputService.changeValidators(
                        this.truckForm.get('ownerId'),
                        false,
                        [],
                        false
                    );
                }
            });

        if (this.editData.ownerData) {
            this.truckForm.get(TruckModalForm.COMPANY_OWNED).setValue(false);
            this.onSelectDropdown(this.editData.ownerData, TableStringEnum.OWNER_3);
        }
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'truck-type':
                this.selectedTruckType = event;

                if (this.isLengthRequired) {
                    this.inputService.changeValidators(
                        this.truckForm.get(TruckModalForm.TRUCK_TRAILER_LENGTH)
                    );
                } else {
                    this.inputService.changeValidators(
                        this.truckForm.get(TruckModalForm.TRUCK_TRAILER_LENGTH),
                        false
                    );
                    this.selectedTruckLengthId = null;
                }

                if (!this.isFuelTypeEnabled) {
                    this.selectedFuelType = null;
                    this.truckForm.get(TruckModalForm.FUEL_TYPE).setValue(null);
                }

                if (this.isLengthRequired) {
                    this.selectedTruckLengthId = null;
                    this.truckForm
                        .get(TruckModalForm.TRUCK_TRAILER_LENGTH)
                        .patchValue(null);
                }

                if (!this.isSpecialTruckType)
                    this.truckForm.get(TruckModalForm.VOLUME).setValue(null);
                break;
            case 'truck-make':
                this.selectedTruckMake = event;
                break;
            case 'color':
                this.selectedColor = event;
                break;
            case 'owner':
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
                                selectedEngineOilType:
                                    this.selectedEngineOilType,
                                selectedFrontWheels: this.selectedFrontWheels,
                                selectedGearRatio: this.selectedGearRatio,
                                selectedOwner: this.selectedOwner,
                                selectedRearWheels: this.selectedRearWheels,
                                selectedShifter: this.selectedShifter,
                                selectedTireSize: this.selectedTireSize,
                                selectedTollTransponders:
                                    this.selectedTollTransponders,
                                selectedTruckGrossWeight:
                                    this.selectedTruckGrossWeight,
                                selectedTruckMake: this.selectedTruckMake,
                                selectedTruckType: this.selectedTruckType,
                                selectedtruckEngineModelId:
                                    this.selectedtruckEngineModelId,
                                truckStatus: this.truckStatus,
                                selectedTruckLengthId:
                                    this.selectedTruckLengthId,
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
            case 'gross-weight':
                this.selectedTruckGrossWeight = event;
                break;
            case 'tire-size':
                this.selectedTireSize = event;
                break;
            case 'shifter':
                this.selectedShifter = event;
                break;
            case 'engine-model':
                this.selectedtruckEngineModelId = event;
                break;
            case 'engine-oil-type':
                this.selectedEngineOilType = event;
                break;
            case 'ap-unit':
                this.selectedAPUnit = event;
                break;
            case 'gear-ratio':
                this.selectedGearRatio = event;
                break;
            case 'toll-transponder':
                this.selectedTollTransponders = event;
                break;
            case 'brakes':
                this.selectedBrakes = event;
                break;
            case 'front-wheels':
                this.selectedFrontWheels = event;
                break;
            case 'rear-wheels':
                this.selectedRearWheels = event;
                break;
            case 'fuel-type':
                this.selectedFuelType = event;
                break;
            case 'truck-length':
                this.selectedTruckLengthId = event;
                this.inputService.changeValidators(
                    this.truckForm.get(TruckModalForm.TRUCK_TRAILER_LENGTH),
                    this.isLengthRequired
                );
                break;

            default:
                break;
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
                if (!(value?.length === 13 || value?.length === 17)) {
                    this.truckForm
                        .get('vin')
                        .setErrors({ incorrectVinNumber: true });
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
                                    year: res?.year
                                        ? res.year.toString()
                                        : null,
                                    truckMakeId: res.truckMake
                                        ? res.truckMake.name
                                        : null,
                                    truckEngineModelId: res.engineModel?.name
                                        ? res.engineModel.name
                                        : null,
                                    fuelType: res.fuelType
                                        ? this.fuelTypes.find(
                                              (item) =>
                                                  item.name === res.fuelType
                                          )?.name
                                        : null,
                                });
                                this.loadingVinDecoder = false;
                                this.selectedTruckMake = res.truckMake;
                                this.selectedtruckEngineModelId =
                                    res.engineModel;
                                this.selectedFuelType = this.fuelTypes.find(
                                    (item) => item.name === res.fuelType
                                );
                            },
                            error: () => {},
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
                    this.tags = res.tags;
                    this.colorType = res.colors.map((item) => {
                        return {
                            ...item,
                            folder: 'common',
                            subFolder: 'colors',
                            logoName: 'ic_color.svg',
                        };
                    });
                    this.truckLengths = res.truckLengths;
                    this.engineOilTypes = res.engineOilTypes;
                    this.tollTransponders = res.ezPass.map((item) => {
                        return {
                            ...item,
                            groups: item.tollTransponders,
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

                    // Edit part
                    if (this.editData?.id) {
                        this.skipVinDecocerEdit = true;
                        this.editTruckById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => {},
            });
    }

    public editTruckById(id: number) {
        this.truckModalService
            .getTruckById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.truckForm.patchValue({
                        // Basic Tab
                        companyOwned: res.companyOwned,
                        truckNumber: res.truckNumber,
                        truckTypeId: res.truckType ? res.truckType.name : null,
                        vin: res.vin,
                        truckMakeId: res.truckMake ? res.truckMake.name : null,
                        model: res.model,
                        year: res.year.toString(),
                        truckLengthId: res.truckLength
                            ? res.truckLength.name
                            : null,
                        colorId: res.color ? res.color.name : null,
                        ownerId: res.owner ? res.owner.name : null,
                        commission: res.commission,
                        note: res.note,
                        // Additional Tab
                        purchaseDate: res.purchaseDate
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  res.purchaseDate
                              )
                            : null,
                        purchasePrice: res.purchasePrice
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.purchasePrice
                              )
                            : null,
                        truckGrossWeightId: res.truckGrossWeight
                            ? res.truckGrossWeight.name
                            : null,
                        emptyWeight: res.emptyWeight
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.emptyWeight
                              )
                            : null,
                        truckEngineModelId: res.truckEngineModel
                            ? res.truckEngineModel.name
                            : null,
                        tireSizeId: res.tireSize ? res.tireSize.name : null,
                        fuelTankSize: res.fuelTankSize
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.fuelTankSize
                              )
                            : null,
                        brakes: res.brakes ? res.brakes.name : null,
                        frontWheels: res.frontWheels
                            ? res.frontWheels.name
                            : null,
                        wheelBase: res.wheelBase
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.wheelBase
                              )
                            : null,
                        rearWheels: res.rearWheels ? res.rearWheels.name : null,
                        transmissionModel: res.transmissionModel,
                        shifter: res.shifter ? res.shifter.name : null,
                        axles: res.axles,
                        insurancePolicy: res.insurancePolicy,
                        mileage: res.mileage
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.mileage
                              )
                            : null,
                        fuelType: res.fuelType ? res.fuelType.name : null,
                        engineOilType: res.engineOilType
                            ? res.engineOilType.name
                            : null,
                        gearRatio: res.gearRatio ? res.gearRatio.name : null,
                        apUnit: res.apUnit ? res.apUnit.name : null,
                        tollTransponder: res.tollTransponder
                            ? res.tollTransponder.name
                            : null,
                        tollTransponderDeviceNo: res.tollTransponderDeviceNo,
                        doubleBunk: res.doubleBunk,
                        refrigerator: res.refrigerator,
                        dcInverter: res.dcInverter,
                        headacheRack: res.headacheRack,
                        dashCam: res.dashCam,
                        blower: res.blower,
                        pto: res.pto,
                        fhwaExp: res.fhwaExp ? res.fhwaExp : 12,
                        volume: res.volume ?? null,
                        excludeFromIftaFuelTaxReport:
                            res.excludeFromIftaFuelTaxReport,
                    });

                    this.selectedAPUnit = res.apUnit ? res.apUnit : null;
                    this.selectedBrakes = res.brakes ? res.brakes : null;
                    this.selectedColor = res.color ? res.color : null;
                    this.selectedEngineOilType = res.engineOilType
                        ? res.engineOilType
                        : null;
                    this.selectedFrontWheels = res.frontWheels
                        ? res.frontWheels
                        : null;

                    this.selectedGearRatio = res.gearRatio
                        ? res.gearRatio
                        : null;
                    this.selectedOwner = res.owner ? res.owner : null;
                    this.selectedRearWheels = res.rearWheels
                        ? res.rearWheels
                        : null;
                    this.selectedShifter = res.shifter ? res.shifter : null;
                    this.selectedTireSize = res.tireSize ? res.tireSize : null;
                    this.selectedTollTransponders = res.tollTransponder
                        ? res.tollTransponder
                        : null;
                    this.selectedTruckGrossWeight = res.truckGrossWeight
                        ? res.truckGrossWeight
                        : null;
                    this.selectedTruckMake = res.truckMake
                        ? res.truckMake
                        : null;
                    this.selectedTruckType = res.truckType
                        ? res.truckType
                        : null;
                    this.selectedtruckEngineModelId = res.truckEngineModel
                        ? res.truckEngineModel
                        : null;
                    this.selectedFuelType = res.fuelType;
                    this.truckStatus = res.status !== 1;
                    this.selectedTruckLengthId = res.truckLength;
                    this.documents = res.files;

                    this.modalService.changeModalStatus({
                        name: 'deactivate',
                        status: this.truckStatus,
                    });

                    this.startFormChanges();
                },
                error: () => {},
            });
    }

    public get isFuelTypeEnabled(): boolean {
        return TruckModalConstants.fuelTypeTrucks.includes(
            this.truckForm.get(TruckModalForm.TRUCK_TYPE_ID).value
        );
    }

    public get isSpecialTruckType(): boolean {
        const truckTypeId = this.truckForm.get(
            TruckModalForm.TRUCK_TYPE_ID
        ).value;
        return TruckModalConstants.truckTypesWithAdditionalColumns.includes(
            truckTypeId
        );
    }

    public get isBoxTruck(): boolean {
        return (
            this.truckForm.get(TruckModalForm.TRUCK_TYPE_ID).value ===
            TruckModalForm.BOX_TRUCK
        );
    }

    public get isLengthRequired(): boolean {
        return this.truckTypesWithLength.includes(this.selectedTruckType?.name);
    }

    private populateStorageData(res: any) {
        const timeout = setTimeout(() => {
            this.getTruckDropdowns();
            this.truckForm.patchValue({
                companyOwned: res.companyOwned,
                truckNumber: res.truckNumber,
                truckTypeId: res.truckTypeId,
                truckLengthId: res.truckLengthId,
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
                wheelBase: res.wheelBase,
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
                headacheRack: res.headacheRack,
                dashCam: res.dashCam,
                blower: res.blower,
                pto: res.pto,
                volume: res.volume,
                excludeFromIftaFuelTaxReport: res.excludeFromIftaFuelTaxReport,
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
        let documents = [];
        let tagsArray = [];
        this.documents.map((item) => {
            if (item.tagId?.length)
                tagsArray.push({
                    fileName: item.realFile.name,
                    tagIds: item.tagId,
                });

            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        if (!tagsArray.length) {
            tagsArray = null;
        }

        const newData: any = {
            ...this.truckForm.value,

            apUnit: this.selectedAPUnit ? this.selectedAPUnit.name : null,
            brakes: this.selectedBrakes ? this.selectedBrakes.name : null,
            colorId: this.selectedColor ? this.selectedColor.id : null,
            engineOilType: this.selectedEngineOilType
                ? this.selectedEngineOilType.id
                : null,
            truckTypeId: this.selectedTruckType
                ? this.selectedTruckType.id
                : null,
            truckMakeId: this.selectedTruckMake
                ? this.selectedTruckMake.id
                : null,
            truckLengthId: this.selectedTruckLengthId
                ? this.selectedTruckLengthId.id
                : null,
            tollTransponder: this.selectedTollTransponders
                ? this.selectedTollTransponders.id
                : null,
            ownerId: this.selectedOwner ? this.selectedOwner.id : null,
            gearRatio: this.selectedGearRatio
                ? this.selectedGearRatio.id
                : null,
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
            wheelBase: this.truckForm.get('wheelBase').value
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      this.truckForm.get('wheelBase').value
                  )
                : null,
            rearWheels: this.selectedRearWheels
                ? this.selectedRearWheels.name
                : null,
            fuelTankSize: this.truckForm.get('fuelTankSize').value
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      this.truckForm.get('fuelTankSize').value
                  )
                : null,
            mileage: this.truckForm.get('mileage').value
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      this.truckForm.get('mileage').value
                  )
                : null,
            axles: this.truckForm.get('axles').value
                ? parseInt(this.truckForm.get('axles').value)
                : null,
            emptyWeight: this.truckForm.get('emptyWeight').value
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      this.truckForm.get('emptyWeight').value
                  )
                : null,
            commission: this.truckForm.get('commission').value
                ? parseFloat(
                      this.truckForm
                          .get('commission')
                          .value.toString()
                          .replace(/,/g, '')
                  )
                : null,
            fuelType: this.isFuelTypeEnabled
                ? this.selectedFuelType
                    ? this.selectedFuelType.id
                    : null
                : null,
            year: parseInt(this.truckForm.get(TruckModalForm.YEAR).value),
            purchaseDate: this.truckForm.get(TruckModalForm.COMPANY_OWNED).value
                ? this.truckForm.get(TruckModalForm.PURCHASE_DATE).value
                    ? MethodsCalculationsHelper.convertDateToBackend(
                          this.truckForm.get(TruckModalForm.PURCHASE_DATE).value
                      )
                    : null
                : null,
            purchasePrice: this.truckForm.get(TruckModalForm.COMPANY_OWNED)
                .value
                ? this.truckForm.get(TruckModalForm.PURCHASE_PRICE).value
                    ? MethodsCalculationsHelper.convertThousanSepInNumber(
                          this.truckForm.get(TruckModalForm.PURCHASE_PRICE)
                              .value
                      )
                    : null
                : null,
            files: documents,
            tags: tagsArray,
            volume: this.truckForm.get(TruckModalForm.VOLUME).value,
            excludeFromIftaFuelTaxReport: this.truckForm.get(
                TruckModalForm.EXCLUDE_FROM_IFTA
            ).value,
        };

        this.truckModalService
            .addTruck(newData, this.editData?.isDispatchCall)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal) {
                        switch (this.editData?.key) {
                            case 'repair-modal': {
                                this.modalService.setProjectionModal({
                                    action: 'close',
                                    payload: {
                                        key: this.editData?.key,
                                        value: null,
                                    },
                                    component: RepairOrderModalComponent,
                                    size: 'large',
                                    type: 'Truck',
                                    closing: 'slowlest',
                                });
                                this.ngbActiveModal.close();
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    }

                    this.ngbActiveModal.close();
                    if (this.addNewAfterSave) {
                        this.modalService.openModal(TruckModalComponent, {
                            size: ContactsModalStringEnum.SMALL,
                        });
                    }
                },
                error: () => {},
            });
    }

    public updateTruck(id: number) {
        let documents = [];
        let tagsArray = [];
        this.documents.map((item) => {
            if (item.tagId?.length && item?.realFile?.name)
                tagsArray.push({
                    fileName: item.realFile.name,
                    tagIds: item.tagId,
                });

            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        if (!tagsArray.length) {
            tagsArray = null;
        }

        const newData: any = {
            id: id,
            ...this.truckForm.value,
            apUnit: this.selectedAPUnit ? this.selectedAPUnit.name : null,
            brakes: this.selectedBrakes ? this.selectedBrakes.name : null,
            colorId: this.selectedColor ? this.selectedColor.id : null,
            engineOilType: this.selectedEngineOilType
                ? this.selectedEngineOilType.id
                : null,
            truckTypeId: this.selectedTruckType
                ? this.selectedTruckType.id
                : null,
            truckMakeId: this.selectedTruckMake
                ? this.selectedTruckMake.id
                : null,
            truckLengthId: this.selectedTruckLengthId
                ? this.selectedTruckLengthId.id
                : null,
            tollTransponder: this.selectedTollTransponders
                ? this.selectedTollTransponders.id
                : null,
            ownerId: this.truckForm.get(TruckModalForm.COMPANY_OWNED).value
                ? null
                : this.selectedOwner
                  ? this.selectedOwner.id
                  : null,
            gearRatio: this.selectedGearRatio
                ? this.selectedGearRatio.id
                : null,
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
            wheelBase: this.truckForm.get('wheelBase').value
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      this.truckForm.get('wheelBase').value
                  )
                : null,
            rearWheels: this.selectedRearWheels
                ? this.selectedRearWheels.name
                : null,
            fuelTankSize: this.truckForm.get('fuelTankSize').value
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      this.truckForm.get('fuelTankSize').value
                  )
                : null,
            mileage: this.truckForm.get('mileage').value
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      this.truckForm.get('mileage').value
                  )
                : null,
            axles: this.truckForm.get('axles').value
                ? parseInt(this.truckForm.get('axles').value)
                : null,
            emptyWeight: this.truckForm.get('emptyWeight').value
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      this.truckForm.get('emptyWeight').value
                  )
                : null,
            commission: this.truckForm.get('commission').value
                ? parseFloat(
                      this.truckForm
                          .get('commission')
                          .value.toString()
                          .replace(/,/g, '')
                  )
                : null,
            fuelType: this.isFuelTypeEnabled
                ? this.selectedFuelType
                    ? this.selectedFuelType.id
                    : null
                : null,
            year: parseInt(this.truckForm.get(TruckModalForm.YEAR).value),
            volume: parseInt(this.truckForm.get(TruckModalForm.VOLUME).value),
            excludeFromIftaFuelTaxReport: this.truckForm.get(
                TruckModalForm.EXCLUDE_FROM_IFTA
            ).value,
            purchaseDate: this.truckForm.get(TruckModalForm.COMPANY_OWNED).value
                ? this.truckForm.get(TruckModalForm.PURCHASE_DATE).value
                    ? MethodsCalculationsHelper.convertDateToBackend(
                          this.truckForm.get(TruckModalForm.PURCHASE_DATE).value
                      )
                    : null
                : null,
            purchasePrice: this.truckForm.get(TruckModalForm.COMPANY_OWNED)
                .value
                ? this.truckForm.get(TruckModalForm.PURCHASE_PRICE).value
                    ? MethodsCalculationsHelper.convertThousanSepInNumber(
                          this.truckForm.get(TruckModalForm.PURCHASE_PRICE)
                              .value
                      )
                    : null
                : null,
            files: documents ? documents : this.truckForm.value.files,
            filesForDeleteIds: this.filesForDelete,
            tags: tagsArray,
        };

        this.truckModalService
            .updateTruck(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
                    this.updateTags();
                },
                error: () => {},
            });
    }

    public deleteTruckById(id: number) {
        this.truckModalService
            .deleteTruckById(id, this.editData.tabSelected)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
                },
                error: () => {},
            });
    }

    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case 'add': {
                this.truckForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.truckForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) {
                    this.filesForDelete.push(event.deleteId);
                }

                this.fileModified = true;
                break;
            }
            case 'tag': {
                let changedTag = false;
                event.files.map((item) => {
                    if (item.tagChanged) {
                        changedTag = true;
                    }
                });

                this.truckForm.get('tags').patchValue(changedTag ? true : null);
                break;
            }
            default: {
                break;
            }
        }
    }

    public onBlurTruckModel() {
        const model = this.truckForm.get('model').value;
        if (model?.length >= 1) {
            this.truckModalService
                .autocompleteByTruckModel(model)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }

    updateTags() {
        let tags = [];

        this.documents.map((item) => {
            if (item?.tagChanged && item?.fileId) {
                var tagsData = {
                    storageId: item.fileId,
                    tagId: item.tagId?.length ? item.tagId[0] : null,
                };
                tags.push(tagsData);
            }
        });

        if (tags.length) {
            this.tagsService.updateTag({ tags: tags }).subscribe();
        }
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.truckForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
