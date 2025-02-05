import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { Subject, takeUntil } from 'rxjs';

// modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// services
import { PmService } from '@pages/pm-truck-trailer/services/pm.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';

// validators
import { descriptionValidation } from '@shared/components/ta-input/validators/ta-input.regex-validations';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// components
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import { CaModalComponent, CaModalButtonComponent } from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';
import { ModalButtonType } from '@shared/enums';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// models
import {
    PMStatus,
    PMTrailerResponse,
    PMTruckResponse,
    UpdatePMTrailerListDefaultCommand,
    UpdatePMTrailerUnitListCommand,
    UpdatePMTruckDefaultListCommand,
} from 'appcoretruckassist';
import { PmUpdateTruckUnitListCommand } from '@pages/pm-truck-trailer/models/pm-update-truck-unit-list-command.model';
import { PMTableData } from '@pages/pm-truck-trailer/pages/pm-table/models/pm-table-data.model';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';

@Component({
    selector: 'app-pm-modal',
    templateUrl: './pm-modal.component.html',
    styleUrls: ['./pm-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // components
        CaModalComponent,
        CaModalButtonComponent,
        TaCustomCardComponent,
        TaModalTableComponent,
        TaAppTooltipV2Component,
    ],
})
export class PmModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() editData: any;

    public PMform: UntypedFormGroup;

    public isFormDirty: boolean;

    public isCardAnimationDisabled: boolean = false;

    public pmTableData: PMTableData[] = [];

    public isPmRowCreated: boolean = false;

    public removedPMs: number[] = [];

    public isFormValid: boolean = false;

    public isAllValuesSet: boolean = false;

    // enums
    public modalTableTypeEnum = ModalTableTypeEnum;
    public modalButtonType = ModalButtonType;
    public taModalActionEnum = TaModalActionEnum;
    public TableStringEnum = TableStringEnum;
    public activeAction: string;

    public svgRoutes = SharedSvgRoutes;

    constructor(
        // form
        private formBuilder: UntypedFormBuilder,

        // services
        private pmService: PmService,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,

        // change detector
        private changeDetector: ChangeDetectorRef,
        private ngbActiveModal: NgbActiveModal
    ) { }

    ngOnInit() {
        this.createForm();

        if (this.editData?.action?.includes(TableStringEnum.UNIT_PM)) {
            this.isCardAnimationDisabled = true;
        }

        this.getPMList();
    }

    private createForm() {
        this.PMform = this.formBuilder.group({
            defaultPMs: this.formBuilder.array([]),
            newPMs: this.formBuilder.array([]),
        });

        this.formService.checkFormChange(this.PMform);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public get defaultPMs(): UntypedFormArray {
        return this.PMform.get(TableStringEnum.DEFAULT_PMS) as UntypedFormArray;
    }

    public get newPMs(): UntypedFormArray {
        return this.PMform.get(TableStringEnum.NEW_PMS) as UntypedFormArray;
    }

    private createDefaultPMs(
        id: number,
        isChecked: boolean = false,
        svg: string,
        title: string,
        mileage: string,
        status: string
    ): UntypedFormGroup {
        return this.formBuilder.group({
            id: [id],
            isChecked: [isChecked],
            svg: [svg],
            title: [title],
            mileage: [mileage],
            defaultMileage: [mileage],
            status: [status],
        });
    }

    private createNewPMs(
        id: number,
        isChecked: boolean,
        svg: string,
        title: string,
        mileage: string,
        value: string,
        hidden: boolean,
        status: string
    ): UntypedFormGroup {
        return this.formBuilder.group({
            id: [id],
            isChecked: [isChecked],
            svg: [svg],
            title: [title],
            mileage: [mileage],
            defaultMileage: [mileage],
            value: [value, [...descriptionValidation]],
            hidden: [hidden],
            status: [status],
        });
    }

    public addPMs() {
        this.isPmRowCreated = true;

        setTimeout(() => {
            this.isPmRowCreated = false;
        }, 400);

        this.changeDetector.detectChanges();
    }

    public activePMs() {
        return this.newPMs.controls.reduce((accumulator, item: any) => {
            if (item.get(TableStringEnum.IS_CHECKED).value) {
                return (accumulator = accumulator + 1);
            } else {
                return (accumulator = accumulator);
            }
        }, 0);
    }

    public removeNewPMs(index: number) {
        if (this.editData.type === TableStringEnum.NEW) {
            if (this.newPMs.at(index).value.id) {
                switch (this.editData.header) {
                    case TableStringEnum.TRUCK_PM_SETTINGS:
                        this.deleteTruckPMList(this.newPMs.at(index).value.id);
                        break;

                    case TableStringEnum.TRAILER_PM_SETTINGS:
                        this.deleteTrailerPMList(
                            this.newPMs.at(index).value.id
                        );
                        break;

                    default:
                        break;
                }
            }

            this.newPMs.removeAt(index);
        }
    }

    public removeDefaultPMs(index: number) {
        if (this.editData.type === TableStringEnum.NEW) {
            if (this.defaultPMs.at(index).value.id) {
                switch (this.editData.header) {
                    case TableStringEnum.TRUCK_PM_SETTINGS:
                        this.deleteTruckPMList(
                            this.defaultPMs.at(index).value.id
                        );
                        break;

                    case TableStringEnum.TRAILER_PM_SETTINGS:
                        this.deleteTrailerPMList(
                            this.defaultPMs.at(index).value.id
                        );
                        break;

                    default:
                        break;
                }
            }

            this.defaultPMs.removeAt(index);
        }
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        this.activeAction = data.action;

        switch (data.action) {
            case TableStringEnum.CLOSE:
                if (this.editData?.canOpenModal) {
                    switch (this.editData?.key) {
                        case TableStringEnum.REPAIR_MODAL:
                            this.openRepairModal();

                            break;

                        default:
                            break;
                    }
                } else {
                    this.ngbActiveModal.close();
                }
                break;

            case TableStringEnum.SAVE:
                if (!this.isFormValid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.PMform);
                    return;
                }

                switch (this.editData.type) {
                    case TableStringEnum.NEW:
                        switch (this.editData.header) {
                            case TableStringEnum.TRUCK_PM_SETTINGS:
                                if (this.removedPMs?.length) {
                                    this.removedPMs.map((removedPmIndex) => {
                                        this.removeNewPMs(removedPmIndex);
                                    });
                                }

                                this.addPMTruckList();
                                break;

                            case TableStringEnum.TRAILER_PM_SETTINGS:
                                if (this.removedPMs?.length) {
                                    this.removedPMs.map((removedPmIndex) => {
                                        this.removeNewPMs(removedPmIndex);
                                    });
                                }

                                this.addPMTrailerList();
                                break;

                            default:
                                break;
                        }
                        break;

                    case TableStringEnum.EDIT:
                        switch (this.editData.header) {
                            case TableStringEnum.CONFIGURE_TRUCK_PM_HEADER:
                                this.addUpdatePMTruckUnit();
                                break;
                            case TableStringEnum.CONFIGURE_TRAILER_PM_HEADER:
                                this.addUpdatePMTrailerUnit();
                                break;
                            default:
                                break;
                        }

                        break;

                    default:
                        break;
                }

                break;

            default:
                break;
        }
    }

    private getPMTruckList() {
        this.pmService
            .getPMTruckList()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.pmTableData = res.pagination.data.map(
                        (item, index) => {
                            const data = this.mapPmTruckData(item, index);

                            if (data.status.name === PMStatus.Default) {
                                this.newPMs.push(
                                    this.createDefaultPMs(
                                        data.id,
                                        data.isChecked,
                                        data.svg,
                                        data.title,
                                        data.mileage,
                                        data.status.name
                                    )
                                );
                            } else {
                                this.newPMs.push(
                                    this.createNewPMs(
                                        data.id,
                                        data.isChecked,
                                        data.svg,
                                        data.title,
                                        data.mileage,
                                        data.title,
                                        false,
                                        data.status.name
                                    )
                                );
                            }

                            return data;
                        }
                    );

                    this.PMform.get(TableStringEnum.NEW_PMS).patchValue(
                        this.pmTableData
                    );
                    this.changeDetector.detectChanges();
                },
                error: () => { },
            });
    }

    private getPMTruckUnit(id: number) {
        this.pmService
            .getPmTruckUnitIdModal(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.pmTableData = res.pagination.data.map(
                        (item, index) => {
                            const data = this.mapPmTruckData(item, index);

                            if (data.status.name === PMStatus.Default) {
                                this.newPMs.push(
                                    this.createDefaultPMs(
                                        data.id,
                                        data.isChecked,
                                        data.svg,
                                        data.title,
                                        data.mileage,
                                        data.status.name
                                    )
                                );
                            } else {
                                this.newPMs.push(
                                    this.createNewPMs(
                                        data.id,
                                        data.isChecked,
                                        data.svg,
                                        data.title,
                                        data.mileage,
                                        data.title,
                                        false,
                                        data.status.name
                                    )
                                );
                            }

                            return data;
                        }
                    );

                    this.PMform.get(TableStringEnum.NEW_PMS).patchValue(
                        this.pmTableData
                    );
                },
                error: () => { },
            });
    }

    private getPMTrailerList() {
        this.pmService
            .getPMTrailerList()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.pmTableData = res.pagination.data.map(
                        (item, index) => {
                            const data = this.mapPmTrailerData(item, index);

                            if (data.status.name === PMStatus.Default) {
                                this.newPMs.push(
                                    this.createDefaultPMs(
                                        data.id,
                                        data.isChecked,
                                        data.svg,
                                        data.title,
                                        data.mileage,
                                        data.status.name
                                    )
                                );
                            } else {
                                this.newPMs.push(
                                    this.createNewPMs(
                                        data.id,
                                        data.isChecked,
                                        data.svg,
                                        data.title,
                                        data.mileage,
                                        data.title,
                                        false,
                                        data.status.name
                                    )
                                );
                            }

                            return data;
                        }
                    );

                    this.PMform.get(TableStringEnum.NEW_PMS).patchValue(
                        this.pmTableData
                    );
                },
                error: () => { },
            });
    }

    private getPMTrailerUnit(id: number) {
        this.pmService
            .getPmTrailerUnitIdModal(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.pmTableData = res.pagination.data.map(
                        (item, index) => {
                            const data = this.mapPmTrailerData(item, index);

                            if (data.status.name === PMStatus.Default) {
                                this.newPMs.push(
                                    this.createDefaultPMs(
                                        data.id,
                                        data.isChecked,
                                        data.svg,
                                        data.title,
                                        data.mileage,
                                        data.status.name
                                    )
                                );
                            } else {
                                this.newPMs.push(
                                    this.createNewPMs(
                                        data.id,
                                        data.isChecked,
                                        data.svg,
                                        data.title,
                                        data.mileage,
                                        data.title,
                                        false,
                                        data.status.name
                                    )
                                );
                            }

                            return data;
                        }
                    );

                    this.PMform.get(TableStringEnum.NEW_PMS).patchValue(
                        this.pmTableData
                    );
                },
                error: () => { },
            });
    }

    private addPMTruckList() {
        const newData: UpdatePMTruckDefaultListCommand = {
            pmTruckDefaults: [
                ...this.newPMs.controls.map((item, index) => {
                    return {
                        id: item.get(TableStringEnum.ID).value,
                        title: item.get(TableStringEnum.TITLE_2).value,
                        mileage:
                            MethodsCalculationsHelper.convertThousandSepInNumber(
                                item.get(TableStringEnum.MILEAGE).value
                            ),
                        status:
                            index < 4
                                ? PMStatus.Default
                                : item.get(TableStringEnum.IS_CHECKED).value
                                    ? PMStatus.Active
                                    : PMStatus.Inactive,
                    };
                }),
            ],
        };

        this.pmService
            .addUpdatePMTruckList(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal) {
                        switch (this.editData?.key) {
                            case TableStringEnum.REPAIR_MODAL:
                                this.openRepairModal();

                                break;

                            default:
                                break;
                        }
                    } else {
                        this.ngbActiveModal.close();
                    }
                },
                error: () => (this.activeAction = null),
            });
    }

    private addPMTrailerList() {
        const newData: UpdatePMTrailerListDefaultCommand = {
            pmTrailerDefaults: [
                ...this.newPMs.controls.map((item, index) => {
                    return {
                        id: item.get(TableStringEnum.ID).value,
                        title: item.get(TableStringEnum.TITLE_2).value,
                        months: MethodsCalculationsHelper.convertThousandSepInNumber(
                            item.get(TableStringEnum.MILEAGE).value
                        ),
                        status:
                            index < 1
                                ? PMStatus.Default
                                : item.get(TableStringEnum.IS_CHECKED).value
                                    ? PMStatus.Active
                                    : PMStatus.Inactive,
                    };
                }),
            ],
        };

        this.pmService
            .addUpdatePMTrailerList(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal) {
                        switch (this.editData?.key) {
                            case TableStringEnum.REPAIR_MODAL:
                                this.openRepairModal();

                                break;

                            default: {
                                break;
                            }
                        }
                    } else {
                        this.ngbActiveModal.close();
                    }
                },
                error: () => (this.activeAction = null),
            });
    }

    private addUpdatePMTruckUnit() {
        const newData: PmUpdateTruckUnitListCommand = {
            truckId: this.editData.data.truck.id,
            pmId: this.editData.data.pmId,
            pmTrucks: [
                ...this.defaultPMs.controls.map((item, index) => {
                    return {
                        id: item.get(TableStringEnum.ID).value,
                        mileage:
                            MethodsCalculationsHelper.convertThousandSepInNumber(
                                item.get(TableStringEnum.MILEAGE).value
                            ),
                        status:
                            index < 4
                                ? PMStatus.Default
                                : item.get(TableStringEnum.IS_CHECKED).value
                                    ? PMStatus.Active
                                    : PMStatus.Inactive,
                    };
                }),
                ...this.newPMs.controls.map((item, index) => {
                    return {
                        id: item.get(TableStringEnum.ID).value,
                        mileage:
                            MethodsCalculationsHelper.convertThousandSepInNumber(
                                item.get(TableStringEnum.MILEAGE).value
                            ),
                        status:
                            index < 4
                                ? PMStatus.Default
                                : item.get(TableStringEnum.IS_CHECKED).value
                                    ? PMStatus.Active
                                    : PMStatus.Inactive,
                    };
                }),
            ],
        };

        this.pmService
            .addUpdatePMTruckUnit(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal) {
                        switch (this.editData?.key) {
                            case TableStringEnum.REPAIR_MODAL:
                                this.openRepairModal();

                                break;

                            default:
                                break;
                        }
                    } else {
                        this.ngbActiveModal.close();
                    }
                },
                error: () => (this.activeAction = null),
            });
    }

    private addUpdatePMTrailerUnit() {
        const newData: UpdatePMTrailerUnitListCommand = {
            trailerId: this.editData.id,
            pmTrailers: [
                ...this.defaultPMs.controls.map((item, index) => {
                    return {
                        id: item.get(TableStringEnum.ID).value,
                        months: MethodsCalculationsHelper.convertThousandSepInNumber(
                            item.get(TableStringEnum.MILEAGE).value
                        ),
                        status:
                            index < 1
                                ? PMStatus.Default
                                : item.get(TableStringEnum.IS_CHECKED).value
                                    ? PMStatus.Active
                                    : PMStatus.Inactive,
                    };
                }),
                ...this.newPMs.controls.map((item, index) => {
                    return {
                        id: item.get(TableStringEnum.ID).value,
                        months: MethodsCalculationsHelper.convertThousandSepInNumber(
                            item.get(TableStringEnum.MILEAGE).value
                        ),
                        status:
                            index < 1
                                ? PMStatus.Default
                                : item.get(TableStringEnum.IS_CHECKED).value
                                    ? PMStatus.Active
                                    : PMStatus.Inactive,
                    };
                }),
            ],
        };

        this.pmService
            .addUpdatePMTrailerUnit(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal) {
                        switch (this.editData?.key) {
                            case TableStringEnum.REPAIR_MODAL:
                                this.openRepairModal();

                                break;

                            default:
                                break;
                        }
                    } else {
                        this.ngbActiveModal.close();
                    }
                },
                error: () => (this.activeAction = null),
            });
    }

    private getPMList() {
        // Global List
        if (this.editData.type === TableStringEnum.NEW) {
            switch (this.editData.header) {
                case TableStringEnum.TRUCK_PM_SETTINGS:
                    this.getPMTruckList();
                    break;

                case TableStringEnum.TRAILER_PM_SETTINGS:
                    this.getPMTrailerList();
                    break;

                default:
                    break;
            }
        }
        // Per Unit list
        else {
            if (
                [
                    TableStringEnum.TRUCK_PM_SETTINGS,
                    TableStringEnum.TRAILER_PM_SETTINGS,
                ].includes(this.editData?.type)
            ) {
                const data = JSON.parse(
                    sessionStorage.getItem(this.editData.key)
                );

                if (this.editData.type === TableStringEnum.TRUCK_PM_SETTINGS) {
                    this.editData = {
                        ...this.editData,
                        id: data.id,
                        data: {
                            textUnit: data.unit,
                        },
                        type2: this.editData.type,
                        type: TableStringEnum.EDIT,
                        header: TableStringEnum.CONFIGURE_TRUCK_PM_HEADER,
                        action: TableStringEnum.UNIT_PM,
                    };
                }

                if (
                    this.editData.type === TableStringEnum.TRAILER_PM_SETTINGS
                ) {
                    this.editData = {
                        ...this.editData,
                        id: data.id,
                        data: {
                            textUnit: data.unit,
                        },
                        type2: this.editData.type,
                        type: TableStringEnum.EDIT,
                        header: TableStringEnum.CONFIGURE_TRAILER_PM_HEADER,
                        action: TableStringEnum.UNIT_PM,
                    };
                }
            }
            if (
                [this.editData?.header].includes(
                    TableStringEnum.CONFIGURE_TRUCK_PM_HEADER
                )
            ) {
                this.getPMTruckUnit(this.editData.id);
            } else {
                this.getPMTrailerUnit(this.editData.id);
            }

            setTimeout(() => {
                this.isCardAnimationDisabled = false;
            }, 1000);
        }
    }

    private deleteTruckPMList(id: number) {
        this.pmService
            .deletePMTruckById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteTrailerPMList(id: number) {
        this.pmService
            .deletePMTrailerById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public handleModalTableValueEmit(modalTableDataValue): void {
        let pmNames = [];

        modalTableDataValue.forEach((pmItem) => {
            const existingPmIndex = this.newPMs.controls.findIndex(
                (newPm) =>
                    newPm.get(TableStringEnum.TITLE_2).value === pmItem.title
            );

            if (pmItem.title && pmItem.mileage && existingPmIndex === -1) {
                this.newPMs.push(
                    this.createNewPMs(
                        null,
                        pmItem.isChecked,
                        pmItem.logoName,
                        pmItem.title,
                        MethodsCalculationsHelper.convertNumberInThousandSep(
                            pmItem.mileage
                        ),
                        pmItem.title,
                        false,
                        pmItem.status
                    )
                );
            } else if (existingPmIndex > -1) {
                const defaultPmsIndex =
                    this.editData.header ===
                        TableStringEnum.TRUCK_PM_SETTINGS ||
                        this.editData.header ===
                        TableStringEnum.CONFIGURE_TRUCK_PM_HEADER
                        ? 4
                        : 1;

                this.newPMs.at(existingPmIndex).patchValue({
                    svg: pmItem.logoName,
                    title: pmItem.title,
                    mileage: pmItem.mileage,
                    value: pmItem.title,
                    isChecked: pmItem.isChecked,
                    status:
                        existingPmIndex < defaultPmsIndex
                            ? PMStatus.Default
                            : pmItem.isChecked
                                ? PMStatus.Active
                                : PMStatus.Inactive,
                });
            }

            if (pmItem.title) pmNames.push(pmItem.title);
        });

        if (
            !this.isAllValuesSet &&
            pmNames?.length === this.newPMs.controls.length
        )
            this.isAllValuesSet = true;

        if (pmNames?.length && this.isAllValuesSet) {
            this.newPMs.controls.map((newPm, index) => {
                if (
                    !pmNames.includes(newPm.get(TableStringEnum.TITLE_2).value)
                ) {
                    if (!this.removedPMs.includes(index))
                        this.removedPMs.push(index);
                }
            });
        }

        this.changeDetector.detectChanges();
    }

    public handleModalTableValidStatusEmit(validStatus: boolean): void {
        this.isFormValid = validStatus;
    }

    private mapPmTruckData(item: PMTruckResponse, index: number): PMTableData {
        return {
            id: item.id,
            isChecked: item.status.name === PMStatus.Active || index < 4,
            svg: `assets/svg/common/repair-pm/${item.logoName}`,
            title: item.title,
            mileage: MethodsCalculationsHelper.convertNumberInThousandSep(
                item.mileage
            ),
            defaultMileage:
                MethodsCalculationsHelper.convertNumberInThousandSep(
                    item.mileage
                ),
            status: item.status,
        };
    }

    private mapPmTrailerData(
        item: PMTrailerResponse,
        index: number
    ): PMTableData {
        return {
            id: item.id,
            isChecked: item.status.name === PMStatus.Active || index < 1,
            svg: `assets/svg/common/repair-pm/${item.logoName}`,
            title: item.title,
            mileage: MethodsCalculationsHelper.convertNumberInThousandSep(
                item.months
            ),
            defaultMileage:
                MethodsCalculationsHelper.convertNumberInThousandSep(
                    item.months
                ),
            status: item.status,
        };
    }

    public openRepairModal(): void {
        this.modalService.setProjectionModal({
            action: TableStringEnum.CLOSE,
            payload: {
                key: this.editData?.key,
                value: null,
            },
            component: RepairOrderModalComponent,
            size: TableStringEnum.LARGE,
            type: this.editData?.type2,
            closing: TableStringEnum.FASTEST,
        });
    }

    public identity(index: number, item: any): number {
        return item.id;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
