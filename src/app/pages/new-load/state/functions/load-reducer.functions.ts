// Interfaces
import { ILoadState } from '@pages/new-load/interfaces';

// Models
import {
    DispatcherFilterResponse,
    LoadListResponse,
    LoadMinimalListResponse,
    LoadResponse,
    LoadStatusFilterResponse,
} from 'appcoretruckassist';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eCommonElement } from '@shared/enums';

// Helper
import { LoadHelper } from '@pages/new-load/utils/helpers';
import { FilterHelper } from '@shared/utils/helpers';

// Ca components
import { IFilterAction } from 'ca-components';

export const getLoadByIdSuccessResult = function (
    state: ILoadState,
    loadResponse: LoadListResponse
): ILoadState {
    console.log('getLoadByIdSuccessResult');
    return {
        ...state,
        loads: LoadHelper.loadMapper(loadResponse.pagination.data),
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
    minimalList: LoadMinimalListResponse
): ILoadState {
    console.log('onGetLoadByIdSuccess');
    return setLoadDetailsState(
        (state = {
            ...state,
            minimalList,
        }),
        data,
        false
    );
}

export function onGetLoadById(state: ILoadState): ILoadState {
    console.log('onGetLoadById');
    return setLoadDetailsState(state, {}, true);
}

export function onGetLoadByIdError(state: ILoadState): ILoadState {
    console.log('onGetLoadByIdError');
    return setLoadDetailsState(state, {}, false);
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

function setLoadDetailsState(
    state: ILoadState,
    data: LoadResponse,
    isLoading: boolean
): ILoadState {
    const stops = data?.stops || [];

    const isFirstStopDeadhead = stops[0]?.stopType?.id === 0;

    const stopCount = stops.length - (isFirstStopDeadhead ? 1 : 0);

    const extraStopCount =
        stops.length <= 2
            ? 0
            : isFirstStopDeadhead
              ? stops.length - 3
              : stops.length - 2;

    return {
        ...state,
        details: {
            data,
            isLoading,
            isMapOpen: true,
            stopCount,
            extraStopCount,
        },
    };
}
//#endregion
