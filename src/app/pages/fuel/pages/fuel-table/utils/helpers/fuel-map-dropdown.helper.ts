import { FuelStopResponse } from 'appcoretruckassist';
import { MapDropdownContent } from 'ca-components/lib/components/ca-map-dropdown/models';

export class FuelMapDropdownHelper {
    static getFuelMapDropdownConfig(
        data: FuelStopResponse,
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
                data?.isClosed
                    ? {
                          template: 'subtitle',
                          field: '',
                          title: 'Permanently Closed',
                          customClassText:
                              'ca-font-semi-bold red-text uppercase mb-1',
                      }
                    : null,
                { template: 'divider', field: '' },
                { template: 'fuel-price-range', field: '' },
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
                {
                    template: 'icon-text',
                    field: 'address',
                    secondField: 'address',
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
                            template: 'title-count',
                            field: 'used',
                            title: 'Visited',
                        },
                        rightSide: {
                            template: 'money-text',
                            field: 'totalCost',
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
                            isDate: true,
                            field: 'createdAt',
                            url: 'assets/svg/common/date.svg',
                            iconTooltipText: 'Date Added',
                        },
                        rightSide: {
                            template: 'icon-text',
                            isDate: true,
                            field: data?.deactivatedAt
                                ? 'deactivatedAt'
                                : data?.lastUsed
                                  ? 'lastUsed'
                                  : 'updatedAt',
                            url: data?.deactivatedAt
                                ? 'assets/ca-components/svg/map/ic_date_deactivated.svg'
                                : data?.lastUsed
                                  ? 'assets/svg/common/ic_date_checked.svg'
                                  : 'assets/ca-components/svg/map/accident_calender.svg',
                            iconTooltipText: data?.deactivatedAt
                                ? 'Permanently Closed'
                                : data?.lastUsed
                                  ? 'Last Used'
                                  : 'Last Edited',
                        },
                    },
                },
            ],
        };
    }
}
