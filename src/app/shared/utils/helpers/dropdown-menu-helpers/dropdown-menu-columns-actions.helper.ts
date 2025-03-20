// models
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { ITableColummn } from '@shared/models';
import { TableType, UpdateTableConfigCommand } from 'appcoretruckassist';

// enums
import { DropdownMenuStringEnum } from '@shared/enums';

// configs
import {
    getLoadActiveAndPendingColumnDefinition,
    getLoadClosedColumnDefinition,
    getLoadTemplateColumnDefinition,
} from '@shared/utils/settings/table-settings/load-columns';

export class DropdownMenuColumnsActionsHelper {
    static getColumnDefinition(tableType: string): ITableColummn[] {
        const columnDefinitionMap: Record<string, ITableColummn[]> = {
            [DropdownMenuStringEnum.LOAD_TEMPLATE]:
                getLoadTemplateColumnDefinition(),
            [DropdownMenuStringEnum.LOAD_REGULAR]:
                getLoadActiveAndPendingColumnDefinition(),
            [DropdownMenuStringEnum.LOAD_CLOSED]:
                getLoadClosedColumnDefinition(),
        };

        return columnDefinitionMap[tableType];
    }

    static getTableType(selectedTab: string): string {
        switch (selectedTab) {
            case DropdownMenuStringEnum.TEMPLATE:
                return 'LOAD_TEMPLATE';
            case DropdownMenuStringEnum.PENDING:
            case DropdownMenuStringEnum.ACTIVE_CAPITALIZED:
                return 'LOAD_REGULAR';
            case DropdownMenuStringEnum.CLOSED:
                return 'LOAD_CLOSED';
        }
    }

    static getDropdownMenuColumnsContent(selectedTab: string) {
        const tableType = this.getTableType(selectedTab);

        const tableColumnsConfig = JSON.parse(
            localStorage.getItem(`table-${tableType}-Configuration`)
        );

        const mappedColumns = this.mapToolbarDropdownColumns(
            tableColumnsConfig
                ? tableColumnsConfig
                : this.getColumnDefinition(tableType)
        );

        return mappedColumns;
    }

    static mapToolbarDropdownColumns(
        columns: ITableColummn[]
    ): IDropdownMenuItem[] {
        const groupedColumns: Record<string, IDropdownMenuItem> = {};
        const dropdownItems: IDropdownMenuItem[] = [];

        columns.forEach((column) => {
            if (column.ngTemplate === 'checkbox') return;

            const mappedColumn: IDropdownMenuItem = {
                title: column.title,
                type: column.field,
                isChecked: !column.hidden,
                isColumnDropdown: true,
                ...(column.disabled && { isCheckBoxDisabled: true }),
            };

            if (column.groupName) {
                if (!groupedColumns[column.groupName]) {
                    groupedColumns[column.groupName] = {
                        title: column.groupName,
                        type: column.groupName,
                        groupName: column.groupName,
                        svgClass: 'regular',
                        isChecked: false,
                        isColumnDropdown: true,
                        innerDropdownContent: [],
                    };
                    dropdownItems.push(groupedColumns[column.groupName]);
                }

                groupedColumns[column.groupName].innerDropdownContent.push(
                    mappedColumn
                );
                groupedColumns[column.groupName].isChecked ||=
                    mappedColumn.isChecked;
            } else {
                dropdownItems.push(mappedColumn);
            }
        });

        return dropdownItems;
    }

    static getConfigTableType(subType: string): TableType {
        return subType as TableType;
    }

    static getTableConfig(tableType: string): string | null {
        return localStorage.getItem(`table-${tableType}-Configuration`);
    }

    static setTableConfig(tableType: string, config: UpdateTableConfigCommand) {
        localStorage.setItem(
            `table-${tableType}-Configuration`,
            JSON.stringify(config)
        );
    }

    static clearTableConfig(tableType: string): void {
        localStorage.removeItem(`table-${tableType}-Configuration`);
    }
}
