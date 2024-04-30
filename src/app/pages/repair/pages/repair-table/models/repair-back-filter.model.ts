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
    truckNumbers: Array<string>;
    pageIndex: number;
    pageSize: number;
    costTo: number;
    costFrom: number;
    trailerNumbers: Array<string>;
    companyId: number;
    sort: string;
    searchOne: string | undefined;
    searchTwo: string | undefined;
    searchThree: string | undefined;
}
