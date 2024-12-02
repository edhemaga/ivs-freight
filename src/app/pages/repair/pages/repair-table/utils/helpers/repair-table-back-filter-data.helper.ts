import { RepairBackFilter } from '@pages/repair/pages/repair-table/models/repair-back-filter.model';

export class RepairTableBackFilterDataHelper {
    static backRepairFilterData(): RepairBackFilter {
        return {
            repairShopId: null,
            unitType: null,
            dateFrom: null,
            dateTo: null,
            isPM: null,
            categoryIds: null,
            pmTruckTitles: null,
            pmTrailerTitles: null,
            isOrder: null,
            truckNumbers: null,
            costFrom: null,
            costTo: null,
            trailerNumbers: null,
            pageIndex: 1,
            pageSize: 25,
            companyId: null,
            sort: null,
        };
    }

    static backRepairedVehiclesFilterData(): RepairBackFilter {
        return {
            repairShopId: null,
            pageIndex: 1,
            pageSize: 25,
            companyId: null,
            sort: null,
            searchOne: null,
            searchTwo: null,
            searchThree: null,
        };
    }
}
