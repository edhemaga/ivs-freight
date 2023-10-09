import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CdlResponse, GetCdlModalResponse } from 'appcoretruckassist';
import { CdlTService } from '../../../driver/state/cdl.service';
import { DriverTService } from '../../../driver/state/driver.service';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { FormService } from '../../../../services/form/form.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppTooltipComponent } from '../../../shared/app-tooltip/app-tooltip.component';
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';
import { TaInputDropdownComponent } from '../../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaUploadFilesComponent } from '../../../shared/ta-upload-files/ta-upload-files.component';
import { TaInputComponent } from '../../../shared/ta-input/ta-input.component';
import { TaCustomCardComponent } from '../../../shared/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '../../../shared/ta-input-note/ta-input-note.component';
import {
    convertDateFromBackend,
    convertDateToBackend,
} from '../../../../utils/methods.calculations';
import {
    cdlCANADAValidation,
    cdlUSValidation,
} from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';

@Component({
    selector: 'app-driver-cdl-modal',
    templateUrl: './driver-cdl-modal.component.html',
    styleUrls: ['./driver-cdl-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // Component
        AppTooltipComponent,
        TaModalComponent,
        TaInputDropdownComponent,
        TaUploadFilesComponent,
        TaInputComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
    ],
})
export class DriverCdlModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() editData: any;

    public cdlForm: UntypedFormGroup;

    public modalName: string = null;

    public classTypes: any[] = [];

    public stateTypes: any[] = [];
    public endorsements: any[] = [];
    public restrictions: any[] = [];

    public selectedRestrictions: any[] = [];
    public selectedEndorsments: any[] = [];
    public selectedClassType: any = null;

    public selectedStateType: any = null;
    public selectedCountryType: string = 'US';

    public documents: any[] = [];

    public isFormDirty: boolean;

    fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public disableCardAnimation: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private driverService: DriverTService,
        private cdlService: CdlTService,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService
    ) {}

    ngOnInit(): void {
        this.getCdlDropdowns();
        this.createForm();
        this.getDriverById(this.editData.id);
    }

    private createForm() {
        const cdlCountryTypeValidation =
            this.selectedCountryType === 'US'
                ? cdlUSValidation
                : cdlCANADAValidation;

        this.cdlForm = this.formBuilder.group({
            cdlNumber: [
                null,
                [Validators.required, ...cdlCountryTypeValidation],
            ],
            issueDate: [null, Validators.required],
            expDate: [null, Validators.required],
            classType: [null, Validators.required],
            stateId: [null, Validators.required],
            restrictions: [null],
            restrictionsHelper: [null],
            endorsements: [null],
            endorsementsHelper: [null],
            note: [null],
            files: [null],
        });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
                if (this.cdlForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.cdlForm);
                    return;
                }

                if (this.editData.type === 'edit-licence') {
                    this.updateCdl();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addCdl();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'class': {
                this.selectedClassType = event;
                break;
            }
            case 'state': {
                this.selectedStateType = event;
                break;
            }
            case 'restrictions': {
                this.selectedRestrictions = event;

                this.cdlForm
                    .get('restrictionsHelper')
                    .setValue(
                        this.selectedRestrictions.length
                            ? JSON.stringify(this.selectedRestrictions)
                            : null
                    );

                break;
            }
            case 'endorsments': {
                this.selectedEndorsments = event;

                this.cdlForm
                    .get('endorsementsHelper')
                    .setValue(
                        this.selectedEndorsments.length
                            ? JSON.stringify(this.selectedEndorsments)
                            : null
                    );

                break;
            }
            default: {
                break;
            }
        }
    }

    private getCdlDropdowns() {
        this.cdlService
            .getCdlDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: GetCdlModalResponse) => {
                    this.selectedCountryType = res.country?.name;
                    this.stateTypes = res.states.map((item) => {
                        return {
                            id: item.id,
                            name: item.stateShortName,
                            stateName: item.stateName,
                        };
                    });
                    this.classTypes = res.classTypes;
                    this.endorsements = res.endorsements.map((item) => {
                        return {
                            ...item,
                            name: item.code
                                .concat(' ', '-')
                                .concat(' ', item.description),
                        };
                    });
                    this.restrictions = res.restrictions.map((item) => {
                        return {
                            ...item,
                            name: item.code
                                .concat(' ', '-')
                                .concat(' ', item.description),
                        };
                    });

                    if (this.editData.type === 'edit-licence') {
                        this.disableCardAnimation = true;
                        this.getCdlById(this.editData.file_id);
                    } else if (this.editData.type === 'renew-licence') {
                        this.disableCardAnimation = true;
                        this.populateCdlFormOnRenew(this.editData.renewData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => {},
            });
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.cdlForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    private getDriverById(id: number) {
        this.driverService
            .getDriverById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.modalName = res.firstName.concat(' ', res.lastName);
                },
                error: () => {},
            });
    }

    public populateCdlFormOnRenew(id: any) {
        this.cdlService
            .getCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CdlResponse) => {
                    this.cdlForm.patchValue({
                        cdlNumber: res.cdlNumber,
                        issueDate: null,
                        expDate: null,
                        classType: res.classType.name,
                        stateId: res.state.stateShortName,
                        restrictions: null,
                        restrictionsHelper: res.cdlRestrictions.length
                            ? JSON.stringify(res.cdlRestrictions)
                            : null,
                        endorsements: null,
                        endorsementsHelper: res.cdlEndorsements.length
                            ? JSON.stringify(res.cdlEndorsements)
                            : null,
                        note: res.note,
                        files: res.files.length
                            ? JSON.stringify(res.files)
                            : null,
                    });

                    this.documents = res.files ? (res.files as any) : [];

                    this.selectedEndorsments = res.cdlEndorsements.map(
                        (item) => {
                            return {
                                ...item,
                                name: item.code
                                    .concat(' ', '-')
                                    .concat(' ', item.description),
                            };
                        }
                    );

                    this.selectedRestrictions = res.cdlRestrictions.map(
                        (item) => {
                            return {
                                ...item,
                                name: item.code
                                    .concat(' ', '-')
                                    .concat(' ', item.description),
                            };
                        }
                    );

                    this.selectedClassType = res.classType;
                    this.selectedStateType = {
                        ...res.state,
                        name: res.state.stateShortName,
                    };
                    setTimeout(() => {
                        this.disableCardAnimation = false;
                        this.startFormChanges();
                    }, 1000);
                },
                error: () => {},
            });
    }

    public getCdlById(id: number) {
        this.cdlService
            .getCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CdlResponse) => {
                    this.cdlForm.patchValue({
                        cdlNumber: res.cdlNumber,
                        issueDate: convertDateFromBackend(res.issueDate),
                        expDate: convertDateFromBackend(res.expDate),
                        classType: res.classType.name,
                        stateId: res.state.stateShortName,
                        restrictions: null,
                        restrictionsHelper: res.cdlRestrictions.length
                            ? JSON.stringify(res.cdlRestrictions)
                            : null,
                        endorsements: null,
                        endorsementsHelper: res.cdlEndorsements.length
                            ? JSON.stringify(res.cdlEndorsements)
                            : null,
                        note: res.note,
                        files: res.files.length
                            ? JSON.stringify(res.files)
                            : null,
                    });

                    this.documents = res.files ? (res.files as any) : [];

                    this.selectedEndorsments = res.cdlEndorsements.map(
                        (item) => {
                            return {
                                ...item,
                                name: item.code
                                    .concat(' ', '-')
                                    .concat(' ', item.description),
                            };
                        }
                    );

                    this.selectedRestrictions = res.cdlRestrictions.map(
                        (item) => {
                            return {
                                ...item,
                                name: item.code
                                    .concat(' ', '-')
                                    .concat(' ', item.description),
                            };
                        }
                    );

                    this.selectedClassType = res.classType;
                    this.selectedStateType = {
                        ...res.state,
                        name: res.state.stateShortName,
                    };
                    setTimeout(() => {
                        this.disableCardAnimation = false;
                        this.startFormChanges();
                    }, 1000);
                },
                error: () => {},
            });
    }

    public updateCdl() {
        const {
            issueDate,
            expDate,
            note,
            endorsementsHelper,
            restrictionsHelper,
        } = this.cdlForm.value;
        const newData: any = {
            id: this.editData.file_id,
            ...this.cdlForm.value,
            issueDate: convertDateToBackend(issueDate),
            expDate: convertDateToBackend(expDate),
            classType: this.selectedClassType
                ? this.selectedClassType.name
                : null,
            stateId: this.selectedStateType ? this.selectedStateType.id : null,
            restrictions: this.selectedRestrictions
                ? this.selectedRestrictions.map((item) => item.id)
                : [],
            endorsements: this.selectedEndorsments
                ? this.selectedEndorsments.map((item) => item.id)
                : [],
            note: note,
            files: this.documents[0]?.realFile
                ? [this.documents[0]?.realFile]
                : this.cdlForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.cdlService
            .updateCdl(newData)
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

    public addCdl() {
        const {
            issueDate,
            expDate,
            note,
            endorsementsHelper,
            restrictionsHelper,
        } = this.cdlForm.value;

        const newData: any = {
            driverId: this.editData.id,
            ...this.cdlForm.value,
            issueDate: convertDateToBackend(issueDate),
            expDate: convertDateToBackend(expDate),
            classType: this.selectedClassType
                ? this.selectedClassType.name
                : null,
            stateId: this.selectedStateType ? this.selectedStateType.id : null,
            restrictions: this.selectedRestrictions
                ? this.selectedRestrictions.map((item) => item.id)
                : [],
            endorsements: this.selectedEndorsments
                ? this.selectedEndorsments.map((item) => item.id)
                : [],
            note: note,
            tableActiveTab: this.editData?.tableActiveTab
                ? this.editData.tableActiveTab
                : null,
            files: [this.documents[0]?.realFile],
        };

        if (this.editData.type === 'renew-licence') {
            const { driverId, ...renewData } = newData;
            this.cdlService
                .renewCdlUpdate({
                    ...renewData,
                    id: this.editData.renewData.id,
                })
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
        } else {
            this.cdlService
                .addCdl(newData)
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
    }

    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case 'add': {
                this.cdlForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.cdlForm
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
