import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// services
import { DriverService } from '@pages/driver/services/driver.service';
import { DriverMedicalService } from '@pages/driver/pages/driver-modals/driver-medical-modal/services/driver-medical.service';
import { ModalService } from '@shared/services/modal.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { FormService } from '@shared/services/form.service';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// enums
import { DriverMedicalModalStringEnum } from '@pages/driver/pages/driver-modals/driver-medical-modal/enums/driver-medical-modal-string.enum';

// models
import { EditData } from '@shared/models/edit-data.model';
import { MedicalResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-driver-medical-modal',
    templateUrl: './driver-medical-modal.component.html',
    styleUrls: ['./driver-medical-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // components
        TaAppTooltipV2Component,
        TaModalComponent,
        TaUploadFilesComponent,
        TaInputComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
    ],
})
export class DriverMedicalModalComponent implements OnInit, OnDestroy {
    @Input() editData: EditData;

    private destroy$ = new Subject<void>();

    public medicalForm: UntypedFormGroup;
    public medical: MedicalResponse;

    public isFormDirty: boolean;
    public isCardAnimationDisabled: boolean = false;

    public modalName: string;

    // documents
    public documents: any[] = [];
    public filesForDelete: any[] = [];
    public isFileModified: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private driverService: DriverService,
        private inputService: TaInputService,
        private medicalService: DriverMedicalService,
        private modalService: ModalService,
        private formService: FormService,

        // bootstrap
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.isAddOrEdit();
    }

    private createForm() {
        this.medicalForm = this.formBuilder.group({
            issueDate: [null, Validators.required],
            expDate: [null, Validators.required],
            note: [null],
            files: [null],
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

    private isAddOrEdit(): void {
        if (this.editData) {
            this.isCardAnimationDisabled = true;

            this.getDriverById(this.editData.id);

            if (
                this.editData.type === DriverMedicalModalStringEnum.EDIT_MEDICAL
            ) {
                this.getMedicalById(this.editData.file_id);
            } else {
                this.startFormChanges();
            }
        }
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case DriverMedicalModalStringEnum.CLOSE:
                break;
            case DriverMedicalModalStringEnum.SAVE:
                if (this.medicalForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.medicalForm);

                    return;
                }

                if (
                    this.editData?.type ===
                    DriverMedicalModalStringEnum.EDIT_MEDICAL
                ) {
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
            case DriverMedicalModalStringEnum.DELETE:
                this.ngbActiveModal.close();

                const mappedEvent = {
                    data: {
                        ...this.medical,
                        driverName: this.modalName,
                    },
                };

                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DriverMedicalModalStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DriverMedicalModalStringEnum.MEDICAL,
                        type: DriverMedicalModalStringEnum.DELETE,
                        image: false,
                        modalHeaderTitle:
                            DriverMedicalModalStringEnum.DELETE_MEDICAL_TITLE,
                    }
                );

                break;
            default:
                break;
        }
    }

    public onFilesEvent(event: any): void {
        this.documents = event.files;
        switch (event.action) {
            case DriverMedicalModalStringEnum.ADD:
                this.medicalForm
                    .get(DriverMedicalModalStringEnum.FILES)
                    .patchValue(JSON.stringify(event.files));

                break;
            case DriverMedicalModalStringEnum.DELETE:
                this.medicalForm
                    .get(DriverMedicalModalStringEnum.FILES)
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );

                if (event.deleteId) this.filesForDelete.push(event.deleteId);

                this.isFileModified = true;

                break;
            default:
                break;
        }
    }

    private getDriverById(id: number): void {
        this.driverService
            .getDriverById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                const { firstName, lastName } = res;

                this.modalName = firstName.concat(
                    DriverMedicalModalStringEnum.EMPTY_STRING,
                    lastName
                );
            });
    }

    public getMedicalById(id: number): void {
        this.medicalService
            .getMedicalById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((medical) => {
                const { issueDate, expDate, note, files } = medical;

                this.medical = medical;

                this.medicalForm.patchValue({
                    issueDate:
                        MethodsCalculationsHelper.convertDateFromBackend(
                            issueDate
                        ),
                    expDate:
                        MethodsCalculationsHelper.convertDateFromBackend(
                            expDate
                        ),
                    note,
                    files: files?.length ? JSON.stringify(files) : null,
                });

                this.documents = files;

                setTimeout(() => {
                    this.startFormChanges();

                    this.isCardAnimationDisabled = false;
                }, 1000);
            });
    }

    private addMedical(): void {
        const { issueDate, expDate, note } = this.medicalForm.value;

        // documents
        let documents = [];

        this.documents.map((item) => {
            if (item.realFile) documents.push(item.realFile);
        });

        const newData = {
            driverId: this.editData?.id,
            issueDate:
                MethodsCalculationsHelper.convertDateToBackend(issueDate),
            expDate: MethodsCalculationsHelper.convertDateToBackend(expDate),
            note,
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

    private updateMedical(): void {
        const { issueDate, expDate, note } = this.medicalForm.value;

        // documents
        let documents = [];

        this.documents.map((item) => {
            if (item.realFile) documents.push(item.realFile);
        });

        const newData = {
            id: this.editData.file_id,
            issueDate:
                MethodsCalculationsHelper.convertDateToBackend(issueDate),
            expDate: MethodsCalculationsHelper.convertDateToBackend(expDate),
            note,
            files: documents,
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
