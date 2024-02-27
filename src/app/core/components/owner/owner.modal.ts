import {
    EnumValue,
    TrailerOwnerResponse,
    TruckOwnerResponse,
} from 'appcoretruckassist';

export interface OwnerBackFilterQuery {
    active: number;
    companyOwnerId: any;
    long: number;
    lat: number;
    distance: number;
    truckTypeIds: number[];
    trailerTypeIds: number[];
    pageIndex: number;
    pageSize: number;
    companyId: number;
    sort: string;
    searchOne: string;
    searchTwo: string;
    searchThree: string;
}

export interface OwnerBodyResponse {
    id: number;
    type: string;
    data: OwnerTableBodyResponse;
}

export interface MapOwnerData {
    isSelected: boolean;
    textType: string;
    textAddress: string;
    textBankName: string;
    fileCount: number;
    tableDropdownContent: {};
}

export interface OwnerBackFilterFilter {
    active: number;
    companyOwnerId: number | undefined;
    long: number | undefined;
    lat: number | undefined;
    distance: number | undefined;
    truckTypeIds: Array<number> | undefined;
    trailerTypeIds: Array<number> | undefined;
    pageIndex: number;
    pageSize: number;
    companyId: number | undefined;
    sort: string | undefined;
    searchOne: string | undefined;
    searchTwo: string | undefined;
    searchThree: string | undefined;
}

export interface OwnerTableBodyResponse {
    id?: number;
    name?: string | null;
    ownerType?: EnumValue;
    trailerCount?: number;
    truckCount?: number;
    ssnEin?: string | null;
    phone?: string | null;
    email?: string | null;
    note?: string | null;
    bankName?: string | null;
    isSelected?: boolean | null;
    accountNumber?: string | null;
    routingNumber?: string | null;
    address?: string | null;
    fileCount?: number | null;
    trucks?: Array<TruckOwnerResponse> | null;
    trailers?: Array<TrailerOwnerResponse> | null;
}
