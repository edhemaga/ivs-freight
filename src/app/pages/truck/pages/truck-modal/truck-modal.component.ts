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
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

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
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// models
import { GetTruckModalResponse, VinDecodeResponse } from 'appcoretruckassist';
import { Tabs } from '@shared/models';
import { Confirmation } from '@shared/components/ta-shared-modals/confirmation-modal/models/confirmation.model';

// Enums
import { eTruckModalForm } from '@pages/truck/pages/truck-modal/enums';
import { ContactsModalStringEnum } from '@pages/contacts/pages/contacts-modal/enums';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import {
    eFileActions,
    eFileFormControls,
    eGeneralActions,
    eStringPlaceholder,
    TableStringEnum,
} from '@shared/enums';

// Const
import { TruckModalConstants } from '@pages/truck/pages/truck-modal/const';

// Pipes
import { FormatDatePipe } from '@shared/pipes';

// SVG routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

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
    @Input() editData: any;

    // Constants
    public truckTypesWithLength = TruckModalConstants.truckTypesWithLength;

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
    public tabs: Tabs[] = TruckModalConstants.truckModalTabs;

    public commissionOptions: Options = TruckModalConstants.commissionOptions;

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
    public taModalActionEnum = TaModalActionEnum;

    // Clean-up
    private destroy$ = new Subject<void>();

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

    ngOnInit(): void {
        this.createForm();
        this.isCompanyOwned();

        this.vinDecoder();
        this.confirmationActivationSubscribe();
        this.confirmationDeactivationSubscribe();
    }

    ngAfterViewInit(): void {
        if (!this.editData?.storageData) {
            this.getTruckDropdowns();
            return;
        }

        this.skipVinDecocerEdit = true;
        this.populateStorageData(this.editData.storageData);
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
            .subscribe((res: Confirmation) => {
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

    public tabChange(event: Tabs): void {
        this.selectedTab = event.id;
        this.tabs = this.tabs?.map((item): Tabs => {
            return {
                ...item,
                checked: item.id === event.id,
            };
        });

        const dotAnimation = document.querySelector('.animation-two-tabs');
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
                        case eTruckModalForm.REPAIR_MODAL:
                            this.modalService.setProjectionModal({
                                action: eGeneralActions.CLOSE,
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
                } else this.ngbActiveModal.close();
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

                if (this.editData?.id) this.updateTruck(this.editData.id);
                else this.addTruck();

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

    private isCompanyOwned(): void {
        this.truckForm
            .get(eTruckModalForm.COMPANY_OWNED)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.truckForm
                    .get(eTruckModalForm.PURCHASE_DATE)
                    .setValue(null);
                this.truckForm
                    .get(eTruckModalForm.PURCHASE_PRICE)
                    .setValue(null);
                if (!value) {
                    this.inputService.changeValidators(
                        this.truckForm.get(eTruckModalForm.OWNER_ID),
                        true,
                        [],
                        false
                    );
                    this.truckForm.get(eTruckModalForm.OWNER_ID).setValue(null);
                } else {
                    this.inputService.changeValidators(
                        this.truckForm.get(eTruckModalForm.OWNER_ID),
                        false,
                        [],
                        false
                    );
                }
            });

        if (this.editData?.ownerData) {
            this.truckForm.get(eTruckModalForm.COMPANY_OWNED).setValue(false);
            this.onSelectDropdown(
                this.editData.ownerData,
                TableStringEnum.OWNER_3
            );
        }
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case eTruckModalForm.TRUCK_TYPE:
                this.selectedTruckType = event;

                if (this.isLengthRequired)
                    this.inputService.changeValidators(
                        this.truckForm.get(eTruckModalForm.TRUCK_TRAILER_LENGTH)
                    );
                else
                    this.inputService.changeValidators(
                        this.truckForm.get(
                            eTruckModalForm.TRUCK_TRAILER_LENGTH
                        ),
                        false
                    );
                this.selectedTruckLengthId = null;

                if (!this.isFuelTypeEnabled) {
                    this.selectedFuelType = null;
                    this.truckForm
                        .get(eTruckModalForm.FUEL_TYPE)
                        .setValue(null);
                }

                if (this.isLengthRequired) {
                    this.selectedTruckLengthId = null;
                    this.truckForm
                        .get(eTruckModalForm.TRUCK_TRAILER_LENGTH)
                        .patchValue(null);
                }

                if (!this.isSpecialTruckType)
                    this.truckForm.get(eTruckModalForm.VOLUME).setValue(null);
                break;
            case eTruckModalForm.TRUCK_MAKE:
                this.selectedTruckMake = event;
                break;
            case eTruckModalForm.COLOR:
                this.selectedColor = event;
                break;
            case eTruckModalForm.OWNER:
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();
                    this.modalService.setProjectionModal({
                        action: eGeneralActions.OPEN,
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
                } else this.selectedOwner = event;
                break;
            case eTruckModalForm.GROSS_WEIGHT:
                this.selectedTruckGrossWeight = event;
                break;
            case eTruckModalForm.TIRE_SIZE:
                this.selectedTireSize = event;
                break;
            case eTruckModalForm.SHIFTER:
                this.selectedShifter = event;
                break;
            case eTruckModalForm.ENGINE_MODEL:
                this.selectedtruckEngineModelId = event;
                break;
            case eTruckModalForm.ENGINE_OIL_TYPE:
                this.selectedEngineOilType = event;
                break;
            case eTruckModalForm.AP_UNIT:
                this.selectedAPUnit = event;
                break;
            case eTruckModalForm.GEAR_RATIO:
                this.selectedGearRatio = event;
                break;
            case eTruckModalForm.TOLL_TRANSPONDER:
                this.selectedTollTransponders = event;
                break;
            case eTruckModalForm.BRAKES:
                this.selectedBrakes = event;
                break;
            case eTruckModalForm.FRONT_WHEELS:
                this.selectedFrontWheels = event;
                break;
            case eTruckModalForm.REAR_WHEELS:
                this.selectedRearWheels = event;
                break;
            case eTruckModalForm.FUEL_TYPE:
                this.selectedFuelType = event;
                break;
            case eTruckModalForm.TRUCK_LENGTH:
                this.selectedTruckLengthId = event;
                this.inputService.changeValidators(
                    this.truckForm.get(eTruckModalForm.TRUCK_TRAILER_LENGTH),
                    this.isLengthRequired
                );
                break;
            default:
                break;
        }
    }

    private vinDecoder(): void {
        this.truckForm
            .get(eTruckModalForm.VIN)
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                this.skipVinDecocerEdit ? skip(1) : tap()
            )
            .subscribe((value) => {
                this.skipVinDecocerEdit = false;
                if (!(value?.length === 13 || value?.length === 17)) {
                    this.truckForm
                        .get(eTruckModalForm.VIN)
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
                                    ...(res?.model && { model: res.model }),
                                    ...(res?.year && {
                                        year: res.year.toString(),
                                    }),
                                    ...(res?.truckMake?.id && {
                                        truckMakeId: res.truckMake.id,
                                    }),
                                    ...(res?.engineModel?.name && {
                                        truckEngineModelId:
                                            res.engineModel.name,
                                    }),
                                    ...(res?.fuelType && {
                                        fuelType: this.fuelTypes.find(
                                            (item) => item.name === res.fuelType
                                        )?.name,
                                    }),
                                });
                                
                                this.loadingVinDecoder = false;
                                this.selectedTruckMake = res.truckMake;
                                this.selectedtruckEngineModelId =
                                    res.engineModel;
                                this.selectedFuelType = this.fuelTypes.find(
                                    (item) => item.name === res.fuelType
                                );
                            },
                        });
                }
            });
    }

    public getTruckDropdowns(): void {
        this.truckModalService
            .getTruckDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: GetTruckModalResponse) => {
                    this.apUnits = res.apUnits;
                    this.brakes = res.brakes;
                    this.tags = res.tags;
                    this.colorType = res.colors?.map((item) => {
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
                    this.truckType = res.truckTypes?.map((item) => {
                        return {
                            ...item,
                            folder: 'common',
                            subFolder: 'trucks',
                        };
                    });
                    this.rearWheels = this.frontWheels = res.wheelsTypes;
                    this.fuelTypes = res.fuelTypes;
                    this.truckForm
                        .get(eTruckModalForm.FHWA_EXP)
                        .patchValue(res.fhwaExp);

                    // Edit part
                    if (!this.editData?.id) {
                        this.startFormChanges();
                        return;
                    }

                    this.skipVinDecocerEdit = true;
                    this.editTruckById(this.editData.id);
                },
            });
    }

    public editTruckById(id: number): void {
        this.truckModalService
            .getTruckById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.truckForm.patchValue({
                        // Basic Tab
                        ...res,
                        truckTypeId: res.truckType?.id ?? null,
                        truckMakeId: res.truckMake?.id ?? null,
                        year: res.year.toString(),
                        truckLengthId: res.truckLength?.id ?? null,
                        colorId: res.color?.id ?? null,
                        ownerId: res.owner?.id ?? null,
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
                        rearWheels: res.rearWheels?.name ?? null,
                        shifter: res.shifter?.name ?? null,
                        mileage: res.mileage
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.mileage
                              )
                            : null,
                        fuelType: res.fuelType?.name ?? null,
                        engineOilType: res.engineOilType
                            ? res.engineOilType.name
                            : null,
                        gearRatio: res.gearRatio?.name ?? null,
                        apUnit: res.apUnit?.name ?? null,
                        tollTransponder: res.tollTransponder?.name ?? null,
                        fhwaExp: res.fhwaExp ?? 12,
                        volume: res.volume ?? null,
                        excludeFromIftaFuelTaxReport:
                            res.excludeFromIftaFuelTaxReport,
                    });

                    this.selectedAPUnit = res.apUnit ?? null;
                    this.selectedBrakes = res.brakes ?? null;
                    this.selectedColor = res.color ?? null;
                    this.selectedEngineOilType = res.engineOilType ?? null;
                    this.selectedFrontWheels = res.frontWheels ?? null;
                    this.selectedGearRatio = res.gearRatio
                        ? res.gearRatio
                        : null;
                    this.selectedOwner =
                        res.owner && !res.companyOwned ? res.owner : null;
                    this.selectedRearWheels = res.rearWheels
                        ? res.rearWheels
                        : null;
                    this.selectedShifter = res.shifter ?? null;
                    this.selectedTireSize = res.tireSize ?? null;
                    this.selectedTollTransponders = res.tollTransponder ?? null;
                    this.selectedTruckGrossWeight =
                        res.truckGrossWeight ?? null;
                    this.selectedTruckMake = res.truckMake ?? null;
                    this.selectedTruckType = res.truckType ?? null;
                    this.selectedtruckEngineModelId =
                        res.truckEngineModel ?? null;
                    this.selectedFuelType = res.fuelType;
                    this.truckStatus = res.status !== 1;
                    this.selectedTruckLengthId = res.truckLength;
                    this.documents = res.files;

                    this.modalService.changeModalStatus({
                        name: eGeneralActions.DEACTIVATE,
                        status: this.truckStatus,
                    });

                    this.startFormChanges();
                },
            });
    }

    public get isFuelTypeEnabled(): boolean {
        return TruckModalConstants.fuelTypeTrucks.includes(
            this.truckForm.get(eTruckModalForm.TRUCK_TYPE_ID).value
        );
    }

    public get isSpecialTruckType(): boolean {
        const truckTypeId = this.truckForm.get(
            eTruckModalForm.TRUCK_TYPE_ID
        ).value;
        return TruckModalConstants.truckTypesWithAdditionalColumns.includes(
            truckTypeId
        );
    }

    public get isBoxTruck(): boolean {
        return (
            this.truckForm.get(eTruckModalForm.TRUCK_TYPE_ID).value ===
            eTruckModalForm.BOX_TRUCK
        );
    }

    public get isLengthRequired(): boolean {
        return this.truckTypesWithLength.includes(this.selectedTruckType?.name);
    }

    private populateStorageData(res: any): void {
        this.getTruckDropdowns();
        this.truckForm.patchValue({ ...res });

        if (res.id) this.editData = { ...this.editData, id: res.id };

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
            name: eGeneralActions.DEACTIVATE,
            status: this.truckStatus,
        });
    }

    public addTruck(): void {
        let documents = [];
        let tagsArray = [];

        this.documents.forEach((item) => {
            if (item.tagId?.length) {
                const tag = {
                    fileName: item.realFile.name,
                    tagIds: item.tagId,
                };
                tagsArray = [...tagsArray, tag];
            }

            if (item.realFile) documents = [...documents, item.realFile];
        });

        if (!tagsArray.length) tagsArray = null;

        const newData: any = {
            ...this.truckForm.value,
            apUnit: this.selectedAPUnit?.name ?? null,
            brakes: this.selectedBrakes?.name ?? null,
            colorId: this.selectedColor?.id ?? null,
            engineOilType: this.selectedEngineOilType?.id ?? null,
            truckTypeId: this.selectedTruckType?.id ?? null,
            truckMakeId: this.selectedTruckMake?.id ?? null,
            truckLengthId: this.selectedTruckLengthId?.id ?? null,
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
            wheelBase: this.truckForm.get(eTruckModalForm.WHEEL_BASE).value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.truckForm.get(eTruckModalForm.WHEEL_BASE).value
                  )
                : null,
            rearWheels: this.selectedRearWheels
                ? this.selectedRearWheels.name
                : null,
            fuelTankSize: this.truckForm.get(eTruckModalForm.FUEL_TANK_SIZE)
                .value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.truckForm.get(eTruckModalForm.FUEL_TANK_SIZE).value
                  )
                : null,
            mileage: this.truckForm.get(eTruckModalForm.MILEAGE).value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.truckForm.get(eTruckModalForm.MILEAGE).value
                  )
                : null,
            axles: this.truckForm.get(eTruckModalForm.AXLES).value
                ? parseInt(this.truckForm.get(eTruckModalForm.AXLES).value)
                : null,
            emptyWeight: this.truckForm.get(eTruckModalForm.EMPTY_WEIGHT).value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.truckForm.get(eTruckModalForm.EMPTY_WEIGHT).value
                  )
                : null,
            commission: this.truckForm.get(eTruckModalForm.COMMISSION).value
                ? parseFloat(
                      this.truckForm
                          .get(eTruckModalForm.COMMISSION)
                          .value.toString()
                          .replace(/,/g, eStringPlaceholder.EMPTY)
                  )
                : null,
            fuelType: this.isFuelTypeEnabled
                ? this.selectedFuelType
                    ? this.selectedFuelType.id
                    : null
                : null,
            year: parseInt(this.truckForm.get(eTruckModalForm.YEAR).value),
            purchaseDate: this.truckForm.get(eTruckModalForm.COMPANY_OWNED)
                .value
                ? this.truckForm.get(eTruckModalForm.PURCHASE_DATE).value
                    ? MethodsCalculationsHelper.convertDateToBackend(
                          this.truckForm.get(eTruckModalForm.PURCHASE_DATE)
                              .value
                      )
                    : null
                : null,
            purchasePrice: this.truckForm.get(eTruckModalForm.COMPANY_OWNED)
                .value
                ? this.truckForm.get(eTruckModalForm.PURCHASE_PRICE).value
                    ? MethodsCalculationsHelper.convertThousandSepInNumber(
                          this.truckForm.get(eTruckModalForm.PURCHASE_PRICE)
                              .value
                      )
                    : null
                : null,
            files: documents,
            tags: tagsArray,
            volume: this.truckForm.get(eTruckModalForm.VOLUME).value,
            excludeFromIftaFuelTaxReport: this.truckForm.get(
                eTruckModalForm.EXCLUDE_FROM_IFTA
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
                                    action: eGeneralActions.CLOSE,
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
                    if (this.addNewAfterSave)
                        this.modalService.openModal(TruckModalComponent, {
                            size: ContactsModalStringEnum.SMALL,
                        });
                },
            });
    }

    public updateTruck(id: number): void {
        let documents = [];
        let tagsArray = [];

        this.documents.forEach((item) => {
            if (item.tagId?.length && item?.realFile?.name)
                tagsArray = [
                    ...tagsArray,
                    {
                        fileName: item.realFile.name,
                        tagIds: item.tagId,
                    },
                ];

            if (item.realFile) documents = [...documents, item.realFile];
        });

        if (!tagsArray.length) tagsArray = null;

        const newData: any = {
            id,
            ...this.truckForm.value,
            apUnit: this.selectedAPUnit?.name ?? null,
            brakes: this.selectedBrakes?.name ?? null,
            colorId: this.selectedColor?.id ?? null,
            engineOilType: this.selectedEngineOilType?.id ?? null,
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
            ownerId: this.truckForm.get(eTruckModalForm.COMPANY_OWNED).value
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
            wheelBase: this.truckForm.get(eTruckModalForm.WHEEL_BASE).value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.truckForm.get(eTruckModalForm.WHEEL_BASE).value
                  )
                : null,
            rearWheels: this.selectedRearWheels
                ? this.selectedRearWheels.name
                : null,
            fuelTankSize: this.truckForm.get(eTruckModalForm.FUEL_TANK_SIZE)
                .value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.truckForm.get(eTruckModalForm.FUEL_TANK_SIZE).value
                  )
                : null,
            mileage: this.truckForm.get(eTruckModalForm.MILEAGE).value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.truckForm.get(eTruckModalForm.MILEAGE).value
                  )
                : null,
            axles: this.truckForm.get(eTruckModalForm.AXLES).value
                ? parseInt(this.truckForm.get(eTruckModalForm.AXLES).value)
                : null,
            emptyWeight: this.truckForm.get(eTruckModalForm.EMPTY_WEIGHT).value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.truckForm.get(eTruckModalForm.EMPTY_WEIGHT).value
                  )
                : null,
            commission: this.truckForm.get(eTruckModalForm.COMMISSION).value
                ? parseFloat(
                      this.truckForm
                          .get(eTruckModalForm.COMMISSION)
                          .value.toString()
                          .replace(/,/g, eStringPlaceholder.WHITESPACE)
                  )
                : null,
            fuelType: this.isFuelTypeEnabled
                ? this.selectedFuelType
                    ? this.selectedFuelType.id
                    : null
                : null,
            year: parseInt(this.truckForm.get(eTruckModalForm.YEAR).value),
            volume: parseInt(this.truckForm.get(eTruckModalForm.VOLUME).value),
            excludeFromIftaFuelTaxReport: this.truckForm.get(
                eTruckModalForm.EXCLUDE_FROM_IFTA
            ).value,
            purchaseDate: this.truckForm.get(eTruckModalForm.COMPANY_OWNED)
                .value
                ? this.truckForm.get(eTruckModalForm.PURCHASE_DATE).value
                    ? MethodsCalculationsHelper.convertDateToBackend(
                          this.truckForm.get(eTruckModalForm.PURCHASE_DATE)
                              .value
                      )
                    : null
                : null,
            purchasePrice: this.truckForm.get(eTruckModalForm.COMPANY_OWNED)
                .value
                ? this.truckForm.get(eTruckModalForm.PURCHASE_PRICE).value
                    ? MethodsCalculationsHelper.convertThousandSepInNumber(
                          this.truckForm.get(eTruckModalForm.PURCHASE_PRICE)
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
            });
    }

    public deleteTruckById(id: number): void {
        this.truckModalService
            .deleteTruckById(id, this.editData.tabSelected)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.ngbActiveModal.close();
            });
    }

    public onFilesEvent(event: any): void {
        this.documents = event.files;
        switch (event.action) {
            case eGeneralActions.ADD:
                this.updateFormControl(
                    this.truckForm,
                    eFileFormControls.FILES,
                    JSON.stringify(event.files)
                );
                break;
            case eGeneralActions.DELETE:
                const value = event.files.length
                    ? JSON.stringify(event.files)
                    : null;
                this.updateFormControl(
                    this.truckForm,
                    eFileFormControls.FILES,
                    value
                );
                if (!event.deleteId) return;

                this.filesForDelete = this.filesForDelete?.length
                    ? [...this.filesForDelete, event.deleteId]
                    : [];

                this.fileModified = true;
                break;
            case eFileActions.TAG:
                const changedTag: boolean = event?.files?.some(
                    (item) => item.tagChanged
                );

                this.updateFormControl(
                    this.truckForm,
                    'tags',
                    changedTag ? true : null
                );
                break;
            default:
                break;
        }
    }

    private updateFormControl(
        form: UntypedFormGroup,
        formControlName: string,
        value: unknown
    ): void {
        form.get(formControlName).patchValue(value);
    }

    updateTags(): void {
        const tags = this.documents
            ?.filter((document) => document?.tagChanged && document?.fileId)
            ?.map((item) => {
                const tagsData = {
                    storageId: item.fileId,
                    tagId: item.tagId?.length ? item.tagId[0] : null,
                };
                return tagsData;
            });

        if (!tags.length) return;

        this.tagsService.updateTag({ tags }).subscribe();
    }

    private startFormChanges(): void {
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
