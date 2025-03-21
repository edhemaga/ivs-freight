// Interface
import { IMilesModel, IMilesState } from '@pages/miles/interface';
import { IStateFilters } from '@shared/interfaces';
import { MilesByUnitPaginatedStopsResponse } from 'appcoretruckassist';

// Enums
import { eActiveViewMode } from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';

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
        selectedRows: 0,
        areAllItemsSelected: false,
    };
};

export const updateMilesData = function (
    state: IMilesState,
    miles: IMilesModel[]
): IMilesState {
    return {
        ...state,
        items: miles,
        loading: false,
        activeUnitIndex: 0,
    };
};

export const toggleRowSelection = function (
    state: IMilesState,
    mile: IMilesModel
): IMilesState {
    const updatedItems = state.items.map((item) =>
        item.id === mile.id ? { ...item, selected: !item.selected } : item
    );

    const newSelectedCount = updatedItems.filter(
        (item) => item.selected
    ).length;

    return {
        ...state,
        items: updatedItems,
        selectedRows: newSelectedCount,
        areAllItemsSelected: newSelectedCount === updatedItems.length,
    };
};

export const toggleSelectAll = function (state: IMilesState): IMilesState {
    const areAllItemsSelected = !state.areAllItemsSelected;

    const updatedItems = state.items.map((item) => ({
        ...item,
        selected: areAllItemsSelected,
    }));

    return {
        ...state,
        items: updatedItems,
        selectedRows: areAllItemsSelected ? updatedItems.length : 0,
        areAllItemsSelected,
    };
};

export const updateFilters = function (
    state: IMilesState,
    filters: IStateFilters
): IMilesState {
    return {
        ...state,
        filters,
        selectedRows: 0,
        areAllItemsSelected: false,
    };
};

export const updateTabSelection = function (
    state: IMilesState,
    selectedTab: eMileTabs
): IMilesState {
    return {
        ...state,
        selectedTab,
        selectedRows: 0,
        filters: {},
        areAllItemsSelected: false,
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
        isLastUnit: isLast,
    };
};
export const setFollowingUnitDetails = function (
    state: IMilesState,
    details: MilesByUnitPaginatedStopsResponse,
    activeUnitIndex: number,
    isFirstUnit: boolean,
    isLastUnit: boolean
): IMilesState {
    return {
        ...state,
        details,
        activeUnitIndex,
        isFirstUnit,
        isLastUnit,
    };
};
