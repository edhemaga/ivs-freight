import { HttpResponseBase } from '@angular/common/http';
import {
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
import { TaInputService } from '../../../../core/components/shared/ta-input/ta-input.service';
import { tab_modal_animation } from '../../../../core/components/shared/animations/tabs-modal.animation';
import { GetTrailerModalResponse, VinDecodeResponse } from 'appcoretruckassist';
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
} from '../../../../core/components/shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../../../core/components/shared/ta-modal/modal.service';
import { TrailerService } from 'src/app/shared/services/trailer.service';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OwnerModalComponent } from '../../../../core/components/modals/owner-modal/owner-modal.component';
import { RepairOrderModalComponent } from '../../../../core/components/modals/repair-modals/repair-order-modal/repair-order-modal.component';
import { skip, Subject, takeUntil, tap } from 'rxjs';
import { VinDecoderService } from '../../../../core/services/VIN-DECODER/vindecoder.service';
import { trailerVolumeValidation } from '../../../../core/components/shared/ta-input/ta-input.regex-validations';
import { FormService } from '../../../../core/services/form/form.service';
import { TrailerAutocompleteModelResponse } from '../../../../../../appcoretruckassist/model/trailerAutocompleteModelResponse';
import {
    convertDateToBackend,
    convertDateFromBackend,
} from '../../../../core/utils/methods.calculations';
import {
    convertThousanSepInNumber,
    convertNumberInThousandSep,
} from '../../../../core/utils/methods.calculations';
import { CommonModule } from '@angular/common';
import { TaModalComponent } from '../../../../core/components/shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../../../core/components/standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '../../../../core/components/shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../../../core/components/shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaCheckboxCardComponent } from '../../../../core/components/shared/ta-checkbox-card/ta-checkbox-card.component';
import { TaCustomCardComponent } from '../../../../core/components/shared/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '../../../../core/components/shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '../../../../core/components/shared/ta-input-note/ta-input-note.component';
import { TaCheckboxComponent } from '../../../../core/components/shared/ta-checkbox/ta-checkbox.component';

@Component({
    selector: 'app-trailer-modal',
    templateUrl: './trailer-modal.component.html',
    styleUrls: ['./trailer-modal.component.scss'],
    animations: [tab_modal_animation('animationTabsModal')],
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // Component
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaCheckboxCardComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCheckboxComponent,
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

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private trailerModalService: TrailerService,
        private modalService: ModalService,
        private ngbActiveModal: NgbActiveModal,
        private vinDecoderService: VinDecoderService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();

        this.getTrailerDropdowns();
        this.isCompanyOwned();
        this.vinDecoder();
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

    private isCompanyOwned() {
        this.trailerForm
            .get('companyOwned')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (!value) {
                    this.inputService.changeValidators(
                        this.trailerForm.get('ownerId'),
                        true,
                        [],
                        false
                    );
                } else {
                    this.inputService.changeValidators(
                        this.trailerForm.get('ownerId'),
                        false,
                        [],
                        false
                    );
                }
            });
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        if (data.action === 'close') {
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
            }
            return;
        } else {
            if (data.action === 'deactivate' && this.editData) {
                this.trailerModalService
                    .changeTrailerStatus(
                        this.editData.id,
                        this.editData.tabSelected
                    )
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (res: HttpResponseBase) => {
                            if (res.status === 200 || res.status === 204) {
                                this.trailerStatus = !this.trailerStatus;

                                this.modalService.changeModalStatus({
                                    name: 'deactivate',
                                    status: this.trailerStatus,
                                });
                            }
                        },
                        error: () => {},
                    });
            }
            // Save And Add New
            else if (data.action === 'save and add new') {
                if (this.trailerForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.trailerForm);
                    return;
                }
                this.addTrailer();
                this.modalService.setModalSpinner({
                    action: 'save and add new',
                    status: true,
                    close: false,
                });
                this.addNewAfterSave = true;
            } else {
                // Save & Update
                if (data.action === 'save') {
                    if (this.trailerForm.invalid || !this.isFormDirty) {
                        this.inputService.markInvalid(this.trailerForm);
                        return;
                    }
                    if (this.editData?.id) {
                        this.updateTrailer(this.editData.id);
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: false,
                        });
                    } else {
                        this.addTrailer();
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: false,
                        });
                    }
                }

                // Delete
                if (data.action === 'delete' && this.editData) {
                    this.deleteTrailerById(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                        close: false,
                    });
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
                error: () => {},
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
                ? this.selectedSuspension.id
                : null,
            tireSizeId: this.selectedTireSize ? this.selectedTireSize.id : null,
            doorType: this.selectedDoorType ? this.selectedDoorType.id : null,
            reeferUnit: this.selectedReeferType
                ? this.selectedReeferType.id
                : null,
            emptyWeight: this.trailerForm.get('emptyWeight').value
                ? convertThousanSepInNumber(
                      this.trailerForm.get('emptyWeight').value
                  )
                : null,
            mileage: this.trailerForm.get('mileage').value
                ? convertThousanSepInNumber(
                      this.trailerForm.get('mileage').value
                  )
                : null,
            volume: this.trailerForm.get('volume').value
                ? convertThousanSepInNumber(
                      this.trailerForm.get('volume').value
                  )
                : null,
            purchaseDate: this.trailerForm.get('companyOwned').value
                ? this.trailerForm.get('purchaseDate').value
                    ? convertDateToBackend(
                          this.trailerForm.get('purchaseDate').value
                      )
                    : null
                : null,
            purchasePrice: this.trailerForm.get('companyOwned').value
                ? this.trailerForm.get('purchasePrice').value
                    ? convertThousanSepInNumber(
                          this.trailerForm.get('purchasePrice').value
                      )
                    : null
                : null,
            files: documents,
        };

        this.trailerModalService
            .addTrailer(newData)
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

                    if (this.addNewAfterSave) {
                        this.formService.resetForm(this.trailerForm);

                        this.selectedTrailerType = null;
                        this.selectedTrailerMake = null;
                        this.selectedColor = null;
                        this.selectedTrailerLength = null;
                        this.selectedOwner = null;
                        this.selectedSuspension = null;
                        this.selectedTireSize = null;
                        this.selectedDoorType = null;
                        this.selectedReeferType = null;

                        this.tabChange({ id: 1 });

                        this.trailerForm
                            .get('fhwaExp')
                            .patchValue(this.storedfhwaExpValue);

                        this.trailerForm.get('companyOwned').patchValue(true);
                        this.inputService.changeValidators(
                            this.trailerForm.get('ownerId'),
                            false
                        );

                        this.documents = [];
                        this.filesForDelete = [];
                        this.fileModified = false;

                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                            close: false,
                        });
                        this.addNewAfterSave = false;
                    } else {
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: true,
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

    private deleteTrailerById(id: number): void {
        this.trailerModalService
            .deleteTrailerById(id, this.editData.tabSelected)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
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
            emptyWeight: this.trailerForm.get('emptyWeight').value
                ? convertThousanSepInNumber(
                      this.trailerForm.get('emptyWeight').value
                  )
                : null,
            mileage: this.trailerForm.get('mileage').value
                ? convertThousanSepInNumber(
                      this.trailerForm.get('mileage').value
                  )
                : null,
            volume: this.trailerForm.get('volume').value
                ? convertThousanSepInNumber(
                      this.trailerForm.get('volume').value
                  )
                : null,
            purchaseDate: this.trailerForm.get('companyOwned').value
                ? this.trailerForm.get('purchaseDate').value
                    ? convertDateToBackend(
                          this.trailerForm.get('purchaseDate').value
                      )
                    : null
                : null,
            purchasePrice: this.trailerForm.get('companyOwned').value
                ? this.trailerForm.get('purchasePrice').value
                    ? convertThousanSepInNumber(
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
                            ? convertNumberInThousandSep(res.emptyWeight)
                            : null,
                        mileage: res.mileage
                            ? convertNumberInThousandSep(res.mileage)
                            : null,
                        volume: res.volume
                            ? convertNumberInThousandSep(res.volume)
                            : null,
                        insurancePolicy: res.insurancePolicy,
                        purchaseDate: res.purchaseDate
                            ? convertDateFromBackend(res.purchaseDate)
                            : null,
                        purchasePrice: res.purchasePrice
                            ? convertNumberInThousandSep(res.purchasePrice)
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
                error: () => {},
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
                            error: () => {},
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
                .subscribe({
                    next: (res: TrailerAutocompleteModelResponse) => {
                        console.log('autocomplete: ', res);
                    },
                    error: (error) => {
                        console.log(error);
                    },
                });
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
