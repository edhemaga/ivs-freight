// models
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

// enums
import { TableStringEnum } from '@shared/enums';
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';

// helpers
import { DropdownMenuContentHelper } from '@shared/utils/helpers';
import { DropdownMenuColumnsActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

export class LoadTableHelper {
    public static capitalizeFirstLetter(value: string): string {
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
    }

    public static composeDeleteModalTitle(selectedTab: string): string {
        let result = `Delete ${selectedTab}`;

        if (eLoadStatusType[selectedTab] !== eLoadStatusType.Template)
            result = result.concat(` ${TableStringEnum.LOAD_2}`);

        return result;
    }

    static getToolbarDropdownMenuContent(
        selectedTab: string,
        isTableLocked: boolean,
        isColumnsDropdownActive: boolean,
        loadColumnsList?: IDropdownMenuItem[]
    ): IDropdownMenuItem[] {
        const tableType =
            DropdownMenuColumnsActionsHelper.getTableType(selectedTab);
        return !isColumnsDropdownActive
            ? DropdownMenuContentHelper.getLoadToolbarDropdownContent(
                  tableType,
                  isTableLocked
              )
            : DropdownMenuContentHelper.getLoadToolbarColumnsDropdownContent(
                  loadColumnsList
              );
    }
}
