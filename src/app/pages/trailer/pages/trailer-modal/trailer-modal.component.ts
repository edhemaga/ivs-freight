import { CommonModule } from '@angular/common';
import {
    AbstractControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';

import { skip, Subject, takeUntil, tap } from 'rxjs';

// modules
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { TrailerService } from '@shared/services/trailer.service';
import { VinDecoderService } from '@shared/services/vin-decoder.service';
import { FormService } from '@shared/services/form.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
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
    trailerVolumeValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// components
import { OwnerModalComponent } from '@pages/owner/pages/owner-modal/owner-modal.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import {
    CaInputComponent,
    CaInputDatetimePickerComponent,
    CaInputDropdownComponent,
    CaInputNoteComponent,
    CaModalButtonComponent,
    CaModalComponent,
    eModalButtonClassType,
    eModalButtonSize,
} from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// models
import {
    ColorResponse,
    GetTrailerModalResponse,
    VinDecodeResponse,
} from 'appcoretruckassist';
import type { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { TrailerModalConfig } from '@pages/trailer/pages/trailer-modal/utils/configs/trailer-modal.config';

// enums
import {
    ETrailerAction,
    TrailerFormFieldEnum,
} from '@pages/trailer/pages/trailer-modal/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ActionTypesEnum } from '@pages/repair/pages/repair-modals/repair-shop-modal/enums';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import { ContactsModalStringEnum } from '@pages/contacts/pages/contacts-modal/enums';
import { eFileFormControls, eGeneralActions } from '@shared/enums';

// pipes
import { FormatDatePipe } from '@shared/pipes';
import { TrailerModalInputConfigPipe } from '@pages/trailer/pages/trailer-modal/pipes';

// SVG routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';
import { ICaInput } from '@ca-shared/components/ca-input/config';

@Component({
    selector: 'app-trailer-modal',
    templateUrl: './trailer-modal.component.html',
    styleUrls: ['./trailer-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, FormService],
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
        TaCheckboxCardComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        CaInputNoteComponent,
        TaCheckboxComponent,
        CaInputComponent,
        CaInputDropdownComponent,
        TaAppTooltipV2Component,
        CaInputDatetimePickerComponent,
        CaModalButtonComponent,

        // Pipes
        FormatDatePipe,
        TrailerModalInputConfigPipe,
    ],
})
export class TrailerModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public trailerForm: UntypedFormGroup;
    public trailerType: any[] = [];
    public trailerMakeType: any[] = [];
    public colorType: any[] = [];
    public trailerLengthType: any[] = [];
    public ownerType: any[] = [];
    public suspensionType: any[] = [];
    public tireSize: any[] = [];
    public doorType: any[] = [];
    public reeferUnitType: any[] = [];

    public selectedTrailerType: any = null;
    public selectedTrailerMake: any = null;
    public selectedColor: any = null;
    public selectedTrailerLength: any = null;
    public selectedOwner: any = null;
    public selectedSuspension: any = null;
    public selectedTireSize: any = null;
    public selectedDoorType: any = null;
    public selectedReeferType: any = null;

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

    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };
    public isLiftgate: boolean = false;

    public trailerStatus: boolean = true;
    public loadingVinDecoder: boolean = false;
    public isFormDirty: boolean;
    public skipVinDecocerEdit: boolean = false;

    public documents: any[] = [];
    public filesForDelete: any[] = [];
    public fileModified: boolean = false;

    private destroy$ = new Subject<void>();

    public addNewAfterSave: boolean = false;

    private storedfhwaExpValue: any = null;
    public svgRoutes = SharedSvgRoutes;
    public actionTypesEnum = ActionTypesEnum;
    public taModalActionEnum = TaModalActionEnum;
    public activeAction: string;

    public eModalButtonClassType = eModalButtonClassType;
    public eModalButtonSize = eModalButtonSize;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private trailerModalService: TrailerService,
        private modalService: ModalService,
        private ngbActiveModal: NgbActiveModal,
        private vinDecoderService: VinDecoderService,
        private formService: FormService,
        private confirmationService: ConfirmationService,
        private confirmationActivationService: ConfirmationActivationService
    ) {}

    get volumenTrailers(): string[] {
        return TrailerModalConfig.getVolumenTrailers();
    }

    get isDoorAndLiftGate(): string[] {
        return TrailerModalConfig.getIsDoorAndLiftGate();
    }

    get TrailerNumberConfig(): ITaInput {
        return TrailerModalConfig.getTrailerNumberConfig(this.editData);
    }

    get TrailerTypeIdConfig(): ICaInput {
        return TrailerModalConfig.getTrailerTypeIdConfig({
            selectedTrailerType: this.selectedTrailerType,
        });
    }

    get TrailerLengthConfig(): ITaInput {
        return TrailerModalConfig.getTrailerLengthConfig();
    }

    get TrailerYearConfig(): ITaInput {
        return TrailerModalConfig.getTrailerYearConfig();
    }

    get TrailerMakeConfig(): ICaInput {
        return TrailerModalConfig.getTrailerMakeConfig({
            selectedTrailerMake: this.selectedTrailerMake,
        });
    }

    get TrailerModelConfig(): ITaInput {
        return TrailerModalConfig.getTrailerModelConfig();
    }

    get TrailerColorConfig(): ICaInput {
        return TrailerModalConfig.getTrailerColorConfig({
            selectedColor: this.selectedColor,
        });
    }

    get TrailerOwnerConfig(): ITaInput {
        return TrailerModalConfig.getTrailerOwnerConfig();
    }

    get TrailerReferConfig(): ITaInput {
        return TrailerModalConfig.getTrailerReferConfig();
    }

    get TrailerVolumeConfig(): ITaInput {
        return TrailerModalConfig.getTrailerVolumeConfig({
            selectedTrailerType: this.selectedTrailerType,
            formValue: this.trailerForm.get('volume').value,
        });
    }

    get TrailerWeightConfig(): ITaInput {
        return TrailerModalConfig.getTrailerWeightConfig({
            formValue: this.trailerForm.get('emptyWeight').value,
        });
    }

    get TrailerTireSizeConfig(): ITaInput {
        return TrailerModalConfig.getTrailerTireSizeConfig();
    }

    get TrailerSuspensionConfig(): ITaInput {
        return TrailerModalConfig.getTrailerSuspensionConfig({
            formValue: this.trailerForm.get('trailerTypeId').value,
        });
    }

    get TrailerDoorTypeConfig(): ITaInput {
        return TrailerModalConfig.getTrailerDoorTypeConfig();
    }

    get TrailerMileageConfig(): ITaInput {
        return TrailerModalConfig.getTrailerMileageConfig();
    }

    get TrailerInsurancePolicyConfig(): ITaInput {
        return TrailerModalConfig.getTrailerInsurancePolicyConfig();
    }

    get TrailerFhwaExpConfig(): ITaInput {
        return TrailerModalConfig.getTrailerFhwaExpConfig();
    }

    get TrailerPurchaseDateConfig(): ITaInput {
        return TrailerModalConfig.getTrailerPurchaseDateConfig();
    }

    get TrailerPurchasePriceConfig(): ITaInput {
        return TrailerModalConfig.getTrailerPurchasePriceConfig();
    }

    get TrailerAxlesConfig(): ITaInput {
        return TrailerModalConfig.getTrailerAxlesConfig();
    }
    ngOnInit() {
        this.createForm();

        this.getTrailerDropdowns();
        this.isCompanyOwned();
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
        this.trailerForm = this.formBuilder.group({
            companyOwned: [true],
            trailerNumber: [
                null,
                [Validators.required, ...vehicleUnitValidation],
            ],
            trailerTypeId: [null, [Validators.required]],
            vin: [null, [Validators.required, ...vinNumberValidation]],
            trailerMakeId: [null, [Validators.required]],
            model: [null, truckTrailerModelValidation],
            colorId: [null],
            year: [
                null,
                [Validators.required, yearValidRegex, ...yearValidation],
            ],
            trailerLengthId: [null, [Validators.required]],
            ownerId: [null],
            note: [null],
            axles: [null, axlesValidation],
            suspension: [null],
            tireSizeId: [null],
            doorType: [null],
            isLiftgate: [null],
            reeferUnit: [null],
            emptyWeight: [null, emptyWeightValidation],
            mileage: [null, mileageValidation],
            volume: [null, trailerVolumeValidation],
            insurancePolicy: [null, insurancePolicyValidation],
            purchaseDate: [null],
            purchasePrice: [null],
            fhwaExp: [null, Validators.required],
            files: [null],
        });
    }

    private isCompanyOwned(): void {
        const ownerIdControl = this.trailerForm.get(
            TrailerFormFieldEnum.OWNER_ID
        );

        this.trailerForm
            .get(TrailerFormFieldEnum.COMPANY_OWNED)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((isCompanyOwned: boolean) => {
                this.updateOwnerIdValidators(isCompanyOwned, ownerIdControl);
                if (!isCompanyOwned)
                    // Clear the owner ID when not company-owned
                    ownerIdControl.patchValue(
                        TableStringEnum.EMPTY_STRING_PLACEHOLDER
                    );
            });

        if (this.editData?.ownerData) {
            this.trailerForm
                .get(TrailerFormFieldEnum.COMPANY_OWNED)
                .setValue(false);
            this.onSelectDropdown(
                this.editData.ownerData,
                ETrailerAction.OWNER
            );
        }
    }

    private updateOwnerIdValidators(
        isCompanyOwned: boolean,
        control: AbstractControl
    ): void {
        const shouldBeRequired = !isCompanyOwned;
        this.inputService.changeValidators(
            control,
            shouldBeRequired,
            [],
            false
        );
    }

    public onModalAction(action: string): void {
        this.activeAction = action;
        if (action === TaModalActionEnum.CLOSE) {
            if (this.editData?.canOpenModal)
                switch (this.editData?.key) {
                    case ETrailerAction.REPAIR_MODAL:
                        this.modalService.setProjectionModal({
                            action: eGeneralActions.CLOSE,
                            payload: { key: this.editData?.key, value: null },
                            component: RepairOrderModalComponent,
                            size: 'large',
                            type: 'Trailer',
                            closing: 'fastest',
                        });
                        break;

                    default:
                        break;
                }
            else this.ngbActiveModal.close();

            return;
        } else {
            if (action === TaModalActionEnum.DEACTIVATE && this.editData) {
                this.modalService.openModal(
                    ConfirmationActivationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...this.trailerForm.value,
                        array: [
                            {
                                ...this.editData.data,
                                data: {
                                    ...this.trailerForm.value.value,
                                    number: this.trailerForm.value
                                        .trailerNumber,
                                    avatar: `assets/svg/common/trailer/${this.editData.data?.trailerType?.logoName}`,
                                },
                                modalTitle:
                                    this.trailerForm.value.trailerNumber,
                                modalSecondTitle: this.trailerForm.value.vin,
                            },
                        ],
                        template: TableStringEnum.TRAILER_2,
                        subType: TableStringEnum.TRAILERS,
                        type: TableStringEnum.DEACTIVATE,
                        tableType: TableStringEnum.TRAILER_2,
                        modalTitle:
                            ' Unit ' + this.trailerForm.value.trailerNumber,
                        modalSecondTitle: this.trailerForm.value.vin,
                        svg: true,
                    }
                );
            }
            // Save And Add New
            else if (action === TaModalActionEnum.SAVE_AND_ADD_NEW) {
                if (this.trailerForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.trailerForm);
                    return;
                }
                this.addTrailer();
                this.addNewAfterSave = true;
            } else {
                // Save & Update
                if (action === TaModalActionEnum.SAVE) {
                    if (this.trailerForm.invalid || !this.isFormDirty) {
                        this.inputService.markInvalid(this.trailerForm);
                        return;
                    }
                    if (this.editData?.id) this.updateTrailer(this.editData.id);
                    else this.addTrailer();
                }

                // Delete
                if (action === TaModalActionEnum.DELETE && this.editData)
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            ...this.editData,
                            template: TableStringEnum.TRAILER_2,
                            type: TableStringEnum.DELETE,
                            svg: true,
                        }
                    );
            }
        }
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

    private getTrailerDropdowns(): void {
        this.trailerModalService
            .getTrailerDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: GetTrailerModalResponse) => {
                    this.trailerType = res.trailerTypes.map((item) => {
                        return {
                            ...item,
                            folder: 'common',
                            subFolder: 'trailers',
                        };
                    });

                    this.trailerMakeType = res.trailerMakes;

                    this.colorType = res.colors.map((item: ColorResponse) => {
                        return {
                            ...item,
                            folder: 'common',
                            subFolder: 'colors',
                            logoName: 'ic_color.svg',
                        };
                    });

                    this.trailerLengthType = res.trailerLengths;
                    this.ownerType = res.owners;
                    this.suspensionType = res.suspensions;
                    this.tireSize = res.tireSizes;
                    this.doorType = res.doorTypes;
                    this.reeferUnitType = res.reeferUnits;

                    this.trailerForm
                        .get(TrailerFormFieldEnum.FHWA_EXP)
                        .patchValue(res.fhwaExp);

                    this.storedfhwaExpValue = res.fhwaExp;

                    // ------- EDIT -------
                    if (this.editData?.storageData) {
                        this.skipVinDecocerEdit = true;
                        this.populateStorageData(this.editData.storageData);
                    }

                    if (this.editData?.id) {
                        this.skipVinDecocerEdit = true;
                        this.editTrailerById(this.editData.id);
                    } else this.startFormChanges();
                },
            });
    }

    private addTrailer(): void {
        const documents =
            this.documents
                .filter((item) => item.realFile)
                .map((item) => {
                    documents.push(item.realFile);
                }) ?? [];

        const newData: any = {
            ...this.trailerForm.value,
            trailerTypeId: this.selectedTrailerType?.id ?? null,
            trailerMakeId: this.selectedTrailerMake?.id ?? null,
            colorId: this.selectedColor?.id ?? null,
            year: parseInt(
                this.trailerForm.get(TrailerFormFieldEnum.YEAR).value
            ),
            trailerLengthId: this.selectedTrailerLength.id,
            ownerId: this.trailerForm.get(TrailerFormFieldEnum.COMPANY_OWNED)
                .value
                ? null
                : (this.selectedOwner?.id ?? null),
            axles: this.trailerForm.get(TrailerFormFieldEnum.AXLES).value
                ? parseInt(
                      this.trailerForm.get(TrailerFormFieldEnum.AXLES).value
                  )
                : null,
            suspension: this.selectedSuspension?.id ?? null,

            tireSizeId: this.selectedTireSize?.id ?? null,
            doorType: this.selectedDoorType?.id ?? null,
            isLiftgate:
                this.trailerForm.get(TrailerFormFieldEnum.IS_LIFTGATE).value ??
                false,
            reeferUnit: this.selectedReeferType?.id ?? null,

            emptyWeight: this.trailerForm.get(TrailerFormFieldEnum.EMPTY_WEIGHT)
                .value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.trailerForm.get(TrailerFormFieldEnum.EMPTY_WEIGHT)
                          .value
                  )
                : null,
            mileage: this.trailerForm.get(TrailerFormFieldEnum.MILEAGE).value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.trailerForm.get(TrailerFormFieldEnum.MILEAGE).value
                  )
                : null,
            volume: this.trailerForm.get(TrailerFormFieldEnum.VOLUME).value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.trailerForm.get(TrailerFormFieldEnum.VOLUME).value
                  )
                : null,
            purchaseDate: this.trailerForm.get(
                TrailerFormFieldEnum.COMPANY_OWNED
            ).value
                ? this.trailerForm.get(TrailerFormFieldEnum.PURCHASE_DATE).value
                    ? MethodsCalculationsHelper.convertDateToBackend(
                          this.trailerForm.get(
                              TrailerFormFieldEnum.PURCHASE_DATE
                          ).value
                      )
                    : null
                : null,
            purchasePrice: this.trailerForm.get(
                TrailerFormFieldEnum.COMPANY_OWNED
            ).value
                ? this.trailerForm.get(TrailerFormFieldEnum.PURCHASE_PRICE)
                      .value
                    ? MethodsCalculationsHelper.convertThousandSepInNumber(
                          this.trailerForm.get(
                              TrailerFormFieldEnum.PURCHASE_PRICE
                          ).value
                      )
                    : null
                : null,
            files: documents,
        };

        this.trailerModalService
            .addTrailer(newData, this.editData?.isDispatchCall)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal)
                        switch (this.editData?.key) {
                            case ETrailerAction.REPAIR_MODAL:
                                this.modalService.setProjectionModal({
                                    action: eGeneralActions.CLOSE,
                                    payload: {
                                        key: this.editData?.key,
                                        value: null,
                                    },
                                    component: RepairOrderModalComponent,
                                    size: 'large',
                                    type: 'Trailer',
                                    closing: 'slowlest',
                                });
                                this.modalService.setModalSpinner({
                                    action: null,
                                    status: true,
                                    close: true,
                                });
                                break;

                            default:
                                break;
                        }

                    this.ngbActiveModal.close();
                    if (this.addNewAfterSave)
                        this.modalService.openModal(TrailerModalComponent, {
                            size: ContactsModalStringEnum.SMALL,
                        });
                },
                error: () => {
                    this.activeAction = null;
                },
            });
    }

    private updateTrailer(id: number): void {
        const documents = this.documents
            .filter((item) => item.realFile)
            .map((item) => {
                return item.realFile;
            });

        const newData: any = {
            id,
            ...this.trailerForm.value,
            trailerTypeId: this.selectedTrailerType.id,
            trailerMakeId: this.selectedTrailerMake.id,
            colorId: this.selectedColor?.id ?? null,
            year: parseInt(
                this.trailerForm.get(TrailerFormFieldEnum.YEAR).value
            ),
            trailerLengthId: this.selectedTrailerLength.id,
            ownerId: this.trailerForm.get(TrailerFormFieldEnum.COMPANY_OWNED)
                .value
                ? null
                : (this.selectedOwner?.id ?? null),

            axles: this.trailerForm.get(TrailerFormFieldEnum.AXLES).value
                ? parseInt(
                      this.trailerForm.get(TrailerFormFieldEnum.AXLES).value
                  )
                : null,
            suspension: this.selectedSuspension?.id ?? null,
            tireSizeId: this.selectedTireSize?.id ?? null,
            doorType: this.selectedDoorType?.id ?? null,
            isLiftgate:
                this.trailerForm.get(TrailerFormFieldEnum.IS_LIFTGATE).value ??
                false,
            reeferUnit: this.selectedReeferType
                ? this.selectedReeferType.id
                : null,
            emptyWeight: this.trailerForm.get(TrailerFormFieldEnum.EMPTY_WEIGHT)
                .value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.trailerForm.get(TrailerFormFieldEnum.EMPTY_WEIGHT)
                          .value
                  )
                : null,
            mileage: this.trailerForm.get(TrailerFormFieldEnum.MILEAGE).value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.trailerForm.get(TrailerFormFieldEnum.MILEAGE).value
                  )
                : null,
            volume: this.trailerForm.get(TrailerFormFieldEnum.VOLUME).value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.trailerForm.get(TrailerFormFieldEnum.VOLUME).value
                  )
                : null,
            purchaseDate: this.trailerForm.get(
                TrailerFormFieldEnum.COMPANY_OWNED
            ).value
                ? this.trailerForm.get(TrailerFormFieldEnum.PURCHASE_DATE).value
                    ? MethodsCalculationsHelper.convertDateToBackend(
                          this.trailerForm.get(
                              TrailerFormFieldEnum.PURCHASE_DATE
                          ).value
                      )
                    : null
                : null,
            purchasePrice: this.trailerForm.get(
                TrailerFormFieldEnum.COMPANY_OWNED
            ).value
                ? this.trailerForm.get(TrailerFormFieldEnum.PURCHASE_PRICE)
                      .value
                    ? MethodsCalculationsHelper.convertThousandSepInNumber(
                          this.trailerForm.get(
                              TrailerFormFieldEnum.PURCHASE_PRICE
                          ).value
                      )
                    : null
                : null,
            files: documents ?? this.trailerForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.trailerModalService
            .updateTrailer(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
                },
                error: () => {
                    this.activeAction = null;
                },
            });
    }

    private populateStorageData(res): void {
        this.getTrailerDropdowns();
        this.trailerForm.patchValue({
            ...res,
        });

        if (res.id) this.editData = { ...this.editData, id: res.id };

        this.trailerForm
            .get(TrailerFormFieldEnum.VIN)
            .patchValue(res.vin, { emitEvent: false });

        this.selectedTrailerType = res.selectedTrailerType;
        this.selectedTrailerMake = res.selectedTrailerMake;
        this.selectedColor = res.selectedColor;
        this.selectedTrailerLength = res.selectedTrailerLength;
        this.selectedOwner = res.selectedOwner;
        this.selectedSuspension = res.selectedSuspension;
        this.selectedTireSize = res.selectedTireSize;
        this.selectedDoorType = res.selectedDoorType;
        this.selectedReeferType = res.selectedReeferType;
        this.trailerStatus = res.trailerStatus;

        this.modalService.changeModalStatus({
            name: eGeneralActions.DEACTIVATE,
            status: this.trailerStatus,
        });
    }

    private editTrailerById(id: number): void {
        this.trailerModalService
            .getTrailerById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.trailerForm.patchValue({
                        ...res,
                        trailerTypeId: res.trailerType?.id ?? null,
                        trailerMakeId: res.trailerMake?.id ?? null,
                        isLiftgate: res.liftgate ?? false,
                        colorId: res.color?.id ?? null,
                        year: res.year.toString(),
                        trailerLengthId: res.trailerLength
                            ? res.trailerLength.id
                            : null,
                        ownerId: res.companyOwned
                            ? null
                            : (res.owner?.name ?? null),
                        suspension: res.suspension?.name ?? null,
                        tireSizeId: res.tireSize?.name ?? null,
                        doorType: res.doorType?.name ?? null,
                        reeferUnit: res.reeferUnit?.name ?? null,
                        emptyWeight: res.emptyWeight
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.emptyWeight
                              )
                            : null,
                        mileage: res.mileage
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.mileage
                              )
                            : null,
                        volume: res.volume
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.volume
                              )
                            : null,
                        insurancePolicy: res.insurancePolicy,
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
                        fhwaExp: res.fhwaExp ? res.fhwaExp : 12,
                    });

                    this.selectedTrailerType = res.trailerType;
                    this.selectedTrailerMake = res.trailerMake;
                    this.selectedColor = res.color;
                    this.selectedTrailerLength = res.trailerLength;
                    this.selectedOwner = res.owner;
                    this.selectedSuspension = res.suspension;
                    this.selectedTireSize = res.tireSize;
                    this.selectedDoorType = res.doorType;
                    this.selectedReeferType = res.reeferUnit;
                    this.trailerStatus = res.status !== 1;
                    this.documents = res.files;

                    this.modalService.changeModalStatus({
                        name: eGeneralActions.DEACTIVATE,
                        status: this.trailerStatus,
                    });

                    setTimeout(() => {
                        this.startFormChanges();
                    }, 1000);
                },
            });
    }

    public onSelectDropdown(event: any, action: ETrailerAction): void {
        switch (action) {
            case ETrailerAction.TRAILER_TYPE:
                this.selectedTrailerType = event;
                break;
            case ETrailerAction.TRAILER_MAKE:
                this.selectedTrailerMake = event;
                break;
            case ETrailerAction.COLOR:
                this.selectedColor = event;
                break;
            case ETrailerAction.TRAILER_LENGTH:
                this.selectedTrailerLength = event;
                break;
            case ETrailerAction.OWNER:
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: eGeneralActions.OPEN,
                        payload: {
                            key: ETrailerAction.TRAILER_MODAL,
                            value: {
                                ...this.trailerForm.value,
                                selectedTrailerType: this.selectedTrailerType,
                                selectedTrailerMake: this.selectedTrailerMake,
                                selectedColor: this.selectedColor,
                                selectedTrailerLength:
                                    this.selectedTrailerLength,
                                selectedOwner: this.selectedOwner,
                                id: this.editData?.id,
                                selectedSuspension: this.selectedSuspension,
                                selectedTireSize: this.selectedTireSize,
                                selectedDoorType: this.selectedDoorType,
                                selectedReeferType: this.selectedReeferType,
                                trailerStatus: this.trailerStatus,
                            },
                        },
                        component: OwnerModalComponent,
                        size: 'small',
                    });
                } else this.selectedOwner = event;
                break;
            case ETrailerAction.REEFER_UNIT:
                this.selectedReeferType = event;
                break;
            case ETrailerAction.SUSPENSION:
                this.selectedSuspension = event;
                break;
            case ETrailerAction.TIRE_SIZE:
                this.selectedTireSize = event;
                break;
            case ETrailerAction.DOOR_TYPE:
                this.selectedDoorType = event;
                break;
            default:
                break;
        }
    }

    private vinDecoder() {
        this.trailerForm
            .get(TrailerFormFieldEnum.VIN)
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                this.skipVinDecocerEdit ? skip(1) : tap()
            )
            .subscribe((value) => {
                this.skipVinDecocerEdit = false;
                if (!(value?.length === 13 || value?.length === 17)) {
                    this.trailerForm
                        .get(TrailerFormFieldEnum.VIN)
                        .setErrors({ incorrectVinNumber: true });
                }

                if (value?.length === 17) {
                    this.loadingVinDecoder = true;
                    this.vinDecoderService
                        .getVINDecoderData(value.toString(), 2)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (res: VinDecodeResponse) => {
                                this.trailerForm.patchValue({
                                    ...(res?.model && { model: res.model }),
                                    ...(res?.year && {
                                        year: res.year.toString(),
                                    }),
                                    ...(res?.trailerMake?.id && {
                                        trailerMakeId: res.trailerMake.id,
                                    }),
                                });

                                this.loadingVinDecoder = false;
                                this.selectedTrailerMake = res.trailerMake;
                            },
                        });
                }
            });
    }

    public onFilesEvent(event: any): void {
        this.documents = event.files;
        switch (event.action) {
            case eGeneralActions.ADD:
                this.trailerForm
                    .get(eFileFormControls.FILES)
                    .patchValue(JSON.stringify(event.files));
                break;
            case eGeneralActions.DELETE:
                this.trailerForm
                    .get(eFileFormControls.FILES)
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) this.filesForDelete.push(event.deleteId);

                this.fileModified = true;
                break;
            default:
                break;
        }
    }

    public onBlurTrailerModel(): void {
        const model = this.trailerForm.get(TrailerFormFieldEnum.MODEL).value;
        if (model?.length >= 1)
            this.trailerModalService
                .autocompleteByTrailerModel(model)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
    }

    private startFormChanges(): void {
        this.formService.checkFormChange(this.trailerForm);
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
