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

//Services
import { DriverCdlService } from '@pages/driver/pages/driver-modals/driver-cdl-modal/services/driver-cdl.service';
import { DriverService } from '@pages/driver/services/driver.service';
import { ModalService } from '@shared/services/modal.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { FormService } from '@shared/services/form.service';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import {
    CaInputComponent,
    CaInputDropdownComponent,
    CaInputNoteComponent,
    CaUploadFilesComponent,
    CaModalButtonComponent,
    CaModalComponent,
    CaInputDatetimePickerComponent,
    eModalButtonClassType,
    eModalButtonSize,
} from 'ca-components';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// validations
import {
    cdlCANADAValidation,
    cdlUSValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// enums
import { DriverCdlModalStringEnum } from '@pages/driver/pages/driver-modals/driver-cdl-modal/enums/driver-cdl-modal-string.enum';

// config
import { CdlModalUploadFilesConfig } from '@pages/driver/pages/driver-modals/driver-cdl-modal/utils/config';

// models
import {
    CdlEndorsementResponse,
    CdlResponse,
    CdlRestrictionResponse,
    EnumValue,
    GetCdlModalResponse,
    StateResponse,
} from 'appcoretruckassist';
import { ExtendedStateResponse } from '@pages/driver/pages/driver-modals/driver-cdl-modal/models/extended-state-response.model';
import { EditData } from '@shared/models/edit-data.model';
import { FileEvent } from '@shared/models';
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Pipes
import { FormatDatePipe } from '@shared/pipes';

@Component({
    selector: 'app-driver-cdl-modal',
    templateUrl: './driver-cdl-modal.component.html',
    styleUrls: ['./driver-cdl-modal.component.scss'],
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
        TaAppTooltipV2Component,
        CaModalComponent,
        CaInputComponent,
        TaCustomCardComponent,
        CaInputDropdownComponent,
        CaInputComponent,
        CaUploadFilesComponent,
        CaInputNoteComponent,
        CaModalButtonComponent,
        CaInputDatetimePickerComponent,

        FormatDatePipe,
    ],
})
export class DriverCdlModalComponent implements OnInit, OnDestroy {
    @Input() editData: EditData;

    private destroy$ = new Subject<void>();

    public cdlForm: UntypedFormGroup;
    public cdl: CdlResponse;

    public isFormDirty: boolean;
    public isCardAnimationDisabled: boolean = false;

    public modalName: string;

    private driverStatus: number;

    public uploadFilesConfig =
        CdlModalUploadFilesConfig.CDL_MODAL_UPLOAD_FILES_CONFIG;

    // dropdowns
    public stateDropdownList: StateResponse[] = [];
    public classDropdownList: EnumValue[] = [];
    public restrictionsDropdownList: CdlRestrictionResponse[] = [];
    public endorsementsDropdownList: CdlEndorsementResponse[] = [];

    public selectedCountry: string;
    public selectedState: ExtendedStateResponse;
    public selectedClass: EnumValue;
    public selectedRestrictions: CdlRestrictionResponse[] = [];
    public selectedEndorsments: CdlEndorsementResponse[] = [];

    // documents
    public documents: any[] = [];
    public filesForDelete: any[] = [];
    public isFileModified: boolean = false;

    public taModalActionEnum = DriverCdlModalStringEnum;
    public svgRoutes = SharedSvgRoutes;
    public eModalButtonClassType = eModalButtonClassType;
    public eModalButtonSize = eModalButtonSize;
    public activeAction!: string;
    public data: CdlResponse;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private driverService: DriverService,
        private cdlService: DriverCdlService,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,

        // bootstrap
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getCdlDropdowns();

        this.getDriverById(this.editData.id);
    }

    private createForm() {
        this.cdlForm = this.formBuilder.group({
            stateId: [null, Validators.required],
            cdlNumber: [null, [Validators.required]],
            classType: [null, Validators.required],
            issueDate: [null, Validators.required],
            expDate: [null, Validators.required],
            restrictions: [null],
            restrictionsHelper: [null],
            endorsements: [null],
            endorsementsHelper: [null],
            note: [null],
            files: [null],
        });
    }

    private startFormChanges(): void {
        this.formService.checkFormChange(this.cdlForm);

        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public onModalAction(action: string): void {
        if (this.cdlForm.valid && this.isFormDirty) this.activeAction = action;

        switch (action) {
            case DriverCdlModalStringEnum.CLOSE:
                this.ngbActiveModal.close();
                break;
            case DriverCdlModalStringEnum.SAVE:
                if (this.cdlForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.cdlForm);

                    return;
                }

                if (
                    this.editData.type === DriverCdlModalStringEnum.EDIT_LICENCE
                ) {
                    this.updateCdl();
                } else {
                    this.addCdl();
                }

                break;
            case DriverCdlModalStringEnum.DELETE:
                this.ngbActiveModal.close();

                const mappedEvent = {
                    data: {
                        ...this.cdl,
                        driverName: this.modalName,
                    },
                };

                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DriverCdlModalStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DriverCdlModalStringEnum.CDL,
                        type: DriverCdlModalStringEnum.DELETE,
                        image: false,
                        modalHeaderTitle:
                            DriverCdlModalStringEnum.DELETE_CDL_TITLE,
                    }
                );

                break;
            case DriverCdlModalStringEnum.VOID:
                this.ngbActiveModal.close();

                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DriverCdlModalStringEnum.SMALL },
                    {
                        data: {
                            ...this.cdl,
                            state: this.cdl.state.stateShortName,
                            driverName: this.modalName,
                        },
                        template: DriverCdlModalStringEnum.CDL,
                        type: DriverCdlModalStringEnum.INFO,
                        subType: DriverCdlModalStringEnum.VOID_CDL,
                        modalHeader: true,
                        modalHeaderTitle: DriverCdlModalStringEnum.VOID_CDL_2,
                    }
                );

                break;
            default:
                break;
        }
    }

    public onSelectDropdown(event: any, action: string): void {
        switch (action) {
            case DriverCdlModalStringEnum.CLASS:
                this.selectedClass = event;

                break;
            case DriverCdlModalStringEnum.STATE:
                this.selectedState = event;

                break;
            case DriverCdlModalStringEnum.RESTRICTIONS:
                this.selectedRestrictions = event;

                this.cdlForm
                    .get(DriverCdlModalStringEnum.RESTRICTIONS_HELPER)
                    .setValue(
                        this.selectedRestrictions?.length
                            ? JSON.stringify(this.selectedRestrictions)
                            : null
                    );

                break;
            case DriverCdlModalStringEnum.ENDORSEMENTS:
                this.selectedEndorsments = event;

                this.cdlForm
                    .get(DriverCdlModalStringEnum.ENDORSEMENTS_HELPER)
                    .setValue(
                        this.selectedEndorsments?.length
                            ? JSON.stringify(this.selectedEndorsments)
                            : null
                    );

                break;
            default:
                break;
        }
    }

    public onFilesEvent(event: FileEvent): void {
        this.documents = event.files;

        switch (event.action) {
            case DriverCdlModalStringEnum.ADD:
                this.cdlForm
                    .get(DriverCdlModalStringEnum.FILES)
                    .patchValue(JSON.stringify(event.files));

                break;
            case DriverCdlModalStringEnum.DELETE:
                this.cdlForm
                    .get(DriverCdlModalStringEnum.FILES)
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

    private getCdlDropdowns(): void {
        this.cdlService
            .getCdlDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: GetCdlModalResponse) => {
                const {
                    country,
                    states,
                    classTypes,
                    restrictions,
                    endorsements,
                } = res;

                // country
                this.selectedCountry = country?.name;

                // state
                this.stateDropdownList = states?.map((item) => {
                    return {
                        id: item.id,
                        name: item.stateShortName,
                        stateName: item.stateName,
                    };
                });

                // class
                this.classDropdownList = classTypes;

                // restrictions & endorsements
                this.restrictionsDropdownList = restrictions?.map((item) => {
                    return {
                        ...item,
                        name: item.code
                            .concat(' ', '-')
                            .concat(' ', item.description),
                    };
                });

                this.endorsementsDropdownList = endorsements?.map((item) => {
                    return {
                        ...item,
                        name: item.code
                            .concat(' ', '-')
                            .concat(' ', item.description),
                    };
                });

                // cdl number validations
                const validators =
                    this.selectedCountry === DriverCdlModalStringEnum.US
                        ? cdlUSValidation
                        : cdlCANADAValidation;

                this.inputService.changeValidators(
                    this.cdlForm.get(DriverCdlModalStringEnum.CDL_NUMBER),
                    true,
                    [...validators]
                );

                if (
                    this.editData.type === DriverCdlModalStringEnum.EDIT_LICENCE
                ) {
                    this.isCardAnimationDisabled = true;

                    this.getCdlById(this.editData.file_id);
                } else if (
                    this.editData.type ===
                    DriverCdlModalStringEnum.RENEW_LICENCE
                ) {
                    this.isCardAnimationDisabled = true;

                    this.populateCdlFormOnRenew(this.editData.renewData.id);
                } else {
                    this.startFormChanges();
                }
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
                    DriverCdlModalStringEnum.EMPTY_STRING,
                    lastName
                );
            });
    }

    public getCdlById(id: number): void {
        this.cdlService
            .getCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (cdl) => {
                    const {
                        cdlNumber,
                        issueDate,
                        expDate,
                        classType,
                        state,
                        cdlRestrictions,
                        cdlEndorsements,
                        files,
                        note,
                    } = cdl;

                    this.cdl = cdl;

                    // state
                    this.selectedState = {
                        ...state,
                        name: state?.stateShortName,
                    };

                    // class
                    this.selectedClass = classType;

                    // restrictions & endorsements
                    this.selectedRestrictions = cdlRestrictions.map((item) => {
                        return {
                            ...item,
                            name: item.code
                                .concat(' ', '-')
                                .concat(' ', item.description),
                        };
                    });

                    this.selectedEndorsments = cdlEndorsements.map((item) => {
                        return {
                            ...item,
                            name: item.code
                                .concat(' ', '-')
                                .concat(' ', item.description),
                        };
                    });

                    // documents
                    this.documents = files ?? [];

                    // patch form
                    this.cdlForm.patchValue({
                        cdlNumber,
                        issueDate: issueDate
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  issueDate
                              )
                            : null,
                        expDate: expDate
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  expDate
                              )
                            : expDate,
                        classType: classType?.name,
                        stateId: state?.stateShortName,
                        restrictionsHelper: cdlRestrictions?.length
                            ? JSON.stringify(cdlRestrictions)
                            : null,
                        endorsementsHelper: cdlEndorsements?.length
                            ? JSON.stringify(cdlEndorsements)
                            : null,
                        files: files?.length ? JSON.stringify(files) : null,
                        note,
                    });

                    this.data = cdl;

                    setTimeout(() => {
                        this.isCardAnimationDisabled = false;

                        this.startFormChanges();
                    }, 1000);
                },
                error: () => {},
            });
    }

    public addCdl(): void {
        const {
            // eslint-disable-next-line no-unused-vars
            endorsementsHelper, // eslint-disable-next-line no-unused-vars
            restrictionsHelper, // eslint-disable-next-line no-unused-vars
            files, // eslint-disable-next-line no-unused-vars
            stateId,
            issueDate,
            expDate,
            ...form
        } = this.cdlForm.value;

        // documents
        let documents = [];

        this.documents.map((item) => {
            if (item.realFile) documents.push(item.realFile);
        });

        const newData = {
            ...form,

            driverId: this.editData?.id,
            driverStatus: this.driverStatus,
            stateId: this.selectedState.id,
            issueDate:
                MethodsCalculationsHelper.convertDateToBackend(issueDate),
            expDate: MethodsCalculationsHelper.convertDateToBackend(expDate),
            restrictions: this.selectedRestrictions
                ? this.selectedRestrictions.map((item) => item.id)
                : [],
            endorsements: this.selectedEndorsments
                ? this.selectedEndorsments.map((item) => item.id)
                : [],
            files: documents,
        };

        if (this.editData.type === DriverCdlModalStringEnum.RENEW_LICENCE) {
            // eslint-disable-next-line no-unused-vars
            const renewData = {
                ...newData,
                id: this.editData?.renewData?.id,
            };

            this.cdlService
                .renewCdlUpdate(renewData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => this.ngbActiveModal.close(),
                    error: () => (this.activeAction = null),
                });
        } else {
            this.cdlService
                .addCdl(newData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.ngbActiveModal.close();
                    },
                    error: () => (this.activeAction = null),
                });
        }
    }

    public updateCdl(): void {
        const {
            // eslint-disable-next-line no-unused-vars
            endorsementsHelper, // eslint-disable-next-line no-unused-vars
            restrictionsHelper, // eslint-disable-next-line no-unused-vars
            files, // eslint-disable-next-line no-unused-vars
            stateId,
            issueDate,
            expDate,
            ...form
        } = this.cdlForm.value;

        // documents
        let documents = [];

        this.documents.map((item) => {
            if (item.realFile) documents.push(item.realFile);
        });

        const newData = {
            ...form,

            id: this.editData.file_id,
            driverId: this.editData?.id,
            driverStatus: this.driverStatus,
            stateId: this.selectedState.id,
            issueDate:
                MethodsCalculationsHelper.convertDateToBackend(issueDate),
            expDate: MethodsCalculationsHelper.convertDateToBackend(expDate),
            restrictions: this.selectedRestrictions
                ? this.selectedRestrictions.map((item) => item.id)
                : [],
            endorsements: this.selectedEndorsments
                ? this.selectedEndorsments.map((item) => item.id)
                : [],
            files: documents,
            filesForDeleteIds: this.filesForDelete,
        };

        this.cdlService
            .updateCdl(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
                },
                error: () => (this.activeAction = null),
            });
    }

    public populateCdlFormOnRenew(id: number): void {
        this.cdlService
            .getCdlById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CdlResponse) => {
                    this.cdlForm.patchValue({
                        cdlNumber: res.cdlNumber,
                        issueDate: null,
                        expDate: null,
                        classType: res.classType.name,
                        stateId: res.state.stateShortName,
                        restrictions: null,
                        restrictionsHelper: res.cdlRestrictions.length
                            ? JSON.stringify(res.cdlRestrictions)
                            : null,
                        endorsements: null,
                        endorsementsHelper: res.cdlEndorsements.length
                            ? JSON.stringify(res.cdlEndorsements)
                            : null,
                        note: res.note,
                        files: res.files.length
                            ? JSON.stringify(res.files)
                            : null,
                    });

                    this.documents = res.files ? (res.files as any) : [];

                    this.selectedEndorsments = res.cdlEndorsements.map(
                        (item) => {
                            return {
                                ...item,
                                name: item.code
                                    .concat(' ', '-')
                                    .concat(' ', item.description),
                            };
                        }
                    );

                    this.selectedRestrictions = res.cdlRestrictions.map(
                        (item) => {
                            return {
                                ...item,
                                name: item.code
                                    .concat(' ', '-')
                                    .concat(' ', item.description),
                            };
                        }
                    );

                    this.selectedClass = res.classType;
                    this.selectedState = {
                        ...res.state,
                        name: res.state.stateShortName,
                    };
                    setTimeout(() => {
                        this.isCardAnimationDisabled = false;
                        this.startFormChanges();
                    }, 1000);
                },
                error: () => {},
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
