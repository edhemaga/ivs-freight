import {
    RepairBackFilterModal,
    ShopbBckFilterQueryInterface,
} from '../../components/repair/repair.modal';

import { DropdownItem } from '../../components/shared/model/cardTableData';

import {
    FilterOptionBroker,
    FilterOptionshipper,
} from '../../components/shared/model/table-components/customer.modals';

import {
    FilterOptionApplicant,
    FilterOptionDriver,
} from '../../components/shared/model/table-components/driver-modal';

import { FilterOptionsLoad } from '../../components/shared/model/table-components/load-modal';

import { backFilterQueryInterface } from '../../components/trailer/trailer.modal';

import { FilterOptions } from '../../components/truck/truck.modal';

import { OwnerBackFilterQuery } from '../../components/owner/owner.modal';
import { SortTypes } from '../../model/fuel';

// Load page
export class TableDropdownLoadComponentConstants {
    static LOAD_BACK_FILTER: FilterOptionsLoad = {
        loadType: undefined,
        statusType: 1,
        status: undefined,
        dispatcherId: undefined,
        dispatchId: undefined,
        brokerId: undefined,
        shipperId: undefined,
        dateFrom: undefined,
        dateTo: undefined,
        revenueFrom: undefined,
        revenueTo: undefined,
        truckId: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    static DROPDOWN_DATA: DropdownItem[] = [
        {
            title: 'Edit',
            name: 'edit',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            hasBorder: true,
        },

        {
            title: 'View Details',
            name: 'view-details',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            hasBorder: true,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Share',
            name: 'share',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Print',
            name: 'print',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            hasBorder: true,
        },

        {
            title: 'Delete',
            name: 'delete',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'delete',
        },
    ];
}

// Customer page
export class TableDropdownCustomerComponentConstants {
    static BROKER_BACK_FILTER: FilterOptionBroker = {
        ban: null,
        dnu: null,
        invoiceAgeingFrom: undefined,
        invoiceAgeingTo: undefined,
        availableCreditFrom: undefined,
        availableCreditTo: undefined,
        revenueFrom: undefined,
        revenueTo: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    static SHIPPER_BACK_FILTER: FilterOptionshipper = {
        stateIds: undefined,
        long: undefined,
        lat: undefined,
        distance: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    static DROPDOWN_BROKER: DropdownItem[] = [
        {
            title: 'Edit',
            name: 'edit-cutomer-or-shipper',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            hasBorder: true,
            svgClass: 'regular',
        },

        {
            title: 'View Details',
            name: 'view-details',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Create Load',
            name: 'create-load',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Add Contact',
            name: 'add-contact',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Write Review',
            name: 'write-review',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Move to Ban List',
            name: 'move-to-ban-list',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Move to DNU List',
            name: 'move-to-dnu-list',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            hasBorder: true,
        },

        {
            title: 'Share',
            name: 'share',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Print',
            name: 'print',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },

            svgClass: 'regular',
            hasBorder: true,
        },

        {
            title: 'Close Business',
            name: 'close-business',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'delete',
        },

        {
            title: 'delete',
            name: 'delete',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'delete',
        },
    ];

    static DROPDOWN_SHIPPER: DropdownItem[] = [
        {
            title: 'Edit',
            name: 'edit-cutomer-or-shipper',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            hasBorder: true,
            svgClass: 'regular',
        },

        {
            title: 'View Details',
            name: 'view-details',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Add Contact',
            name: 'add-contact',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Write Review',
            name: 'write-review',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            hasBorder: true,
        },

        {
            title: 'Share',
            name: 'share',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Print',
            name: 'print',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },

            svgClass: 'regular',
            hasBorder: true,
        },

        {
            title: 'Close Business',
            name: 'close-business',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'delete',
        },

        {
            title: 'delete',
            name: 'delete',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'delete',
        },
    ];
}

// Driver page
export class TableDropdownDriverComponentConstants {
    static APPLICANT_BACK_FILTER: FilterOptionApplicant = {
        applicantSpecParamsArchived: undefined,
        applicantSpecParamsHired: undefined,
        applicantSpecParamsFavourite: undefined,
        applicantSpecParamsPageIndex: 1,
        applicantSpecParamsPageSize: 25,
        applicantSpecParamsCompanyId: undefined,
        applicantSpecParamsSort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    static DRIVER_BACK_FILTER: FilterOptionDriver = {
        active: 1,
        long: undefined,
        lat: undefined,
        distance: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    static DROPDOWN_APPLICANT: DropdownItem[] = [
        {
            title: 'Edit',
            name: 'edit',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            hasBorder: true,
            svgClass: 'regular',
        },

        {
            title: 'View Details',
            name: 'view-details',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Hire Applicant',
            name: 'hire-applicant',
            mutedStyle: true,
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'regular',
        },

        {
            title: 'Review',
            name: 'review',
            mutedStyle: true,
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'regular',
        },

        {
            title: 'Move to Favourites',
            name: 'add-to-favourites',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgUrl: '',
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Resend Invitation',
            name: 'resend-invitation',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'regular',
            hasBorder: true,
        },

        {
            title: 'Share',
            name: 'share',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },

        {
            title: 'Print',
            name: 'print',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },

            svgClass: 'regular',
            hasBorder: true,
        },

        {
            title: 'Move to Archive',
            name: 'move-to-archive',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'delete',
        },

        {
            title: 'Delete',
            name: 'delete-applicant',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'delete',
        },
    ];
}

// Truck page
export class TableDriverColorsConstants {
    static BACK_FILTER_QUERY: FilterOptions = {
        active: 1,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    static TEXT_COLORS: string[] = [
        '#6D82C7',
        '#4DB6A2',
        '#E57373',
        '#E3B00F',
        '#BA68C8',
        '#BEAB80',
        '#81C784',
        '#FF8A65',
        '#64B5F6',
        '#F26EC2',
        '#A1887F',
        '#919191',
    ];

    static BACKGROUND_COLORS: string[] = [
        '#DAE0F1',
        '#D2EDE8',
        '#F9DCDC',
        '#F8EBC2',
        '#EED9F1',
        '#EFEADF',
        '#DFF1E0',
        '#FFE2D8',
        '#D8ECFD',
        '#FCDAF0',
        '#E7E1DF',
        '#E3E3E3',
    ];
}

// Trailer page
export class TableDropdownTrailerComponentConstants {
    static BACK_FILTER_QUERY: backFilterQueryInterface = {
        active: 1,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };
}

// Repair page
export class TableRepair {
    static BACK_FILTER_QUERY: RepairBackFilterModal = {
        repairShopId: undefined,
        unitType: 1,
        dateFrom: undefined,
        dateTo: undefined,
        isPM: undefined,
        categoryIds: undefined,
        pmTruckTitles: undefined,
        pmTrailerTitles: undefined,
        isOrder: undefined,
        truckId: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    static SHOP_FILTER_QUERY: ShopbBckFilterQueryInterface = {
        active: 1,
        pinned: undefined,
        companyOwned: undefined,
        categoryIds: undefined,
        long: undefined,
        lat: undefined,
        distance: undefined,
        costFrom: undefined,
        costTo: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    static DROPDOWN_SHOP: DropdownItem[] = [
        {
            title: 'Edit',
            name: 'edit',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            hasBorder: true,
        },
        {
            title: 'View Details',
            name: 'view-details',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'All Bill',
            name: 'all-bill',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Move to Favourite',
            name: 'move-to-favourite',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Write Review',
            name: 'write-review',
            hasBorder: true,
        },
        {
            title: 'Share',
            name: 'share',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Print',
            name: 'print',
            hasBorder: true,
        },
        {
            title: 'Close Business',
            name: 'close-business',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Delete',
            name: 'delete',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'delete',
        },
    ];

    static DROPDOWN_REPAIR: DropdownItem[] = [
        {
            title: 'Edit',
            name: 'edit',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            hasBorder: true,
        },
        {
            title: 'View Details',
            name: 'view-details',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'All Bills',
            name: 'all-bills',
            hasBorder: true,
        },
        {
            title: 'Share',
            name: 'share',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Print',
            name: 'print',
            hasBorder: true,
        },
        {
            title: 'Delete',
            name: 'delete-repair',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'delete',
        },
    ];
}

export class TablePM {
    static ACTIONS_DROPDOWN: DropdownItem[] = [
        {
            title: 'Edit',
            name: 'edit',
            class: 'regular-text',
            contentType: 'edit',
        },
        {
            title: 'Delete',
            name: 'delete',
            text: 'Are you sure you want to delete pm(s)',
            class: 'delete-text',
            contentType: 'delete',
        },
    ];
}

// Fuel page
export class TableFuel {
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
}

// Owner page
export class TableOwner {
    static BACKFILTER_QUERY: OwnerBackFilterQuery = {
        active: 1,
        companyOwnerId: undefined,
        long: undefined,
        lat: undefined,
        distance: undefined,
        truckTypeIds: undefined,
        trailerTypeIds: undefined,
        pageIndex: 1,
        pageSize: 25,
        companyId: undefined,
        sort: undefined,
        searchOne: undefined,
        searchTwo: undefined,
        searchThree: undefined,
    };

    static DROPDOWN_OWNER_CONTENT: DropdownItem[] = [
        {
            title: 'Edit',
            name: 'edit-owner',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            hasBorder: true,
            svgClass: 'regular',
        },
        {
            title: 'View Details',
            name: 'view-details',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Add Truck',
            name: 'add-truck',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Add Trailer',
            name: 'add-trailer',
            svgUrl: '',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            hasBorder: true,
        },
        {
            title: 'Share',
            name: 'share',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'regular',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: 'Print',
            name: 'print',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },

            svgClass: 'regular',
            hasBorder: true,
        },
        {
            title: 'Delete',
            name: 'delete-owner',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'delete',
        },
    ];
}
