import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    DriverListResponse,
    DriverResponse,
    MedicalResponse,
} from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { DriverTService } from '../../../driver/state/driver.service';
import { MedicalTService } from '../../../driver/state/medical.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { FormService } from '../../../../services/form/form.service';
import {
    convertDateToBackend,
    convertDateFromBackend,
} from '../../../../utils/methods.calculations';

@Component({
    selector: 'app-driver-medical-modal',
    templateUrl: './driver-medical-modal.component.html',
    styleUrls: ['./driver-medical-modal.component.scss'],
    providers: [ModalService, FormService],
})
export class DriverMedicalModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() editData: any;

    public medicalForm: FormGroup;

    public isFormDirty: boolean;

    public modalName: string;

    public documents: any[] = [];

    public selectedDriver: any = null;
    public labelsDrivers: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private driverService: DriverTService,
        private inputService: TaInputService,
        private medicalService: MedicalTService,
        private modalService: ModalService,
        private formService: FormService
    ) {}

    ngOnInit(): void {
        this.createForm();

        if (this.editData) {
            this.getDriverById(this.editData.id);

            if (this.editData.type === 'edit-medical') {
                this.getMedicalById(this.editData.file_id);
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

        this.formService.checkFormChange(this.medicalForm);
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
                    });
                } else {
                    this.addMedical();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
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
            .subscribe();
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
            files: documents,
        };

        this.medicalService
            .addMedical(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
