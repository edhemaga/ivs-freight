import { MultipleSelectDetailsDropdownItem } from '@shared/models/multiple-select-details-dropdown-item.model';

// models
import { ExtendedRepairShopResponse } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/models';
import { RepairShopDetailsConstants } from '@pages/repair/pages/repair-shop-details/utils/constants';
import { DetailsConfig } from '@shared/models/details-config.model';
import { DetailsDropdownOptions } from '@shared/models/details-dropdown-options.model';
import { RepairShopContactResponse } from 'appcoretruckassist';

// enums
import { EGeneralActions } from '@shared/enums';

export class RepairShopDetailsHelper {
    static getDetailsDropdownOptions(
        pinned: boolean,
        status: number,
        companyOwned: boolean
    ): DetailsDropdownOptions {
        return {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: 'Edit',
                    name: EGeneralActions.EDIT,
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    iconName: EGeneralActions.EDIT,
                    disabled: !status,
                },
                {
                    title: 'border',
                },
                {
                    title: 'Add Bill',
                    name: 'Repair',
                    svg: 'assets/svg/common/ic_plus.svg',
                    show: true,
                    blueIcon: true,
                    iconName: 'ic_plus',
                    disabled: !status,
                },
                {
                    title: !pinned ? 'Mark as Favorite' : 'Unmark Favorite',
                    name: 'move-to-favourite',
                    svg: 'assets/svg/common/ic_star.svg',
                    activate: true,
                    show: true,
                    iconName: 'ic_star',
                    blueIcon: !pinned,
                    disabled: !status || companyOwned,
                },
                {
                    title: 'Write Review',
                    name: 'write-review',
                    svg: 'assets/svg/common/review-pen.svg',
                    show: true,
                    iconName: 'write-review',
                    disabled: !status,
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    show: true,
                    iconName: 'share',
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: true,
                    iconName: 'print',
                },
                {
                    title: 'border',
                },
                {
                    title: !status ? 'Open Business' : 'Close Business',
                    name: 'close-business',
                    svg: !status
                        ? 'assets/svg/common/ic_verify-check.svg'
                        : 'assets/svg/common/close-business-icon.svg',
                    greenIcon: !status,
                    redIcon: !!status,
                    show: true,
                    iconName: 'close-business',
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    show: true,
                    redIcon: true,
                    iconName: EGeneralActions.DELETE,
                },
            ],
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
