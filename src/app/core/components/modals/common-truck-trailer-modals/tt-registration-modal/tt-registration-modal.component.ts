import { Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
    RegistrationModalResponse,
    RegistrationResponse,
} from 'appcoretruckassist';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { CommonTruckTrailerService } from '../common-truck-trailer.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { licensePlateValidation } from '../../../shared/ta-input/ta-input.regex-validations';
import { NotificationService } from '../../../../services/notification/notification.service';
import { FormService } from '../../../../services/form/form.service';
import {
    convertDateToBackend,
    convertDateFromBackend,
} from '../../../../utils/methods.calculations';
import { UpdateRegistrationCommand } from 'appcoretruckassist/model/updateRegistrationCommand';
import { CreateRegistrationCommand } from 'appcoretruckassist/model/createRegistrationCommand';

@Component({
    selector: 'app-tt-registration-modal',
    templateUrl: './tt-registration-modal.component.html',
    styleUrls: ['./tt-registration-modal.component.scss'],
    providers: [ModalService, FormService],
})
export class TtRegistrationModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() editData: any;

    public registrationForm: FormGroup;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public isFormDirty: boolean;

    public stateTypes: any[] = [];
    public selectedStateType: any = null;

    constructor(
        private formBuilder: FormBuilder,
        private commonTruckTrailerService: CommonTruckTrailerService,
        private notificationService: NotificationService,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
        if (this.editData.type === 'edit-registration') {
            this.editRegistrationById();
        }
    }

    private createForm() {
        this.registrationForm = this.formBuilder.group({
            licensePlate: [
                null,
                [Validators.required, ...licensePlateValidation],
            ],
            stateId: [null, Validators.required],
            issueDate: [null, Validators.required],
            expDate: [null, Validators.required],
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
                    });
                } else {
                    this.addRegistration();
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
        const documents = this.documents.map((item) => {
            return item.realFile;
        });
        const newData: UpdateRegistrationCommand = {
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
                    this.notificationService.success(
                        'Registration successfully updated.',
                        'Success:'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Registartion can't be updated.",
                        'Error:'
                    );
                },
            });
    }

    private addRegistration() {
        const { issueDate, expDate, ...form } = this.registrationForm.value;
        const documents = this.documents.map((item) => {
            return item.realFile;
        });
        const newData: CreateRegistrationCommand = {
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
            files: documents,
        };

        this.commonTruckTrailerService
            .addRegistration(newData, this.editData.tabSelected)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Registration successfully added.',
                        'Success:'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Registration can't be added.",
                        'Error:'
                    );
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

                    this.documents = res.files;
                    this.selectedStateType = res.state;
                },
                error: () => {
                    this.notificationService.error(
                        "Can't get registration.",
                        'Error:'
                    );
                },
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
                },
                error: () => {
                    this.notificationService.error(
                        "Can't get registration dropdowns!",
                        'Error'
                    );
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
