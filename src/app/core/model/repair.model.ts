import {
    EnumValue,
    FileResponse,
    RepairItemResponse,
    RepairResponse,
    RepairServiceTypeResponse,
    RepairShopShortResponse,
    TrailerMinimalResponse,
    TruckMinimalResponse,
} from 'appcoretruckassist';
import { DropdownItem } from '../components/shared/model/card-table-data.model';

export interface BodyResponseRepair {
    data?: RepairBodyResponse;
    id?: number;
    type?: any;
    subType?: string;
}
export interface RepairBodyResponse {
    id?: number;
    companyId?: number;
    repairType?: EnumValue;
    unitType?: EnumValue;
    truckId?: number | null;
    truck?: TruckMinimalResponse;
    trailerId?: number | null;
    trailer?: TrailerMinimalResponse;
    odometer?: number | null;
    status?: number | null;
    date?: string | null;
    invoice?: string | null;
    repairShop?: RepairShopShortResponse;
    total?: number | null;
    serviceTypes?: Array<RepairServiceTypeResponse> | null;
    note?: string | null;
    createdAt?: string;
    updatedAt?: string;
    items?: Array<RepairItemResponse> | null;
    files?: Array<FileResponse> | null;
    fileCount?: number | null;
}

export interface RepairBackFilterModal {
    repairShopId: number;
    unitType: number;
    dateFrom: string;
    dateTo: string;
    isPM: number;
    categoryIds: Array<number>;
    pmTruckTitles: Array<string>;
    pmTrailerTitles: Array<string>;
    isOrder: boolean;
    truckId: number;
    pageIndex: number;
    pageSize: number;
    companyId: number;
    sort: string;
    searchOne: string | undefined;
    searchTwo: string | undefined;
    searchThree: string | undefined;
}

export interface ShopbBckFilterQueryInterface {
    active?: number;
    pinned?: boolean;
    companyOwned?: boolean;
    categoryIds?: number[];
    long?: number;
    lat?: number;
    distance?: number;
    costFrom?: number;
    costTo?: number;
    pageIndex?: number;
    pageSize?: number;
    companyId?: number;
    sort?: string;
    searchOne: string;
    searchTwo: string;
    searchThree: string;
}

export interface MapList {
    isSelected: boolean;
    id: number;
}

export interface MapedTruckAndTrailer extends RepairResponse {
    isSelected: boolean;
    isRepairOrder: boolean;
    tableUnit: string;
    tableType: string;
    tableMake: string;
    tableModel: string;
    tableYear: string;
    tableOdometer: string;
    tableIssued: string;
    tableShopName: string;
    tableShopAdress: string;
    tableServices: RepairServiceTypeResponse[];
    tableDescription: string;
    tabelDescriptionDropTotal: string;
    tableCost: string;
    tableAdded: string;
    tableEdited: string;
    tableAttachments: FileResponse[];
    tableDropdownContent: {
        hasContent: boolean;
        content: DropdownItem[];
    };
    descriptionItems: Array<RepairItemResponse>;
}

export interface ShopBackFilterModal {
    active?: number;
    pinned?: boolean | undefined;
    companyOwned?: boolean | undefined;
    categoryIds?: Array<number> | undefined;
    long?: number | undefined;
    lat?: number | undefined;
    visitedByMe?: boolean;
    driverId?: number;
    distance?: number | undefined;
    costFrom?: number | undefined;
    costTo?: number | undefined;
    pageIndex?: number;
    pageSize?: number;
    companyId?: number | undefined;
    sort?: string | undefined;
    searchOne: string | undefined;
    searchTwo: string | undefined;
    searchThree: string | undefined;
}
