import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaInputService } from '../../../../../shared/components/ta-input/services/ta-input.service';
import { ModalService } from '../../../../../shared/components/ta-modal/services/modal.service';
import { CommonTruckTrailerService } from '../common-truck-trailer.service';
import { TitleModalResponse, TitleResponse } from 'appcoretruckassist';

import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../../../shared/services/form.service';
import { MethodsCalculationsHelper } from '../../../../../shared/utils/helpers/methods-calculations.helper';
import { CommonModule } from '@angular/common';
import { TaModalComponent } from '../../../../../shared/components/ta-modal/ta-modal.component';
import { TaInputComponent } from '../../../../../shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../../../../shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaCustomCardComponent } from '../../../../../shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '../../../../../shared/components/ta-input-note/ta-input-note.component';
import { TaUploadFilesComponent } from '../../../../../shared/components/ta-upload-files/ta-upload-files.component';

@Component({
    selector: 'app-tt-title-modal',
    templateUrl: './tt-title-modal.component.html',
    styleUrls: ['./tt-title-modal.component.scss'],
    providers: [FormService],
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
export class TtTitleModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public ttTitleForm: UntypedFormGroup;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public stateTypes: any[] = [];
    public selectedStateType: any = null;

    public isFormDirty: boolean = false;

    public disableCardAnimation: boolean = false;

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private commonTruckTrailerService: CommonTruckTrailerService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
    }

    private createForm() {
        this.ttTitleForm = this.formBuilder.group({
            number: [null, Validators.required],
            stateId: [null, Validators.required],
            purchaseDate: [null, Validators.required],
            issueDate: [null, Validators.required],
            note: [null],
            files: [null],
        });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
                // If Form not valid
                if (this.ttTitleForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.ttTitleForm);
                    return;
                }
                if (this.editData.type === 'edit-title') {
                    this.updateTitle();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addTitle();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            default: {
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
                this.ttTitleForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.ttTitleForm
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

    private addTitle() {
        const { issueDate, purchaseDate, ...form } = this.ttTitleForm.value;

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
            purchaseDate:
                MethodsCalculationsHelper.convertDateToBackend(purchaseDate),
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
            .addTitle(newData)
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

    private updateTitle() {
        const { issueDate, purchaseDate, ...form } = this.ttTitleForm.value;

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
            purchaseDate:
                MethodsCalculationsHelper.convertDateToBackend(purchaseDate),
            stateId: this.selectedStateType ? this.selectedStateType.id : null,
            files: documents ? documents : this.ttTitleForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.commonTruckTrailerService
            .updateTitle(newData)
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

    private editTitleById(id: number) {
        this.commonTruckTrailerService
            .getTitleById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: TitleResponse) => {
                    this.ttTitleForm.patchValue({
                        number: res.number,
                        stateId: res.state ? res.state.stateShortName : null,
                        purchaseDate: res.purchaseDate
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  res.purchaseDate
                              )
                            : null,
                        issueDate: res.issueDate
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  res.issueDate
                              )
                            : null,
                        note: res.note,
                        files: res.files.length
                            ? JSON.stringify(res.files)
                            : null,
                    });
                    this.selectedStateType = {
                        ...res.state,
                        name: res.state.stateShortName,
                    };
                    this.documents = res.files;
                    setTimeout(() => {
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private getModalDropdowns() {
        this.commonTruckTrailerService
            .getTitleModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: TitleModalResponse) => {
                    this.stateTypes = res.states.map((item) => {
                        return {
                            id: item.id,
                            name: item.stateShortName,
                            stateName: item.stateName,
                        };
                    });

                    if (this.editData.type === 'edit-title') {
                        this.disableCardAnimation = true;
                        this.editTitleById(this.editData.file_id);
                    }

                    if (this.editData && this.editData?.data) {
                        this.editData = {
                            ...this.editData,
                            payload: this.editData.data,
                        };
                    }

                    this.startFormChanges();
                },
                error: () => {},
            });
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.ttTitleForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
