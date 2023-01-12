import {
    phoneFaxRegex,
    addressValidation,
    vinNumberValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AddressEntity } from 'appcoretruckassist';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../services/form/form.service';
import { AccidentTService } from '../../safety/accident/state/accident.service';
import { AccidentResponse } from '../../../../../../appcoretruckassist/model/accidentResponse';
import { convertDateFromBackend } from '../../../utils/methods.calculations';
import { AccidentModalResponse } from '../../../../../../appcoretruckassist/model/accidentModalResponse';

@Component({
    selector: 'app-accident-modal',
    templateUrl: './accident-modal.component.html',
    styleUrls: ['./accident-modal.component.scss'],
    animations: [tab_modal_animation('animationTabsModal')],
    providers: [ModalService, FormService],
})
export class AccidentModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() editData: any;

    public accidentForm: FormGroup;

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

    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };

    public documents: any[] = [];
    public media: any[] = [];

    // Customer (Broker)
    public labelsAccidentCustomer: any[] = [];
    public selectedAccidentCustomer: any = null;

    // Insurance Type (Labels)
    public labelsInsuranceType: any[] = [];
    public selectedInsuranceType: any[] = [];

    // Trailer Units
    public labelsTrailerUnits: any[] = [];
    public selectedTrailerUnit: any = null;

    public selectedAddressLocation: AddressEntity = null;
    public selectedAddressDestination: AddressEntity = null;
    public selectedAddressOrigin: AddressEntity = null;
    public selectedAddressAuthority: AddressEntity = null;

    public isLocationAndShippingOpen: boolean = true;

    public isFormDirty: boolean;

    public accidentModalName: string = null;

    public disableCardAnimation: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,
        private accidentTService: AccidentTService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();

        if (this.editData) {
            this.disableCardAnimation = true;
            this.editAccidentById(this.editData.id);
        }
    }

    private createForm() {
        this.accidentForm = this.formBuilder.group({
            report: [null],
            federallyRecordable: [null],
            stateRecordable: [null],
            injury: [null],
            fatality: [null],
            towing: [null],
            hazMat: [null],
            vehicleNo: [null],
            addressAccident: [null, [...addressValidation]],
            date: [null],
            time: [null],
            driverName: [null],
            driverLicenceNumber: [null],
            driverState: [null],
            driverDOB: [null],
            truckUnit: [null],
            truckType: [null],
            truckMake: [null],
            truckPlateNumber: [null],
            truckState: [null],
            truckVIN: [null, [...vinNumberValidation]],
            trailerUnit: [null],
            trailerType: [null],
            trailerMake: [null],
            trailerPlateNumber: [null],
            trailerState: [null],
            trailerVIN: [null, [...vinNumberValidation]],
            violations: this.formBuilder.array([]),
            insuranceType: this.formBuilder.array([]),
            note: [null],
            roadwayTrafficWay: [null],
            weatherCondition: [null],
            roadAccessControl: [null],
            roadSurfaceCondition: [null],
            lightCondition: [null],
            reportingAgency: [null],
            policeOfficer: [null],
            bagdeNo: [null],
            authorityAddress: [null, [...addressValidation]],
            phoneOfficer: [null, phoneFaxRegex],
            fax: [null, phoneFaxRegex],
            origin: [null, [...addressValidation]],
            destination: [null, [...addressValidation]],
            customer: [null],
            boL: [null],
            cargo: [null],
            files: [null],
            medies: [null],
        });

        this.formService.checkFormChange(this.accidentForm);
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

    public get violations(): FormArray {
        return this.accidentForm.get('violations') as FormArray;
    }

    public get insurances(): FormArray {
        return this.accidentForm.get('insuranceType') as FormArray;
    }

    private createInsurance(data?: {
        insuranceType: string;
        claimNumber: string;
        insuranceAdjuster: string;
        phone: string;
        email: string;
    }): FormGroup {
        return this.formBuilder.group({
            insuranceType: [data?.insuranceType ? data.insuranceType : null],
            claimNumber: [data?.claimNumber ? data.claimNumber : null],
            insuranceAdjuster: [
                data?.insuranceAdjuster ? data.insuranceAdjuster : null,
            ],
            phone: [data?.phone ? data.phone : null, phoneFaxRegex],
            email: [data?.email ? data.email : null],
        });
    }

    public addInsurance(event: { check: boolean; action: string }) {
        const form = this.createInsurance();
        if (event.check) {
            this.insurances.push(form);
        }

        this.inputService.customInputValidator(
            form.get('email'),
            'email',
            this.destroy$
        );
    }

    public removeInsurance(id: number) {
        this.insurances.removeAt(id);
        this.selectedInsuranceType.splice(id, 1);
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
                if (this.accidentForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.accidentForm);
                    return;
                }
                if (this.editData) {
                    this.updateAccident(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                } else {
                    this.addAccident();
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

    public editAccidentById(id: number) {
        this.accidentTService
            .getAccidentById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: AccidentResponse) => {
                    this.accidentForm.patchValue({
                        report: res.report,
                        federallyRecordable: res.federallyRecordable,
                        stateRecordable: res.stateRecordable,
                        injury: res.injury,
                        fatality: res.fatality,
                        towing: res.towing,
                        hazMat: res.hazMat,
                        vehicleNo: res.vehicloNo,
                        addressAccident: res.addressAccident
                            ? res.addressAccident.address
                            : null,
                        date: res.date
                            ? convertDateFromBackend(res.date)
                            : null,
                        time: res.time,
                        driverName: res.driver_FullName,
                        driverLicenceNumber: res.driver_LicenceNo,
                        driverState: res.driver_State,
                        driverDOB: res.driver_DateOfBirth
                            ? convertDateFromBackend(res.driver_DateOfBirth)
                            : null,
                        truckUnit: res.truck_Unit,
                        truckType: res.truck_Type,
                        truckMake: res.truck_Make,
                        truckPlateNumber: res.truck_PlateNo,
                        truckState: res.truck_State,
                        truckVIN: res.truck_VIN,
                        trailerUnit: res.trailer_Unit,
                        trailerType: res.trailer_Type,
                        trailerMake: res.trailer_Make,
                        trailerPlateNumber: res.trailer_PlateNo,
                        trailerState: res.trailer_State,
                        trailerVIN: res.trailer_VIN,
                        violations: [],
                        insuranceType: [],
                        note: null,
                        roadwayTrafficWay: res.roadwayTrafficway,
                        weatherCondition: res.weatherCondition,
                        roadAccessControl: res.roadAccessControl,
                        roadSurfaceCondition: res.roadSurfaceCondition,
                        lightCondition: res.lightCondition,
                        reportingAgency: res.reportingAgency,
                        policeOfficer: res.policeOfficer,
                        bagdeNo: res.bagdeNo,
                        authorityAddress: res.addressAuthority
                            ? res.addressAuthority.address
                            : null,
                        phoneOfficer: res.phoneOfficer,
                        fax: res.fax,
                        origin: res.origin ? res.origin.address : null,
                        destination: res.destination
                            ? res.destination.address
                            : null,
                        customer: res.broker ? res.broker.businessName : null,
                        boL: res.boL,
                        cargo: res.cargo,
                    });

                    this.accidentModalName = res.report;

                    this.selectedAddressLocation = res.addressAccident;
                    this.selectedAddressAuthority = res.addressAuthority;
                    this.selectedAddressOrigin = res.origin;
                    this.selectedAddressDestination = res.destination;

                    this.selectedAccidentCustomer = res.broker;

                    if (res.insuranceType.length) {
                        for (let i = 0; i < res.insuranceType.length; i++) {
                            this.insurances.push(
                                this.createInsurance({
                                    insuranceType: res.insuranceType[i].insTypes
                                        ? res.insuranceType[i].insTypes.name
                                        : null,
                                    claimNumber:
                                        res.insuranceType[i].claimNo.toString(),
                                    insuranceAdjuster:
                                        res.insuranceType[i].insAdjuster,
                                    phone: res.insuranceType[i].phone,
                                    email: res.insuranceType[i].email,
                                })
                            );
                        }
                    }

                    // [
                    //   this.formBuilder.group({
                    //     categoryId: ['Crash Indicator'],
                    //     sw: ['2'],
                    //     hm: [true],
                    //     description: [
                    //       'Involves tow-away but no injury or fatality',
                    //       [...descriptionValidation],
                    //     ],
                    //   }),
                    // ]
                    setTimeout(() => {
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private updateAccident(id: number) {
        console.log('update: ', id);
    }

    private addAccident() {}

    private getModalDropdowns() {
        this.accidentTService
            .getModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: AccidentModalResponse) => {
                    this.labelsTrailerUnits = res.trailers.map((item) => {
                        return {
                            id: item.id,
                            name: item.trailerNumber,
                        };
                    });
                    this.labelsAccidentCustomer = res.brokers.map((item) => {
                        return {
                            id: item.id,
                            name: item.businessName,
                        };
                    });
                    this.labelsInsuranceType = res.insuranceType;
                },
                error: () => {},
            });
    }

    public onHandleAddress(
        event: {
            address: AddressEntity | any;
            valid: boolean;
        },
        action: string
    ) {
        switch (action) {
            case 'address-authority': {
                if (event.valid) this.selectedAddressAuthority = event.address;
                break;
            }
            case 'address-origin': {
                if (event.valid) this.selectedAddressOrigin = event.address;
                break;
            }
            case 'address-destination': {
                if (event.valid)
                    this.selectedAddressDestination = event.address;
                break;
            }
            case 'location': {
                if (event.valid) this.selectedAddressLocation = event.address;
                break;
            }
            default: {
                break;
            }
        }
    }

    public onFilesEvent(event: any) {
        switch (event.type) {
            case 'documents': {
                this.documents = event.files;
                break;
            }
            case 'media': {
                this.media = event.files;
                break;
            }
            default: {
                break;
            }
        }
    }

    public onSelectDropDown(event: any, action: string, index?: number) {
        switch (action) {
            case 'shipping-customer': {
                this.selectedAccidentCustomer = event;
                break;
            }
            case 'trailer-unit': {
                this.selectedTrailerUnit = event;
                break;
            }
            case 'insurance-type': {
                this.selectedInsuranceType[index] = event;
                break;
            }
            default: {
                break;
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
