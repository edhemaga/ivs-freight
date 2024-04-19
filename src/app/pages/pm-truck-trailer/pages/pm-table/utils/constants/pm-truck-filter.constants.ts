import { PMTruckFilter } from '@pages/pm-truck-trailer/pages/pm-table/models/pm-truck-filter.model';

export class PMTruckFilterConstants {
    static pmTruckFilterQuery: PMTruckFilter = {
        truckId: undefined,
        hideInactivePMs: undefined,
        truckTypeId: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };
}
