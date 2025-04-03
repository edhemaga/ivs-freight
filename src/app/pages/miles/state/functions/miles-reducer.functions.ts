// interfaces
import { IMilesModel, IMilesState } from '@pages/miles/interface';
import { IStateFilters } from '@shared/interfaces';
import {
    ITableColumn,
    ITableResizeAction,
} from '@shared/components/new-table/interface';

// enums
import {
    eActiveViewMode,
    eCardFlipViewMode,
    eGeneralActions,
} from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';

// models
import { MilesByUnitPaginatedStopsResponse } from 'appcoretruckassist';

// configs
import { MilesTableColumnsConfig } from '@pages/miles/utils/config';

// helpers
import { MilesDropdownMenuHelper } from '@pages/miles/utils/helpers';
import { DropdownMenuColumnsActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';
import { StoreFunctionsHelper } from '@shared/components/new-table/utils/helpers';

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
        tabResults: {
            activeTruckCount,
            inactiveTruckCount,
        },
    };
};

export const changeViewMode = function (
    state: IMilesState,
    activeViewMode: eActiveViewMode
): IMilesState {
    const {
        tableSettings,
        cardFlipViewMode,
        isToolbarDropdownMenuColumnsActive,
    } = state;
    return {
        ...state,
        activeViewMode,
        selectedCount: 0,
        hasAllItemsSelected: false,
        unitsPagination: {
            ...state.unitsPagination,
            activeUnitIndex: 0,
        },
        toolbarDropdownMenuOptions:
            MilesDropdownMenuHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                cardFlipViewMode,
                isToolbarDropdownMenuColumnsActive
            ),
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
        page: 1,
        loading: false,
        unitsPagination: {
            ...state.unitsPagination,
            activeUnitIndex: 0,
            totalResultsCount,
        },
    };
};

export const pageChanges = function (state: IMilesState): IMilesState {
    return {
        ...state,
        page: state.page + 1,
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
    const {
        tableSettings,
        activeViewMode,
        cardFlipViewMode,
        isToolbarDropdownMenuColumnsActive,
    } = state;

    const toolbarDropdownMenuOptions =
        MilesDropdownMenuHelper.getToolbarDropdownMenuContent(
            activeViewMode,
            !tableSettings.isTableLocked,
            cardFlipViewMode,
            isToolbarDropdownMenuColumnsActive
        );

    return {
        ...state,
        tableSettings: {
            ...tableSettings,
            isTableLocked: !tableSettings.isTableLocked,
        },
        toolbarDropdownMenuOptions,
    };
};

export function pinTableColumn(
    state: IMilesState,
    column: ITableColumn
): IMilesState {
    return {
        ...state,
        columns: StoreFunctionsHelper.togglePinned(column, state.columns),
    };
}

export function tableSortingChange(
    state: IMilesState,
    column: ITableColumn
): IMilesState {
    const { columns, sortKey, sortDirection } = StoreFunctionsHelper.toggleSort(
        column,
        state.columns
    );

    return {
        ...state,
        columns,
        tableSettings: {
            ...state.tableSettings,
            sortDirection,
            sortKey,
        },
    };
}

export function toggleColumnVisibility(
    state: IMilesState,
    columnKey: string,
    isActive: boolean
): IMilesState {
    const columns = StoreFunctionsHelper.mapColumnsVisibility(
        state.columns,
        columnKey,
        isActive
    );

    return {
        ...state,
        columns,
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

export function resetTable(state: IMilesState): IMilesState {
    const {
        activeViewMode,
        cardFlipViewMode,
        isToolbarDropdownMenuColumnsActive,
    } = state;

    return {
        ...state,
        columns: MilesTableColumnsConfig.columnsConfig,
        tableSettings: {
            isTableLocked: false,
            sortKey: null,
            sortDirection: null,
        },
        toolbarDropdownMenuOptions:
            MilesDropdownMenuHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                false,
                cardFlipViewMode,
                isToolbarDropdownMenuColumnsActive
            ),
    };
}

export function toggleCardFlipViewMode(state: IMilesState): IMilesState {
    const {
        cardFlipViewMode,
        activeViewMode,
        tableSettings,
        isToolbarDropdownMenuColumnsActive,
    } = state;

    const nextCardFlipViewMode =
        cardFlipViewMode === eCardFlipViewMode.FRONT
            ? eCardFlipViewMode.BACK
            : eCardFlipViewMode.FRONT;

    return {
        ...state,
        cardFlipViewMode: nextCardFlipViewMode,
        toolbarDropdownMenuOptions:
            MilesDropdownMenuHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                nextCardFlipViewMode,
                isToolbarDropdownMenuColumnsActive
            ),
    };
}

export function toggleToolbarDropdownMenuColumnsActive(
    state: IMilesState
): IMilesState {
    const {
        cardFlipViewMode,
        activeViewMode,
        tableSettings,
        isToolbarDropdownMenuColumnsActive,
        columns,
    } = state;

    const toolbarDropdownColumns =
        DropdownMenuColumnsActionsHelper.mapToolbarDropdownColumnsNew(columns);

    return {
        ...state,
        isToolbarDropdownMenuColumnsActive: !isToolbarDropdownMenuColumnsActive,
        toolbarDropdownMenuOptions:
            MilesDropdownMenuHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                cardFlipViewMode,
                !isToolbarDropdownMenuColumnsActive,
                toolbarDropdownColumns
            ),
    };
}

export function tableResizeChange(
    state: IMilesState,
    resizeAction: ITableResizeAction
): IMilesState {
    const { columns } = state;
    const { id, newWidth } = resizeAction;

    function updateColumnWidth(
        columns: ITableColumn[],
        columnId: number,
        newWidth: number
    ): ITableColumn[] {
        return columns.map((col) => {
            // if this column contains nested columns, recursively call updateColumnWidth

            if (col.columns)
                return {
                    ...col,
                    columns: updateColumnWidth(col.columns, columnId, newWidth), // recursive call
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

    const resizedColumns = updateColumnWidth(columns, id, newWidth);

    return {
        ...state,
        columns: resizedColumns,
    };
}
