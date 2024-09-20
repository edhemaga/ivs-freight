import { Injectable } from '@angular/core';

import moment from 'moment';

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
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { ShipperModalComponent } from '@pages/customer/pages/shipper-modal/shipper-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { SettingsOfficeModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-office-modal/settings-office-modal.component';
import { SettingsParkingModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-parking-modal/settings-parking-modal.component';
import { SettingsTerminalModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-terminal-modal/settings-terminal-modal.component';
import { ConfirmationMoveModalComponent } from '@shared/components/ta-shared-modals/confirmation-move-modal/confirmation-move-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { ConfirmationMoveStringEnum } from '@shared/components/ta-shared-modals/confirmation-move-modal/enums/confirmation-move-string.enum';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';
import { DropActionsStringEnum } from '@shared/enums/drop-actions-string.enum';

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
            case DropActionsStringEnum.DELETE_CDL: {
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...dataCdl,
                        state: dataCdl?.state?.stateShortName,
                        driverName: data?.firstName + ' ' + data?.lastName,
                    },
                    cdlsArray: cdlsArray?.length > 0 ? cdlsArray : [],
                };

                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.CDL,
                        type: DropActionsStringEnum.DELETE,
                        image: false,
                        modalHeaderTitle:
                            DropActionsStringEnum.DELETE_CDL_TITLE,
                    }
                );
                break;
            }
            case DropActionsStringEnum.VOID: {
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
                    { size: DropActionsStringEnum.SMALL },
                    {
                        data: {
                            ...voidData,
                        },
                        template: DropActionsStringEnum.VOID,
                        type: DropActionsStringEnum.VOID,
                        modalHeader: true,
                        array: cdlsArray?.length > 0 ? cdlsArray : [],
                    }
                );

                break;
            }
            case DropActionsStringEnum.ACTIVATE: {
                let registrationData = data.registrations.find(
                    (registration) => registration.id === dropDownData.id
                );
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...registrationData,
                    },
                };
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.VOID,
                        type: DropActionsStringEnum.ACTIVATE,
                        svg: true,
                    }
                );
                break;
            }
            case DropActionsStringEnum.DELETE_MEDICAL: {
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...dataMedical,
                        driverName: data?.firstName + ' ' + data?.lastName,
                    },
                };
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.MEDICAL,
                        type: DropActionsStringEnum.DELETE,
                        image: false,
                        modalHeaderTitle:
                            DropActionsStringEnum.DELETE_MEDICAL_TITLE,
                    }
                );
                break;
            }
            case DropActionsStringEnum.DELETE_MVR: {
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...dataMvr,
                        driverName: data?.firstName + ' ' + data?.lastName,
                    },
                };
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.MVR,
                        type: DropActionsStringEnum.DELETE,
                        image: false,
                        modalHeaderTitle:
                            DropActionsStringEnum.DELETE_MVR_TITLE,
                    }
                );
                break;
            }
            case DropActionsStringEnum.DELETE_TEST: {
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...dataTest,
                        testTypeName: dataTest.testType.name,
                        reasonName: dataTest.testReason.name,
                        driverName: data?.firstName + ' ' + data?.lastName,
                    },
                };

                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.TEST,
                        type: DropActionsStringEnum.DELETE,
                        image: false,
                        modalHeaderTitle:
                            DropActionsStringEnum.DELETE_TEST_TITLE,
                    }
                );
                break;
            }
            case DropActionsStringEnum.EDIT_LICENCE: {
                this.modalService.openModal(
                    DriverCdlModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        file_id: dropDownData.id,
                        id: driverId,
                        type: name,
                    }
                );
                break;
            }

            case DropActionsStringEnum.EDIT_DRUG: {
                this.modalService.openModal(
                    DriverDrugAlcoholTestModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        file_id: dropDownData.id,
                        id: driverId,
                        type: name,
                    }
                );
                break;
            }
            case DropActionsStringEnum.EDIT_MEDICAL: {
                this.modalService.openModal(
                    DriverMedicalModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        file_id: dropDownData.id,
                        id: driverId,
                        type: name,
                    }
                );
                break;
            }
            case DropActionsStringEnum.EDIT_MVR: {
                this.modalService.openModal(
                    DriverMvrModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        file_id: dropDownData.id,
                        id: driverId,
                        type: name,
                    }
                );
                break;
            }
            case DropActionsStringEnum.DELETE_INSPECTION: {
                const inspection = data.inspections.find(
                    (ins) => ins.id === dropDownData.id
                );

                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...inspection,
                        unit:
                            nameTruck === DropActionsStringEnum.TRAILER
                                ? data.trailerNumber
                                : data.truckNumber,
                    },
                };
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.INSPECTION,
                        type: DropActionsStringEnum.DELETE,
                        image: false,
                    }
                );
                break;
            }
            case DropActionsStringEnum.DELETE_REGISTRATION: {
                const registration = data.registrations.find(
                    (reg) => reg.id === dropDownData.id
                );
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...registration,
                        unit:
                            nameTruck === DropActionsStringEnum.TRAILER
                                ? data.trailerNumber
                                : data.truckNumber,
                    },
                };
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.REGISTRATION,
                        type: DropActionsStringEnum.DELETE,
                        image: false,
                    }
                );
                break;
            }
            case DropActionsStringEnum.DELETE_TITLE: {
                const title = data.titles.find(
                    (title) => title.id === dropDownData.id
                );
                const mappedEvent = {
                    ...dropDownData,
                    data: {
                        ...title,
                        unit:
                            nameTruck === DropActionsStringEnum.TRAILER
                                ? data.trailerNumber
                                : data.truckNumber,
                    },
                };
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.TITLE,
                        type: DropActionsStringEnum.DELETE,
                        image: false,
                    }
                );
                break;
            }
            case DropActionsStringEnum.EDIT_REGISTRATION: {
                this.modalService.openModal(
                    TtRegistrationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        id: data.id,
                        payload: data,
                        file_id: dropDownData.id,
                        type: name,
                        modal:
                            nameTruck === DropActionsStringEnum.TRUCK
                                ? DropActionsStringEnum.TRUCK
                                : DropActionsStringEnum.TRAILER,
                    }
                );
                break;
            }
            case DropActionsStringEnum.EDIT_INSPECTION: {
                this.modalService.openModal(
                    TtFhwaInspectionModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        id: data.id,
                        payload: data,
                        file_id: dropDownData.id,
                        type: name,
                        modal:
                            nameTruck === DropActionsStringEnum.TRUCK
                                ? DropActionsStringEnum.TRUCK
                                : DropActionsStringEnum.TRAILER,
                    }
                );
                break;
            }
            case DropActionsStringEnum.EDIT_TITLE: {
                this.modalService.openModal(
                    TtTitleModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        id: data.id,
                        payload: data,
                        file_id: dropDownData.id,
                        type: name,
                        modal:
                            nameTruck === DropActionsStringEnum.TRUCK
                                ? DropActionsStringEnum.TRUCK
                                : DropActionsStringEnum.TRAILER,
                    }
                );
                break;
            }
            case DropActionsStringEnum.RENEW: {
                this.modalService.openModal(
                    DriverCdlModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        id: driverId,
                        file_id: dataCdl.id,
                        type: DropActionsStringEnum.RENEW_LICENCE,
                        renewData: dataCdl,
                    }
                );
                break;
            }
            case DropActionsStringEnum.DEACTIVATE_ITEM: {
                const mappedEvent = {
                    data: {
                        ...dataCdl,
                        driver: { ...data },
                        driverName: data?.firstName + ' ' + data?.lastName,
                    },
                    cdlsArray: cdlsArray?.length > 0 ? cdlsArray : [],
                };

                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.CDL,
                        type: DropActionsStringEnum.INFO,
                        subType: DropActionsStringEnum.VOID_CDL,
                        modalHeader: true,
                        modalHeaderTitle: ConfirmationModalStringEnum.VOID_CDL,
                    }
                );
                break;
            }
            case DropActionsStringEnum.ACTIVATE_ITEM: {
                if (dataCdl[0]?.status == 1) {
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: DropActionsStringEnum.SMALL },
                        {
                            data: {
                                ...dataCdl[0],
                                state: dataCdl[0].state?.stateShortName,
                                data,
                                driverName:
                                    data?.firstName + ' ' + data?.lastName,
                            },
                            template: DropActionsStringEnum.CDL,
                            type: DropActionsStringEnum.INFO,
                            subType: DropActionsStringEnum.CDL_VOID,
                            cdlStatus: DropActionsStringEnum.NEW,
                            modalHeader: true,
                            modalHeaderTitle:
                                ConfirmationModalStringEnum.VOID_CDL,
                        }
                    );
                } else {
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: DropActionsStringEnum.SMALL },
                        {
                            data: {
                                ...dataCdl,
                                state: dataCdl.state?.stateShortName,
                                data,
                                driverName:
                                    data?.firstName + ' ' + data?.lastName,
                            },
                            template: DropActionsStringEnum.CDL,
                            type: DropActionsStringEnum.ACTIVATE,
                            cdlStatus: DropActionsStringEnum.ACTIVATE_2,
                            modalHeader: true,
                            modalHeaderTitle:
                                ConfirmationModalStringEnum.ACTIVATE_CDL,
                        }
                    );
                }

                break;
            }
            case DropActionsStringEnum.EDIT_REPAIR: {
                this.modalService.openModal(
                    RepairOrderModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        id: data.id,
                        payload: data,
                        file_id: dropDownData.id,
                        type: name,
                        modal: DropActionsStringEnum.REPAIR,
                    }
                );
                break;
            }
            case DropActionsStringEnum.DELETE_REPAIR: {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        id: data.id,
                        template: DropActionsStringEnum.REPAIR,
                        type: DropActionsStringEnum.DELETE,
                        image: false,
                    }
                );
                break;
            }
            case DropActionsStringEnum.DELETE_REPAIR_DETAIL: {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...dropDownData,
                        id: data.id,
                        template: DropActionsStringEnum.REPAIR_DETAIL,
                        type: DropActionsStringEnum.DELETE,
                        modalHeaderTitle:
                            data?.data?.repairType?.name ===
                            DropActionsStringEnum.ORDER
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

        if (event.type === DropActionsStringEnum.EDIT && !trailerId) {
            this.modalService.openModal(
                TruckModalComponent,
                { size: DropActionsStringEnum.SMALL },
                {
                    ...mappedEvent,
                    type: DropActionsStringEnum.EDIT,
                    disableButton: true,
                }
            );
        }

        if (event.type === DropActionsStringEnum.EDIT && trailerId) {
            this.modalService.openModal(
                TrailerModalComponent,
                { size: DropActionsStringEnum.SMALL },
                {
                    ...mappedEvent,
                    type: DropActionsStringEnum.EDIT,
                    id: trailerId,
                }
            );
        } else if (
            event.type === DropActionsStringEnum.DEACTIVATE ||
            event.type === DropActionsStringEnum.ACTIVATE
        ) {
            this.modalService.openModal(
                ConfirmationActivationModalComponent,
                { size: DropActionsStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: trailerId
                        ? TableStringEnum.TRAILER_2
                        : DropActionsStringEnum.TRUCK,
                    subType: trailerId
                        ? TableStringEnum.TRAILER_2
                        : DropActionsStringEnum.TRUCK,
                    tableType: trailerId
                        ? TableStringEnum.TRAILER_2
                        : DropActionsStringEnum.TRUCK,
                    type:
                        truckObject.status === 1
                            ? DropActionsStringEnum.DEACTIVATE
                            : DropActionsStringEnum.ACTIVATE,
                    modalTitle:
                        ' Unit ' + trailerId
                            ? truckObject?.trailerNumber
                            : truckObject?.truckNumber,
                    modalSecondTitle: mappedEvent?.data?.vin,
                    svg: true,
                }
            );
        } else if (event.type === DropActionsStringEnum.DELETE_ITEM) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: DropActionsStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: trailerId
                        ? DropActionsStringEnum.TRAILER
                        : DropActionsStringEnum.TRUCK,
                    type: DropActionsStringEnum.DELETE,
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
        if (event.type === DropActionsStringEnum.EDIT) {
            switch (names) {
                case DropActionsStringEnum.EDIT_PARKING:
                    this.modalService.openModal(
                        SettingsParkingModalComponent,
                        {
                            size: DropActionsStringEnum.SMALL,
                        },
                        {
                            ...event,
                            disableButton: true,
                            id: event.id,
                        }
                    );
                    break;

                case DropActionsStringEnum.EDIT_OFFICE:
                    this.modalService.openModal(
                        SettingsOfficeModalComponent,
                        {
                            size: DropActionsStringEnum.SMALL,
                        },
                        {
                            ...event,
                            disableButton: true,
                            id: event.id,
                        }
                    );
                    break;

                case DropActionsStringEnum.EDIT_REPAIR_SHOP:
                    this.modalService.openModal(
                        RepairShopModalComponent,
                        {
                            size: DropActionsStringEnum.SMALL,
                        },
                        {
                            ...event,
                            disableButton: true,
                            id: event.id,
                        }
                    );
                    break;

                case DropActionsStringEnum.EDIT_TERMINAL:
                    this.modalService.openModal(
                        SettingsTerminalModalComponent,
                        {
                            size: DropActionsStringEnum.SMALL,
                        },
                        {
                            ...event,
                            disableButton: true,
                            id: event.id,
                        }
                    );
                    break;
            }
        } else if (event.type === DropActionsStringEnum.DELETE_ITEM) {
            switch (names) {
                case DropActionsStringEnum.DELETE_PARKING:
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: DropActionsStringEnum.SMALL },
                        {
                            ...mappedEvent,
                            template: DropActionsStringEnum.COMPANY_PARKING,
                            type: DropActionsStringEnum.DELETE,
                            svg: false,
                        }
                    );
                    break;

                case DropActionsStringEnum.DELETE_OFFICE:
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: DropActionsStringEnum.SMALL },
                        {
                            ...mappedEvent,
                            template: DropActionsStringEnum.COMPANY_OFFICE,
                            type: DropActionsStringEnum.DELETE,
                            svg: false,
                        }
                    );
                    break;

                case DropActionsStringEnum.DELETE_REPAIR_SHOP:
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: DropActionsStringEnum.SMALL },
                        {
                            ...mappedEvent,
                            template: DropActionsStringEnum.COMPANY_REPAIR_SHOP,
                            type: DropActionsStringEnum.DELETE,
                            svg: false,
                        }
                    );
                    break;

                case DropActionsStringEnum.DELETE_TERMINAL:
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: DropActionsStringEnum.SMALL },
                        {
                            ...mappedEvent,
                            template: DropActionsStringEnum.COMPANY_TERMINAL,
                            type: DropActionsStringEnum.DELETE,
                            svg: false,
                        }
                    );
                    break;
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
            case DropActionsStringEnum.EDIT:
                this.modalService.openModal(
                    RepairShopModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...event,
                        disableButton: true,
                        id: event.id,
                    }
                );
                break;

            case DropActionsStringEnum.ADD_FAVOURITES:
            case DropActionsStringEnum.REMOVE_FAVOURITES:
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.REPAIR_SHOP,
                        type: DropActionsStringEnum.ACTIVATE,
                        image: false,
                    }
                );
                break;

            case DropActionsStringEnum.MOVE_TO_FAVOURITE:
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.REPAIR_SHOP,
                        type: DropActionsStringEnum.INFO,
                        subType: DropActionsStringEnum.FAVORITE,
                        subTypeStatus: DropActionsStringEnum.MOVE,
                        image: false,
                    }
                );
                break;

            case DropActionsStringEnum.REMOVE_FROM_FAVOURITE:
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.REPAIR_SHOP,
                        type: DropActionsStringEnum.INFO,
                        subType: DropActionsStringEnum.FAVORITE,
                        subTypeStatus: DropActionsStringEnum.REMOVE,
                        image: false,
                    }
                );
                break;

            case DropActionsStringEnum.DELETE_ITEM:
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.REPAIR_SHOP,
                        type: DropActionsStringEnum.DELETE,
                        image: false,
                    }
                );
                break;

            case DropActionsStringEnum.CLOSE_BUSINESS:
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.REPAIR_SHOP_2,
                        type: DropActionsStringEnum.DEACTIVATE,
                        image: false,
                    }
                );
                break;

            case DropActionsStringEnum.OPEN_BUSINESS:
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: DropActionsStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: DropActionsStringEnum.REPAIR_SHOP_2,
                        type: DropActionsStringEnum.ACTIVATE,
                        image: false,
                    }
                );
                break;

            case DropActionsStringEnum.REPAIR_2:
                this.modalService.openModal(
                    RepairOrderModalComponent,
                    { size: DropActionsStringEnum.LARGE },
                    {
                        template: DropActionsStringEnum.REPAIR_SHOP_2,
                        type: DropActionsStringEnum.SPECIFIC_REPAIR_SHOP,
                        shopId: event.id ? event.id : null,
                    }
                );

                break;
        }
    }
}
