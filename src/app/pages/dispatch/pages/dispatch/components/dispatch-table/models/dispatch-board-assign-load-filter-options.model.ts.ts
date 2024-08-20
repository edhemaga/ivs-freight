export interface DispatchBoardAssignLoadFilterOptions {
    dispatchId?: number;
    truckType?: number[];
    trailerType?: number[];
    _long?: number;
    lat?: number;
    distance?: number;
    dispatcherId?: number;
    dateFrom?: string;
    dateTo?: string;
    pageIndex?: number;
    pageSize?: number;
    companyId?: number;
    sort?: string;
    search?: string;
    search1?: string;
    search2?: string;
}
