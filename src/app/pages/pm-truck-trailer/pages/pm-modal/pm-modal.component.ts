import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Services
import { PmService } from 'src/app/pages/pm-truck-trailer/services/pm.service';
import { TaInputService } from 'src/app/shared/components/ta-input/services/ta-input.service';
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';
import { FormService } from 'src/app/shared/services/form.service';

// Models
import {
    PMTrailerListResponse,
    PMTruckListResponse,
    UpdatePMTrailerListDefaultCommand,
    UpdatePMTrailerUnitListCommand,
    UpdatePMTruckDefaultListCommand,
    UpdatePMTruckUnitListCommand,
} from 'appcoretruckassist';

// Validators
import { descriptionValidation } from 'src/app/shared/components/ta-input/validators/ta-input.regex-validations';

// Helpers
import {
    convertNumberInThousandSep,
    convertThousanSepInNumber,
} from '../../../../core/utils/methods.calculations';

// Modals
import { RepairOrderModalComponent } from '../../../repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';

// Components
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';
import { TaModalComponent } from 'src/app/shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from 'src/app/shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaCheckboxComponent } from 'src/app/shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputComponent } from 'src/app/shared/components/ta-input/ta-input.component';

@Component({
    selector: 'app-pm-modal',
    templateUrl: './pm-modal.component.html',
    styleUrls: ['./pm-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,

        // Components
        AppTooltipComponent,
        TaModalComponent,
        TaTabSwitchComponent,
        TaCustomCardComponent,
        TaCheckboxComponent,
        TaInputComponent,
    ],
})
export class PmModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() editData: any;

    public PMform: UntypedFormGroup;

    public isFormDirty: boolean;

    public disableCardAnimation: boolean = false;

    constructor(
        // Form
        private formBuilder: UntypedFormBuilder,

        // Services
        private pmService: PmService,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();

        if (this.editData?.action?.includes('unit-pm')) {
            // TODO: Proveri sa bokija da li je povezao kako treba
            this.disableCardAnimation = true;
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
        return this.PMform.get('defaultPMs') as UntypedFormArray;
    }

    public get newPMs(): UntypedFormArray {
        return this.PMform.get('newPMs') as UntypedFormArray;
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
        hidden: boolean
    ): UntypedFormGroup {
        return this.formBuilder.group({
            id: [id],
            isChecked: [isChecked],
            svg: [svg],
            title: [title],
            mileage: [mileage],
            value: [value, [...descriptionValidation]],
            hidden: [hidden],
        });
    }

    public addPMs(
        data: {
            id: any;
            isChecked: boolean;
            svg: string;
            title: string;
            mileage: string;
            status: any;
        },
        event: string,
        defaultValue?: number
    ) {
        // This if check if new item added or already new items exist, because of 'custom-svg'
        if (event === 'new-pm') {
            if (data?.id) {
                this.newPMs.push(
                    this.createNewPMs(
                        data.id,
                        data.isChecked,
                        data.svg,
                        data.title,
                        data.mileage,
                        data.title,
                        false
                    )
                );
            } else {
                this.newPMs.push(
                    this.createNewPMs(
                        null,
                        true,
                        'assets/svg/common/repair-pm/ic_custom_pm.svg',
                        null,
                        convertNumberInThousandSep(defaultValue),
                        null,
                        false
                    )
                );
            }
        } else {
            this.defaultPMs.push(
                this.createDefaultPMs(
                    data.id,
                    data.isChecked,
                    data.svg,
                    data.title,
                    data.mileage,
                    data.status
                )
            );
        }
    }

    public activePMs() {
        return this.defaultPMs.controls.reduce((accumulator, item: any) => {
            if (item.get('isChecked').value) {
                return (accumulator = accumulator + 1);
            } else {
                return (accumulator = accumulator);
            }
        }, 0);
    }

    public removeNewPMs(id: number) {
        if (this.editData.type === 'new') {
            switch (this.editData.header) {
                case 'Truck': {
                    this.deleteTruckPMList(this.newPMs.at(id).value.id);
                    break;
                }
                case 'Trailer': {
                    this.deleteTrailerPMList(this.newPMs.at(id).value.id);
                    break;
                }
                default: {
                    break;
                }
            }

            this.newPMs.removeAt(id);
        }
    }

    public onChangeValueNewPM(ind: number) {
        this.newPMs
            .at(ind)
            .get('value')
            .valueChanges.pipe(debounceTime(2000), takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.newPMs.at(ind).get('hidden').patchValue(true);
                }
            });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
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
                                type: this.editData?.type2,
                                closing: 'fastest',
                            });
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
                break;
            }
            case 'save': {
                if (this.PMform.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.PMform);
                    return;
                }

                switch (this.editData.type) {
                    case 'new': {
                        switch (this.editData.header) {
                            case 'Truck': {
                                this.addPMTruckList();
                                this.modalService.setModalSpinner({
                                    action: null,
                                    status: true,
                                    close: false,
                                });
                                break;
                            }
                            case 'Trailer': {
                                this.addPMTrailerList();
                                this.modalService.setModalSpinner({
                                    action: null,
                                    status: true,
                                    close: false,
                                });
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                        break;
                    }
                    case 'edit': {
                        switch (this.editData.header) {
                            case 'Truck': {
                                this.addUpdatePMTruckUnit();
                                this.modalService.setModalSpinner({
                                    action: null,
                                    status: true,
                                    close: false,
                                });
                                break;
                            }
                            case 'Trailer': {
                                this.addUpdatePMTrailerUnit();
                                this.modalService.setModalSpinner({
                                    action: null,
                                    status: true,
                                    close: false,
                                });
                                break;
                            }
                            default: {
                                break;
                            }
                        }

                        break;
                    }
                    default: {
                        break;
                    }
                }

                break;
            }

            default: {
                break;
            }
        }
    }

    private getPMTruckList() {
        this.pmService
            .getPMTruckList()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: PMTruckListResponse) => {
                    res.pagination.data.forEach((item, index) => {
                        const data = {
                            id: item.id,
                            isChecked:
                                item.status.name === 'Active' || index < 4,
                            svg: `assets/svg/common/repair-pm/${item.logoName}`,
                            title: item.title,
                            mileage: convertNumberInThousandSep(item.mileage),
                            status: item.status,
                        };

                        this.addPMs(
                            data,
                            item.logoName.includes('custom') ? 'new-pm' : null
                        );
                    });
                },
                error: () => {},
            });
    }

    private getPMTruckUnit(id: number) {
        this.pmService
            .getPmTruckUnitIdModal(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: PMTruckListResponse) => {
                    res.pagination.data.forEach((item, index) => {
                        const data = {
                            id: item.id,
                            isChecked:
                                item.status.name === 'Active' || index < 4,
                            svg: `assets/svg/common/repair-pm/${item.logoName}`,
                            title: item.title,
                            mileage: convertNumberInThousandSep(item.mileage),
                            status: item.status.name,
                        };

                        this.addPMs(
                            data,
                            item.logoName.includes('custom') ? 'new-pm' : null
                        );
                    });
                },
                error: () => {},
            });
    }

    private getPMTrailerList() {
        this.pmService
            .getPMTrailerList()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: PMTrailerListResponse) => {
                    res.pagination.data.forEach((item) => {
                        const data = {
                            id: item.id,
                            isChecked: item.status.name === 'Active',
                            svg: `assets/svg/common/repair-pm/${item.logoName}`,
                            title: item.title,
                            mileage: convertNumberInThousandSep(item.months),
                            status: item.status.name,
                        };

                        this.addPMs(
                            data,
                            item.logoName.includes('custom') ? 'new-pm' : null
                        );
                    });
                },
                error: () => {},
            });
    }

    private getPMTrailerUnit(id: number) {
        this.pmService
            .getPmTrailerUnitIdModal(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: PMTrailerListResponse) => {
                    res.pagination.data.forEach((item) => {
                        const data = {
                            id: item.id,
                            isChecked: item.status.name === 'Active',
                            svg: `assets/svg/common/repair-pm/${item.logoName}`,
                            title: item.title,
                            mileage: convertNumberInThousandSep(item.months),
                            status: item.status,
                        };

                        this.addPMs(
                            data,
                            item.logoName.includes('custom') ? 'new-pm' : null
                        );
                    });
                },
                error: () => {},
            });
    }

    private addPMTruckList() {
        const newData: UpdatePMTruckDefaultListCommand = {
            pmTruckDefaults: [
                ...this.defaultPMs.controls.map((item, index) => {
                    return {
                        id: item.get('id').value,
                        title: item.get('title').value,
                        mileage: convertThousanSepInNumber(
                            item.get('mileage').value
                        ),
                        status:
                            index < 4
                                ? item.get('status').value.name
                                : item.get('isChecked').value
                                ? 'Active'
                                : 'Inactive',
                    };
                }),
                ...this.newPMs.controls.map((item: any) => {
                    return {
                        id: item.get('id').value,
                        title: item.get('value').value,
                        mileage: convertThousanSepInNumber(
                            item.get('mileage').value
                        ),
                        status: item.get('isChecked').value
                            ? 'Active'
                            : 'Inactive',
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
                            case 'repair-modal': {
                                this.modalService.setProjectionModal({
                                    action: 'close',
                                    payload: {
                                        key: this.editData?.key,
                                        value: null,
                                    },
                                    component: RepairOrderModalComponent,
                                    size: 'large',
                                    type: this.editData?.type2,
                                    closing: 'slowlest',
                                });
                                break;
                            }
                            default: {
                                break;
                            }
                        }
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

    private addPMTrailerList() {
        const newData: UpdatePMTrailerListDefaultCommand = {
            pmTrailerDefaults: [
                ...this.defaultPMs.controls.map((item, index) => {
                    return {
                        id: item.get('id').value,
                        title: item.get('title').value,
                        months: convertThousanSepInNumber(
                            item.get('mileage').value
                        ),
                        status:
                            index < 1
                                ? item.get('status').value
                                : item.get('isChecked').value
                                ? 'Active'
                                : 'Inactive',
                    };
                }),
                ...this.newPMs.controls.map((item: any) => {
                    return {
                        id: item.get('id').value,
                        title: item.get('value').value,
                        months: convertThousanSepInNumber(
                            item.get('mileage').value
                        ),
                        status: item.get('isChecked').value
                            ? 'Active'
                            : 'Inactive',
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
                            case 'repair-modal': {
                                this.modalService.setProjectionModal({
                                    action: 'close',
                                    payload: {
                                        key: this.editData?.key,
                                        value: null,
                                    },
                                    component: RepairOrderModalComponent,
                                    size: 'large',
                                    type: this.editData?.type2,
                                    closing: 'slowlest',
                                });
                                break;
                            }
                            default: {
                                break;
                            }
                        }
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

    private addUpdatePMTruckUnit() {
        const newData: UpdatePMTruckUnitListCommand = {
            truckId: this.editData.id,
            pmTrucks: [
                ...this.defaultPMs.controls.map((item, index) => {
                    return {
                        id: item.get('id').value,
                        mileage: convertThousanSepInNumber(
                            item.get('mileage').value
                        ),
                        status:
                            index < 4
                                ? item.get('status').value
                                : item.get('isChecked').value
                                ? 'Active'
                                : 'Inactive',
                    };
                }),
                ...this.newPMs.controls.map((item) => {
                    return {
                        id: item.get('id').value,
                        mileage: convertThousanSepInNumber(
                            item.get('mileage').value
                        ),
                        status: item.get('isChecked').value
                            ? 'Active'
                            : 'Inactive',
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
                            case 'repair-modal': {
                                this.modalService.setProjectionModal({
                                    action: 'close',
                                    payload: {
                                        key: this.editData?.key,
                                        value: null,
                                    },
                                    component: RepairOrderModalComponent,
                                    size: 'large',
                                    type: this.editData?.type2,
                                    closing: 'slowlest',
                                });
                                break;
                            }
                            default: {
                                break;
                            }
                        }
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

    private addUpdatePMTrailerUnit() {
        const newData: UpdatePMTrailerUnitListCommand = {
            trailerId: this.editData.id,
            pmTrailers: [
                ...this.defaultPMs.controls.map((item, index) => {
                    return {
                        id: item.get('id').value,
                        months: convertThousanSepInNumber(
                            item.get('mileage').value
                        ),
                        status:
                            index < 1
                                ? item.get('status').value.name
                                : item.get('isChecked').value
                                ? 'Active'
                                : 'Inactive',
                    };
                }),
                ...this.newPMs.controls.map((item) => {
                    return {
                        id: item.get('id').value,
                        months: convertThousanSepInNumber(
                            item.get('mileage').value
                        ),
                        status: item.get('isChecked').value
                            ? 'Active'
                            : 'Inactive',
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
                            case 'repair-modal': {
                                this.modalService.setProjectionModal({
                                    action: 'close',
                                    payload: {
                                        key: this.editData?.key,
                                        value: null,
                                    },
                                    component: RepairOrderModalComponent,
                                    size: 'large',
                                    type: this.editData?.type2,
                                    closing: 'slowlest',
                                });
                                break;
                            }
                            default: {
                                break;
                            }
                        }
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

    private getPMList() {
        // Global List
        if (this.editData.type === 'new') {
            switch (this.editData.header) {
                case 'Truck': {
                    this.getPMTruckList();
                    break;
                }
                case 'Trailer': {
                    this.getPMTrailerList();
                    break;
                }
                default: {
                    break;
                }
            }
        }
        // Per Unit list
        else {
            if (['Truck', 'Trailer'].includes(this.editData?.type)) {
                const data = JSON.parse(
                    sessionStorage.getItem(this.editData.key)
                );

                if (this.editData.type === 'Truck') {
                    this.editData = {
                        ...this.editData,
                        id: data.id,
                        data: {
                            textUnit: data.unit,
                        },
                        type2: this.editData.type,
                        type: 'edit',
                        header: 'Truck',
                        action: 'unit-pm',
                    };
                }

                if (this.editData.type === 'Trailer') {
                    this.editData = {
                        ...this.editData,
                        id: data.id,
                        data: {
                            textUnit: data.unit,
                        },
                        type2: this.editData.type,
                        type: 'edit',
                        header: 'Trailer',
                        action: 'unit-pm',
                    };
                }
            }
            if (
                [this.editData?.header, this.editData?.type].includes('Truck')
            ) {
                this.getPMTruckUnit(this.editData.id);
            } else {
                this.getPMTrailerUnit(this.editData.id);
            }

            setTimeout(() => {
                this.disableCardAnimation = false;
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

    public identity(index: number, item: any): number {
        return item.id;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
