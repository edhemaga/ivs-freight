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
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// services
import { DriverService } from '@pages/driver/services/driver.service';
import { DriverDrugAlcoholTestService } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/services/driver-drug-alcohol-test.service';
import { ModalService } from '@shared/services/modal.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { FormService } from '@shared/services/form.service';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import {
    CaInputDropdownComponent,
    CaInputComponent,
    CaUploadFilesComponent,
    CaInputNoteComponent,
    CaModalComponent,
    CaModalButtonComponent,
} from 'ca-components';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// enums
import { DriverDrugAlcoholTestModalStringEnum } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/enums/driver-drug-alcohol-test-modal-string.enum';

// models
import { EnumValue, TestResponse } from 'appcoretruckassist';
import { EditData } from '@shared/models/edit-data.model';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Pipes
import { FormatDatePipe } from '@shared/pipes';

// Enums
import { ModalButtonType, ModalButtonSize } from '@shared/enums';

@Component({
    selector: 'app-driver-drug-alcohol-test-modal',
    templateUrl: './driver-drug-alcohol-test-modal.component.html',
    styleUrls: ['./driver-drug-alcohol-test-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // components
        TaAppTooltipV2Component,
        CaModalComponent,
        CaModalButtonComponent,
        TaCustomCardComponent,

        CaInputDropdownComponent,
        CaInputComponent,
        CaUploadFilesComponent,
        CaInputNoteComponent,

        // Pipes
        FormatDatePipe,
    ],
})
export class DriverDrugAlcoholTestModalComponent implements OnInit, OnDestroy {
    @Input() editData: EditData;

    private destroy$ = new Subject<void>();

    public drugForm: UntypedFormGroup;
    public test: TestResponse;

    public isFormDirty: boolean;
    public isCardAnimationDisabled: boolean = false;

    public modalName: string;

    private driverStatus: number;

    // dropdowns
    public testTypesDropdownList: EnumValue[] = [];
    public testReasonsDropdownList: EnumValue[] = [];
    public testResultsDropdownList: EnumValue[] = [];
    public testReasonDropdownStatic: EnumValue[] = [];
    public testReasonDropdownAlcohol: EnumValue[] = [];

    public selectedTestType: EnumValue;
    public selectedTestReason: EnumValue;
    public selectedTestResult: EnumValue;

    // documents
    public documents: any[] = [];
    public filesForDelete: any[] = [];
    public isFileModified: boolean = false;
    public svgRoutes = SharedSvgRoutes;
    public modalButtonType = ModalButtonType;
    public modalButtonSize = ModalButtonSize;
    public activeAction!: string;
    public taModalActionEnums = DriverDrugAlcoholTestModalStringEnum;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private driverService: DriverService,
        private testService: DriverDrugAlcoholTestService,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,

        // bootstrap
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getDrugAlcoholDropdowns();
    }

    private createForm(): void {
        this.drugForm = this.formBuilder.group({
            testingDate: [null, Validators.required],
            testType: [null, Validators.required],
            testReasonId: [null, Validators.required],
            result: [null, Validators.required],
            note: [null],
            files: [null],
        });
    }

    private startFormChanges(): void {
        this.formService.checkFormChange(this.drugForm);

        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public onModalAction(action: string): void {
        this.activeAction = action;
        switch (action) {
            case DriverDrugAlcoholTestModalStringEnum.CLOSE:
                this.ngbActiveModal.close();
                break;
            case DriverDrugAlcoholTestModalStringEnum.SAVE:
                if (this.drugForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.drugForm);

                    return;
                }

                if (
                    this.editData?.type ===
                    DriverDrugAlcoholTestModalStringEnum.EDIT_DRUG
                ) {
                    this.updateTest();
                } else {
                    this.addTest();
                }

                break;
            case DriverDrugAlcoholTestModalStringEnum.DELETE:
                this.ngbActiveModal.close();

                const mappedEvent = {
                    data: {
                        ...this.test,
                        driverName: this.modalName,
                        reasonName: this.test.testReason.name,
                    },
                };

                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DriverDrugAlcoholTestModalStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DriverDrugAlcoholTestModalStringEnum.TEST,
                        type: DriverDrugAlcoholTestModalStringEnum.DELETE,
                        image: false,
                        modalHeaderTitle:
                            DriverDrugAlcoholTestModalStringEnum.DELETE_TEST_TITLE,
                    }
                );

                break;
            default:
                break;
        }
    }

    public onSelectDropdown(event: any, action: string): void {
        switch (action) {
            case DriverDrugAlcoholTestModalStringEnum.TEST:
                this.selectedTestType = event;

                this.testReasonsDropdownList =
                    event.name === DriverDrugAlcoholTestModalStringEnum.DRUG
                        ? this.testReasonDropdownStatic
                        : this.testReasonDropdownAlcohol;

                if (
                    this.selectedTestReason?.name ===
                    DriverDrugAlcoholTestModalStringEnum.PRE_EMPLOYMENT
                ) {
                    this.selectedTestReason = null;
                    this.drugForm
                        .get(
                            DriverDrugAlcoholTestModalStringEnum.TEST_REASON_ID
                        )
                        .setValue(null);
                }

                break;
            case DriverDrugAlcoholTestModalStringEnum.REASON:
                this.selectedTestReason = event;

                break;
            case DriverDrugAlcoholTestModalStringEnum.RESULT:
                this.selectedTestResult = event;

                break;
            default:
                break;
        }
    }

    public onFilesEvent(event: any): void {
        this.documents = event.files;

        switch (event.action) {
            case DriverDrugAlcoholTestModalStringEnum.ADD:
                this.drugForm
                    .get(DriverDrugAlcoholTestModalStringEnum.FILES)
                    .patchValue(JSON.stringify(event.files));

                break;
            case DriverDrugAlcoholTestModalStringEnum.DELETE:
                this.drugForm
                    .get(DriverDrugAlcoholTestModalStringEnum.FILES)
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

    private getDrugAlcoholDropdowns(): void {
        this.testService
            .getTestDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                const { types, reasons, results } = res;

                this.testTypesDropdownList = types;
                this.testReasonsDropdownList = reasons;
                this.testResultsDropdownList = results;
                this.testReasonDropdownStatic = reasons;

                this.testReasonDropdownAlcohol =
                    this.testReasonDropdownStatic.filter(
                        (item) =>
                            item.name !==
                            DriverDrugAlcoholTestModalStringEnum.PRE_EMPLOYMENT
                    );

                if (this.editData) {
                    this.startFormChanges();

                    this.isCardAnimationDisabled = true;

                    this.getDriverById(this.editData.id);

                    if (
                        this.editData.type ===
                        DriverDrugAlcoholTestModalStringEnum.EDIT_DRUG
                    )
                        this.getTestById(this.editData.file_id);
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
                    DriverDrugAlcoholTestModalStringEnum.EMPTY_STRING,
                    lastName
                );
            });
    }

    public getTestById(id: number): void {
        this.testService
            .getTestById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((test) => {
                const {
                    testingDate,
                    testType,
                    testReason,
                    result,
                    files,
                    note,
                } = test;

                this.test = test;

                this.drugForm.patchValue({
                    testingDate:
                        MethodsCalculationsHelper.convertDateFromBackend(
                            testingDate
                        ),
                    testType: testType?.name,
                    testReasonId: testReason?.name,
                    result: result?.name,

                    files: files?.length ? JSON.stringify(files) : null,
                    note,
                });

                this.selectedTestType = testType;
                this.selectedTestReason = testReason;
                this.selectedTestResult = result;

                this.testReasonsDropdownList =
                    testType?.name === DriverDrugAlcoholTestModalStringEnum.DRUG
                        ? this.testReasonDropdownStatic
                        : this.testReasonDropdownAlcohol;

                this.documents = files;

                setTimeout(() => {
                    this.isCardAnimationDisabled = false;

                    this.startFormChanges();
                }, 1000);
            });
    }

    public addTest(): void {
        const { testingDate, note } = this.drugForm.value;

        // documents
        let documents = [];

        this.documents.map((item) => {
            if (item.realFile) documents.push(item.realFile);
        });

        const newData = {
            driverId: this.editData?.id,
            driverStatus: this.driverStatus,
            testingDate:
                MethodsCalculationsHelper.convertDateToBackend(testingDate),
            testType: this.selectedTestType.id,
            testReasonId: this.selectedTestReason.id,
            result: this.selectedTestResult.id,
            files: documents,
            note,
        };

        this.testService
            .addTest(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
                },
                error: () => (this.activeAction = null),
            });
    }

    public updateTest() {
        const { testingDate, note } = this.drugForm.value;

        // documents
        let documents = [];

        this.documents.map((item) => {
            if (item.realFile) documents.push(item.realFile);
        });

        const newData = {
            id: this.editData.file_id,
            driverId: this.editData?.id,
            driverStatus: this.driverStatus,
            testingDate:
                MethodsCalculationsHelper.convertDateToBackend(testingDate),
            testType: this.selectedTestType.id,
            testReasonId: this.selectedTestReason.id,
            result: this.selectedTestResult.id,
            note,
            files: documents,
            filesForDeleteIds: this.filesForDelete,
        };

        this.testService
            .updateTest(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
                },
                error: () => (this.activeAction = null),
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
