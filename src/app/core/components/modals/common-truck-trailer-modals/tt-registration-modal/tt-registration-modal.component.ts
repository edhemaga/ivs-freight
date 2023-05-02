import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import {
    RegistrationModalResponse,
    RegistrationResponse,
} from 'appcoretruckassist';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { CommonTruckTrailerService } from '../common-truck-trailer.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { licensePlateValidation } from '../../../shared/ta-input/ta-input.regex-validations';
import { FormService } from '../../../../services/form/form.service';
import {
    convertDateToBackend,
    convertDateFromBackend,
} from '../../../../utils/methods.calculations';
import { CommonModule } from '@angular/common';
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';
import { TaInputComponent } from '../../../shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaCustomCardComponent } from '../../../shared/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '../../../shared/ta-input-note/ta-input-note.component';
import { TaUploadFilesComponent } from '../../../shared/ta-upload-files/ta-upload-files.component';

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
        TaInputComponent,
        TaInputDropdownComponent,
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

    constructor(
        private formBuilder: UntypedFormBuilder,
        private commonTruckTrailerService: CommonTruckTrailerService,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
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

        this.formService.checkFormChange(this.registrationForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
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
            }
            default: {
                break;
            }
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
            issueDate: convertDateToBackend(issueDate),
            expDate: convertDateToBackend(expDate),
            stateId: this.selectedStateType ? this.selectedStateType.id : null,
            files: documents ? documents : this.registrationForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.commonTruckTrailerService
            .updateRegistration(newData)
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
            issueDate: convertDateToBackend(issueDate),
            expDate: convertDateToBackend(expDate),
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

        this.commonTruckTrailerService
            .addRegistration(newData)
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
        this.commonTruckTrailerService
            .getRegistrationById(this.editData.file_id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RegistrationResponse) => {
                    this.registrationForm.patchValue({
                        issueDate: convertDateFromBackend(res.issueDate),
                        expDate: convertDateFromBackend(res.expDate),
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
        this.commonTruckTrailerService
            .getRegistrationModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RegistrationModalResponse) => {
                    this.stateTypes = res.states.map((item) => {
                        return {
                            id: item.id,
                            name: item.stateShortName,
                            stateName: item.stateName,
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
