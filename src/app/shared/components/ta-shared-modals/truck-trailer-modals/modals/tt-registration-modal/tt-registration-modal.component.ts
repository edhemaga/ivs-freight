import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// Bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// models
import {
    RegistrationModalResponse,
    RegistrationResponse,
} from 'appcoretruckassist';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { TruckTrailerService } from '@shared/components/ta-shared-modals/truck-trailer-modals/services/truck-trailer.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service'; 
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';

// validations
import { licensePlateValidation } from '@shared/components/ta-input/validators/ta-input.regex-validations';

// utils
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
 
// components
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { CaInputComponent, CaInputDropdownComponent } from 'ca-components';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

//enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ActionTypesEnum } from '@pages/repair/pages/repair-modals/repair-shop-modal/enums';
import { LoadModalStringEnum } from '@pages/load/pages/load-modal/enums';

@Component({
    selector: 'app-tt-registration-modal',
    templateUrl: './tt-registration-modal.component.html',
    styleUrls: ['./tt-registration-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // Component
        TaModalComponent,
        CaInputComponent,
        CaInputDropdownComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
        TaUploadFilesComponent,
    ],
})
export class TtRegistrationModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public registrationForm: UntypedFormGroup;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public isFormDirty: boolean;

    public stateTypes: any[] = [];
    public selectedStateType: any = null;

    public disableCardAnimation: boolean = false;

    public registrationExpirationDate: boolean = false;

    private destroy$ = new Subject<void>();

    public logoStateRoutes: string = TableStringEnum.ASSETS_SVG_COMMON_STATES;

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
        this.getModalDropdowns();
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
        this.registrationForm = this.formBuilder.group({
            licensePlate: [
                null,
                [Validators.required, ...licensePlateValidation],
            ],
            stateId: [null, Validators.required],
            issueDate: [null, Validators.required],
            expDate: [null],
            note: [null],
            files: [null],
        });
    }

    public onModalAction(data: { action: string }) {
        switch (data.action) {
            case ActionTypesEnum.CLOSE:
                break;
            case ActionTypesEnum.SAVE:
                // If Form not valid
                if (this.registrationForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.registrationForm);
                    return;
                }
                if (this.editData.type === 'edit-registration') {
                    this.updateRegistration();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addRegistration();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
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
                        template: TableStringEnum.REGISTRATION_2,
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

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'state': {
                this.selectedStateType = event;
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
                this.registrationForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.registrationForm
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

    private updateRegistration() {
        const { issueDate, expDate, ...form } = this.registrationForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const newData: any = {
            id: this.editData.file_id,
            ...form,
            issueDate:
                MethodsCalculationsHelper.convertDateToBackend(issueDate),
            expDate: MethodsCalculationsHelper.convertDateToBackend(expDate),
            stateId: this.selectedStateType ? this.selectedStateType.id : null,
            files: documents ? documents : this.registrationForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.TruckTrailerService.updateRegistration(newData)
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

    private addRegistration() {
        const { issueDate, expDate, ...form } = this.registrationForm.value;

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
            expDate: expDate
                ? MethodsCalculationsHelper.convertDateToBackend(expDate)
                : null,
            stateId: this.selectedStateType ? this.selectedStateType.id : null,
            trailerId:
                this.editData.modal === 'trailer'
                    ? this.editData.id
                    : undefined,
            truckId:
                this.editData.modal === 'truck' ? this.editData.id : undefined,
            tabSelected: this.editData.tabSelected,
            files: documents,
        };

        this.TruckTrailerService.addRegistration(newData)
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

    private editRegistrationById() {
        this.TruckTrailerService.getRegistrationById(this.editData.file_id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RegistrationResponse) => {
                    this.registrationForm.patchValue({
                        issueDate:
                            MethodsCalculationsHelper.convertDateFromBackend(
                                res.issueDate
                            ),
                        expDate:
                            MethodsCalculationsHelper.convertDateFromBackend(
                                res.expDate
                            ),
                        licensePlate: res.licensePlate,
                        stateId: res.state ? res.state.stateShortName : null,
                        note: res.note,
                        files: res.files.length
                            ? JSON.stringify(res.files)
                            : null,
                    });

                    this.registrationExpirationDate = !!res.expDate;

                    this.documents = res.files;
                    this.selectedStateType = {
                        ...res.state,
                        name: res.state.stateShortName,
                    };
                    setTimeout(() => {
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private getModalDropdowns() {
        this.TruckTrailerService.getRegistrationModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RegistrationModalResponse) => {
                    this.stateTypes = res.states.map((item) => {
                        return {
                            id: item.id,
                            name:
                                item.stateShortName +
                                ' (' +
                                item.stateName +
                                ')',
                            stateName: item.stateName,
                            folder: 'common',
                            subFolder: 'states',
                            logoName:
                                item.stateName.toLowerCase().replace(' ', '_') +
                                '.svg',
                        };
                    });
                    if (this.editData.type === 'edit-registration') {
                        this.disableCardAnimation = true;
                        this.editRegistrationById();
                    }

                    if (this.editData && this.editData?.data) {
                        this.editData = {
                            ...this.editData,
                            payload: this.editData.data,
                        };
                    }

                    if (this.editData?.modal) {
                        if (this.editData.modal === 'truck') {
                            this.inputService.changeValidators(
                                this.registrationForm.get('expDate')
                            );
                            this.registrationExpirationDate = true;
                        } else {
                            this.inputService.changeValidators(
                                this.registrationForm.get('expDate'),
                                false
                            );
                        }
                    }
                    this.startFormChanges();
                },
                error: () => {},
            });
    }

    public onAction() {
        this.registrationExpirationDate = !this.registrationExpirationDate;

        this.inputService.changeValidators(
            this.registrationForm.get('expDate'),
            this.registrationExpirationDate ? true : false
        );
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.registrationForm);
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
