// Store
import { createReducer, on } from '@ngrx/store';

// Actions
import * as LoadActions from '@pages/new-load/state/actions/load.actions';

// Functions
import * as Functions from '@pages/new-load/state/functions/load-reducer.functions';

// Interfaces
import { ILoadState } from '@pages/new-load/interfaces';

// Constants
import { LoadToolbarTabs } from '@pages/new-load/utils/constants';

// Config
import { LoadTableColumns } from '@pages/new-load/utils/config';

// Enums
import { eLoadStatusStringType } from '@pages/new-load/enums';
import { eCommonElement } from '@shared/enums';

export const initialState: ILoadState = {
    loads: [],
    selectedCount: 0,
    totalLoadSum: 0,

    toolbarTabs: LoadToolbarTabs,
    selectedTab: eLoadStatusStringType.ACTIVE,

    activeViewMode: eCommonElement.LIST,

    filtersDropdownList: {
        dispatcherFilters: [],
        statusFilters: [],
    },
    filters: {},

    tableColumns: LoadTableColumns,

    details: {
        data: {},
        isLoading: true,
        isMapOpen: true,
        stopCount: 0,
        extraStopCount: 0,
        reveresedHistory: [],
        mapRoutes: {},
    },

    minimalList: {
        pagination: {},
        groupedByStatusTypeList: {},
    },
};

export const loadReducer = createReducer(
    initialState,

    on(LoadActions.getLoadsPayloadSuccess, (state, { payload }) =>
        Functions.getLoadByIdSuccessResult(state, payload)
    ),

    //#region Toolbar tabs
    on(LoadActions.getLoadsPayloadOnTabTypeChange, (state, { mode }) =>
        Functions.getLoadsPayloadOnTabTypeChange(state, mode)
    ),

    on(LoadActions.getViewModeChange, (state, { viewMode }) =>
        Functions.getViewModeChange(state, viewMode)
    ),
    //#endregion

    //#region Filters
    on(LoadActions.onFiltersChange, (state, { filters }) =>
        Functions.onFiltersChange(state, filters)
    ),

    on(
        LoadActions.setFilterDropdownList,
        (state, { dispatcherFilters, statusFilters }) =>
            Functions.setFilterDropdownList(
                state,
                dispatcherFilters,
                statusFilters
            )
    ),

    on(LoadActions.onSeachFilterChange, (state, { query }) =>
        Functions.onSeachFilterChange(state, query)
    ),
    //#endregion

    //#region Details
    on(LoadActions.onGetLoadById, (state) => Functions.onGetLoadById(state)),

    on(
        LoadActions.onGetLoadByIdSuccess,
        (state, { load, minimalList, mapRoutes }) =>
            Functions.onGetLoadByIdSuccess(state, load, minimalList, mapRoutes)
    ),

    on(LoadActions.onGetLoadByIdError, (state) =>
        Functions.onGetLoadByIdError(state)
    ),

    on(LoadActions.onMapVisiblityToggle, (state) =>
        Functions.onMapVisiblityToggle(state)
    ),
    //#endregion

    //#region List
    on(LoadActions.onSelectLoad, (state, { id }) =>
        Functions.onSelectLoad(state, id)
    ),
    //#endregion

    //#region Delete actions
    on(LoadActions.onDeleteLoadSuccess, (state) =>
        Functions.onDeleteLoadSuccess(state)
    )
    //#endregion
);
