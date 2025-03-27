// interfaces
import { IMilesModel, IMilesState } from '@pages/miles/interface';
import { IStateFilters } from '@shared/interfaces';
import { ITableColumn } from '@shared/components/new-table/interface';

// enums
import { eActiveViewMode, eGeneralActions } from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';

// models
import {
    MilesByUnitPaginatedStopsResponse,
    SortOrder,
} from 'appcoretruckassist';

export const updateTruckCounts = function (
    state: IMilesState,
    activeTruckCount: number,
    inactiveTruckCount: number
): IMilesState {
    return {
        ...state,
        tableViewData: [
            { ...state.tableViewData[0], length: activeTruckCount },
            { ...state.tableViewData[1], length: inactiveTruckCount },
        ],
    };
};

export const changeViewMode = function (
    state: IMilesState,
    activeViewMode: eActiveViewMode
): IMilesState {
    return {
        ...state,
        activeViewMode,
        selectedCount: 0,
        hasAllItemsSelected: false,
        unitsPagination: {
            ...state.unitsPagination,
            activeUnitIndex: 0,
        },
    };
};

export const updateMilesData = function (
    state: IMilesState,
    miles: IMilesModel[],
    totalResultsCount: number
): IMilesState {
    return {
        ...state,
        items: miles,
        loading: false,
        unitsPagination: {
            ...state.unitsPagination,
            activeUnitIndex: 0,
            totalResultsCount,
        },
    };
};

export const updateMilesListData = function (
    state: IMilesState,
    miles: IMilesModel[]
): IMilesState {
    const items = [...state.items, ...miles];

    return {
        ...state,
        items,
        // New items are not selected no need to filter it
        unitsPagination: {
            ...state.unitsPagination,
            currentPage: state.unitsPagination.currentPage + 1,
        },
    };
};

export const toggleRowSelection = function (
    state: IMilesState,
    mile: IMilesModel
): IMilesState {
    const updatedItems = state.items.map((item) =>
        item.id === mile.id ? { ...item, isSelected: !item.isSelected } : item
    );

    const newSelectedCount = updatedItems.filter(
        (item) => item.isSelected
    ).length;

    return {
        ...state,
        items: updatedItems,
        selectedCount: newSelectedCount,
        hasAllItemsSelected: newSelectedCount === updatedItems.length,
    };
};

export const toggleSelectAll = function (
    state: IMilesState,
    action: string
): IMilesState {
    const hasAllItemsSelected =
        action === eGeneralActions.SELECT_ALL ||
        action === eGeneralActions.CLEAR_SELECTED
            ? !state.hasAllItemsSelected
            : true;

    const updatedItems = state.items.map((item) => ({
        ...item,
        isSelected: hasAllItemsSelected,
    }));

    return {
        ...state,
        items: updatedItems,
        selectedCount: hasAllItemsSelected && updatedItems.length,
        hasAllItemsSelected,
    };
};

export const updateFilters = function (
    state: IMilesState,
    filters: IStateFilters
): IMilesState {
    return {
        ...state,
        filters,
        selectedCount: 0,
        hasAllItemsSelected: false,
    };
};

export const updateTabSelection = function (
    state: IMilesState,
    selectedTab: eMileTabs
): IMilesState {
    return {
        ...state,
        selectedTab,
        selectedCount: 0,
        filters: {},
        hasAllItemsSelected: false,
    };
};

export const setUnitDetails = function (
    state: IMilesState,
    details: MilesByUnitPaginatedStopsResponse,
    isLast: boolean
): IMilesState {
    return {
        ...state,
        details,
        unitsPagination: {
            ...state.unitsPagination,
            isLastUnit: isLast,
            isFirstUnit: true,
        },
    };
};
export const setFollowingUnitDetails = function (
    state: IMilesState,
    details: MilesByUnitPaginatedStopsResponse,
    activeUnitIndex: number,
    isFirstUnit: boolean,
    isLastUnit: boolean,
    isLastInCurrentList: boolean
): IMilesState {
    const { unitsPagination } = state;
    return {
        ...state,
        details,
        unitsPagination: {
            ...unitsPagination,
            isFirstUnit,
            isLastUnit,
            activeUnitIndex,
            isLastInCurrentList,
        },
    };
};

export const toggleTableLockingStatus = function (
    state: IMilesState
): IMilesState {
    const { tableSettings } = state;
    return {
        ...state,
        tableSettings: {
            ...tableSettings,
            isTableLocked: !tableSettings.isTableLocked,
        },
    };
};
export function pinTableColumn(
    state: IMilesState,
    column: ITableColumn
): IMilesState {
    function togglePinned(columns: ITableColumn[]): ITableColumn[] {
        return columns.map((col) => {
            if (col.key === column.key) {
                // Use left as pinned side
                return { ...col, pinned: col.pinned ? undefined : 'left' };
            }
            if (col.columns && col.columns.length) {
                // Check all sub group column
                return { ...col, columns: togglePinned(col.columns) };
            }
            return col;
        });
    }

    return {
        ...state,
        columns: togglePinned(state.columns),
    };
}

export function tableSortingChange(
    state: IMilesState,
    column: ITableColumn
): IMilesState {
    let updatedSortKey = column.key;
    let updatedSortDirection: SortOrder | null = SortOrder.Ascending;

    function toggleSort(columns: ITableColumn[]): ITableColumn[] {
        return columns.map((col) => {
            if (col.key === column.key) {
                if (col.direction === SortOrder.Ascending) {
                    updatedSortDirection = SortOrder.Descending;
                } else if (col.direction === SortOrder.Descending) {
                    updatedSortDirection = null;
                } else {
                    updatedSortDirection = SortOrder.Ascending;
                }

                return { ...col, direction: updatedSortDirection };
            }

            // Reset all the other columns
            return {
                ...col,
                direction: null,
                columns: col.columns ? toggleSort(col.columns) : col.columns,
            };
        });
    }

    return {
        ...state,
        columns: toggleSort(state.columns),
        tableSettings: {
            ...state.tableSettings,
            sortDirection: updatedSortDirection,
            sortKey: updatedSortDirection ? updatedSortKey : null,
        },
    };
}

export function onSearchChange(
    state: IMilesState,
    search: string
): IMilesState {
    return {
        ...state,
        unitsPagination: {
            ...state.unitsPagination,
            search,
        },
    };
}
