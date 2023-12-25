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
