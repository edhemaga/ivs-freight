import { OwnerBackFilterQuery } from '@shared/models/owner-back-filter-query.model';
import { TrailerBackFilterQueryInterface } from '@pages/trailer/pages/trailer-table/models/trailer-back-filter-query.model';
import { ShopBackFilterQuery } from '@pages/repair/pages/repair-table/models/shop-back-filter-query.model';
import { FilterOptionBroker } from '@pages/customer/pages/customer-table/models/filter-option-broker.model';
import { FilterOptionShipper } from '@pages/customer/pages/customer-table/models/filter-option-shipper.model';
import { FilterOptionDriver } from '@pages/driver/pages/driver-table/models/filter-option-driver.model';
import { FilterOptionApplicant } from '@pages/driver/pages/driver-table/models/filter-option-applicant.model';
import { FilterOptionsLoad } from '@pages/load/pages/load-table/models/filter-options-load.model';
import { SortTypes } from '@shared/models/sort-types.model';

export class TableDropdownComponentConstants {
    static LOAD_BACK_FILTER: FilterOptionsLoad = {
        loadType: null,
        statusType: 2,
        status: null,
        dispatcherIds: null,
        dispatcherId: null,
        dispatchId: null,
        brokerId: null,
        shipperId: null,
        dateFrom: null,
        dateTo: null,
        revenueFrom: null,
        revenueTo: null,
        truckId: null,
        driverId: null,
        pageIndex: 1,
        pageSize: 25,
        companyId: null,
        rateFrom: null,
        rateTo: null,
        paidFrom: null,
        paidTo: null,
        dueFrom: null,
        dueTo: null,
        pickup: null,
        delivery: null,
        sort: null,
        searchOne: null,
        searchTwo: null,
        searchThree: null,
    };

    static SHIPPER_LOADS_BACK_FILTER: FilterOptionsLoad = {
        loadType: null,
        statusType: null,
        status: null,
        dispatcherIds: null,
        dispatcherId: null,
        dispatchId: null,
        brokerId: null,
        shipperId: null,
        loadId: null,
        dateFrom: null,
        dateTo: null,
        revenueFrom: null,
        revenueTo: null,
        truckId: null,
        driverId: null,
        pageIndex: null,
        pageSize: null,
        companyId: null,
        rateFrom: null,
        rateTo: null,
        paidFrom: null,
        paidTo: null,
        dueFrom: null,
        dueTo: null,
        pickup: null,
        delivery: null,
        longitude: null,
        latitude: null,
        distance: null,
        sort: 'loadNumberDesc',
        searchOne: null,
        searchTwo: null,
        searchThree: null,
    };

    static BROKER_BACK_FILTER: FilterOptionBroker = {
        ban: null,
        dnu: null,
        status: null,
        invoiceAgeingFrom: null,
        invoiceAgeingTo: null,
        availableCreditFrom: null,
        availableCreditTo: null,
        revenueFrom: null,
        revenueTo: null,
        _long: null,
        lat: null,
        distance: null,
        pageIndex: 1,
        pageSize: 25,
        companyId: null,
        sort: null,
        searchOne: null,
        searchTwo: null,
        searchThree: null,
    };

    static DISPATCH_BACK_FILTER = {
        dispatcherId: null,
        teamBoard: null,
        truckTypes: null,
        trailerTypes: null,
        statuses: null,
        parkings: null,
        vacation: null,
        search: null,
        longitude: null,
        latitude: null,
        distance: null,
    };

    static SHIPPER_BACK_FILTER: FilterOptionShipper = {
        stateIds: null,
        long: null,
        lat: null,
        distance: null,
        pageIndex: 1,
        pageSize: 25,
        companyId: null,
        sort: null,
        searchOne: null,
        searchTwo: null,
        searchThree: null,
    };

    static APPLICANT_BACK_FILTER: FilterOptionApplicant = {
        applicantSpecParamsArchived: null,
        applicantSpecParamsHired: null,
        applicantSpecParamsFavourite: null,
        applicantSpecParamsPageIndex: 1,
        applicantSpecParamsPageSize: 25,
        applicantSpecParamsCompanyId: null,
        applicantSpecParamsSort: null,
        searchOne: null,
        searchTwo: null,
        searchThree: null,
    };

    static DRIVER_BACK_FILTER: FilterOptionDriver = {
        active: 1,
        long: null,
        lat: null,
        distance: null,
        pageIndex: 1,
        pageSize: 25,
        companyId: null,
        sort: null,
        searchOne: null,
        searchTwo: null,
        searchThree: null,
    };

    static BACK_FILTER_QUERY: TrailerBackFilterQueryInterface = {
        active: 1,
        trailerTypeIds: [],
        pageIndex: 1,
        pageSize: 25,
        truckType: null,
        companyId: null,
        sort: null,
        searchOne: null,
        searchTwo: null,
        searchThree: null,
    };

    static SHOP_FILTER_QUERY: ShopBackFilterQuery = {
        active: 1,
        pinned: null,
        companyOwned: null,
        categoryIds: null,
        long: null,
        lat: null,
        distance: null,
        costFrom: null,
        costTo: null,
        pageIndex: 1,
        pageSize: 25,
        companyId: null,
        sort: null,
        searchOne: null,
        searchTwo: null,
        searchThree: null,
    };

    static SORT_TYPES: SortTypes[] = [
        { name: 'Business Name', id: 1, sortName: 'name' },
        { name: 'Location', id: 2, sortName: 'location', isHidden: true },
        { name: 'Favorites', id: 8, sortName: 'favorites' },
        { name: 'Fuel Price', id: 9, sortName: 'fuelPrice' },
        { name: 'Last Used Date', id: 5, sortName: 'updatedAt  ' },
        { name: 'Purchase', id: 6, sortName: 'purchase' },
        { name: 'Total Cost', id: 7, sortName: 'cost' },
    ];

    static FUEL_PRICE_COLORS: string[] = [
        '#4CAF4F',
        '#8AC34A',
        '#FEC107',
        '#FF9800',
        '#EF5350',
        '#919191',
    ];

    static FUEL_PRICE_HOVER_COLORS: string[] = [
        '#43A047',
        '#7CB242',
        '#FFB300',
        '#FB8C00',
        '#F34235',
        '#6C6C6C',
    ];

    static OWNER_BACKFILTER_QUERY: OwnerBackFilterQuery = {
        active: 1,
        companyOwnerId: null,
        long: null,
        lat: null,
        distance: null,
        truckTypeIds: null,
        trailerTypeIds: null,
        pageIndex: 1,
        pageSize: 25,
        companyId: null,
        sort: null,
        searchOne: null,
        searchTwo: null,
        searchThree: null,
    };

    static TEXT_COLORS: string[] = [
        '#2724D666',
        '#1AB5E666',
        '#259F9466',
        '#50AC2566',
        '#DF3C3C66',
        '#FF704366',
        '#9E47EC66',
        '#DF3D8566',
        '#F89B2E66',
        '#CF961D66',
        '#865E3A66',
        '#91919166',
    ];

    static BACKGROUND_COLORS: string[] = [
        '#B7B6F1',
        '#B2E6F7',
        '#B6DFDB',
        '#C5E3B6',
        '#F4BEBE',
        '#FFCFC0',
        '#DFC2F9',
        '#F4BED6',
        '#FDDEB9',
        '#EFDCB4',
        '#D6C9BD',
        '#DADADA',
    ];
}
