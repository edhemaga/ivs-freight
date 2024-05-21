export interface TruckFilter {
    active: number;
    pageIndex: number;
    pageSize: number;
    truckType?: number[] | undefined;
    companyId: number;
    sort: string;
    searchOne: string;
    searchTwo: string;
    searchThree: string;
}
