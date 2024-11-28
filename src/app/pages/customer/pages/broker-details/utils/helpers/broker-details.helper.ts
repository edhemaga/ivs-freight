// Models
import { DetailsConfig } from '@shared/models/details-config.model';
import { MultipleSelectDetailsDropdownItem } from '@shared/models/multiple-select-details-dropdown-item.model';
import { BrokerResponseData } from '@pages/customer/pages/broker-details/models/';
import { LoadsSortDropdownModel } from '@pages/customer/models/loads-sort-dropdown.model';

// Enums
import { LoadFilterStringEnum } from '@pages/load/pages/load-table/enums/load-filter-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { BrokerDetailsStringEnum } from '@pages/customer/pages/broker-details/enums';

// Constants
import { BrokerConstants } from '@pages/customer/pages/broker-details/utils/constants/';

export class BrokerDetailsHelper {
    static getBrokerDetailsConfig(
        data: BrokerResponseData,
        dropdownItemId: number = 1,
        loadSortId: number = 1
    ): DetailsConfig[] {
        return [
            {
                id: 0,
                nameDefault: BrokerDetailsStringEnum.BROKER_DETAIL,
                template: BrokerDetailsStringEnum.GENERAL,
                data: data,
            },
            {
                id: 1,
                nameDefault:
                    dropdownItemId === 1
                        ? LoadFilterStringEnum.PENDING_2
                        : dropdownItemId === 2
                        ? LoadFilterStringEnum.ACTIVE_2
                        : dropdownItemId === 3
                        ? LoadFilterStringEnum.CLOSED_2
                        : LoadFilterStringEnum.LOAD,
                template: BrokerDetailsStringEnum.LOAD_2,
                icon: true,
                hasArrowDown: false,
                length: data?.loadStops?.loads?.data?.length ?? 0,
                hasCost: true,
                hide: false,
                hasArrow: false,
                brokerLoadDrop: false,
                customText: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                total: data?.loadStops?.totalRevenue,
                hasSearch: true,
                searchPlaceholder: BrokerDetailsStringEnum.LOAD,
                timeFilter: true,
                dispatcherFilter: true,
                statusFilter: true,
                locationFilter: true,
                moneyFilter: true,
                data: data,
                hasMultipleDetailsSelectDropdown: true,
                multipleDetailsSelectDropdown:
                    this.getMultipleSelectDetailsDropdown(data, dropdownItemId),
                hasSort: true,
                sortDropdown: this.getLoadSortDropdown(loadSortId),
            },
            {
                id: 2,
                nameDefault: BrokerDetailsStringEnum.CONTACT,
                template: BrokerDetailsStringEnum.CONTACT_2,
                length: data?.brokerContacts?.length ?? 0,
                hide: false,
                icon: true,
                hasCost: false,
                hasArrow: false,
                data: data,
            },
            {
                id: 3,
                nameDefault: BrokerDetailsStringEnum.REVIEW,
                template: BrokerDetailsStringEnum.REVIEW_2,
                length: data?.ratingReviews?.length ?? 0,
                hasCost: false,
                hide: false,
                data: data,
                hasArrow: false,
            },
        ];
    }

    static getMultipleSelectDetailsDropdown(
        data: BrokerResponseData,
        dropdownItemId: number = 1
    ): MultipleSelectDetailsDropdownItem[] {
        let multipleSelectDetailsDropdown: MultipleSelectDetailsDropdownItem[] =
            JSON.parse(
                JSON.stringify(BrokerConstants.MULTIPLE_SELECT_DETAILS_DROPDOWN)
            );

        if (dropdownItemId) {
            multipleSelectDetailsDropdown = multipleSelectDetailsDropdown.map(
                (dropdownItem) => {
                    return {
                        ...dropdownItem,
                        isActive: dropdownItem.id === dropdownItemId,
                    };
                }
            );
        }

        return multipleSelectDetailsDropdown.map((dropdownItem) => {
            return {
                ...dropdownItem,
                length: data?.loadStops?.totalLoad,
            };
        });
    }

    static getLoadSortDropdown(
        activeSortId?: number
    ): LoadsSortDropdownModel[] {
        let loadSortDropdown: LoadsSortDropdownModel[] = JSON.parse(
            JSON.stringify(BrokerConstants.BROKER_LOADS_SORT_DROPDOWN)
        );

        if (activeSortId) {
            loadSortDropdown = loadSortDropdown.map((dropdownItem) => {
                return {
                    ...dropdownItem,
                    active: dropdownItem.id === activeSortId,
                };
            });
        }

        return loadSortDropdown;
    }
}
