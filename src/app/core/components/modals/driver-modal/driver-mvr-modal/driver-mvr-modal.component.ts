import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GetMvrModalResponse, MvrResponse } from 'appcoretruckassist';
import { DriverTService } from 'src/app/pages/driver/services/driver.service';
import { MvrTService } from 'src/app/pages/driver/services/mvr.service';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { FormService } from '../../../../services/form/form.service';
import {
    convertDateToBackend,
    convertDateFromBackend,
} from '../../../../utils/methods.calculations';
import { DriverListResponse } from '../../../../../../../appcoretruckassist/model/driverListResponse';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppTooltipComponent } from '../../../shared/app-tooltip/app-tooltip.component';
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';
import { TaUploadFilesComponent } from '../../../shared/ta-upload-files/ta-upload-files.component';
import { TaInputDropdownComponent } from '../../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '../../../shared/ta-input/ta-input.component';
import { TaCustomCardComponent } from '../../../shared/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '../../../shared/ta-input-note/ta-input-note.component';

@Component({
    selector: 'app-driver-mvr-modal',
    templateUrl: './driver-mvr-modal.component.html',
    styleUrls: ['./driver-mvr-modal.component.scss'],
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
export class DriverMvrModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public mvrForm: UntypedFormGroup;

    public isFormDirty: boolean = false;

    public modalName: string;

    public documents: any[] = [];

    public cdls: any[] = [];
    public selectedCdl: any = null;

    public labelsDrivers: any[] = [];
    public selectedDriver: any = null;
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    private destroy$ = new Subject<void>();

    public disableCardAnimation: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private driverService: DriverTService,
        private inputService: TaInputService,
        private modalService: ModalService,
        private mvrService: MvrTService,
        private formService: FormService
    ) {}

    ngOnInit(): void {
        this.createForm();

        if (this.editData) {
            this.disableCardAnimation = true;
            this.getDriverById(this.editData.id);
            this.getModalDropdowns(this.editData.id);

            if (this.editData.type === 'edit-mvr') {
                this.getMVRById(this.editData.file_id);
            }
        } else {
            this.getListOfDrivers();
            this.mvrForm.get('driver').setValidators(Validators.required);
        }
    }

    private createForm() {
        this.mvrForm = this.formBuilder.group({
            driver: [null],
            issueDate: [null, Validators.required],
            cdlId: [null, Validators.required],
            note: [null],
            files: [null],
        });
    }

    private getDriverById(id: number) {
        this.driverService
            .getDriverById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.modalName = res.firstName.concat(' ', res.lastName);
                    setTimeout(() => {
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
                // If Form not valid
                if (this.mvrForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.mvrForm);
                    return;
                }
                if (this.editData?.type === 'edit-mvr') {
                    this.updateMVR();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addMVR();
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

    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case 'add': {
                this.mvrForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.mvrForm
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

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'cdl': {
                this.selectedCdl = event;
                break;
            }
            case 'driver': {
                if (event) {
                    this.selectedDriver = event;
                    this.getModalDropdowns(this.selectedDriver.id);
                    this.modalName = this.selectedDriver.name;
                } else {
                    this.modalName = null;
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    private updateMVR() {
        const { issueDate, note } = this.mvrForm.value;
        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });
        const newData: any = {
            driverId: this.editData.id,
            id: this.editData.file_id,
            issueDate: convertDateToBackend(issueDate),
            cdlId: this.selectedCdl.id,
            note: note,
            files: documents ? documents : this.mvrForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.mvrService
            .updateMvr(newData)
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

    private addMVR() {
        const { issueDate, note } = this.mvrForm.value;
        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const newData: any = {
            driverId: this.selectedDriver
                ? this.selectedDriver.id
                : this.editData.id,
            issueDate: convertDateToBackend(issueDate),
            cdlId: this.selectedCdl.id,
            note: note,
            tableActiveTab: this.editData.tableActiveTab,
            files: documents,
        };

        this.mvrService
            .addMvr(newData)
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

    public getMVRById(id: number) {
        this.mvrService
            .getMvrById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: MvrResponse) => {
                    this.mvrForm.patchValue({
                        cdlId: res.cdlNumber,
                        issueDate: convertDateFromBackend(res.issueDate),
                        note: res.note,
                        files: res.files.length
                            ? JSON.stringify(res.files)
                            : null,
                    });
                    this.selectedCdl = {
                        id: res.cdlId,
                        name: res.cdlNumber,
                    };
                    this.documents = res.files ? (res.files as any) : [];
                    setTimeout(() => {
                        this.startFormChanges();
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    public getModalDropdowns(id: number) {
        this.mvrService
            .getMvrModal(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: GetMvrModalResponse) => {
                    this.cdls = res.cdls.map((item) => {
                        return {
                            ...item,
                            name: item.cdlNumber,
                        };
                    });

                    if (this.cdls.length === 1) {
                        this.selectedCdl = this.cdls[0];
                        this.mvrForm
                            .get('cdlId')
                            .patchValue(this.selectedCdl.name);
                    }
                    this.startFormChanges();
                },
                error: () => {},
            });
    }

    public getListOfDrivers() {
        this.driverService
            .getDrivers()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: DriverListResponse) => {
                    this.labelsDrivers = res.pagination.data.map((item) => {
                        return {
                            id: item.id,
                            name: item.fullName,
                        };
                    });
                },
                error: () => {},
            });
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.mvrForm);
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
