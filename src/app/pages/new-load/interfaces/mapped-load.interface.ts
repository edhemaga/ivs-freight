// models
import {
    CompanyUserShortResponse,
    LoadStatusResponse,
    LoadDriverInfo,
    EnumValue,
    TruckTypeResponse,
    TrailerTypeResponse,
    DriverMinimalResponse,
    LoadStopResponse,
    FileResponse,
} from 'appcoretruckassist';
import { LoadDelivery, LoadPickup } from '@pages/load/pages/load-table/models';

// interfaces
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { DocumentsDrawerTag, ISingleValue } from '@shared/interfaces';
import { IComment } from 'ca-components';

export interface IMappedLoad {
    id: number;
    isSelected: boolean;
    templateName: string;
    loadNumber: string;
    loadType: EnumValue;
    dispatcher: CompanyUserShortResponse;
    companyName: string;
    brokerBusinessName: string;
    brokerContact: string;
    brokerPhone: string;
    brokerPhoneExt: string;
    referenceNumber: string;
    commodity: string;
    weight: ISingleValue;
    assignedDriver: LoadDriverInfo | DriverMinimalResponse;
    assignedDriverTruckNumber: string;
    assignedDriverTrailerNumber: string;
    status: LoadStatusResponse;
    pickup: LoadPickup;
    delivery: LoadDelivery;
    loadStops: LoadStopResponse;
    requirementTruck: TruckTypeResponse;
    requirementTrailer: TrailerTypeResponse;
    requirementLength: string;
    requirementDoor: string;
    requirementSuspension: string;
    requirementYear: string;
    requirementLiftgate: string;
    driverMessage: string;
    milesLoaded: ISingleValue;
    milesEmpty: number;
    milesTotal: ISingleValue;
    billingPayTerm: string;
    billingAgeUnpaid: ISingleValue;
    billingAgePaid: ISingleValue;
    billingRatePerMile: ISingleValue;
    billingLayover: ISingleValue;
    billinglumper: ISingleValue;
    billingFuelSurcharge: ISingleValue;
    billingEscort: ISingleValue;
    billingDetention: ISingleValue;
    billingRate: number;
    billingAdjustedRate: number;
    billingPaid: ISingleValue;
    billingDue: ISingleValue;
    totalDue: number;
    dateInvoiced: ISingleValue;
    datePaid: ISingleValue;
    dateCreated: ISingleValue;
    dateEdited: ISingleValue;
    fileCount: number;
    comments: IComment[];
    note: string;
    tableDropdownContent: IDropdownMenuItem[];
    tableAttachments?: FileResponse[];
    tableAttachmentTags?: DocumentsDrawerTag[];
}
