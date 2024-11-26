import { MapDropdownContent } from 'ca-components/lib/components/ca-map-dropdown/models';

export class ShipperMapDropdownHelper {
    static getShipperMapDropdownConfig(
        data,
        isCluster?: boolean
    ): MapDropdownContent {
        return {
            mainContent: [
                {
                    template: 'header-title',
                    field: 'businessName',
                    customClassText: 'text-ellipsis uppercase',
                    hasBackButton: isCluster,
                },
                !data?.status
                    ? {
                          template: 'subtitle',
                          field: '',
                          title: 'Permanently Closed',
                          customClassText:
                              'ca-font-semi-bold red-text uppercase mb-1',
                      }
                    : null,
                { template: 'rating-review', field: 'tableRaiting' },
                { template: 'divider', field: '' },
                data?.phone
                    ? {
                          template: 'icon-text',
                          field: 'phone',
                          url: 'assets/ca-components/svg/map/phone.svg',
                          customClassContainer: 'mb-2',
                          customClassText: 'text-ellipsis',
                      }
                    : null,
                data?.email
                    ? {
                          template: 'icon-text',
                          field: 'email',
                          url: 'assets/ca-components/svg/map/email.svg',
                          customClassContainer: 'mb-2',
                          customClassText: 'text-ellipsis',
                      }
                    : null,
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
                    field: '',
                    title: 'Available Hours',
                    customClassText: 'mb-2',
                },
                {
                    template: 'side-by-side',
                    field: '',
                    sideBySideInfo: {
                        leftSide: {
                            template: 'small-subtitle',
                            customClassText: 'ca-font-bold',
                            field: '',
                            title: 'Shipping',
                        },
                        rightSide: {
                            template: 'small-subtitle',
                            customClassText: 'ca-font-bold',
                            field: '',
                            title: 'Receiving',
                        },
                    },
                },
                {
                    template: 'side-by-side',
                    field: '',
                    sideBySideInfo: {
                        leftSide: {
                            template: 'text',
                            field: 'tableAvailableHoursReceiving',
                        },
                        rightSide: {
                            template: 'text',
                            field: 'tableAvailableHoursShipping',
                        },
                    },
                },
                { template: 'divider', field: '' },
                {
                    template: 'title-count',
                    field: 'loads',
                    title: 'Load',
                    customClassContainer: 'mb-2',
                },
                {
                    template: 'side-by-side',
                    field: '',
                    sideBySideInfo: {
                        leftSide: {
                            template: 'text-count',
                            customClassText: 'black-text',
                            field: 'tableLoads',
                            secondField: 'pickups',
                            title: 'Pickup',
                        },
                        rightSide: {
                            template: 'text-count',
                            customClassText: 'dark-gray-text',
                            field: 'tableLoads',
                            secondField: 'deliveries',
                            title: 'Delivery',
                        },
                    },
                },
                {
                    template: 'side-by-side',
                    field: '',
                    sideBySideInfo: {
                        leftSide: {
                            template: 'text-count',
                            customClassText: 'small-text gray-text',
                            field: 'tableAverageWatingTimePickup',
                            title: 'Avg. Loading',
                        },
                        rightSide: {
                            template: 'text-count',
                            customClassText: 'small-text gray-text',
                            field: 'tableAverageWatingTimeDelivery',
                            title: 'Avg. Offloading',
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
                            field: 'tableAdded',
                            url: 'assets/svg/common/date.svg',
                            iconTooltipText: 'Date Added',
                        },
                        rightSide: {
                            template: 'icon-text',
                            field: !data?.status
                                ? 'tableEdited'
                                : data?.tableLastUsed
                                ? 'tableLastUsed'
                                : 'tableEdited',
                            url: !data?.status
                                ? 'assets/ca-components/svg/map/ic_date_deactivated.svg'
                                : data?.tableLastUsed
                                ? 'assets/svg/common/ic_date_checked.svg'
                                : 'assets/ca-components/svg/map/accident_calender.svg',
                            iconTooltipText: !data?.status
                                ? 'Permanently Closed'
                                : data?.tableLastUsed
                                ? 'Last Used'
                                : 'Last Edited',
                        },
                    },
                },
            ],
        };
    }
}
