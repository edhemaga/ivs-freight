import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AddressEntity } from 'appcoretruckassist';
import { ModalService } from '../../shared/ta-modal/modal.service';
import {
    addressValidation,
    departmentValidation,
    descriptionValidation,
    fullNameValidation,
    phoneFaxRegex,
    vinNumberValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../services/form/form.service';
import { RoadsideService } from '../../safety/violation/state/roadside.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { convertDateFromBackend } from '../../../utils/methods.calculations';
import { AccidentTService } from '../../safety/accident/state/accident.service';
import { AccidentModalResponse } from '../../../../../../appcoretruckassist/model/accidentModalResponse';

@Component({
    selector: 'app-violation-modal',
    templateUrl: './violation-modal.component.html',
    styleUrls: ['./violation-modal.component.scss'],
    animations: [tab_modal_animation('animationTabsModal')],
    providers: [ModalService, FormService],
})
export class ViolationModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() editData: any;

    public violationForm: FormGroup;

    public selectedTab: number = 1;
    public tabs: any[] = [
        {
            id: 1,
            name: 'Basic',
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

    public selectedViolationCustomer: any = null;
    public labelsViolationCustomer: any[] = [];

    public selectedCounty: any = null;
    public labelsCounty: any[] = [];

    public documents: any[] = [];

    public isFormDirty: boolean;

    public violationModalName: string = null;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,
        private roadsideService: RoadsideService,
        private accidentTService: AccidentTService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();

        if (this.editData) {
            this.editViolationById(this.editData.id);
        }
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
            case 'close': {
                break;
            }
            case 'save': {
                if (this.violationForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.violationForm);
                    return;
                }
                if (this.editData) {
                    this.updateViolation(this.editData.id);
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

    public get violations(): FormArray {
        return this.violationForm.get('violations') as FormArray;
    }

    public createViolation(data: {
        code: string;
        category: string;
        unit: string;
        sw: string;
        oos: boolean;
        sms: boolean;
        description: string;
        extraDescription: string;
        basic: string;
        reason: string;
    }) {
        return this.formBuilder.group({
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
            basic: [data.basic],
            reason: [data.reason],
        });
    }

    public onHandleAddress(
        event: {
            address: AddressEntity | any;
            valid: boolean;
        },
        action
    ) {
        switch (action) {
            case 'address-authority': {
                if (event.valid) this.selectedAuthorityAddress = event;
                break;
            }
            case 'address-origin': {
                if (event.valid) this.selectedAuthorityOrigin = event;
                break;
            }
            case 'address-destination': {
                if (event.valid) this.selectedAuthorityDestination = event;
                break;
            }
        }
    }

    public onSelectDropDown(event: any, action: string) {
        switch (action) {
            case 'customer': {
                this.selectedViolationCustomer = event;
                break;
            }
            case 'county': {
                this.selectedCounty = event;
                break;
            }
            default: {
                break;
            }
        }
    }

    public onFilesEvent(event) {
        this.documents = event.files;
    }

    public pickedSpecialChecks() {
        return this.specialChecks.filter((item) => item.active).length;
    }

    public identity(index: number, item: any): number {
        return item.id;
    }

    private updateViolation(id: number) {
        const { ...form } = this.violationForm.value;
        console.log(this.selectedAuthorityAddress);
        const newData: any = {
            id: id,
            county: this.selectedCounty ? this.selectedCounty.id : null,
            violations: this.premmapedViolations(),
            note: form.note,
            policeDepartment: form.policeDepartment,
            policeOfficer: form.policeOfficer,
            badgeNo: form.badgeNo,
            addressCity: this.selectedAuthorityAddress
                ? this.selectedAuthorityAddress.address.city
                : null,
            addressState: this.selectedAuthorityAddress
                ? this.selectedAuthorityAddress.address.state
                : null,
            addressCounty: this.selectedAuthorityAddress
                ? this.selectedAuthorityAddress.address.county
                : null,
            addressAddress: this.selectedAuthorityAddress
                ? this.selectedAuthorityAddress.address.address
                : null,
            addressStreet: this.selectedAuthorityAddress
                ? this.selectedAuthorityAddress.address.street
                : null,
            addressStreetNumber: this.selectedAuthorityAddress
                ? this.selectedAuthorityAddress.address.streetNumber
                : null,
            addressCountry: this.selectedAuthorityAddress
                ? this.selectedAuthorityAddress.address.country
                : null,
            addressZipCode: this.selectedAuthorityAddress
                ? this.selectedAuthorityAddress.address.zipCode
                : null,
            addressStateShortName: this.selectedAuthorityAddress
                ? this.selectedAuthorityAddress.address.stateShortName
                : null,
            addressAddressUnit: this.selectedAuthorityAddress
                ? this.selectedAuthorityAddress.address.addressUnit
                : null,
            phone: form.phone,
            fax: form.fax,
            highway: form.highway,
            milePost: form.milePost,
            originCity: this.selectedAuthorityOrigin
                ? this.selectedAuthorityOrigin.address.city
                : null,
            originState: this.selectedAuthorityOrigin
                ? this.selectedAuthorityOrigin.address.state
                : null,
            originCounty: this.selectedAuthorityOrigin
                ? this.selectedAuthorityOrigin.address.county
                : null,
            originAddress: this.selectedAuthorityOrigin
                ? this.selectedAuthorityOrigin.address.address
                : null,
            originStreet: this.selectedAuthorityOrigin
                ? this.selectedAuthorityOrigin.address.street
                : null,
            originStreetNumber: this.selectedAuthorityOrigin
                ? this.selectedAuthorityOrigin.address.streetNumber
                : null,
            originCountry: this.selectedAuthorityOrigin
                ? this.selectedAuthorityOrigin.address.country
                : null,
            originZipCode: this.selectedAuthorityOrigin
                ? this.selectedAuthorityOrigin.address.zipCode
                : null,
            originStateShortName: this.selectedAuthorityOrigin
                ? this.selectedAuthorityOrigin.address.stateShortName
                : null,
            originAddressUnit: this.selectedAuthorityOrigin
                ? this.selectedAuthorityOrigin.address.addressUnit
                : null,
            destinationCity: this.selectedAuthorityDestination
                ? this.selectedAuthorityDestination.address.city
                : null,
            destinationState: this.selectedAuthorityDestination
                ? this.selectedAuthorityDestination.address.state
                : null,
            destinationCounty: this.selectedAuthorityDestination
                ? this.selectedAuthorityDestination.address.county
                : null,
            destinationAddress: this.selectedAuthorityDestination
                ? this.selectedAuthorityDestination.address.address
                : null,
            destinationStreet: this.selectedAuthorityDestination
                ? this.selectedAuthorityDestination.address.street
                : null,
            destinationStreetNumber: this.selectedAuthorityDestination
                ? this.selectedAuthorityDestination.address.streetNumber
                : null,
            destinationCountry: this.selectedAuthorityDestination
                ? this.selectedAuthorityDestination.address.country
                : null,
            destinationZipCode: this.selectedAuthorityDestination
                ? this.selectedAuthorityDestination.address.zipCode
                : null,
            destinationStateShortName: this.selectedAuthorityDestination
                ? this.selectedAuthorityDestination.address.stateShortName
                : null,
            destinationAddressUnit: this.selectedAuthorityDestination
                ? this.selectedAuthorityDestination.address.addressUnit
                : null,
            brokerId: this.selectedViolationCustomer
                ? this.selectedViolationCustomer.id
                : null,
            boL: form.boL,
            cargo: form.cargo,
            specialChecks: this.premmapedSpecialChecks(),
            files: [],
            filesForDeleteIds: [],
        };

        console.log('udpate violation: ', newData);

        this.roadsideService
            .updateRoadside(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                    });
                },
                error: (err: any) => {},
            });
    }

    private editViolationById(id: number) {
        this.roadsideService
            .getRoadsideById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.violationForm.patchValue({
                        report: res.report,
                        categoryReport: res.categoryReport
                            ? res.categoryReport.name
                            : null,
                        inspectionLevel: res.inspectionLevel,
                        hmInspectionType: res.hmInspectionType,
                        county: res.county, //TODO: Wait for backend
                        state: res.state ? res.state.stateShortName : null,
                        startTime: res.startTime,
                        endTime: res.endTime,
                        date: res.date
                            ? convertDateFromBackend(res.date)
                            : null,
                        // Driver TODO: ceka se backend da napravi dobar response
                        driverName: res.driver
                            ? res.driver?.firstName?.concat(
                                  ' ',
                                  res.driver?.lastName
                              )
                            : res.driver_FullName,
                        driverLicenceNumber: res.driver_LicenceNo,
                        driverState: res.driver_State,
                        driverDOB: res.driver_DateOfBirth
                            ? convertDateFromBackend(res.driver_DateOfBirth)
                            : null,
                        // Co Driver
                        coDriverName: res.coDriver_FullName,
                        coDriverLicenceNumber: res.coDriver_LicenceNo,
                        coDriverState: res.coDriver_State,
                        coDriverDOB: res.coDriver_DateOfBirth
                            ? convertDateFromBackend(res.coDriver_DateOfBirth)
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
                        truck_State: res.truck_State,
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
                        trailer_State: res.trailer_State,
                        trailer_VIN: res.trailer
                            ? res.trailer?.vin
                            : res.trailer_VIN,
                        // Violation
                        violations: [],
                        note: res.note,
                        policeDepartment: res.policeDepartment,
                        policeOfficer: res.policeOfficer,
                        badgeNo: res.badgeNo,
                        address: res.address ? res.address.address : null,
                        phone: res.phone,
                        fax: res.fax,
                        facility: res.facility,
                        highway: res.highway,
                        milePost: res.milePost,
                        origin: res.origin ? res.origin.address : null,
                        destination: res.destination
                            ? res.destination.address
                            : null,
                        customer: res.broker ? res.broker.businessName : null,
                        boL: res.boL,
                        cargo: res.cargo,
                    });

                    this.selectedAuthorityAddress = res.address;
                    this.selectedAuthorityOrigin = res.origin;
                    this.selectedAuthorityDestination = res.destination;
                    this.selectedViolationCustomer = res.broker;

                    this.violationModalName = res.report;

                    if (res.driver) {
                        this.violationForm.patchValue({
                            driverName: res.driver.firstName.concat(
                                ' ',
                                res.driver.lastName
                            ),
                            driverLicenceNumber: null,
                            driverState: null,
                            driverDOB: null,
                        });
                    }

                    if (res.truck) {
                        this.violationForm.patchValue({
                            truck_Unit: res.truck.truckNumber,
                            truck_Type: res.truck.truckType.name,
                            truck_Make: res.truck.truckMake.name,
                            truck_PlateNo: res.truck.licensePlate,
                            truck_State: null,
                            truck_VIN: res.truck.vin,
                        });
                    }

                    if (res.trailer) {
                        this.violationForm.patchValue({
                            trailer_Unit: res.trailer.trailerNumber,
                            trailer_Type: res.trailer.trailerType.name,
                            trailer_Make: res.trailer.trailerMake.name,
                            trailer_PlateNo: res.trailer.licensePlate,
                            trailer_State: null,
                            trailer_VIN: res.trailer.vin,
                        });
                    }

                    if (res.violations.length) {
                        for (let i = 0; i < res.violations.length; i++) {
                            this.violations.push(
                                this.createViolation({
                                    code: res.violations[i].code,
                                    category: res.violations[i].basic,
                                    unit: res.violations[i].unit,
                                    sw: res.violations[i].sw,
                                    oos: res.violations[i].oos,
                                    sms: res.violations[i].sms,
                                    description: res.violations[i].description,
                                    extraDescription: res.violations[i]
                                        .extraDescription
                                        ? res.violations[i].description?.concat(
                                              '.',
                                              res.violations[i].extraDescription
                                          )
                                        : res.violations[i].description,
                                    basic: res.violations[i].basic,
                                    reason: res.violations[i].reason,
                                })
                            );
                        }
                    }

                    if (res.specialChecks.length) {
                        for (let i = 0; i < this.specialChecks.length; i++) {
                            for (let j = 0; j < res.specialChecks.length; j++) {
                                if (
                                    this.specialChecks[i].name ===
                                    res.specialChecks[j].specialChecks.name
                                ) {
                                    this.specialChecks[i].active =
                                        res.specialChecks[j].active;
                                    break;
                                }
                            }
                        }
                    }
                },
                error: (err: any) => {},
            });
    }

    private getModalDropdowns() {
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
                },
                error: (err: any) => {},
            });
    }

    private premmapedSpecialChecks() {
        return this.specialChecks.map((item) => {
            return {
                specialCheck: {
                    id: item.id,
                    name: item.name,
                },
                active: item.active,
            };
        });
    }

    private premmapedViolations() {
        return this.violations.controls.map((item) => {
            return {
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
                          .value.replace(item.get('description').value, '')
                    : null,
                basic: item.get('basic').value,
                reason: item.get('reason').value,
            };
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
