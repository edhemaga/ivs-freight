import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { CommonTruckTrailerService } from '../common-truck-trailer.service';
import { TitleModalResponse, TitleResponse } from 'appcoretruckassist';

import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../../services/form/form.service';
import {
    convertDateToBackend,
    convertDateFromBackend,
} from '../../../../utils/methods.calculations';

@Component({
    selector: 'app-tt-title-modal',
    templateUrl: './tt-title-modal.component.html',
    styleUrls: ['./tt-title-modal.component.scss'],
    providers: [FormService],
})
export class TtTitleModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() editData: any;

    public ttTitleForm: FormGroup;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public stateTypes: any[] = [];
    public selectedStateType: any = null;

    public isFormDirty: boolean = false;

    public disableCardAnimation: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private commonTruckTrailerService: CommonTruckTrailerService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();

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

        this.formService.checkFormChange(this.ttTitleForm);
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
                if (this.ttTitleForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.ttTitleForm);
                    return;
                }
                if (this.editData.type === 'edit-title') {
                    this.updateTitle();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                } else {
                    this.addTitle();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
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
            issueDate: convertDateToBackend(issueDate),
            purchaseDate: convertDateToBackend(purchaseDate),
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
            .subscribe();
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
            issueDate: convertDateToBackend(issueDate),
            purchaseDate: convertDateToBackend(purchaseDate),
            stateId: this.selectedStateType ? this.selectedStateType.id : null,
            files: documents ? documents : this.ttTitleForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.commonTruckTrailerService
            .updateTitle(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
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
                            ? convertDateFromBackend(res.purchaseDate)
                            : null,
                        issueDate: res.issueDate
                            ? convertDateFromBackend(res.issueDate)
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
                },
                error: () => {},
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
