import { OwnerBackFilterQuery } from '@shared/models/owner-back-filter-query.model';
import { TrailerBackFilterQueryInterface } from '@pages/trailer/pages/trailer-table/models/trailer-back-filter-query.model';
import { TruckFilter } from '@pages/truck/pages/truck-table/models/truck-filter.model'; // models
import { ShopBackFilterQuery } from '@pages/repair/pages/repair-table/models/shop-back-filter-query.model';
import { FilterOptionBroker } from '@pages/customer/pages/customer-table/models/filter-option-broker.model';
import { FilterOptionShipper } from '@pages/customer/pages/customer-table/models/filter-option-shipper.model';
import { FilterOptionDriver } from '@pages/driver/pages/driver-table/models/filter-option-driver.model';
import { FilterOptionApplicant } from '@pages/driver/pages/driver-table/models/filter-option-applicant.model';
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';
import { FilterOptionsLoad } from '@pages/load/pages/load-table/models/filter-options-load.model';
import { SortTypes } from '@shared/models/sort-types.model';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

export class TableDropdownComponentConstants {
    static LOAD_BACK_FILTER: FilterOptionsLoad = {
        loadType: null,
        statusType: 1,
        status: null,
        dispatcherId: null,
        dispatchId: null,
        brokerId: null,
        shipperId: null,
        dateFrom: null,
        dateTo: null,
        revenueFrom: null,
        revenueTo: null,
        truckId: null,
        pageIndex: 1,
        pageSize: 25,
        companyId: null,
        sort: null,
        searchOne: null,
        searchTwo: null,
        searchThree: null,
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

    static BROKER_BACK_FILTER: FilterOptionBroker = {
        ban: null,
        dnu: null,
        invoiceAgeingFrom: null,
        invoiceAgeingTo: null,
        availableCreditFrom: null,
        availableCreditTo: null,
        revenueFrom: null,
        revenueTo: null,
        pageIndex: 1,
        pageSize: 25,
        companyId: null,
        sort: null,
        searchOne: null,
        searchTwo: null,
        searchThree: null,
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
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'regular',
        },
        {
            title: 'Hire Applicant',
            name: 'hire-applicant',
            mutedStyle: true,
            svgUrl: 'assets/svg/common/ic_hire-applicant.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'hire-applicant',
        },
        {
            title: 'Review',
            name: 'review',
            mutedStyle: true,
            svgUrl: 'assets/svg/common/ic_pen.svg',
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
            title: 'Mark as Favourite',
            name: 'add-to-favourites',
            svgUrl: 'assets/svg/common/ic_star.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            svgClass: 'favourite',
        },
        {
            title: 'Resend Invitation',
            name: 'resend-invitation',
            svgUrl: 'assets/svg/common/ic_resend-invitation.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
            hasBorder: true,
            svgClass: 'regular',
        },
        {
            title: 'Share',
            name: 'share',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
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
            title: 'Print',
            name: 'print',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            hasBorder: true,
            svgClass: 'regular',
        },
        {
            title: 'Move to Archive',
            name: 'move-to-archive',
            svgUrl: 'assets/svg/common/ic_driver_arhive.svg',
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

    static DRIVER_BACK_FILTER_QUERY: TruckFilter = {
        active: 1,
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
        pageIndex: 1,
        pageSize: 25,
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
            name: 'favorite',
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
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: TableStringEnum.REGULAR,
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
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: TableStringEnum.REGULAR,
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
            svgClass: TableStringEnum.REGULAR,
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

    static SORT_TYPES: SortTypes[] = [
        { name: 'Business Name', id: 1, sortName: 'name' },
        { name: 'Location', id: 2, sortName: 'location', isHidden: true },
        { name: 'Favorites', id: 8, sortName: 'favorites' },
        { name: 'Fuel Price', id: 9, sortName: 'fuelPrice' },
        { name: 'Last Used Date', id: 5, sortName: 'updatedAt  ' },
        { name: 'Purchase', id: 6, sortName: 'purchase' },
        { name: 'Total Cost', id: 7, sortName: 'cost' },
    ];

    static DROPDOWN_FUEL_CONTENT: DropdownItem[] = [
        {
            title: TableStringEnum.EDIT_2,
            name: TableStringEnum.EDIT,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Edit.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            hasBorder: true,
            svgClass: TableStringEnum.REGULAR,
        },
        {
            title: TableStringEnum.VIEW_DETAILS_2,
            name: TableStringEnum.VIEW_DETAILS,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Information.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: TableStringEnum.REGULAR,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: TableStringEnum.SHARE_2,
            name: TableStringEnum.SHARE,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Share.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: TableStringEnum.REGULAR,
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
        },
        {
            title: TableStringEnum.PRINT_2,
            name: TableStringEnum.PRINT,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Print.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: TableStringEnum.REGULAR,
            hasBorder: true,
        },
        {
            title: TableStringEnum.DELETE_2,
            name: TableStringEnum.DELETE_ITEM,
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: TableStringEnum.DELETE,
        },
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

    static DROPDOWN_CONTACTS_CONTENT: DropdownItem[] = [
        {
            title: 'Edit',
            name: 'edit-contact',
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
            title: 'Send SMS',
            name: 'send-sms',
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
            name: 'delete-contact',
            svgUrl: 'assets/svg/truckassist-table/new-list-dropdown/Delete.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'delete',
        },
    ];

    static DROPDOWN_PM_CONTENT: DropdownItem[] = [
        {
            title: 'Configure',
            name: 'configure',
            svgUrl: 'assets/svg/common/ic_settings.svg',
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
            title: 'Add Repair Bill',
            name: 'add-repair-bill',
            svgUrl: 'assets/svg/truckassist-table/dropdown/content/add.svg',
            svgStyle: {
                width: 18,
                height: 18,
            },
            svgClass: 'activate',
            tableListDropdownContentStyle: {
                'margin-bottom.px': 4,
            },
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
        },
    ];

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
