import { Injectable } from '@angular/core';

// services
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';
import { ModalService } from '@shared/services/modal.service';

// components
import { DriverCdlModalComponent } from '@pages/driver/pages/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholTestModalComponent } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/driver-drug-alcohol-test-modal.component';
import { DriverMedicalModalComponent } from '@pages/driver/pages/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '@pages/driver/pages/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { BrokerModalComponent } from '@pages/customer/pages/broker-modal/broker-modal.component';
import { TtFhwaInspectionModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-registration-modal/tt-registration-modal.component';
import { TtTitleModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-title-modal/tt-title-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { DriverModalComponent } from '@pages/driver/pages/driver-modals/driver-modal/driver-modal.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { ShipperModalComponent } from '@pages/customer/pages/shipper-modal/shipper-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { SettingsOfficeModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-office-modal/settings-office-modal.component';
import { SettingsParkingModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-parking-modal/settings-parking-modal.component';
import { SettingsRepairshopModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-repairshop-modal/settings-repairshop-modal.component';
import { SettingsTerminalModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-terminal-modal/settings-terminal-modal.component';
import { ConfirmationMoveModalComponent } from '@shared/components/ta-shared-modals/confirmation-move-modal/confirmation-move-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import moment from 'moment';
import { ConfirmationMoveStringEnum } from '@shared/components/ta-shared-modals/confirmation-move-modal/enums/confirmation-move-string.enum';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';

@Injectable({
    providedIn: 'root',
})
export class DropDownService {
    public parkingDataById: any;

    constructor(
        private modalService: ModalService,
        private settingsLocationService: SettingsLocationService
    ) {}
    public getParkingById(id: number) {
        this.settingsLocationService
            .getCompanyParkingById(id)
            .subscribe((item) => (this.parkingDataById = item));
    }
    public dropActions(
        dropDownData: any,
        name: string,
        dataCdl?: any,
        dataMvr?: any,
        dataMedical?: any,
        dataTest?: any,
        driverId?: number,
        truckId?: number,
        trailerId?: number,
        data?: any,
        nameTruck?: string,
        hasActiveCdl?: boolean,
        cdlsArray?: any
    ) {
        switch (name) {
            case 'delete-cdl': {
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...dataCdl,
                        state: dataCdl.state.stateShortName,
                    },
                    cdlsArray: cdlsArray?.length > 0 ? cdlsArray : [],
                };
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'cdl',
                        type: 'delete',
                        image: false,
                    }
                );
                break;
            }
            case 'void': {
                let voidData = data.registrations.find(
                    (registration) => registration.id === dropDownData.id
                );
                const isVoided = data.registrations.find(
                    (registration) => registration.voidedOn
                );
                let cdlsArray = data.registrations.map((registration) => {
                    const currentDate = moment().valueOf();

                    const expDate = moment(registration.expDate).valueOf();
                    if (isVoided) {
                        if (expDate > currentDate && !registration.voidedOn) {
                            return {
                                id: registration.id,
                                name: registration.licensePlate,
                            };
                        }
                    }
                });
                cdlsArray = cdlsArray?.length
                    ? cdlsArray.filter((item) => item)
                    : [];
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        data: {
                            ...voidData,
                        },
                        template: 'void',
                        type: 'void',
                        modalHeader: true,
                        array: cdlsArray?.length > 0 ? cdlsArray : [],
                    }
                );

                break;
            }
            case 'activate':
                {
                    let registrationData = data.registrations.find(
                        (registration) => registration.id === dropDownData.id
                    );
                    const mappedEvent = {
                        ...event,
                        data: {
                            ...registrationData,
                        },
                    };
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: 'small' },
                        {
                            ...mappedEvent,
                            template: 'void',
                            type: 'activate',
                            svg: true,
                        }
                    );
                }
                break;
            case 'delete-medical': {
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...dataMedical,
                    },
                };
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'medical',
                        type: 'delete',
                        image: false,
                    }
                );
                break;
            }
            case 'delete-mvr': {
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...dataMvr,
                    },
                };
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'mvr',
                        type: 'delete',
                        image: false,
                    }
                );
                break;
            }
            case 'delete-test': {
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...dataTest,
                        testTypeName: dataTest.testType.name,
                        reasonName: dataTest.testReason.name,
                    },
                };
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'test',
                        type: 'delete',
                        image: false,
                    }
                );
                break;
            }
            case 'edit-licence': {
                this.modalService.openModal(
                    DriverCdlModalComponent,
                    { size: 'small' },
                    {
                        file_id: dropDownData.id,
                        id: driverId,
                        type: name,
                    }
                );
                break;
            }

            case 'edit-drug': {
                this.modalService.openModal(
                    DriverDrugAlcoholTestModalComponent,
                    { size: 'small' },
                    {
                        file_id: dropDownData.id,
                        id: driverId,
                        type: name,
                    }
                );
                break;
            }
            case 'edit-medical': {
                this.modalService.openModal(
                    DriverMedicalModalComponent,
                    { size: 'small' },
                    {
                        file_id: dropDownData.id,
                        id: driverId,
                        type: name,
                    }
                );
                break;
            }
            case 'edit-mvr': {
                this.modalService.openModal(
                    DriverMvrModalComponent,
                    { size: 'small' },
                    {
                        file_id: dropDownData.id,
                        id: driverId,
                        type: name,
                    }
                );
                break;
            }
            case 'delete-inspection': {
                const inspection = data.inspections.find(
                    (ins) => ins.id === dropDownData.id
                );
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...inspection,
                        unit: data.truckNumber,
                    },
                };
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'inspection',
                        type: 'delete',
                        image: false,
                    }
                );
                break;
            }
            case 'delete-registration': {
                const registration = data.registrations.find(
                    (reg) => reg.id === dropDownData.id
                );
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...registration,
                        unit: data.truckNumber,
                    },
                };
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'registration',
                        type: 'delete',
                        image: false,
                    }
                );
                break;
            }
            case 'delete-title': {
                const title = data.titles.find(
                    (title) => title.id === dropDownData.id
                );
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...title,
                        unit: data.truckNumber,
                    },
                };
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'title',
                        type: 'delete',
                        image: false,
                    }
                );
                break;
            }
            case 'edit-registration': {
                this.modalService.openModal(
                    TtRegistrationModalComponent,
                    { size: 'small' },
                    {
                        id: data.id,
                        payload: data,
                        file_id: dropDownData.id,
                        type: name,
                        modal: nameTruck === 'truck' ? 'truck' : 'trailer',
                    }
                );
                break;
            }
            case 'edit-inspection': {
                this.modalService.openModal(
                    TtFhwaInspectionModalComponent,
                    { size: 'small' },
                    {
                        id: data.id,
                        payload: data,
                        file_id: dropDownData.id,
                        type: name,
                        modal: nameTruck === 'truck' ? 'truck' : 'trailer',
                    }
                );
                break;
            }
            case 'edit-title': {
                this.modalService.openModal(
                    TtTitleModalComponent,
                    { size: 'small' },
                    {
                        id: data.id,
                        payload: data,
                        file_id: dropDownData.id,
                        type: name,
                        modal: nameTruck === 'truck' ? 'truck' : 'trailer',
                    }
                );
                break;
            }
            case 'renew': {
                this.modalService.openModal(
                    DriverCdlModalComponent,
                    { size: 'small' },
                    {
                        id: driverId,
                        file_id: dataCdl.id,
                        type: 'renew-licence',
                        renewData: dataCdl,
                    }
                );
                break;
            }
            case 'deactivate-item': {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        data: {
                            ...dataCdl[0],
                            state: dataCdl[0].state.stateShortName,
                            data,
                        },
                        template: 'cdl',
                        type: 'info',
                        subType: 'cdl void',
                        cdlStatus: 'New',
                        modalHeader: true,
                        cdlsArray: cdlsArray?.length > 0 ? cdlsArray : [],
                    }
                );
                break;
            }
            case 'activate-item': {
                if (dataCdl[0]?.status == 1) {
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: 'small' },
                        {
                            data: {
                                ...dataCdl[0],
                                state: dataCdl[0].state.stateShortName,
                                data,
                            },
                            template: 'CDL',
                            type: 'info',
                            subType: 'cdl void',
                            cdlStatus: 'New',
                            modalHeader: true,
                        }
                    );
                } else {
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: 'small' },
                        {
                            data: {
                                ...dataCdl,
                                state: dataCdl.state.stateShortName,
                                data,
                            },
                            template: 'CDL',
                            type: 'activate',
                            //subType: 'cdl void',
                            cdlStatus: 'Activate',
                            modalHeader: true,
                        }
                    );
                }

                break;
            }
            case 'edit-repair': {
                this.modalService.openModal(
                    RepairOrderModalComponent,
                    { size: 'small' },
                    {
                        id: data.id,
                        payload: data,
                        file_id: dropDownData.id,
                        type: name,
                        modal: 'repair',
                    }
                );
                break;
            }
            case 'delete-repair': {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        id: data.id,
                        template: 'repair',
                        type: 'delete',
                        image: false,
                    }
                );
                break;
            }
            case TableStringEnum.DELETE_REPAIR_DETAIL: {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...dropDownData,
                        id: data.id,
                        template: TableStringEnum.REPAIR_DETAIL,
                        type: TableStringEnum.DELETE,
                        modalHeaderTitle:
                            data?.data?.repairType?.name ===
                            TableStringEnum.ORDER
                                ? ConfirmationModalStringEnum.DELETE_ORDER
                                : ConfirmationModalStringEnum.DELETE_REPAIR,
                        subType: data?.data?.repairType?.name,
                    }
                );
                break;
            }
            default: {
                break;
            }
        }
    }
    public dropActionsHeader(event: any, driverObject?: any, _?: number) {
        const mappedEvent = {
            ...driverObject,
            data: {
                ...driverObject,
                name: driverObject?.firstName + ' ' + driverObject?.lastName,
            },
        };
        if (event.type === 'edit') {
            this.modalService.openModal(
                DriverModalComponent,
                { size: 'small' },
                {
                    ...event,
                    disableButton: true,
                    id: event.id,
                }
            );
        } else if (event.type === 'deactivate' || event.type === 'activate') {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: 'small' },
                {
                    ...mappedEvent,
                    template: 'driver',
                    type: driverObject.status === 1 ? 'deactivate' : 'activate',
                    image: true,
                }
            );
        } else if (event.type === 'delete-item') {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: 'small' },
                {
                    ...mappedEvent,
                    template: 'driver',
                    type: 'delete',
                    image: true,
                }
            );
        }
    }

    public dropActionsHeaderShipperBroker(
        event: any,
        dataObject?: any,
        name?: string
    ) {
        const mappedEvent = {
            id: dataObject?.id,
            data: {
                ...dataObject,
                name: dataObject?.businessName,
            },
        };

        if (
            event.type === TableStringEnum.EDIT &&
            name === TableStringEnum.SHIPPER
        ) {
            this.modalService.openModal(
                ShipperModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    disableButton: true,
                    id: event.id,
                }
            );
        }
        if (
            event.type === TableStringEnum.EDIT &&
            name === TableStringEnum.BROKER
        ) {
            this.modalService.openModal(
                BrokerModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    disableButton: true,
                    id: event.id,
                }
            );
        } else if (event.type === TableStringEnum.DELETE_ITEM) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template:
                        name === TableStringEnum.SHIPPER
                            ? TableStringEnum.SHIPPER
                            : TableStringEnum.BROKER,
                    type: TableStringEnum.DELETE,
                    svg: true,
                    modalHeaderTitle:
                        name === TableStringEnum.BROKER
                            ? ConfirmationModalStringEnum.DELETE_BROKER
                            : ConfirmationModalStringEnum.DELETE_SHIPPER,
                }
            );
        } else if (
            event.type === TableStringEnum.MOVE_TO_BAN ||
            event.type === TableStringEnum.REMOVE_FROM_BAN_LIST_2
        ) {
            this.modalService.openModal(
                ConfirmationMoveModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    type: !dataObject.ban
                        ? TableStringEnum.MOVE
                        : TableStringEnum.REMOVE,
                    template: TableStringEnum.BROKER,
                    subType: TableStringEnum.BAN,
                    tableType: ConfirmationMoveStringEnum.BROKER_TEXT,
                    modalTitle: dataObject.businessName,
                    modalSecondTitle:
                        dataObject?.billingAddress?.address ??
                        TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                }
            );
        } else if (
            event.type === TableStringEnum.MOVE_TO_DNU ||
            event.type === TableStringEnum.REMOVE_FROM_DNU_LIST_2
        ) {
            this.modalService.openModal(
                ConfirmationMoveModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    type: !dataObject.dnu
                        ? TableStringEnum.MOVE
                        : TableStringEnum.REMOVE,
                    template: TableStringEnum.BROKER,
                    subType: TableStringEnum.DNU,
                    tableType: ConfirmationMoveStringEnum.BROKER_TEXT,
                    modalTitle: dataObject.businessName,
                    modalSecondTitle:
                        dataObject?.billingAddress?.address ??
                        TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                }
            );
        } else if (
            event.type === TableStringEnum.CLOSE_BUSINESS ||
            event.type === TableStringEnum.OPEN_BUSINESS_2
        ) {
            this.modalService.openModal(
                ConfirmationActivationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    type: dataObject.status
                        ? TableStringEnum.CLOSE
                        : TableStringEnum.OPEN,
                    template: TableStringEnum.INFO,
                    subType:
                        name === TableStringEnum.BROKER
                            ? TableStringEnum.BROKER_2
                            : TableStringEnum.SHIPPER_3,
                    subTypeStatus: TableStringEnum.BUSINESS,
                    tableType:
                        name === TableStringEnum.BROKER
                            ? ConfirmationActivationStringEnum.BROKER_TEXT
                            : ConfirmationActivationStringEnum.SHIPPER_TEXT,
                    modalTitle: dataObject.businessName,
                    modalSecondTitle:
                        dataObject?.address?.address ??
                        dataObject?.billingAddress?.address ??
                        TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                }
            );
        }
    }
    public dropActionHeaderTruck(
        event: any,
        truckObject?: any,
        truckId?: number,
        trailerId?: number
    ) {
        const mappedEvent = {
            ...truckObject,
            data: {
                ...truckObject,
                number: trailerId
                    ? truckObject?.trailerNumber
                    : truckObject?.truckNumber,
                avatar: trailerId
                    ? `assets/svg/common/trailers/${truckObject?.trailerType?.logoName}`
                    : `assets/svg/common/trucks/${truckObject?.truckType?.logoName}`,
            },
        };
        if (event.type === 'edit' && !trailerId) {
            this.modalService.openModal(
                TruckModalComponent,
                { size: 'small' },
                {
                    ...mappedEvent,
                    type: 'edit',
                    disableButton: true,
                }
            );
        }
        if (event.type === 'edit' && trailerId) {
            this.modalService.openModal(
                TrailerModalComponent,
                { size: 'small' },
                {
                    ...event,
                    type: 'edit',
                    disableButton: true,
                    id: trailerId,
                }
            );
        } else if (event.type === 'deactivate' || event.type === 'activate') {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: 'small' },
                {
                    ...mappedEvent,
                    template: trailerId ? 'trailer' : 'truck',
                    type: truckObject.status === 1 ? 'deactivate' : 'activate',
                    svg: true,
                }
            );
        } else if (event.type === 'delete-item') {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: 'small' },
                {
                    ...mappedEvent,
                    template: trailerId ? 'trailer' : 'truck',
                    type: 'delete',
                    svg: true,
                }
            );
        }
    }

    public dropActionCompanyLocation(
        event: any,
        names: string,
        parkingObject?: any
    ) {
        const mappedEvent = {
            ...parkingObject,
            data: {
                ...parkingObject,
                name: parkingObject?.name,
            },
        };
        if (event.type === 'edit') {
            switch (names) {
                case 'edit-parking': {
                    this.modalService.openModal(
                        SettingsParkingModalComponent,
                        {
                            size: 'small',
                        },
                        {
                            ...event,
                            disableButton: true,
                            id: event.id,
                        }
                    );
                    break;
                }
                case 'edit-office': {
                    this.modalService.openModal(
                        SettingsOfficeModalComponent,
                        {
                            size: 'small',
                        },
                        {
                            ...event,
                            disableButton: true,
                            id: event.id,
                        }
                    );
                    break;
                }
                case 'edit-repair-shop': {
                    this.modalService.openModal(
                        SettingsRepairshopModalComponent,
                        {
                            size: 'small',
                        },
                        {
                            ...event,
                            disableButton: true,
                            id: event.id,
                        }
                    );
                    break;
                }
                case 'edit-terminal': {
                    this.modalService.openModal(
                        SettingsTerminalModalComponent,
                        {
                            size: 'small',
                        },
                        {
                            ...event,
                            disableButton: true,
                            id: event.id,
                        }
                    );
                    break;
                }
            }
        } else if (event.type === 'delete-item') {
            switch (names) {
                case 'delete-parking': {
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: 'small' },
                        {
                            ...mappedEvent,
                            template: 'Company Parking',
                            type: 'delete',
                            svg: false,
                        }
                    );
                    break;
                }
                case 'delete-office': {
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: 'small' },
                        {
                            ...mappedEvent,
                            template: 'Company Office',
                            type: 'delete',
                            svg: false,
                        }
                    );
                    break;
                }
                case 'delete-repair-shop': {
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: 'small' },
                        {
                            ...mappedEvent,
                            template: 'Company Repair Shop',
                            type: 'delete',
                            svg: false,
                        }
                    );
                    break;
                }
                case 'delete-terminal': {
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: 'small' },
                        {
                            ...mappedEvent,
                            template: 'Company Terminal',
                            type: 'delete',
                            svg: false,
                        }
                    );
                    break;
                }
            }
        }
    }
    public dropActionsHeaderRepair(event: any, dataObject?: any, _?: number) {
        const mappedEvent = {
            ...dataObject,
            data: {
                ...dataObject,
            },
        };

        switch (event.type) {
            case 'edit': {
                this.modalService.openModal(
                    RepairShopModalComponent,
                    { size: 'small' },
                    {
                        ...event,
                        disableButton: true,
                        id: event.id,
                    }
                );
                break;
            }
            case 'add-favourites':
            case 'remove-favourites': {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'repair shop',
                        type: 'activate',
                        image: false,
                    }
                );
                break;
            }
            case 'move-to-favourite': {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'repair shop',
                        type: 'info',
                        subType: 'favorite',
                        subTypeStatus: 'move',
                        image: false,
                    }
                );
                break;
            }
            case 'remove-from-favourite': {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'repair shop',
                        type: 'info',
                        subType: 'favorite',
                        subTypeStatus: 'remove',
                        image: false,
                    }
                );
                break;
            }
            case 'delete-item': {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'repair shop',
                        type: 'delete',
                        image: false,
                    }
                );
                break;
            }
            case 'close-business': {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'Repair Shop',
                        type: 'deactivate',
                        image: false,
                    }
                );
                break;
            }
            case 'open-business': {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: 'small' },
                    {
                        ...mappedEvent,
                        template: 'Repair Shop',
                        type: 'activate',
                        image: false,
                    }
                );
                break;
            }
            case 'Repair': {
                this.modalService.openModal(
                    RepairOrderModalComponent,
                    { size: 'large' },
                    {
                        template: 'Repair Shop',
                        type: 'specific-repair-shop',
                        shopId: event.id ? event.id : null,
                    }
                );

                break;
            }
        }
    }
}
