// Models
import { ICaMapProps, SortColumn } from 'ca-components';
import { MapDropdownContent } from 'ca-components/lib/components/ca-map-dropdown/models';

export class RepairShopMapConfig {
    static repairShopMapConfig: ICaMapProps = {
        markers: [],
        clusterMarkers: [],
        routingMarkers: [],
        mapType: 'repair-shop',
    };

    static repairShopMapColumns: MapDropdownContent = {
        mainContent: [
            {
                template: 'header-title',
                field: 'name',
                customClassText: 'text-ellipsis',
            },
            { template: 'rating-review', field: 'tableRaiting' },
            { template: 'divider', field: '' },
            { template: 'repair-shop-services', field: 'tableShopServices' },
            { template: 'divider', field: '' },
            {
                template: 'icon-text',
                field: 'phone',
                url: 'assets/ca-components/svg/map/phone.svg',
                customClassContainer: 'mb-2',
                customClassText: 'text-ellipsis',
            },
            {
                template: 'icon-text',
                field: 'email',
                url: 'assets/ca-components/svg/map/email.svg',
                customClassContainer: 'mb-2',
                customClassText: 'text-ellipsis',
            },
            {
                template: 'icon-text',
                field: 'tableAddress',
                url: 'assets/ca-components/svg/map/address.svg',
                customClassText: 'text-ellipsis two-rows-ellipsis',
            },
        ],
        expandedContent: [
            { template: 'divider', field: '' },
            {
                template: 'subtitle',
                field: 'tableOpenHours',
                title: 'Working Hours',
            },
            { template: 'divider', field: '' },
            {
                template: 'side-by-side',
                field: '',
                sideBySideInfo: {
                    leftSide: {
                        template: 'title-count',
                        field: 'tableRepairCountOrder',
                        title: 'Repair',
                    },
                    rightSide: {
                        template: 'money-text',
                        field: 'tableExpense',
                        title: 'Expense',
                    },
                },
            },
            { template: 'divider', field: '' },
            {
                template: 'side-by-side',
                field: '',
                sideBySideInfo: {
                    leftSide: {
                        template: 'icon-text',
                        field: 'tableEdited',
                        url: 'assets/ca-components/svg/map/calender_last_used.svg',
                    },
                    rightSide: {
                        template: 'icon-text',
                        field: 'tableAdded',
                        url: 'assets/ca-components/svg/map/accident_calender.svg',
                    },
                },
            },
        ],
    };

    static repairShopMapListPagination: {
        pageIndex: number;
        pageSize: number;
    } = { pageIndex: 1, pageSize: 25 };

    static repairShopMapListSortColumns: SortColumn[] = [
        {
            name: 'Business Name',
            sortName: 'name',
        },
        {
            name: 'Location',
            sortName: 'address',
            isDisabled: true,
        },
        {
            name: 'Available',
            sortName: 'openNow',
        },
        {
            name: 'Rating',
            sortName: 'rating',
        },
        {
            name: 'Date Added',
            sortName: 'dateAdded',
        },
        {
            name: 'Last Used',
            sortName: 'lastUsedDate',
        },
        {
            name: 'Bill Count',
            sortName: 'bill',
        },
        {
            name: 'Order Count',
            sortName: 'order',
        },
        {
            name: 'Total Expense',
            sortName: 'expense',
        },
    ];
}
