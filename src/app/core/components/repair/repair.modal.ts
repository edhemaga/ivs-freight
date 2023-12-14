import { RepairResponse } from 'appcoretruckassist';
import { ConstantStringTableComponentsEnum } from '../../utils/enums/table-components.enums';

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
