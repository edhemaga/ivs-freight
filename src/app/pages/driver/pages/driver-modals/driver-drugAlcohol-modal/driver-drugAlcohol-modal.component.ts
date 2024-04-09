import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Models
import {
    DriverListResponse,
    GetTestModalResponse,
    TestResponse,
} from 'appcoretruckassist';

//Services
import { DriverService } from 'src/app/pages/driver/services/driver.service';
import { DriverTestService } from 'src/app/pages/driver/services/driver-test.service';
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';
import { TaInputService } from 'src/app/shared/components/ta-input/services/ta-input.service';
import { FormService } from 'src/app/shared/services/form.service';

//Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

//Components
import { TaAppTooltipV2Component } from '../../../../../shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaModalComponent } from 'src/app/shared/components/ta-modal/ta-modal.component';
import { TaInputDropdownComponent } from 'src/app/shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputComponent } from 'src/app/shared/components/ta-input/ta-input.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from 'src/app/shared/components/ta-input-note/ta-input-note.component';

//Helpers
import { MethodsCalculationsHelper } from '../../../../../shared/utils/helpers/methods-calculations.helper';

@Component({
    selector: 'app-driver-drugAlcohol-modal',
    templateUrl: './driver-drugAlcohol-modal.component.html',
    styleUrls: ['./driver-drugAlcohol-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // Component
        TaAppTooltipV2Component,
        TaModalComponent,
        TaInputDropdownComponent,
        TaUploadFilesComponent,
        TaInputComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
    ],
})
export class DriverDrugAlcoholModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public drugForm: UntypedFormGroup;

    public isFormDirty: boolean;

    public modalName: string = null;

    public testTypes: any[] = [];
    // Reasons
    public reasons: any[] = [];
    public alcoholReasons: any[] = [];
    public drugReasons: any[] = [];
    // -------
    public testResults: any[] = [];

    public selectedTestType: any = null;
    public selectedReasonType: any = null;
    public selectedTestResult: any = null;

    public labelsDrivers: any[] = [];
    public selectedDriver: any = null;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    private destroy$ = new Subject<void>();

    private storeDrugType: any = null;

    public disableCardAnimation: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private driverService: DriverService,
        private testService: DriverTestService,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService
    ) {}

    ngOnInit(): void {
        this.createForm();
        this.getDrugDropdowns();
    }

    private createForm() {
        this.drugForm = this.formBuilder.group({
            driver: [null],
            testType: [null, Validators.required],
            testReasonId: [null, Validators.required],
            testingDate: [null, Validators.required],
            result: [null, Validators.required],
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
                if (this.drugForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.drugForm);
                    return;
                }
                if (this.editData?.type === 'edit-drug') {
                    this.updateTest();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addTest();
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

    private getDriverById(id: number) {
        this.driverService
            .getDriverById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.modalName = res.firstName.concat(' ', res.lastName);
                    setTimeout(() => {
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private getDrugDropdowns() {
        this.testService
            .getTestDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: GetTestModalResponse) => {
                    this.testTypes = res.testTypes;
                    this.alcoholReasons = res.alcoholTestReasons;
                    this.drugReasons = res.drugTestReasons;
                    this.testResults = res.testResults;

                    if (this.editData) {
                        this.startFormChanges();
                        this.disableCardAnimation = true;
                        this.getDriverById(this.editData.id);
                        if (this.editData.type === 'edit-drug') {
                            this.getTestById(this.editData.file_id);
                        }
                    } else {
                        this.getListOfDrivers();
                        this.drugForm
                            .get('driver')
                            .setValidators(Validators.required);
                    }
                },
                error: () => {},
            });
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'test': {
                this.selectedTestType = event;

                if (this.storeDrugType?.name !== this.selectedTestType?.name) {
                    this.storeDrugType = this.selectedTestType;
                    this.inputService.changeValidators(
                        this.drugForm.get('testReasonId'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.drugForm.get('testReasonId'),
                        true
                    );
                }

                if (this.selectedTestType.name.toLowerCase() === 'drug') {
                    this.reasons = this.drugReasons;
                } else {
                    this.reasons = this.alcoholReasons;
                }
                break;
            }
            case 'reason': {
                this.selectedReasonType = event;
                break;
            }
            case 'driver': {
                if (event) {
                    this.selectedDriver = event;
                    this.modalName = this.selectedDriver.name;
                } else {
                    this.modalName = null;
                }
                break;
            }
            case 'result': {
                this.selectedTestResult = event;
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
                this.drugForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.drugForm
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
        this.formService.checkFormChange(this.drugForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public updateTest() {
        const { testingDate, note } = this.drugForm.value;
        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const newData: any = {
            id: this.editData.file_id,
            testingDate:
                MethodsCalculationsHelper.convertDateToBackend(testingDate),
            testReasonId: this.selectedReasonType.id,
            testType: this.selectedTestType.id,
            result: this.selectedTestResult ? this.selectedTestResult.id : null,
            note: note,
            files: documents ? documents : this.drugForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.testService
            .updateTest(newData)
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

    public addTest() {
        const { testingDate, note } = this.drugForm.value;
        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });
        const newData: any = {
            driverId: this.selectedDriver
                ? this.selectedDriver.id
                : this.editData.id,
            testingDate:
                MethodsCalculationsHelper.convertDateToBackend(testingDate),
            testReasonId: this.selectedReasonType.id,
            testType: this.selectedTestType.id,
            result: this.selectedTestResult ? this.selectedTestResult.id : null,
            tableActiveTab: this.editData.tableActiveTab,
            note: note,
            files: documents,
        };

        this.testService
            .addTest(newData)
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

    public getTestById(id: number) {
        this.testService
            .getTestById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: TestResponse) => {
                    this.drugForm.patchValue({
                        testType: res.testType.name,
                        testReasonId: res.testReason
                            ? res.testReason.name
                            : null,
                        result: res.result ? res.result.name : null,
                        testingDate:
                            MethodsCalculationsHelper.convertDateFromBackend(
                                res.testingDate
                            ),
                        files: res.files.length
                            ? JSON.stringify(res.files)
                            : null,
                        note: res.note,
                    });
                    this.selectedTestType = res.testType;
                    this.storeDrugType = res.testType;
                    this.selectedReasonType = res.testReason;
                    this.selectedTestResult = res.result;
                    this.documents = res.files;
                    if (this.selectedTestType.name.toLowerCase() === 'drug') {
                        this.reasons = this.drugReasons;
                    } else {
                        this.reasons = this.alcoholReasons;
                    }
                    setTimeout(() => {
                        this.disableCardAnimation = false;
                        this.startFormChanges();
                    }, 1000);
                },
                error: () => {},
            });
    }

    public getListOfDrivers() {
        this.driverService
            .getDrivers()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: DriverListResponse) => {
                    this.labelsDrivers = res.pagination.data.map((item) => {
                        return {
                            id: item.id,
                            name: item.fullName,
                        };
                    });
                },
                error: () => {},
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
