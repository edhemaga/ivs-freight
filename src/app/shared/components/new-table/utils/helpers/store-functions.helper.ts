// enums
import { SortOrder } from 'appcoretruckassist';

// interfaces
import {
    ITableColumn,
    ITableReorderAction,
} from '@shared/components/new-table/interface';

export class StoreFunctionsHelper {
    static mapColumnsVisibility(
        columns: ITableColumn[],
        columnKey: string,
        isActive: boolean
    ): ITableColumn[] {
        return columns.map((column) => {
            const isParentMatch = column.key === columnKey;
            const hasChildren = Array.isArray(column.columns);

            if (isParentMatch) {
                return {
                    ...column,
                    isChecked: isActive,
                    pinned: null,
                    ...(hasChildren && {
                        columns: column.columns!.map((child) => ({
                            ...child,
                            isChecked: isActive,
                        })),
                    }),
                };
            }

            if (hasChildren) {
                const columns = column.columns!.map((child) =>
                    child.key === columnKey
                        ? { ...child, isChecked: isActive, pinned: null }
                        : child
                );

                const isChecked = columns.some((child) => child.isChecked);

                return {
                    ...column,
                    columns,
                    isChecked,
                };
            }

            return column;
        });
    }

    static togglePinned(
        column: ITableColumn,
        columns: ITableColumn[]
    ): ITableColumn[] {
        return columns.map((col) =>
            col.key === column.key
                ? { ...col, pinned: col.pinned ? null : 'left' }
                : col
        );
    }

    static toggleSort(
        column: ITableColumn,
        columns: ITableColumn[]
    ): {
        columns: ITableColumn[];
        sortKey: string;
        sortDirection: SortOrder | null;
    } {
        const { sortName, key } = column;

        let updatedSortKey = sortName;
        let updatedSortDirection: SortOrder | null = SortOrder.Ascending;

        function toggleSort(cols: ITableColumn[]): ITableColumn[] {
            return cols.map((col) => {
                if (col.key === key) {
                    if (col.direction === SortOrder.Ascending) {
                        updatedSortDirection = SortOrder.Descending;
                    } else if (col.direction === SortOrder.Descending) {
                        updatedSortDirection = null;
                    } else {
                        updatedSortDirection = SortOrder.Ascending;
                    }

                    return {
                        ...col,
                        direction: updatedSortDirection,
                    };
                }

                return {
                    ...col,
                    direction: null,
                    ...(col.columns && { columns: toggleSort(col.columns) }),
                };
            });
        }

        const updatedColumns = toggleSort(columns);
        return {
            columns: updatedColumns,
            sortKey: updatedSortDirection ? updatedSortKey : null,
            sortDirection: updatedSortDirection,
        };
    }

    static updateColumnWidth(
        columns: ITableColumn[],
        columnId: number,
        newWidth: number
    ): ITableColumn[] {
        return columns.map((col) => {
            // if this column contains nested columns, recursively call updateColumnWidth

            if (col.columns)
                return {
                    ...col,
                    columns: this.updateColumnWidth(
                        col.columns,
                        columnId,
                        newWidth
                    ), // recursive call
                };

            // if column id matches, update the width

            if (col.id === columnId)
                return {
                    ...col,
                    width: newWidth,
                };

            return col;
        });
    }

    static reorderColumns(
        columns: ITableColumn[],
        reorderAction: ITableReorderAction
    ): ITableColumn[] {
        const { previousColumnKey, currentColumnKey, groupColumnKey } =
            reorderAction;

        const swapItems = (
            array: ITableColumn[],
            fromIndex: number,
            toIndex: number
        ): ITableColumn[] =>
            array.map((column, index) =>
                index === fromIndex
                    ? array[toIndex]
                    : index === toIndex
                      ? array[fromIndex]
                      : column
            );

        if (groupColumnKey) {
            return columns.map((column) => {
                if (column.key !== groupColumnKey) return column;

                const groupColumns = column.columns ?? [];

                const previousIndex = groupColumns.findIndex(
                    (col) => col.key === previousColumnKey
                );
                const currentIndex = groupColumns.findIndex(
                    (col) => col.key === currentColumnKey
                );

                return previousIndex > -1 && currentIndex > -1
                    ? {
                          ...column,
                          columns: swapItems(
                              groupColumns,
                              previousIndex,
                              currentIndex
                          ),
                      }
                    : column;
            });
        }

        const previousIndex = columns.findIndex(
            (col) => col.key === previousColumnKey
        );
        const currentIndex = columns.findIndex(
            (col) => col.key === currentColumnKey
        );

        return previousIndex > -1 && currentIndex > -1
            ? swapItems(columns, previousIndex, currentIndex)
            : columns;
    }
}
