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
                    (modifier) => modifier.title === item.title
                );

                return modifier ? { ...item, ...modifier } : item;
            });
        };

        return mapDropdownMenuItems();
    }

    // modifier items

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
}
