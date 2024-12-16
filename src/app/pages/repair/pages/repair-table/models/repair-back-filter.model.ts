export interface RepairBackFilter {
    repairShopId?: number;
    unitType?: number;
    dateFrom?: string;
    dateTo?: string;
    isPM?: number;
    categoryIds?: number[];
    pmTruckTitles?: string[];
    pmTrailerTitles?: string[];
    isOrder?: boolean;
    truckNumbers?: string[];
    pageIndex?: number;
    pageSize?: number;
    costTo?: number;
    costFrom?: number;
    trailerNumbers?: string[];
    companyId?: number;
    sort?: string;
    searchOne?: string | undefined;
    searchTwo?: string | undefined;
    searchThree?: string | undefined;
}
