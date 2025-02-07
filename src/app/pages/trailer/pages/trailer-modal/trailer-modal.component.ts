import { CommonModule } from '@angular/common';
import { HttpResponseBase } from '@angular/common/http';
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

import { AngularSvgIconModule } from 'angular-svg-icon';

import { skip, Subject, takeUntil, tap } from 'rxjs';

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
    CaInputDropdownComponent,
    CaInputNoteComponent,
    CaModalComponent,
} from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// bootstrap
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// models
import { GetTrailerModalResponse, VinDecodeResponse } from 'appcoretruckassist';
import type { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { TrailerModalConfig } from '@pages/trailer/pages/trailer-modal/utils/configs/trailer-modal.config';

// Enums
import { TrailerFormFieldEnum } from '@pages/trailer/pages/trailer-modal/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ActionTypesEnum } from '@pages/repair/pages/repair-modals/repair-shop-modal/enums';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import { ContactsModalStringEnum } from '@pages/contacts/pages/contacts-modal/enums';

// Pipes
import { FormatDatePipe } from '@shared/pipes';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

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

        // Pipes
        FormatDatePipe,
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

    get TrailerTypeIdConfig(): ITaInput {
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

    get TrailerVinConfig(): ITaInput {
        return TrailerModalConfig.getTrailerVinConfig({
            loadingVinDecoder: this.loadingVinDecoder,
        });
    }

    get TrailerMakeConfig(): ITaInput {
        return TrailerModalConfig.getTrailerMakeConfig({
            selectedTrailerMake: this.selectedTrailerMake,
        });
    }

    get TrailerModelConfig(): ITaInput {
        return TrailerModalConfig.getTrailerModelConfig();
    }

    get TrailerColorConfig(): ITaInput {
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

    private createForm() {
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
                if (!isCompanyOwned) {
                    // Clear the owner ID when not company-owned
                    ownerIdControl.patchValue(
                        TableStringEnum.EMPTY_STRING_PLACEHOLDER
                    );
                }
            });
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
        if (action === TaModalActionEnum.CLOSE) {
            if (this.editData?.canOpenModal) {
                switch (this.editData?.key) {
                    case 'repair-modal': {
                        this.modalService.setProjectionModal({
                            action: 'close',
                            payload: { key: this.editData?.key, value: null },
                            component: RepairOrderModalComponent,
                            size: 'large',
                            type: 'Trailer',
                            closing: 'fastest',
                        });
                        break;
                    }
                    default: {
                        break;
                    }
                }
            } else {
                this.ngbActiveModal.close();
            }
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
                    if (this.editData?.id) {
                        this.updateTrailer(this.editData.id);
                    } else {
                        this.addTrailer();
                    }
                }

                // Delete
                if (action === TaModalActionEnum.DELETE && this.editData) {
                    if (this.editData) {
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

                    this.colorType = res.colors.map((item) => {
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

                    this.trailerForm.get('fhwaExp').patchValue(res.fhwaExp);

                    this.storedfhwaExpValue = res.fhwaExp;

                    // ------- EDIT -------
                    if (this.editData?.storageData) {
                        this.skipVinDecocerEdit = true;
                        this.populateStorageData(this.editData.storageData);
                    }

                    if (this.editData?.id) {
                        this.skipVinDecocerEdit = true;
                        this.editTrailerById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
            });
    }

    private addTrailer(): void {
        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const newData: any = {
            ...this.trailerForm.value,
            trailerTypeId: this.selectedTrailerType?.id ?? null,
            trailerMakeId: this.selectedTrailerMake?.id ?? null,
            colorId: this.selectedColor?.id ?? null,
            year: parseInt(this.trailerForm.get('year').value),
            trailerLengthId: this.selectedTrailerLength.id,
            ownerId: this.trailerForm.get('companyOwned').value
                ? null
                : this.selectedOwner
                  ? this.selectedOwner.id
                  : null,
            axles: this.trailerForm.get('axles').value
                ? parseInt(this.trailerForm.get('axles').value)
                : null,
            suspension: this.selectedSuspension
                ? this.selectedSuspension.id
                : null,
            tireSizeId: this.selectedTireSize ? this.selectedTireSize.id : null,
            doorType: this.selectedDoorType ? this.selectedDoorType.id : null,
            isLiftgate: this.trailerForm.get('isLiftgate').value ?? false,
            reeferUnit: this.selectedReeferType
                ? this.selectedReeferType.id
                : null,
            emptyWeight: this.trailerForm.get('emptyWeight').value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.trailerForm.get('emptyWeight').value
                  )
                : null,
            mileage: this.trailerForm.get('mileage').value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.trailerForm.get('mileage').value
                  )
                : null,
            volume: this.trailerForm.get('volume').value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.trailerForm.get('volume').value
                  )
                : null,
            purchaseDate: this.trailerForm.get('companyOwned').value
                ? this.trailerForm.get('purchaseDate').value
                    ? MethodsCalculationsHelper.convertDateToBackend(
                          this.trailerForm.get('purchaseDate').value
                      )
                    : null
                : null,
            purchasePrice: this.trailerForm.get('companyOwned').value
                ? this.trailerForm.get('purchasePrice').value
                    ? MethodsCalculationsHelper.convertThousandSepInNumber(
                          this.trailerForm.get('purchasePrice').value
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
                                    type: 'Trailer',
                                    closing: 'slowlest',
                                });
                                this.modalService.setModalSpinner({
                                    action: null,
                                    status: true,
                                    close: true,
                                });
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    }

                    this.ngbActiveModal.close();
                    if (this.addNewAfterSave) {
                        this.modalService.openModal(TrailerModalComponent, {
                            size: ContactsModalStringEnum.SMALL,
                        });
                    }
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private updateTrailer(id: number): void {
        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const newData: any = {
            id: id,
            ...this.trailerForm.value,
            trailerTypeId: this.selectedTrailerType.id,
            trailerMakeId: this.selectedTrailerMake.id,
            colorId: this.selectedColor ? this.selectedColor.id : null,
            year: parseInt(this.trailerForm.get('year').value),
            trailerLengthId: this.selectedTrailerLength.id,
            ownerId: this.trailerForm.get('companyOwned').value
                ? null
                : this.selectedOwner
                  ? this.selectedOwner.id
                  : null,
            axles: this.trailerForm.get('axles').value
                ? parseInt(this.trailerForm.get('axles').value)
                : null,
            suspension: this.selectedSuspension
                ? this.selectedSuspension.id != 0
                    ? this.selectedSuspension.id
                    : null
                : null,
            tireSizeId: this.selectedTireSize
                ? this.selectedTireSize.id != 0
                    ? this.selectedTireSize.id
                    : null
                : null,
            doorType: this.selectedDoorType
                ? this.selectedDoorType.id != 0
                    ? this.selectedDoorType.id
                    : null
                : null,
            reeferUnit: this.selectedReeferType
                ? this.selectedReeferType.id != 0
                    ? this.selectedReeferType.id
                    : null
                : null,
            isLiftgate: this.trailerForm.get('isLiftgate').value ?? false,
            emptyWeight: this.trailerForm.get('emptyWeight').value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.trailerForm.get('emptyWeight').value
                  )
                : null,
            mileage: this.trailerForm.get('mileage').value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.trailerForm.get('mileage').value
                  )
                : null,
            volume: this.trailerForm.get('volume').value
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.trailerForm.get('volume').value
                  )
                : null,
            purchaseDate: this.trailerForm.get('companyOwned').value
                ? this.trailerForm.get('purchaseDate').value
                    ? MethodsCalculationsHelper.convertDateToBackend(
                          this.trailerForm.get('purchaseDate').value
                      )
                    : null
                : null,
            purchasePrice: this.trailerForm.get('companyOwned').value
                ? this.trailerForm.get('purchasePrice').value
                    ? MethodsCalculationsHelper.convertThousandSepInNumber(
                          this.trailerForm.get('purchasePrice').value
                      )
                    : null
                : null,
            files: documents ? documents : this.trailerForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.trailerModalService
            .updateTrailer(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private populateStorageData(res) {
        const timeout = setTimeout(() => {
            this.getTrailerDropdowns();
            this.trailerForm.patchValue({
                companyOwned: res.companyOwned,
                trailerNumber: res.trailerNumber,
                trailerTypeId: res.trailerTypeId,
                trailerMakeId: res.trailerMakeId,
                model: res.model,
                colorId: res.colorId,
                year: res.year,
                trailerLengthId: res.trailerLengthId,
                ownerId: res.ownerId,
                note: res.note,
                axles: res.axles,
                suspension: res.suspension,
                tireSizeId: res.tireSizeId,
                doorType: res.doorType,
                reeferUnit: res.reeferUnit,
                emptyWeight: res.emptyWeight,
                mileage: res.mileage,
                volume: res.volume,
                insurancePolicy: res.insurancePolicy,
                fhwaExp: res.fhwaExp,
                purchaseDate: res.purchaseDate,
                purchasePrice: res.purchasePrice,
            });

            if (res.id) {
                this.editData = { ...this.editData, id: res.id };
            }

            this.trailerForm
                .get('vin')
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
                name: 'deactivate',
                status: this.trailerStatus,
            });

            clearTimeout(timeout);
        }, 50);
    }

    private editTrailerById(id: number): void {
        this.trailerModalService
            .getTrailerById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.trailerForm.patchValue({
                        companyOwned: res.companyOwned,
                        trailerNumber: res.trailerNumber,
                        trailerTypeId: res.trailerType
                            ? res.trailerType.name
                            : null,
                        trailerMakeId: res.trailerMake
                            ? res.trailerMake.name
                            : null,
                        model: res.model,
                        vin: res.vin,
                        isLiftgate: res.liftgate ?? false,
                        colorId: res.color ? res.color.name : null,
                        year: res.year.toString(),
                        trailerLengthId: res.trailerLength
                            ? res.trailerLength.name
                            : null,
                        ownerId: res.companyOwned
                            ? null
                            : res.owner
                              ? res.owner.name
                              : null,
                        note: res.note,
                        axles: res.axles,
                        suspension: res.suspension ? res.suspension.name : null,
                        tireSizeId: res.tireSize ? res.tireSize.name : null,
                        doorType: res.doorType ? res.doorType.name : null,
                        reeferUnit: res.reeferUnit ? res.reeferUnit.name : null,
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
                        name: 'deactivate',
                        status: this.trailerStatus,
                    });

                    setTimeout(() => {
                        this.startFormChanges();
                    }, 1000);
                },
            });
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'trailer-type': {
                this.selectedTrailerType = event;
                break;
            }
            case 'trailer-make': {
                this.selectedTrailerMake = event;
                break;
            }
            case 'color': {
                this.selectedColor = event;
                break;
            }
            case 'trailer-length': {
                this.selectedTrailerLength = event;
                break;
            }
            case 'owner': {
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: 'open',
                        payload: {
                            key: 'trailer-modal',
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
                } else {
                    this.selectedOwner = event;
                }
                break;
            }
            case 'reefer-unit': {
                this.selectedReeferType = event;
                break;
            }
            case 'suspension': {
                this.selectedSuspension = event;
                break;
            }
            case 'tire-size': {
                this.selectedTireSize = event;
                break;
            }
            case 'door-type': {
                this.selectedDoorType = event;
                break;
            }
            default: {
                break;
            }
        }
    }

    private vinDecoder() {
        this.trailerForm
            .get('vin')
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                this.skipVinDecocerEdit ? skip(1) : tap()
            )
            .subscribe((value) => {
                this.skipVinDecocerEdit = false;
                if (!(value?.length === 13 || value?.length === 17)) {
                    this.trailerForm
                        .get('vin')
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
                                    model: res?.model ? res.model : null,
                                    year: res?.year
                                        ? res.year.toString()
                                        : null,
                                    trailerMakeId: res.trailerMake?.name
                                        ? res.trailerMake.name
                                        : null,
                                });
                                this.loadingVinDecoder = false;
                                this.selectedTrailerMake = res.trailerMake;
                            },
                        });
                }
            });
    }

    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case 'add': {
                this.trailerForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.trailerForm
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
            default: {
                break;
            }
        }
    }

    public onBlurTrailerModel() {
        const model = this.trailerForm.get('model').value;
        if (model?.length >= 1) {
            this.trailerModalService
                .autocompleteByTrailerModel(model)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }

    private startFormChanges() {
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
