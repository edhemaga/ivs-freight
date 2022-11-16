import { ServerResponse, ServerResponseList } from './shared/response';
import { Enums } from './shared/enums';
import { RepairShop } from './shared/repairShop';
import { HistoryData } from '../history-data/history-data.component';

export interface TruckColumn {
    name: string;
    title: string;
    resizable: boolean;
    hidden: boolean;
    disabled: boolean;
    field: string;
    width: any;
    minWidth: any;
    orderIndex: number;
    sortable: boolean;
    alignCenter: boolean;
    number: boolean;
    disableExport: boolean;
    filterable: boolean;
}

// Truck model
export interface Truck {
    id: number;
    property: number;
    type: Enums;
    make: Make;
    divisionCompany: number;
    // color: Color;
    owner: Owner;
    inspection: Inspection;
    endDateTimeStamp: number;
    ifta: Ifta;
    note: string;
    status: boolean;
    model: string;
    VIN: string;
    licensePlate: string;
    commission: any;
    companyOwned: boolean;
    tireSize: any;
    engine: any;
    checked: boolean;
    isSelected: boolean;
}

export interface TruckDataResult {
    data: Truck[];
    activeTrucks: Truck[];
    inactiveTrucks: Truck[];
}

export interface TireSize {
    id: number;
    name: string;
}

export interface Ifta {
    mileage: number;
    year: number;
    insurancePolicyNumber: string;
    emptyWeight: number;
    axises: string;
    engine: string;
}

export interface Make {
    id: any;
    name: string;
    image: string;
}

export interface Owner {
    id: any;
    name: string;
}

export interface Inspection {
    start: Date;
    end: Date;
}

export interface Items {
    id: number;
    item: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface TruckList extends ServerResponseList {
    data: Truck[];
}

export interface TruckDetail extends ServerResponse {
    data: Truck;
}

// Maintenance model
export interface Maintenance {
    id: number;
    property: { id: number; number: string };
    date: Date;
    repairShop: RepairShop;
    price: number;
    items: [Items];
    invoice: string;
    millage: string;
    total: number;
    types: MaintenanceTypes[];
}

export interface MaintenanceTypes {
    id: number;
    type: string;
}

export interface MaintenanceList extends ServerResponseList {
    data: Maintenance[];
}

export interface MaintenanceDetail extends ServerResponse {
    data: Maintenance;
}

// v2 //////////////////////////////////////////////////////////////////////////

export interface TruckTabData {
    activeTrucks: TruckData[];
    allTrucks: TruckData[];
    inactiveTrucks: TruckData[];
}

export interface TruckData {
    guid?: string;
    id?: number;
    companyId?: number;
    companyOwned: number;
    divisionFlag: number;
    ownerId?: number;
    ownerName?: string;
    truckNumber: number;
    vin: string;
    commission: number | string;
    status: number;
    doc?: TruckDoc;
    meta?: any;
    animationType?: string;
    isSelected?: boolean;
}

export interface TruckDoc {
    additionalData: TruckAdditional;
    licenseData?: TruckLicense[];
    inspectionData?: TruckInspection[];
    titleData?: TruckTitle[];
    truckLeaseData?: TruckLease[];
    activityHistory?: HistoryData[];
}

export interface TruckAdditional {
    axises?: string;
    color?: ColorData;
    emptyWeight?: string;
    engine?: any;
    insurancePolicyNumber?: string;
    make?: MakeData;
    mileage?: string;
    ipasEzpass?: string;
    model?: string;
    note?: string;
    tireSize?: number;
    type?: TypeData;
    year?: string;
    ownerName?: string;
}

export interface MakeData {
    file: string;
    name: string;
    color: string;
}

export interface TypeData {
    file: string;
    name: string;
    type: string;
    color: string;
    whiteFile: string;
    class?: string;
}

export interface ColorData {
    id: number;
    key: string;
    value: string;
    domain: string;
}

export interface TruckLicense {
    id?: string;
    startDate?: string;
    endDate?: string;
    licensePlate?: string;
    attachments?: any;
}

export interface TruckInspection {
    id?: string;
    startDate?: string;
    endDate?: string;
    attachments?: any;
}

export interface TruckTitle {
    id?: string;
    titleNumber?: string;
    startDate?: string;
    attachments?: any;
}

export interface TruckLease {
    id?: string;
    lessor?: any;
    seller?: any;
    date?: any;
    paymentAmount?: any;
    numberOfPayments?: any;
    downPayment?: any;
    attachments?: any;
}

export interface TruckOwner {
    id: number;
    ownerName: string;
    ownerType: string;
    divisionFlag: number;
}

// export interface DropdownData {
//   id: number;
//   image?: string;
//   name?: string;
//   code?: string;
//   lastName?: string;
//   trailersCount?: number;
//   truckCount?: number;
//   type?: any;
// }
////////////////////////////////////////////////////////////////////////////////
