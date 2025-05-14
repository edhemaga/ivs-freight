// enums
import { eActiveViewMode, eCardFlipViewMode } from '@shared/enums';

// interfaces
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

// helpers
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

export class MilesDropdownMenuHelper {
    static getToolbarDropdownMenuContent(
        activeViewMode: eActiveViewMode,
        isTableLocked: boolean,
        cardFlipViewMode: eCardFlipViewMode,
        isColumnsDropdownActive: boolean,
        milesColumnsList?: IDropdownMenuItem[]
    ): IDropdownMenuItem[] {
        return !isColumnsDropdownActive
            ? activeViewMode === eActiveViewMode.Card
                ? DropdownMenuContentHelper.getCardToolbarDropdownContent(
                      cardFlipViewMode
                  )
                : DropdownMenuContentHelper.getToolbarDropdownContent(
                      isTableLocked
                  )
            : DropdownMenuContentHelper.getToolbarColumnsDropdownContent(
                  milesColumnsList
              );
    }
}
