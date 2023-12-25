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
