export interface PMTruckFilter {
    truckId?: number;
    hideInactivePMs?: number;
    truckTypeId?: number[];
    pageIndex?: number;
    pageSize?: number;
    companyId?: number;
    sort?: string;
    searchOne?: string;
    searchTwo?: string;
    searchThree?: string;
}
