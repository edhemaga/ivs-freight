import { DropdownMenuContentConstants } from '@shared/utils/constants';

// models
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';

export class DropdownMenuContentConditionalItemsHelper {
    static getConditionalItems(
        requestedItemTitles: string[],
        isSharedConditionalItems: boolean
    ): DropdownMenuItem[] {
        const dropdownMenuItems = isSharedConditionalItems
            ? DropdownMenuContentConstants.DROPDOWN_MENU_SHARED_ITEMS
            : DropdownMenuContentConstants.DROPDOWN_MENU_CONDITIONAL_ITEMS;

        return requestedItemTitles.map((title) => dropdownMenuItems[title]);
    }
}
