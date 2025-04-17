// models
import {
    CompanyUserShortResponse,
    LoadStatusResponse,
    LoadBrokerInfo,
    LoadDriverInfo,
    EnumValue,
    TruckTypeResponse,
    TrailerTypeResponse,
} from 'appcoretruckassist';

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
    driverInfo: LoadDriverInfo;
    templateName: string;
    templateCreated: string;
    generalCommodity?: EnumValue;
    brokerBusinessName: string;
    assignedDriverTruckNumber: string;
    assignedDriverTrailerNumber: string;
    milesLoaded: number;
    milesEmpty: number;
    milesTotal: number;
    billingRatePerMile: number;
    billingRate: number;
    invoicedDate: string;
    requirementTruck: TruckTypeResponse;
    requirementTrailer: TrailerTypeResponse;
    requirementLength: string;
    requirementDoor: string;
    requirementSuspension: string;
    requirementYear: string;
    requirementLiftgate: string;
}
