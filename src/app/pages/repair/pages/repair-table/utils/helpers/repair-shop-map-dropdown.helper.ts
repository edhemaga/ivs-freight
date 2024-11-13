import { MapDropdownContent } from 'ca-components/lib/components/ca-map-dropdown/models';

export class RepairShopMapDropdownHelper {
    static getRepairShopMapDropdownConfig(
        data,
        isCluster?: boolean
    ): MapDropdownContent {
        return {
            mainContent: [
                {
                    template: 'header-title',
                    field: 'name',
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
                {
                    template: 'repair-shop-services',
                    field: 'tableShopServices',
                },
                { template: 'divider', field: '' },
                {
                    template: 'icon-text',
                    field: 'phone',
                    url: 'assets/ca-components/svg/map/phone.svg',
                    customClassContainer: 'mb-2',
                    customClassText: 'text-ellipsis',
                },
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
                    template: 'open-hours',
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
                            field: 'tableAdded',
                            url: 'assets/svg/common/date.svg',
                            iconTooltipText: 'Date Added',
                        },
                        rightSide: {
                            template: 'icon-text',
                            field: !data?.status
                                ? 'tableDeactivated'
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
