// Interfaces
import { ILoadState } from '@pages/new-load/interfaces';

// Models
import {
    DispatcherFilterResponse,
    LoadListResponse,
    LoadMinimalListResponse,
    LoadResponse,
    LoadStatusFilterResponse,
    LoadTemplateListResponse,
    RoutingResponse,
} from 'appcoretruckassist';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eCardFlipViewMode, eCommonElement } from '@shared/enums';

// Helper
import { LoadHelper, LoadStoreHelper } from '@pages/new-load/utils/helpers';
import { FilterHelper } from '@shared/utils/helpers';
import {
    DropdownMenuColumnsActionsHelper,
    DropdownMenuToolbarContentHelper,
} from '@shared/utils/helpers/dropdown-menu-helpers';
import { StoreFunctionsHelper } from '@shared/components/new-table/utils/helpers';

// Ca components
import { eGeneralActions, IFilterAction } from 'ca-components';

// Config
import { LoadTableColumnsConfig } from '@pages/new-load/utils/config';

export const getLoadByIdSuccessResult = function (
    state: ILoadState,
    loadResponse: LoadListResponse | LoadTemplateListResponse
): ILoadState {
    console.log('getLoadByIdSuccessResult');
    const loads = LoadHelper.loadMapper(loadResponse.pagination.data);

    const { selectedTab } = state;
    return {
        ...state,
        loads,
        toolbarTabs: LoadHelper.updateTabsCount(
            loadResponse,
            state.toolbarTabs
        ),
        tableColumns: LoadTableColumnsConfig.getLoadTableColumns(selectedTab),
    };
};

//#region Tabs
export const getLoadsPayloadOnTabTypeChange = function (
    state: ILoadState,
    selectedTabValue: eLoadStatusType
): ILoadState {
    console.log('getLoadsPayloadOnTabTypeChange');

    return {
        ...state,
        selectedTab: LoadHelper.loadStatusTypeToStringMap[selectedTabValue],
    };
};

export const getViewModeChange = function (
    state: ILoadState,
    activeViewMode: eCommonElement
): ILoadState {
    console.log('getViewModeChange');
    const {
        tableSettings,
        cardFlipViewMode,
        isToolbarDropdownMenuColumnsActive,
    } = state;
    return {
        ...state,
        activeViewMode,
        toolbarDropdownMenuOptions:
            DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                cardFlipViewMode,
                isToolbarDropdownMenuColumnsActive
            ),
    };
};
//#endregion

//#region Filters
export function onFiltersChange(
    state: ILoadState,
    filters: IFilterAction
): ILoadState {
    console.log('onFiltersChange');
    return {
        ...state,
        filters: FilterHelper.mapFilters(filters, state.filters),
    };
}

export function setFilterDropdownList(
    state: ILoadState,
    dispatcherFilters: DispatcherFilterResponse[],
    statusFilters: LoadStatusFilterResponse[]
): ILoadState {
    console.log('setFilterDropdownList');
    return {
        ...state,
        filtersDropdownList: {
            dispatcherFilters: FilterHelper.dispatcherFilter(dispatcherFilters),
            statusFilters,
        },
    };
}

export function onSeachFilterChange(
    state: ILoadState,
    searchQuery: string[]
): ILoadState {
    console.log('onSeachFilterChange');
    return {
        ...state,
        filters: {
            ...state.filters,
            searchQuery,
        },
    };
}
//#endregion

//#region Details
export function onGetLoadByIdSuccess(
    state: ILoadState,
    data: LoadResponse,
    minimalList: LoadMinimalListResponse,
    mapRoutes: RoutingResponse
): ILoadState {
    console.log('onGetLoadByIdSuccess');
    return LoadStoreHelper.setLoadDetailsState(
        (state = {
            ...state,
            minimalList: {
                pagination: minimalList,
                groupedByStatusTypeList:
                    LoadStoreHelper.groupedByStatusTypeList(minimalList),
            },
        }),
        data,
        false,
        LoadStoreHelper.mapRouting(mapRoutes, data.stops)
    );
}

export function onGetLoadById(state: ILoadState): ILoadState {
    console.log('onGetLoadById');
    return LoadStoreHelper.setLoadDetailsState(state, {}, true, {});
}

export function onGetLoadByIdError(state: ILoadState): ILoadState {
    console.log('onGetLoadByIdError');
    return LoadStoreHelper.setLoadDetailsState(state, {}, false, {});
}

export function onMapVisiblityToggle(state: ILoadState): ILoadState {
    console.log('onMapVisiblityToggle');
    const { details } = state;

    return {
        ...state,
        details: {
            ...details,
            isMapOpen: !details.isMapOpen,
        },
    };
}

export function onSelectLoad(state: ILoadState, id: number): ILoadState {
    const updatedLoads = state.loads.map((load) =>
        load.id === id ? { ...load, isSelected: !load.isSelected } : load
    );

    const areAllLoadsSelected = state.loads.every((load) => load.isSelected);

    return {
        ...state,
        loads: updatedLoads,
        areAllLoadsSelected,
    };
}

export function onSelectAllLoads(
    state: ILoadState,
    action: string
): ILoadState {
    const shouldSelectAll =
        action === eGeneralActions.SELECT_ALL ||
        action === eGeneralActions.CLEAR_SELECTED
            ? !state.areAllLoadsSelected
            : true;

    const updatedLoads = state.loads.map((load) => ({
        ...load,
        isSelected: shouldSelectAll,
    }));

    return {
        ...state,
        loads: updatedLoads,
        areAllLoadsSelected: shouldSelectAll,
    };
}

//#endregion

//#region Delete
export function onDeleteLoadListSuccess(state: ILoadState): ILoadState {
    const { selectedTab, toolbarTabs } = state;
    const updatedLoads = state.loads.filter((load) => !load.isSelected);

    return {
        ...state,
        loads: updatedLoads,
        toolbarTabs: LoadStoreHelper.updateTabsAfterDelete(
            toolbarTabs,
            updatedLoads,
            selectedTab
        ),
    };
}

export function onDeleteLoad(state: ILoadState, id: number): ILoadState {
    const { selectedTab, toolbarTabs } = state;
    const updatedLoads = state.loads.filter((load) => load.id !== id);

    return {
        ...state,
        loads: updatedLoads,
        toolbarTabs: LoadStoreHelper.updateTabsAfterDelete(
            toolbarTabs,
            updatedLoads,
            selectedTab
        ),
    };
}

//#endregion

//#region Toolbar Hamburger Menu
export function setToolbarDropdownMenuColumnsActive(
    state: ILoadState,
    isActive: boolean
): ILoadState {
    const { cardFlipViewMode, activeViewMode, tableSettings, tableColumns } =
        state;
    const toolbarDropdownColumns =
        DropdownMenuColumnsActionsHelper.mapToolbarDropdownColumnsNew(
            tableColumns
        );
    return {
        ...state,
        isToolbarDropdownMenuColumnsActive: isActive,
        toolbarDropdownMenuOptions:
            DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                cardFlipViewMode,
                isActive,
                toolbarDropdownColumns
            ),
    };
}

export function toggleColumnVisibility(
    state: ILoadState,
    columnKey: string,
    isActive: boolean
): ILoadState {
    const tableColumns = StoreFunctionsHelper.mapColumnsVisibility(
        state.tableColumns,
        columnKey,
        isActive
    );
    return {
        ...state,
        tableColumns,
    };
}

export function toggleTableLockingStatus(state: ILoadState): ILoadState {
    const {
        tableSettings,
        activeViewMode,
        cardFlipViewMode,
        isToolbarDropdownMenuColumnsActive,
    } = state;
    const toolbarDropdownMenuOptions =
        DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
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
}

export function toggleCardFlipViewMode(state: ILoadState): ILoadState {
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
            DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                nextCardFlipViewMode,
                isToolbarDropdownMenuColumnsActive
            ),
    };
}
//#endregion
