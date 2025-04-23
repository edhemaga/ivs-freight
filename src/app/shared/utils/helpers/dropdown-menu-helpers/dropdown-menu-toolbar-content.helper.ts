// enums
import { eCardFlipViewMode, eCommonElement } from '@shared/enums';

// interfaces
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

// helpers
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

export class DropdownMenuToolbarContentHelper {
    static getToolbarDropdownMenuContent(
        activeViewMode: eCommonElement,
        isTableLocked: boolean,
        cardFlipViewMode: eCardFlipViewMode,
        isColumnsDropdownActive: boolean,
        columnsList?: IDropdownMenuItem[]
    ): IDropdownMenuItem[] {
        return !isColumnsDropdownActive
            ? activeViewMode === eCommonElement.CARD
                ? DropdownMenuContentHelper.getCardToolbarDropdownContent(
                      cardFlipViewMode
                  )
                : DropdownMenuContentHelper.getToolbarDropdownContent(
                      isTableLocked
                  )
            : DropdownMenuContentHelper.getToolbarColumnsDropdownContent(
                  columnsList
              );
    }
}
