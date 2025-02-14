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
import { AngularSvgIconModule } from 'angular-svg-icon';

// Bootstrap
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// models
import { InspectionResponse } from 'appcoretruckassist';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { TruckTrailerService } from '@shared/components/ta-shared-modals/truck-trailer-modals/services/truck-trailer.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';

// utils
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// components
import {
    CaInputComponent,
    CaInputDatetimePickerComponent,
    CaInputNoteComponent,
    CaModalComponent,
} from 'ca-components';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Enums
import { ActionTypesEnum } from '@pages/repair/pages/repair-modals/repair-shop-modal/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { LoadModalStringEnum } from '@pages/load/pages/load-modal/enums';
import { eFileFormControls, eGeneralActions } from '@shared/enums';

// Pipes
import { FormatDatePipe } from '@shared/pipes';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

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
        AngularSvgIconModule,
        NgbTooltipModule,

        // Component
        CaModalComponent,
        TaCustomCardComponent,
        CaInputNoteComponent,
        TaUploadFilesComponent,
        TaAppTooltipV2Component,
        CaInputDatetimePickerComponent,

        // Pipes
        FormatDatePipe,
    ],
})
export class TtFhwaInspectionModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public fhwaInspectionForm: UntypedFormGroup;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public isFormDirty: boolean;

    public isCardAnimationDisabled: boolean = false;

    private destroy$ = new Subject<void>();
    public svgRoutes = SharedSvgRoutes;
    public actionTypesEnum = ActionTypesEnum;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private TruckTrailerService: TruckTrailerService,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,
        private ngbActiveModal: NgbActiveModal,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.createForm();

        if (this.editData.type === 'edit-inspection') {
            this.isCardAnimationDisabled = true;
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

        this.confirmationData();
    }

    private confirmationData(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res.action !== TableStringEnum.CLOSE)
                    this.ngbActiveModal?.close();
            });
    }

    private createForm() {
        this.fhwaInspectionForm = this.formBuilder.group({
            issueDate: [null, Validators.required],
            note: [null],
            files: [null],
        });
    }

    public onModalAction(action: string) {
        switch (action) {
            case ActionTypesEnum.CLOSE:
                this.ngbActiveModal.close();
                break;
            case ActionTypesEnum.SAVE:
                // If Form not valid
                if (this.fhwaInspectionForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.fhwaInspectionForm);
                    return;
                }
                if (this.editData.type === 'edit-inspection') {
                    this.updateInspection();
                } else {
                    this.addInspection();
                }
                break;
            case ActionTypesEnum.DELETE:
                this.modalService.setProjectionModal({
                    action: LoadModalStringEnum.OPEN,
                    payload: {
                        value: null,
                        id: this.editData.file_id,
                        key: null,
                        data: this.editData,
                        template: TableStringEnum.INSPECTION_2,
                    },
                    type: LoadModalStringEnum.DELETE_2,
                    component: ConfirmationModalComponent,
                    size: LoadModalStringEnum.SMALL,
                });
                break;
            default:
                break;
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
                        this.isCardAnimationDisabled = false;
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
                next: () => this.ngbActiveModal.close(),
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
                next: () => this.ngbActiveModal.close(),
            });
    }

    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case eGeneralActions.ADD: {
                this.fhwaInspectionForm
                    .get(eFileFormControls.FILES)
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case eGeneralActions.DELETE: {
                this.fhwaInspectionForm
                    .get(eFileFormControls.FILES)
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
