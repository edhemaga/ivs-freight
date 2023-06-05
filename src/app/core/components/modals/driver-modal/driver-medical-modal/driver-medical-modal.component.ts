import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { DriverListResponse, MedicalResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { DriverTService } from '../../../driver/state/driver.service';
import { MedicalTService } from '../../../driver/state/medical.service';
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
    convertDateToBackend,
    convertDateFromBackend,
} from '../../../../utils/methods.calculations';

@Component({
    selector: 'app-driver-medical-modal',
    templateUrl: './driver-medical-modal.component.html',
    styleUrls: ['./driver-medical-modal.component.scss'],
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
export class DriverMedicalModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() editData: any;

    public medicalForm: UntypedFormGroup;

    public isFormDirty: boolean;

    public modalName: string;

    public documents: any[] = [];

    public selectedDriver: any = null;
    public labelsDrivers: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public disableCardAnimation: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private driverService: DriverTService,
        private inputService: TaInputService,
        private medicalService: MedicalTService,
        private modalService: ModalService,
        private formService: FormService
    ) {}

    ngOnInit(): void {
        this.createForm();

        if (this.editData) {
            this.disableCardAnimation = true;
            this.getDriverById(this.editData.id);

            if (this.editData.type === 'edit-medical') {
                this.getMedicalById(this.editData.file_id);
                this.startFormChanges();
            } else {
                this.startFormChanges();
            }
        } else {
            this.getListOfDrivers();
            this.medicalForm.get('driver').setValidators(Validators.required);
        }
    }

    private createForm() {
        this.medicalForm = this.formBuilder.group({
            driver: [null],
            issueDate: [null, Validators.required],
            expDate: [null, Validators.required],
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
                if (this.medicalForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.medicalForm);
                    return;
                }
                if (this.editData?.type === 'edit-medical') {
                    this.updateMedical();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addMedical();
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
                this.medicalForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.medicalForm
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

    private updateMedical() {
        const { issueDate, expDate, note } = this.medicalForm.value;
        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });
        const newData: any = {
            id: this.editData.file_id,
            issueDate: convertDateToBackend(issueDate),
            expDate: convertDateToBackend(expDate),
            note: note,
            files: documents ? documents : this.medicalForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.medicalService
            .updateMedical(newData)
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

    private addMedical() {
        const { issueDate, expDate, note } = this.medicalForm.value;
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
            expDate: convertDateToBackend(expDate),
            note: note,
            tableActiveTab: this.editData.tableActiveTab,
            files: documents,
        };

        this.medicalService
            .addMedical(newData)
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

    public getMedicalById(id: number) {
        this.medicalService
            .getMedicalById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: MedicalResponse) => {
                    this.medicalForm.patchValue({
                        issueDate: convertDateFromBackend(res.issueDate),
                        expDate: convertDateFromBackend(res.expDate),
                        note: res.note,
                        files: res.files.length
                            ? JSON.stringify(res.files)
                            : null,
                    });

                    this.documents = res.files ? (res.files as any) : [];
                    setTimeout(() => {
                        this.startFormChanges();
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'driver': {
                if (event) {
                    this.selectedDriver = event;
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
        this.formService.checkFormChange(this.medicalForm);
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
