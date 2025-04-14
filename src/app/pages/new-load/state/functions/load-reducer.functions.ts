// Interfaces
import { ILoadState } from '@pages/new-load/interfaces';

// Models
import {
    DispatcherFilterResponse,
    LoadListResponse,
    LoadMinimalListResponse,
    LoadResponse,
    LoadStatusFilterResponse,
    RoutingResponse,
} from 'appcoretruckassist';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eCommonElement } from '@shared/enums';

// Helper
import { LoadHelper, LoadStoreHelper } from '@pages/new-load/utils/helpers';
import { FilterHelper } from '@shared/utils/helpers';

// Ca components
import { IFilterAction } from 'ca-components';
import { eLoadStatusStringType } from '@pages/new-load/enums';

export const getLoadByIdSuccessResult = function (
    state: ILoadState,
    loadResponse: LoadListResponse
): ILoadState {
    console.log('getLoadByIdSuccessResult');
    const loads = LoadHelper.loadMapper(loadResponse.pagination.data);

    return {
        ...state,
        loads,
        selectedCount: 0,
        totalLoadSum: LoadStoreHelper.getTotalLoadSum(loads),
        toolbarTabs: LoadHelper.updateTabsCount(
            loadResponse,
            state.toolbarTabs
        ),
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
    return {
        ...state,
        activeViewMode,
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

    const newSelectedCount = updatedLoads.filter(
        (load) => load.isSelected
    ).length;

    return {
        ...state,
        loads: updatedLoads,
        selectedCount: newSelectedCount,
    };
}

//#endregion

//#region Delete
export function onDeleteLoadSuccess(state: ILoadState): ILoadState {
    const { selectedTab, toolbarTabs } = state;
    const updatedLoads = state.loads.filter((load) => !load.isSelected);

    return {
        ...state,
        loads: updatedLoads,
        selectedCount: 0,
        totalLoadSum: LoadStoreHelper.getTotalLoadSum(updatedLoads),
        toolbarTabs: LoadStoreHelper.updateTabsAfterDelete(
            toolbarTabs,
            updatedLoads,
            selectedTab
        ),
    };
}
//#endregion
