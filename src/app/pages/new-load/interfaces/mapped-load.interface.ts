// models
import {
    CompanyUserShortResponse,
    LoadStatusResponse,
    LoadBrokerInfo,
    LoadDriverInfo,
    EnumValue,
    TruckTypeResponse,
    TrailerTypeResponse,
    DriverMinimalResponse,
} from 'appcoretruckassist';
import { LoadDelivery, LoadPickup } from '@pages/load/pages/load-table/models';

// interfaces
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { ISingleValue } from '@shared/interfaces';

export interface IMappedLoad {
    id: number;
    isSelected: boolean;

    /////////////////////////////////////// TEMPLATE
    templateName: string;
    loadType: EnumValue;
    dispatcher: CompanyUserShortResponse;
    companyName: string;
    brokerBusinessName: string;
    brokerContact: string;
    brokerPhone: string;
    brokerPhoneExt: string;
    referenceNumber: string;
    commodity: string;
    weight: string;
    assignedDriver: LoadDriverInfo | DriverMinimalResponse;
    assignedDriverTruckNumber: string;
    assignedDriverTrailerNumber: string;
    requirementTruck: TruckTypeResponse;
    requirementTrailer: TrailerTypeResponse;
    requirementLength: string;
    requirementDoor: string;
    requirementSuspension: string;
    requirementYear: string;
    requirementLiftgate: string;
    driverMessage: string;
    milesLoaded: number;
    milesEmpty: number;
    milesTotal: number;

    billingRatePerMile: ISingleValue;
    billingLayover: ISingleValue;
    billinglumper: ISingleValue;
    billingFuelSurcharge: ISingleValue;
    billingEscort: ISingleValue;
    billingDetention: ISingleValue;
    billingRate: number;
    billingAdjustedRate: number;

    ////////////////////////////////////////////////////////////

    edit: boolean;

    loadNumber: string;
    status: LoadStatusResponse;

    tableDropdownContent: IDropdownMenuItem[];
    totalDue: number;
    broker: LoadBrokerInfo;

    invoicedDate: string;
    note: string;

    pickup: LoadPickup;
    delivery: LoadDelivery;
    dateCreated: string;
}
