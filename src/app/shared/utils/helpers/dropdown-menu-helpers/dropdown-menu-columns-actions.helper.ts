// models
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { ITableColummn, ITableColumn } from '@shared/models';
import { TableType, UpdateTableConfigCommand } from 'appcoretruckassist';

// enums
import { eDropdownMenu, eDropdownMenuColumns } from '@shared/enums';

// configs
import {
    getLoadActiveAndPendingColumnDefinition,
    getLoadClosedColumnDefinition,
    getLoadTemplateColumnDefinition,
} from '@shared/utils/settings/table-settings/load-columns';
import { MilesTableColumns } from '@pages/miles/utils/constants';

export class DropdownMenuColumnsActionsHelper {
    static getColumnDefinition(tableType: string): ITableColummn[] {
        const columnDefinitionMap: Record<string, ITableColummn[]> = {
            [eDropdownMenuColumns.LOAD_TEMPLATE]:
                getLoadTemplateColumnDefinition(),
            [eDropdownMenuColumns.LOAD_REGULAR]:
                getLoadActiveAndPendingColumnDefinition(),
            [eDropdownMenuColumns.LOAD_CLOSED]: getLoadClosedColumnDefinition(),
            [eDropdownMenuColumns.MILES]: getLoadClosedColumnDefinition(),
        };

        return columnDefinitionMap[tableType];
    }

    static getColumnDefinitionNew(tableType: string): ITableColumn[] {
        const columnDefinitionMap: Record<string, ITableColumn[]> = {
            [eDropdownMenuColumns.MILES]: MilesTableColumns,
        };

        return columnDefinitionMap[tableType];
    }

    static getTableType(selectedTab: string): string {
        switch (selectedTab) {
            case eDropdownMenu.TEMPLATE:
                return 'LOAD_TEMPLATE';
            case eDropdownMenu.PENDING:
            case eDropdownMenu.ACTIVE_CAPITALIZED:
                return 'LOAD_REGULAR';
            case eDropdownMenu.CLOSED:
                return 'LOAD_CLOSED';
        }
    }

    static getDropdownMenuColumnsContent(
        selectedTab: string
    ): IDropdownMenuItem[] {
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

    static getDropdownMenuColumnsContentNew() // selectedTab: string
    : IDropdownMenuItem[] {
        // const tableColumnsConfig = JSON.parse(
        //     localStorage.getItem(`table-${tableType}-Configuration`)
        // );

        // const mappedColumns = this.mapToolbarDropdownColumns(
        //     tableColumnsConfig
        //         ? tableColumnsConfig
        //         : this.getColumnDefinition(tableType)
        // );

        const mappedColumns = this.mapToolbarDropdownColumnsNew(
            this.getColumnDefinitionNew('MILES')
        );

        return mappedColumns;
    }

    static mapToolbarDropdownColumns(
        columns: ITableColummn[]
    ): IDropdownMenuItem[] {
        const groupedColumns: Record<string, IDropdownMenuItem> = {};
        const dropdownItems: IDropdownMenuItem[] = [];

        columns.forEach((column) => {
            if (column.ngTemplate === 'checkbox' || column) return;

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
            } else dropdownItems.push(mappedColumn);
        });

        return dropdownItems;
    }

    static mapToolbarDropdownColumnsNew(
        columns: ITableColumn[]
    ): IDropdownMenuItem[] {
        const dropdownItems: IDropdownMenuItem[] = [];

        columns.forEach((column) => {
            // Ako je grupni element (ima columns niz)
            if ('columns' in column) {
                const group: IDropdownMenuItem = {
                    title: column.label,
                    type: column.key,
                    groupName: column.key,
                    svgClass: 'regular',
                    isChecked: column.columns.some((col) => col.isChecked),
                    isColumnDropdown: true,
                    innerDropdownContent: column.columns.map((col) => ({
                        title: col.label,
                        type: col.key,
                        isChecked: col.isChecked ?? true,
                        isColumnDropdown: true,
                        ...(col.isDisabled && { isCheckBoxDisabled: true }),
                    })),
                };

                dropdownItems.push(group);
            } else if (column.key !== 'select') {
                // preskačemo checkbox
                const item: IDropdownMenuItem = {
                    title: column.label,
                    type: column.key,
                    isChecked: column.isChecked ?? true,
                    isColumnDropdown: true,
                    ...(column.isDisabled && { isCheckBoxDisabled: true }),
                };

                dropdownItems.push(item);
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

    static setTableConfig(
        tableType: string,
        config: UpdateTableConfigCommand
    ): void {
        localStorage.setItem(
            `table-${tableType}-Configuration`,
            JSON.stringify(config)
        );
    }

    static clearTableConfig(tableType: string): void {
        localStorage.removeItem(`table-${tableType}-Configuration`);
    }
}
