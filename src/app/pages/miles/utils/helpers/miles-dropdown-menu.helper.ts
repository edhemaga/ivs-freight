import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

export class MilesDropdownMenuHelper {
    static getToolbarDropdownMenuContent(
        isTableLocked: boolean,
        isColumnsDropdownActive: boolean,
        milesColumnsList?: IDropdownMenuItem[]
    ): IDropdownMenuItem[] {
        return !isColumnsDropdownActive
            ? DropdownMenuContentHelper.getMilesToolbarDropdownContent(
                  isTableLocked
              )
            : DropdownMenuContentHelper.getMilesToolbarColumnsDropdownContent(
                  milesColumnsList
              );
    }
}
