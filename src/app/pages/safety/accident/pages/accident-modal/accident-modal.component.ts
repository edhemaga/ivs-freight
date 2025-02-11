import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    FormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// validations
import {
    phoneFaxRegex,
    addressValidation,
    vinNumberValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// animations
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';
import { AccidentService } from '@pages/safety/accident/services/accident.service';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';

// models
import {
    AddressEntity,
    AccidentResponse,
    AccidentModalResponse,
} from 'appcoretruckassist';
import { EGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-accident-modal',
    templateUrl: './accident-modal.component.html',
    styleUrls: ['./accident-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,

        // Component
        TaAppTooltipV2Component,
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        TaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaInputDropdownComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
    ],
})
export class AccidentModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() editData: any;

    public accidentForm: UntypedFormGroup;

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

    public isCardAnimationDisabled: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,
        private accidentTService: AccidentService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();

        if (this.editData) {
            this.isCardAnimationDisabled = true;
            this.editAccidentById(this.editData.id);
        } else {
            this.startFormChanges();
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
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;
        let dotAnimation = document.querySelector('.animation-two-tabs');

        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };
    }

    public get violations(): UntypedFormArray {
        return this.accidentForm.get('violations') as UntypedFormArray;
    }

    public get insurances(): UntypedFormArray {
        return this.accidentForm.get('insuranceType') as UntypedFormArray;
    }

    private createInsurance(data?: {
        insuranceType: string;
        claimNumber: string;
        insuranceAdjuster: string;
        phone: string;
        email: string;
    }): UntypedFormGroup {
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
            case EGeneralActions.CLOSE: {
                break;
            }
            case EGeneralActions.SAVE: {
                if (this.accidentForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.accidentForm);
                    return;
                }
                if (this.editData) {
                    this.updateAccident(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addAccident();
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

    public editAccidentById(id: number): void {
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
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  res.date
                              )
                            : null,
                        time: res.time,
                        driverName: res.driver_FullName,
                        driverLicenceNumber: res.driver_LicenceNo,
                        driverState: res.driver_State,
                        driverDOB: res.driver_DateOfBirth
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  res.driver_DateOfBirth
                              )
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
                        this.startFormChanges();
                        this.isCardAnimationDisabled = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private updateAccident(id: number) {
        this.modalService.setModalSpinner({
            action: null,
            status: true,
            close: true,
        });
    }

    private addAccident() {
        this.modalService.setModalSpinner({
            action: null,
            status: true,
            close: true,
        });
    }

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

    private startFormChanges() {
        this.formService.checkFormChange(this.accidentForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
