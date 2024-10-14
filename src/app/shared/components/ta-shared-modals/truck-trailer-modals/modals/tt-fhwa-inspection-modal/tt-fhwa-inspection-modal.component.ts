import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

// models
import { InspectionResponse } from 'appcoretruckassist';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { TruckTrailerService } from '@shared/components/ta-shared-modals/truck-trailer-modals/services/truck-trailer.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';
import { DropDownService } from '@shared/services/drop-down.service';

// utils
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { DropActionNameHelper } from '@shared/utils/helpers/drop-action-name.helper';

// components
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';

// Enums
import { ActionTypesEnum } from '@pages/repair/pages/repair-modals/repair-shop-modal/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';

@Component({
    selector: 'app-tt-fhwa-inspection-modal',
    templateUrl: './tt-fhwa-inspection-modal.component.html',
    styleUrls: ['./tt-fhwa-inspection-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // Component
        TaModalComponent,
        TaInputComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
        TaUploadFilesComponent,
    ],
})
export class TtFhwaInspectionModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public fhwaInspectionForm: UntypedFormGroup;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public isFormDirty: boolean;

    public disableCardAnimation: boolean = false;

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private TruckTrailerService: TruckTrailerService,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,
        private dropDownService: DropDownService
    ) {}

    ngOnInit() {
        this.createForm();

        if (this.editData.type === 'edit-inspection') {
            this.disableCardAnimation = true;
            this.editInspectionById();
        } else {
            this.startFormChanges();
        }

        if (this.editData && this.editData?.data) {
            this.editData = {
                ...this.editData,
                payload: this.editData.data,
            };
        }
    }

    private createForm() {
        this.fhwaInspectionForm = this.formBuilder.group({
            issueDate: [null, Validators.required],
            note: [null],
            files: [null],
        });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case ActionTypesEnum.CLOSE: {
                break;
            }
            case ActionTypesEnum.SAVE: {
                // If Form not valid
                if (this.fhwaInspectionForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.fhwaInspectionForm);
                    return;
                }
                if (this.editData.type === 'edit-inspection') {
                    this.updateInspection();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addInspection();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            case ActionTypesEnum.DELETE: {
                data = {
                    ...this.editData.payload,
                    id: this.editData.file_id,
                };
                const name = DropActionNameHelper.dropActionNameTrailerTruck(
                    { type: TableStringEnum.DELETE_ITEM },
                    TableStringEnum.INSPECTION_2
                );
                this.modalService.setModalSpinner({
                    action: null,
                    status: true,
                    close: true,
                });
                this.dropDownService.dropActions(
                    data,
                    name,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    data,
                    TableStringEnum.TRAILER_2
                );
                break;
            }
            default: {
            }
        }
    }

    private editInspectionById() {
        this.TruckTrailerService.getInspectionById(this.editData.file_id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: InspectionResponse) => {
                    this.fhwaInspectionForm.patchValue({
                        issueDate:
                            MethodsCalculationsHelper.convertDateFromBackend(
                                res.issueDate
                            ),
                        note: res.note,
                        files: res.files.length
                            ? JSON.stringify(res.files)
                            : null,
                    });
                    this.documents = res.files;
                    setTimeout(() => {
                        this.disableCardAnimation = false;
                        this.startFormChanges();
                    }, 1000);
                },
                error: () => {},
            });
    }

    private updateInspection() {
        const { issueDate, ...form } = this.fhwaInspectionForm.value;
        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const newData: any = {
            ...form,
            issueDate:
                MethodsCalculationsHelper.convertDateToBackend(issueDate),
            id: this.editData.file_id,
            files: documents ? documents : this.fhwaInspectionForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.TruckTrailerService.updateInspection(newData)
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

    private addInspection() {
        const { issueDate, ...form } = this.fhwaInspectionForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const newData: any = {
            ...form,
            issueDate:
                MethodsCalculationsHelper.convertDateToBackend(issueDate),
            truckId:
                this.editData.modal === 'truck' ? this.editData.id : undefined,
            trailerId:
                this.editData.modal === 'trailer'
                    ? this.editData.id
                    : undefined,
            tabSelected: this.editData.tabSelected,
            files: documents,
        };
        this.TruckTrailerService.addInspection(
            newData,
            this.editData.tabSelected
        )
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

    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case 'add': {
                this.fhwaInspectionForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.fhwaInspectionForm
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

    private startFormChanges() {
        this.formService.checkFormChange(this.fhwaInspectionForm);
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
