import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// services
import { DriverService } from '@pages/driver/services/driver.service';
import { DriverMvrService } from '@pages/driver/pages/driver-modals/driver-mvr-modal/services/driver-mvr.service';
import { ModalService } from '@shared/services/modal.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { FormService } from '@shared/services/form.service';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { DriverCdlModalComponent } from '@pages/driver/pages/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import {
    CaInputDropdownComponent,
    CaInputComponent,
    CaUploadFilesComponent,
    CaInputNoteComponent,
    CaModalComponent,
    CaModalButtonComponent,
} from 'ca-components';
// enums
import { DriverMVrModalStringEnum } from '@pages/driver/pages/driver-modals/driver-mvr-modal/enums/driver-mvrl-modal-string.enum';
import { ModalButtonType, ModalButtonSize } from '@shared/enums';

// models
import { EditData } from '@shared/models/edit-data.model';
import { ExtendedCdlMinimalResponse } from '@pages/driver/pages/driver-modals/driver-mvr-modal/models/extended-cdl-minimal-response.model';
import { MvrResponse } from 'appcoretruckassist';

// Pipes
import { FormatDatePipe } from '@shared/pipes';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-driver-mvr-modal',
    templateUrl: './driver-mvr-modal.component.html',
    styleUrls: ['./driver-mvr-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // componentS
        TaAppTooltipV2Component,
        CaModalComponent,
        CaModalButtonComponent,
        TaCustomCardComponent,

        CaInputDropdownComponent,
        CaInputComponent,
        CaUploadFilesComponent,
        CaInputNoteComponent,

        FormatDatePipe,
    ],
})
export class DriverMvrModalComponent implements OnInit, OnDestroy {
    @Input() editData: EditData;

    private destroy$ = new Subject<void>();

    public mvrForm: UntypedFormGroup;
    public mvr: MvrResponse;

    public isFormDirty: boolean = false;
    public isCardAnimationDisabled: boolean = false;

    public modalName: string;

    private driverStatus: number;

    // dropdowns
    public cdlsDropdownList: ExtendedCdlMinimalResponse[] = [];
    public selectedCdl: ExtendedCdlMinimalResponse;

    // documents
    public documents: any[] = [];
    public filesForDelete: any[] = [];
    public isFileModified: boolean = false;
    public svgRoutes = SharedSvgRoutes;

    private isAddNewCdl: boolean = false;
    public modalButtonType = ModalButtonType;
    public modalButtonSize = ModalButtonSize;
    public activeAction!: string;
    public taModalActionEnum = DriverMVrModalStringEnum;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private driverService: DriverService,
        private inputService: TaInputService,
        private modalService: ModalService,
        private mvrService: DriverMvrService,
        private formService: FormService,

        // bootstrap
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.isAddOrEdit();

        this.isNewCdlAdded();
    }

    private createForm(): void {
        this.mvrForm = this.formBuilder.group({
            issueDate: [null, Validators.required],
            cdlId: [null, Validators.required],
            note: [null],
            files: [null],
        });
    }

    private startFormChanges(): void {
        this.formService.checkFormChange(this.mvrForm);

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

            this.getMvrDropdowns(this.editData.id);

            if (this.editData.type === DriverMVrModalStringEnum.EDIT_MVR)
                this.getMVRById(this.editData.file_id);
        }
    }

    private isNewCdlAdded(): void {
        if (this.isAddNewCdl) this.getMvrDropdowns(this.editData.id);
    }

    public onModalAction(action: string): void {
        this.activeAction = action;

        switch (action) {
            case DriverMVrModalStringEnum.CLOSE:
                this.ngbActiveModal.close();
                break;
            case DriverMVrModalStringEnum.SAVE:
                if (this.mvrForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.mvrForm);

                    return;
                }

                if (this.editData?.type === DriverMVrModalStringEnum.EDIT_MVR) {
                    this.updateMVR();
                } else {
                    this.addMVR();
                }

                break;
            case DriverMVrModalStringEnum.DELETE:
                this.ngbActiveModal.close();

                const mappedEvent = {
                    data: {
                        ...this.mvr,
                        driverName: this.modalName,
                    },
                };

                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DriverMVrModalStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DriverMVrModalStringEnum.MVR,
                        type: DriverMVrModalStringEnum.DELETE,
                        image: false,
                    }
                );

                break;
            default:
                break;
        }
    }

    public onSelectDropdown(event: any): void {
        if (event?.canOpenModal) {
            this.isAddNewCdl = true;

            this.modalService.openModal(
                DriverCdlModalComponent,
                { size: DriverMVrModalStringEnum.SMALL },
                { id: this.editData?.id }
            );
        } else this.selectedCdl = event;
    }

    public onFilesEvent(event: any): void {
        this.documents = event.files;

        switch (event.action) {
            case DriverMVrModalStringEnum.ADD:
                this.mvrForm
                    .get(DriverMVrModalStringEnum.FILES)
                    .patchValue(JSON.stringify(event.files));

                break;
            case DriverMVrModalStringEnum.DELETE:
                this.mvrForm
                    .get(DriverMVrModalStringEnum.FILES)
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

    public getMvrDropdowns(id: number): void {
        this.mvrService
            .getMvrModal(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                const { cdls } = res;

                this.cdlsDropdownList = cdls.map((item) => {
                    return {
                        ...item,
                        name: item.cdlNumber,
                    };
                });

                if (this.cdlsDropdownList.length === 1) {
                    this.selectedCdl = this.cdlsDropdownList[0];

                    this.mvrForm
                        .get(DriverMVrModalStringEnum.MVR_ID)
                        .patchValue(this.selectedCdl.name);
                }

                if (this.isAddNewCdl) this.isAddNewCdl = false;

                this.startFormChanges();
            });
    }

    private getDriverById(id: number): void {
        this.driverService
            .getDriverById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((driver) => {
                const { firstName, lastName, status } = driver;

                this.driverStatus = status;

                this.modalName = firstName.concat(
                    DriverMVrModalStringEnum.EMPTY_STRING,
                    lastName
                );
            });
    }

    public getMVRById(id: number): void {
        this.mvrService
            .getMvrById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((mvr) => {
                const { cdlNumber, issueDate, note, files, cdlId } = mvr;

                this.mvr = mvr;

                this.mvrForm.patchValue({
                    cdlId: cdlNumber,
                    issueDate:
                        MethodsCalculationsHelper.convertDateFromBackend(
                            issueDate
                        ),
                    note,
                    files: files?.length ? JSON.stringify(files) : null,
                });

                this.selectedCdl = {
                    id: cdlId,
                    name: cdlNumber,
                };

                this.documents = files;

                setTimeout(() => {
                    this.startFormChanges();

                    this.isCardAnimationDisabled = false;
                }, 1000);
            });
    }

    private addMVR(): void {
        const { issueDate, note } = this.mvrForm.value;

        // documents
        let documents = [];

        this.documents.map((item) => {
            if (item.realFile) documents.push(item.realFile);
        });

        const newData = {
            driverId: this.editData?.id,
            driverStatus: this.driverStatus,
            issueDate:
                MethodsCalculationsHelper.convertDateToBackend(issueDate),
            cdlId: this.selectedCdl.id,
            files: documents,
            note,
        };

        this.mvrService
            .addMvr(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => this.ngbActiveModal.close(),
                error: () => (this.activeAction = null),
            });
    }

    private updateMVR(): void {
        const { issueDate, note } = this.mvrForm.value;

        // documents
        let documents = [];

        this.documents.map((item) => {
            if (item.realFile) documents.push(item.realFile);
        });

        const newData = {
            id: this.editData?.file_id,
            driverId: this.editData?.id,
            driverStatus: this.driverStatus,
            issueDate:
                MethodsCalculationsHelper.convertDateToBackend(issueDate),
            cdlId: this.selectedCdl.id,
            note: note,
            files: documents ? documents : this.mvrForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.mvrService
            .updateMvr(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => this.ngbActiveModal.close(),
                error: () => (this.activeAction = null),
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
