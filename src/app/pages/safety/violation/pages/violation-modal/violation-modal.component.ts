import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// animations
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';
import { RoadsideService } from '@pages/safety/violation/services/roadside.service';
import { AccidentService } from '@pages/safety/accident/services/accident.service';

// models
import {
    AddressEntity,
    ViolationCategoryResponse,
    ViolationResponse,
} from 'appcoretruckassist';

// validations
import {
    addressValidation,
    departmentValidation,
    descriptionValidation,
    fullNameValidation,
    phoneFaxRegex,
    vinNumberValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// components
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { CaInputDatetimePickerComponent } from 'ca-components';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// models
import {
    AccidentModalResponse,
    RoadsideInspectionResponse,
} from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// Enums
import {
    EFileFormControls,
    EGeneralActions,
    EStringPlaceholder,
} from '@shared/enums';

@Component({
    selector: 'app-violation-modal',
    templateUrl: './violation-modal.component.html',
    styleUrls: ['./violation-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // components
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaCustomCardComponent,
        TaInputAddressDropdownComponent,
        CaInputDatetimePickerComponent,
    ],
})
export class ViolationModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public violationForm: UntypedFormGroup;

    public isCardAnimationDisabled: boolean = false;

    public selectedTab: number = 1;
    public tabs: any[] = [
        {
            id: 1,
            name: 'Basic',
            checked: true,
        },
        {
            id: 2,
            name: 'Additional',
        },
    ];

    public specialChecks: any[] = [
        {
            id: 1,
            name: 'Alc / Cont. Sub. Check',
            active: false,
        },
        {
            id: 2,
            name: 'Cond. by Local Juris.',
            active: false,
        },
        {
            id: 3,
            name: 'Size & Weight Enf.',
            active: false,
        },
        {
            id: 4,
            name: 'eScreen Inspection',
            active: false,
        },
        {
            id: 5,
            name: 'Traffic Enforcement',
            active: false,
        },
        {
            id: 6,
            name: 'PASA Cond. Insp.',
            active: false,
        },
        {
            id: 7,
            name: 'Drug Interd. Search',
            active: false,
        },
        {
            id: 8,
            name: 'Border Enf. Inspection',
            active: false,
        },
        {
            id: 9,
            name: 'Post Crash Inspection',
            active: false,
        },
        {
            id: 10,
            name: 'PBBT Inspection',
            active: false,
        },
    ];
    public isSpecialChecksOpen: boolean = true;

    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };

    public selectedAuthorityAddress: AddressEntity | any;
    public selectedAuthorityOrigin: AddressEntity | any;
    public selectedAuthorityDestination: AddressEntity | any;

    // Customer (Broker) on additional tab
    public selectedViolationCustomer: any = null;
    public labelsViolationCustomer: any[] = [];

    // Violation array categories
    public violationCategories: any[] = [];

    public selectedCounty: any = null;
    public labelsCounty: any[] = [];

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public isFormDirty: boolean;

    public violationModalName: string = null;

    public truckTypeConfig: ITaInput = {
        name: 'Truck Type',
        type: 'text',
        label: 'Type',
        isDisabled: true,
        dropdownImageInput: {
            withText: true,
            svg: true,
            image: false,
            url: null,
            template: 'truck',
            class: null,
        },
    };

    public trailerTypeConfig: ITaInput = {
        name: 'Trailer Type',
        type: 'text',
        label: 'Type',
        isDisabled: true,
        dropdownImageInput: {
            withText: true,
            svg: true,
            image: false,
            url: null,
            template: 'trailer',
            class: null,
        },
    };

    public longitude: number;
    public latitude: number;

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,
        private roadsideService: RoadsideService,
        private accidentTService: AccidentService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
    }

    private createForm() {
        this.violationForm = this.formBuilder.group({
            report: [null, Validators.required],
            categoryReport: [null],
            inspectionLevel: [null],
            hmInspectionType: [null],
            county: [null],
            state: [null],
            startTime: [null],
            endTime: [null],
            date: [null],
            // Driver
            driverName: [null, [...fullNameValidation]],
            driverLicenceNumber: [null],
            driverState: [null],
            driverDOB: [null],
            // Co Driver
            coDriverName: [null, [...fullNameValidation]],
            coDriverLicenceNumber: [null],
            coDriverState: [null],
            coDriverDOB: [null],
            // Truck
            truck_Unit: [null],
            truck_Type: [null],
            truck_Make: [null],
            truck_PlateNo: [null],
            truck_State: [null],
            truck_VIN: [null, [...vinNumberValidation]],
            // Trailer
            trailer_Unit: [null],
            trailer_Type: [null],
            trailer_Make: [null],
            trailer_PlateNo: [null],
            trailer_State: [null],
            trailer_VIN: [null, [...vinNumberValidation]],
            // Violation
            violations: this.formBuilder.array([]),
            note: [null],
            policeDepartment: [null, [...departmentValidation]],
            policeOfficer: [null],
            badgeNo: [null],
            address: [null, [...addressValidation]],
            phone: [null, phoneFaxRegex],
            fax: [null, phoneFaxRegex],
            facility: [null],
            highway: [null],
            milePost: [null],
            origin: [null, [...addressValidation]],
            destination: [null, [...addressValidation]],
            customer: [null],
            boL: [null],
            cargo: [null],
            files: [null],
        });

        this.formService.checkFormChange(this.violationForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;
        let dotAnimation = document.querySelector('.animation-two-tabs');

        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        // Update
        switch (data.action) {
            case EGeneralActions.CLOSE:
                break;
            case EGeneralActions.SAVE:
                if (this.violationForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.violationForm);
                    return;
                }
                if (this.editData) {
                    this.updateViolation(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            default:
                break;
        }
    }

    public get violations(): UntypedFormArray {
        return this.violationForm.get('violations') as UntypedFormArray;
    }

    public createViolation(data: {
        id: number;
        code: string;
        category: string;
        unit: string;
        sw: string;
        oos: boolean;
        sms: boolean;
        description: string;
        extraDescription: string;
        reason: string;
        violationCategoryId: number;
    }) {
        return this.formBuilder.group({
            id: [data.id],
            code: [data.code],
            category: [data.category],
            unit: [data.unit],
            sw: [data.sw],
            oos: [data.oos],
            sms: [data.sms],
            description: [data.description, [...descriptionValidation]],
            extraDescription: [
                data.extraDescription,
                [...descriptionValidation],
            ],
            reason: [data.reason],
            violationCategoryId: [data.violationCategoryId],
        });
    }

    public onHandleAddress(
        event: {
            address: AddressEntity | any;
            valid: boolean;
            longLat: any;
        },
        action: string
    ) {
        switch (action) {
            case 'address-authority':
                if (event.valid) {
                    this.selectedAuthorityAddress = event.address;
                    this.longitude = event.longLat.longitude;
                    this.latitude = event.longLat.latitude;
                }
                break;
            case 'address-origin':
                if (event.valid) this.selectedAuthorityOrigin = event.address;
                break;
            case 'address-destination':
                if (event.valid)
                    this.selectedAuthorityDestination = event.address;
                break;
        }
    }

    public onSelectDropDown(event: any, action: string) {
        switch (action) {
            case 'customer':
                this.selectedViolationCustomer = event;
                break;
            case 'county':
                this.selectedCounty = event;
                break;
            default:
                break;
        }
    }

    public onFilesEvent(event: any): void {
        this.documents = event.files;
        switch (event.action) {
            case EGeneralActions.ADD:
                this.violationForm
                    .get(EFileFormControls.FILES)
                    .patchValue(JSON.stringify(event.files));
                break;
            case EGeneralActions.DELETE:
                this.violationForm
                    .get(EFileFormControls.FILES)
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) this.filesForDelete.push(event.deleteId);
                this.fileModified = true;
                break;
            default:
                break;
        }
    }

    public pickedSpecialChecks(): number {
        return this.specialChecks.filter((item) => item.active).length;
    }

    private updateViolation(id: number): void {
        const { ...form } = this.violationForm.value;

        const documents = this.documents
            .filter((item) => item.realFile)
            .map((item) => {
                documents.push(item.realFile);
            });

        const newData: any = {
            id,
            county: this.selectedCounty?.id ?? null,
            violations: this.premmapedViolations(),
            note: form.note,
            policeDepartment: form.policeDepartment,
            policeOfficer: form.policeOfficer,
            badgeNo: form.badgeNo,
            address: this.selectedAuthorityAddress,
            phone: form.phone,
            fax: form.fax,
            highway: form.highway,
            milePost: form.milePost,
            origin: this.selectedAuthorityOrigin,
            destination: this.selectedAuthorityDestination,
            brokerId: this.selectedViolationCustomer?.id ?? null,
            boL: form.boL,
            cargo: form.cargo,
            specialChecks: this.premmapedSpecialChecks(),
            files: documents ?? this.violationForm.value.files,
            filesForDeleteIds: this.filesForDelete,
            longitude: this.longitude,
            latitude: this.latitude,
        };

        this.roadsideService
            .updateRoadside(newData)
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

    private editViolationById(id: number) {
        this.roadsideService
            .getRoadsideById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RoadsideInspectionResponse) => {
                    this.violationForm.patchValue({
                        ...res,
                        categoryReport: res.violationCategory?.name ?? null,
                        state: res.state?.stateShortName
                            ? res.state.stateShortName
                            : null,
                        startTime: res.startTime
                            ? MethodsCalculationsHelper.convertTimeFromBackend(
                                  res.startTime
                              )
                            : null,
                        endTime: res.endTime
                            ? MethodsCalculationsHelper.convertTimeFromBackend(
                                  res.endTime
                              )
                            : null,
                        date: res.date
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  res.date
                              )
                            : null,
                        // Driver
                        driverName: res.driver
                            ? res.driver?.fullName
                            : res.driver_FullName,
                        driverLicenceNumber: res.driver
                            ? res.driver.cdlNumber
                            : res.driver_LicenceNo,
                        driverState: res.driver
                            ? res.driver.stateShortName
                            : res.driver_State,
                        driverDOB: res.driver
                            ? res.driver?.dateOfBirth
                                ? MethodsCalculationsHelper.convertDateFromBackend(
                                      res.driver?.dateOfBirth
                                  )
                                : null
                            : res.driver_DateOfBirth
                              ? MethodsCalculationsHelper.convertDateFromBackend(
                                    res.driver_DateOfBirth
                                )
                              : null,
                        // Co Driver
                        coDriverName: res.coDriver_FullName,
                        coDriverLicenceNumber: res.coDriver_LicenceNo,
                        coDriverState: res.coDriver_State,
                        coDriverDOB: res.coDriver_DateOfBirth
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  res.coDriver_DateOfBirth
                              )
                            : null,
                        // Truck
                        truck_Unit: res.truck
                            ? res.truck?.truckNumber
                            : res.truck_Unit,
                        truck_Type: res.truck
                            ? res.truck?.truckType?.name
                            : res.truck_Type,
                        truck_Make: res.truck
                            ? res.truck?.truckMake?.name
                            : res.truck_Make,
                        truck_PlateNo: res.truck
                            ? res.truck?.licensePlate
                            : res.truck_PlateNo,
                        truck_State: res.truck
                            ? res.truck?.stateShortName
                            : res.truck_State,
                        truck_VIN: res.truck ? res?.truck_VIN : res.truck_VIN,
                        // Trailer
                        trailer_Unit: res.trailer
                            ? res.trailer?.trailerNumber
                            : res.trailer_Unit,
                        trailer_Type: res.trailer
                            ? res.trailer?.trailerType?.name
                            : res.trailer_Type,
                        trailer_Make: res.trailer
                            ? res.trailer?.trailerMake?.name
                            : res.trailer_Make,
                        trailer_PlateNo: res.trailer
                            ? res.trailer?.licensePlate
                            : res.trailer_PlateNo,
                        trailer_State: res.trailer
                            ? res.trailer?.stateShortName
                            : res.trailer_State,
                        trailer_VIN: res.trailer
                            ? res.trailer?.vin
                            : res.trailer_VIN,
                        // Violation
                        violations: [],
                        address: res.address?.address ?? null,
                        origin: res.origin?.address ?? null,
                        destination: res.destination?.address ?? null,
                        customer: res.broker?.businessName ?? null,
                    });

                    this.selectedAuthorityAddress = res.address;
                    this.selectedAuthorityOrigin = res.origin;
                    this.selectedAuthorityDestination = res.destination;
                    this.selectedViolationCustomer = res.broker;

                    this.violationModalName = res.report;
                    this.documents = res.files;

                    this.truckTypeConfig = {
                        ...this.truckTypeConfig,
                        dropdownImageInput: {
                            ...this.truckTypeConfig.dropdownImageInput,
                            url: res.truck?.truckType?.logoName
                                ? res.truck?.truckType?.logoName
                                : null,
                            class: res.truck?.truckType?.name
                                ? res.truck?.truckType?.name
                                      ?.trim()
                                      .replace(
                                          EStringPlaceholder.WHITESPACE,
                                          EStringPlaceholder.EMPTY
                                      )
                                      .toLowerCase()
                                : null,
                        },
                    };

                    this.trailerTypeConfig = {
                        ...this.trailerTypeConfig,
                        dropdownImageInput: {
                            ...this.trailerTypeConfig.dropdownImageInput,
                            url: res.trailer?.trailerType?.logoName
                                ? res.trailer?.trailerType?.logoName
                                : null,
                            class: res.trailer?.trailerType?.name
                                ? res.trailer?.trailerType?.name
                                      ?.trim()
                                      .replace(
                                          EStringPlaceholder.WHITESPACE,
                                          EStringPlaceholder.EMPTY
                                      )
                                      .toLowerCase()
                                : null,
                        },
                    };

                    if (res.violations.length) {
                        this.violationCategories = [
                            ...res.violations.map(
                                (
                                    item: ViolationResponse
                                ): ViolationCategoryResponse => {
                                    this.violations.push({
                                        ...item,
                                        violationCategoryId:
                                            item.violationCategory.id,
                                        extraDescription: item.extraDescription
                                            ? item.description?.concat(
                                                  EStringPlaceholder.DOT,
                                                  item.extraDescription
                                              )
                                            : item.description,
                                    });
                                    return item.violationCategory;
                                }
                            ),
                        ];
                    }
                    if (res.specialChecks.length)
                        this.specialChecks = res.specialChecks.map(
                            (item, index) => {
                                return {
                                    id: item.specialChecks.id,
                                    name: this.specialChecks[index].name,
                                    active: item.active,
                                };
                            }
                        );

                    this.isCardAnimationDisabled = false;
                },
            });
    }

    private getModalDropdowns(): void {
        this.accidentTService
            .getModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: AccidentModalResponse) => {
                    this.labelsViolationCustomer = res.brokers.map((item) => {
                        return {
                            id: item.id,
                            name: item.businessName,
                        };
                    });

                    if (this.editData) {
                        this.isCardAnimationDisabled = true;
                        this.editViolationById(this.editData.id);
                    }
                },
            });
    }

    private premmapedSpecialChecks() {
        return this.specialChecks.map((item) => {
            return {
                specialCheck: item.id,
                active: item.active,
            };
        });
    }

    private premmapedViolations() {
        return this.violations.controls.map((item) => {
            return {
                id: item.get('id').value,
                code: item.get('code').value,
                category: item.get('category').value,
                unit: item.get('unit').value,
                sw: item.get('sw').value,
                oos: item.get('oos').value,
                sms: item.get('sms').value,
                description: item.get('description').value,
                extraDescription: item.get('extraDescription').value
                    ? item
                          .get('extraDescription')
                          .value.replace(
                              item.get('description').value,
                              EStringPlaceholder.EMPTY
                          )
                    : null,
                reason: item.get('reason').value,
                violationCategoryId: item.get('violationCategoryId').value,
            };
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
