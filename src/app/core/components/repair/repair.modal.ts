import {
    FileResponse,
    PMTrailerShortResponse,
    PMTruckShortResponse,
    RepairItemResponse,
    RepairResponse,
    RepairServiceTypeResponse,
} from 'appcoretruckassist';
import { ConstantStringTableComponentsEnum } from '../../utils/enums/table-components.enums';
import { DropdownItem } from '../shared/model/card-table-data.model';

export interface BodyResponseRepair {
    data?: RepairResponse;
    id?: number;
    type?: ConstantStringTableComponentsEnum;
    subType?: string;
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
