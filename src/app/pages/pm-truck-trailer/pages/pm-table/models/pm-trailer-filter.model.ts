export interface PMTrailerFilter {
    trailerId?: number;
    hideInactivePMs?: number;
    trailerTypeId?: number[];
    pageIndex?: number;
    pageSize?: number;
    companyId?: number;
    sort?: string;
    searchOne?: string;
    searchTwo?: string;
    searchThree?: string;
}
