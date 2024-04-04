export interface OwnerFilter {
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