import { PMTrailerFilter } from '@pages/pm-truck-trailer/pages/pm-table/models/pm-trailer-filter.model';

export class PMTrailerFilterConstants {
    static pmTrailerFilterQuery: PMTrailerFilter = {
        trailerId: undefined,
        hideInactivePMs: undefined,
        trailerTypeId: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };
}
