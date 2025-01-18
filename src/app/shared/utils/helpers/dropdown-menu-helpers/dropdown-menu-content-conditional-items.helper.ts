import { DropdownMenuContentConstants } from '@shared/utils/constants';

// enums
import { DropdownMenuStringEnum } from '@shared/enums/dropdown-menu-content-string.enum';

// models
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';

export class DropdownMenuContentConditionalItemsHelper {
    // conditional items
    static getConditionalItems(
        requestedItemTitles: string[],
        isSharedConditionalItems: boolean,
        modifiers?: Partial<DropdownMenuItem>[]
    ): DropdownMenuItem[] {
        const dropdownMenuItems = isSharedConditionalItems
            ? DropdownMenuContentConstants.DROPDOWN_MENU_SHARED_ITEMS
            : DropdownMenuContentConstants.DROPDOWN_MENU_CONDITIONAL_ITEMS;

        // if no specific items are requested, return all items
        const requestedItems =
            Array.isArray(requestedItemTitles) && !requestedItemTitles.length
                ? Object.values(dropdownMenuItems)
                : requestedItemTitles.map((title) => dropdownMenuItems[title]);

        // map requested item - optional modifiers
        const mapDropdownMenuItems = () => {
            return requestedItems.map((item) => {
                const modifier = modifiers?.find(
                    (modifier) => modifier.title === item?.title
                );

                return modifier ? { ...item, ...modifier } : item;
            });
        };

        return mapDropdownMenuItems();
    }

    // modifier items

    // owner
    static getOwnerModifierItems(
        isActiveOwner: boolean
    ): Partial<DropdownMenuItem>[] {
        return [
            {
                title: DropdownMenuStringEnum.EDIT,
                isDisabled: !isActiveOwner,
            },
            {
                title: DropdownMenuStringEnum.ADD_TRUCK,
                isDisabled: !isActiveOwner,
            },
            {
                title: DropdownMenuStringEnum.ADD_TRAILER,
                isDisabled: !isActiveOwner,
            },
        ];
    }

    // repair
    static getRepairModifierItems(
        isTruckRepair: boolean
    ): Partial<DropdownMenuItem>[] {
        const svgUrl = isTruckRepair
            ? 'assets/svg/common/ic_truck.svg'
            : 'assets/svg/common/ic_trailer.svg';

        return [
            {
                title: DropdownMenuStringEnum.ALL_ORDERS,
                svgUrl,
            },
            {
                title: DropdownMenuStringEnum.ALL_BILLS,
                svgUrl,
            },
        ];
    }

    // repair shop
    static getRepairShopModifierItems(
        isOpenBusiness: boolean,
        isCompanyOwned: boolean
    ): Partial<DropdownMenuItem>[] {
        return [
            {
                title: DropdownMenuStringEnum.EDIT,
                isDisabled: !isOpenBusiness,
            },
            {
                title: DropdownMenuStringEnum.ADD_REPAIR_BILL,
                isDisabled: !isOpenBusiness,
                hasBorder: false,
            },
            {
                title: DropdownMenuStringEnum.MARK_AS_FAVORITE,
                isDisabled: !isOpenBusiness || isCompanyOwned,
            },
            {
                title: DropdownMenuStringEnum.UNMARK_FAVORITE,
                isDisabled: !isOpenBusiness,
            },
        ];
    }

    // truck - trailer
    static getTruckTrailerModifierItems(
        isActiveVehicle: boolean
    ): Partial<DropdownMenuItem>[] {
        return [
            {
                title: DropdownMenuStringEnum.EDIT,
                isDisabled: !isActiveVehicle,
            },
            {
                title: DropdownMenuStringEnum.ADD_NEW,
                isDisabled: !isActiveVehicle,
            },
        ];
    }

    // driver
    static getDriverModifierItems(
        isActiveDriver: boolean
    ): Partial<DropdownMenuItem>[] {
        return [
            {
                title: DropdownMenuStringEnum.EDIT,
                isDisabled: !isActiveDriver,
            },
            {
                title: DropdownMenuStringEnum.SEND_MESSAGE,
                isDisabled: !isActiveDriver,
            },
            {
                title: DropdownMenuStringEnum.ADD_NEW,
                isDisabled: !isActiveDriver,
            },
            {
                title: DropdownMenuStringEnum.REQUEST,
                isDisabled: !isActiveDriver,
            },
        ];
    }
}
