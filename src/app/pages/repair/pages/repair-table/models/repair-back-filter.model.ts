export interface RepairBackFilter {
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
