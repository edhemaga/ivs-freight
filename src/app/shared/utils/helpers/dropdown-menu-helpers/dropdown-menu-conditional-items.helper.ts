import { DropdownMenuConstants } from '@shared/utils/constants';

// models
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';

export class DropdownMenuConditionalItemsHelper {
    static getConditionalItems(
        requestedItemTitles: string[],
        isSharedConditionalItems: boolean
    ): DropdownMenuItem[] {
        const dropdownMenuItems = isSharedConditionalItems
            ? DropdownMenuConstants.DROPDOWN_MENU_SHARED_ITEMS
            : DropdownMenuConstants.DROPDOWN_MENU_CONDITIONAL_ITEMS;

        return requestedItemTitles.map((title) => dropdownMenuItems[title]);
    }
}
