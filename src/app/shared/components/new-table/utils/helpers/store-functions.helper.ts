// enums
import { SortOrder } from 'appcoretruckassist';

// interfaces
import { ITableColumn } from '@shared/components/new-table/interface';

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
                        ? { ...child, isChecked: isActive }
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
        return columns.map((col) => {
            if (col.key === column.key) {
                // Use left as pinned side
                return { ...col, pinned: col.pinned ? undefined : 'left' };
            }
            if (col.columns && col.columns.length) {
                // Check all sub group column
                return {
                    ...col,
                    columns: this.togglePinned(column, col.columns),
                };
            }
            return col;
        });
    }

    static toggleSort(
        columns: ITableColumn[],
        columnKey: string
    ): {
        columns: ITableColumn[];
        sortKey: string;
        sortDirection: SortOrder | null;
    } {
        let updatedSortKey: string | null = null;
        let updatedSortDirection: SortOrder | null = SortOrder.Ascending;

        function toggleSort(cols: ITableColumn[]): ITableColumn[] {
            return cols.map((col) => {
                if (col.key === columnKey) {
                    updatedSortKey = col.key;

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
                    columns: col.columns
                        ? toggleSort(col.columns)
                        : col.columns,
                };
            });
        }

        return {
            columns: toggleSort(columns),
            sortKey: updatedSortDirection ? updatedSortKey : null,
            sortDirection: updatedSortDirection,
        };
    }
}
