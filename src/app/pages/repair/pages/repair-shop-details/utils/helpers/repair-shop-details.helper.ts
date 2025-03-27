import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// constants
import { RepairShopDetailsConstants } from '@pages/repair/pages/repair-shop-details/utils/constants';

// enums
import { eStringPlaceholder } from '@shared/enums';

// models
import { ExtendedRepairShopResponse } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/models';
import { DetailsConfig } from '@shared/models/details-config.model';
import { DetailsDropdownOptions } from '@shared/models/details-dropdown-options.model';
import { RepairShopContactResponse } from 'appcoretruckassist';
import { MultipleSelectDetailsDropdownItem } from '@shared/models/multiple-select-details-dropdown-item.model';

export class RepairShopDetailsHelper {
    static getDetailsDropdownOptions(
        repairShopData: ExtendedRepairShopResponse
    ): DetailsDropdownOptions {
        const { pinned, status, companyOwned } = repairShopData;

        const actions = DropdownMenuContentHelper.getRepairShopDropdownContent(
            !!status,
            pinned,
            companyOwned,
            true
        );

        return {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: eStringPlaceholder.EMPTY,
                sortDirection: eStringPlaceholder.EMPTY,
                disabledColumns: [0],
                minWidth: 60,
            },
            data: repairShopData,
            actions,
            export: true,
        };
    }

    static getRepairShopDetailsConfig(
        repairShopData: ExtendedRepairShopResponse,
        dropdownItemId: number = 1
    ): DetailsConfig[] {
        const {
            repairList,
            cost,
            repairedVehicleList,
            ratingReviews,
            contacts,
            status,
        } = repairShopData;

        return [
            {
                id: 0,
                name: 'Repair Shop Detail',
                template: 'general',
                isClosedBusiness: !status,
                data: repairShopData,
            },
            {
                id: 1,
                name: 'Repair',
                template: 'repair',
                isClosedBusiness: !status,
                icon: true,
                hasSearch: true,
                hasSort: true,
                isSortBtn: true,
                hide: false,
                total: cost,
                length: repairList?.length || '0',
                data: repairShopData,
                timeFilter: true,
                truckTypeFilter: true,
                trailerTypeFilter: true,
                pmFilter: true,
                moneyFilter: true,
                repairOrderFilter: true,
            },
            {
                id: 2,
                name: 'Vehicle',
                template: 'repaired-vehicle',
                icon: false,
                hasSearch: true,
                hasSort: true,
                sortColumns: RepairShopDetailsConstants.VEHICLE_SORT_COLUMNS,
                hide: true,
                length: repairedVehicleList?.length || '0',
                data: repairShopData,
            },
            {
                id: 3,
                name: dropdownItemId === 1 ? 'Contact' : 'Review',
                template: 'contact-review',
                hasSearch: true,
                hasSort: false,
                hide: false,
                hasMultipleDetailsSelectDropdown: true,
                multipleDetailsSelectDropdown:
                    this.getMultipleSelectDetailsDropdown(
                        repairShopData,
                        dropdownItemId
                    ),
                data: repairShopData,
                length:
                    (dropdownItemId === 1
                        ? contacts?.length
                        : ratingReviews?.length) || '0',
            },
        ];
    }

    static getMultipleSelectDetailsDropdown(
        repairShop: ExtendedRepairShopResponse,
        dropdownItemId: number = 1
    ): MultipleSelectDetailsDropdownItem[] {
        let multipleSelectDetailsDropdown: MultipleSelectDetailsDropdownItem[] =
            JSON.parse(
                JSON.stringify(
                    RepairShopDetailsConstants.MULTIPLE_SELECT_DETAILS_DROPDOWN
                )
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

        return multipleSelectDetailsDropdown.map((dropdownItem, index) => {
            return {
                ...dropdownItem,
                length:
                    index === 0
                        ? repairShop?.contacts?.length
                        : repairShop?.ratingReviews?.length,
            };
        });
    }

    static filterRepairShopContacts(
        contacts: RepairShopContactResponse[],
        searchValue: string
    ): RepairShopContactResponse[] {
        return contacts.filter(
            ({ fullName, phone, email }) =>
                fullName.toLowerCase().includes(searchValue) ||
                phone.includes(searchValue) ||
                email.toLowerCase().includes(searchValue)
        );
    }
}
