import { GetOwnerListResponse } from 'appcoretruckassist';

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
    data: GetOwnerListResponse;
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
