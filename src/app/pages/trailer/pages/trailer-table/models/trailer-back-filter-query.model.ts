export interface TrailerBackFilterQueryInterface {
    active: number;
    pageIndex: number;
    truckType?: number[] | undefined;
    pageSize: number;
    companyId: number;
    sort: string;
    searchOne: string;
    searchTwo: string;
    searchThree: string;
}
