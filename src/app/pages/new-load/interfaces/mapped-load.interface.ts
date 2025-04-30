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

export interface IMappedLoad {
    id: number;
    edit: boolean;
    isSelected: boolean;
    loadNumber: string;
    status: LoadStatusResponse;
    dispatcher: CompanyUserShortResponse;
    referenceNumber: string;
    tableDropdownContent: IDropdownMenuItem[];
    totalDue: number;
    broker: LoadBrokerInfo;
    driverInfo?: LoadDriverInfo | DriverMinimalResponse;
    templateName: string;
    commodity?: string;
    brokerBusinessName: string;
    assignedDriverTruckNumber: string;
    assignedDriverTrailerNumber: string;
    milesLoaded: number;
    milesEmpty: number;
    milesTotal: number;
    billingRatePerMile: number;
    billingRate: number;
    invoicedDate: string;
    note: string;
    brokerContact: string;
    loadType: EnumValue;
    requirementTruck: TruckTypeResponse;
    requirementTrailer: TrailerTypeResponse;
    requirementLength: string;
    requirementDoor: string;
    requirementSuspension: string;
    requirementYear: string;
    requirementLiftgate: string;
    driverMessage: string;
    companyName: string;
    pickup?: LoadPickup;
    delivery?: LoadDelivery;
    dateCreated: string;
}
