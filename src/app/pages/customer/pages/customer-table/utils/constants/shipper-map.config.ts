// Models
import { SortColumn } from '@shared/components/ta-sort-dropdown/models';
import { ICaMapProps } from 'ca-components';
import { MapDropdownContent } from 'ca-components/lib/components/ca-map-dropdown/models';

export class ShipperMapConfig {
    static shipperMapConfig: ICaMapProps = {
        markers: [],
        clusterMarkers: [],
        routingMarkers: [],
    };

    static shipperMapColumns: MapDropdownContent = {
        mainContent: [
            {
                template: 'header-title',
                field: 'name',
                customClassText: 'text-ellipsis',
            },
            { template: 'rating-review', field: 'tableRaiting' },
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
                template: 'side-by-side',
                field: '',
                sideBySideInfo: {
                    leftSide: {
                        template: 'subtitle',
                        field: 'tableAvailableHoursShipping',
                        title: 'Shipping',
                    },
                    rightSide: {
                        template: 'subtitle',
                        field: 'tableAvailableHoursReceiving',
                        title: 'Receiving',
                    },
                },
            },
            { template: 'divider', field: '' },
            {
                template: 'title-count',
                field: 'loads',
                title: 'Load',
            },
            {
                template: 'side-by-side',
                field: '',
                sideBySideInfo: {
                    leftSide: {
                        template: 'title-count',
                        field: 'tableLoads.pickups',
                        title: 'Pickup',
                    },
                    rightSide: {
                        template: 'title-count',
                        field: 'tableLoads.deliveries',
                        title: 'Delivery',
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

    static shipperMapListPagination: {
        pageIndex: number;
        pageSize: number;
    } = { pageIndex: 1, pageSize: 25 };

    static shipperMapListSortColumns: SortColumn[] = [
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
            name: 'Pickup Count',
            sortName: 'pickup',
        },
        {
            name: 'Delivery Count',
            sortName: 'delivery',
        },
        {
            name: 'Avg. Pickup Time',
            sortName: 'pickupTime',
        },
        {
            name: 'Avg. Delivery Time',
            sortName: 'deliveryTime',
        },
    ];
}
