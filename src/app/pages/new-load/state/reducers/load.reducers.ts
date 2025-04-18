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
import { LoadTableColumnsConfig } from '@pages/new-load/utils/config';

// Enums
import { eLoadStatusStringType } from '@pages/new-load/enums';
import { eCardFlipViewMode, eCommonElement } from '@shared/enums';

// Helpers
import { DropdownMenuToolbarContentHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

export const initialState: ILoadState = {
    loads: [],
    areAllLoadsSelected: false,
    searchResultsCount: 0,

    toolbarTabs: LoadToolbarTabs,
    selectedTab: eLoadStatusStringType.ACTIVE,

    activeViewMode: eCommonElement.LIST,

    filtersDropdownList: {
        dispatcherFilters: [],
        statusFilters: [],
    },
    filters: {},
    currentPage: 1,

    tableColumns: LoadTableColumnsConfig.getLoadTableColumns(
        eLoadStatusStringType.ACTIVE
    ),

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

    cardFlipViewMode: eCardFlipViewMode.FRONT,
    isToolbarDropdownMenuColumnsActive: false,

    toolbarDropdownMenuOptions:
        DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
            eCommonElement.LIST,
            true,
            eCardFlipViewMode.FRONT,
            false
        ),

    tableSettings: {
        isTableLocked: true,
        sortKey: null,
        sortDirection: null,
        label: '',
    },

    possibleStatuses: null,
    loadIdLoadStatusChange: null,
};

export const loadReducer = createReducer(
    initialState,

    on(LoadActions.getLoadsPayloadSuccess, (state, { payload }) =>
        Functions.getLoadByIdSuccessResult(state, payload)
    ),

    on(LoadActions.getLoadsOnPageChange, (state) => state),

    on(LoadActions.getLoadsPagePayloadSuccess, (state, { payload }) =>
        Functions.onPageChanges(state, payload)
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

    on(LoadActions.onSelectAllLoads, (state, { action }) =>
        Functions.onSelectAllLoads(state, action)
    ),
    //#endregion

    //#region Delete actions
    on(LoadActions.onDeleteLoadListSuccess, (state, { selectedIds }) =>
        Functions.onDeleteLoadListSuccess(state, selectedIds)
    ),

    on(LoadActions.onDeleteLoad, (state, { id }) =>
        Functions.onDeleteLoad(state, id)
    ),

    //#region Toolbar hamburger menu
    on(LoadActions.setToolbarDropdownMenuColumnsActive, (state, { isActive }) =>
        Functions.setToolbarDropdownMenuColumnsActive(state, isActive)
    ),
    on(LoadActions.toggleColumnVisibility, (state, { columnKey, isActive }) =>
        Functions.toggleColumnVisibility(state, columnKey, isActive)
    ),
    on(LoadActions.tableUnlockToggle, (state) =>
        Functions.toggleTableLockingStatus(state)
    ),
    on(LoadActions.tableColumnReset, (state) => ({ ...state })),
    on(LoadActions.toggleCardFlipViewMode, (state) =>
        Functions.toggleCardFlipViewMode(state)
    ),
    //#endregion

    // #region table header
    on(LoadActions.tableSortingChange, (state, { column }) =>
        Functions.onTableSortingChange(state, column)
    ),
    //#endregion

    //#region Change dropdown status
    on(LoadActions.openChangeStatuDropdown, (state) => ({ ...state })),
    on(
        LoadActions.openChangeStatuDropdownSuccess,
        (state, { possibleStatuses, loadId }) =>
            Functions.openChangeStatuDropdownSuccessResult(
                state,
                possibleStatuses,
                loadId
            )
    ),
    on(LoadActions.openChangeStatuDropdownError, (state) => ({ ...state })),

    on(LoadActions.updateLoadStatus, (state) => ({ ...state })),
    on(LoadActions.updateLoadStatusSuccess, (state, { status, load }) =>
        Functions.updateLoadStatusSuccessResult(state, status, load)
    ),
    on(LoadActions.updateLoadStatusError, (state) => ({ ...state })),

    // on(LoadActions.updateLoadStatusSignalR, (state, { response }) =>
    //     Functions.updateLoadStatusSignalRSuccess(state, response)
    // ),

    on(LoadActions.revertLoadStatus, (state) => ({ ...state })),
    on(LoadActions.revertLoadStatusSuccess, (state, { status, load }) =>
        Functions.updateLoadStatusSuccessResult(state, status, load)
    ),
    on(LoadActions.revertLoadStatusError, (state) => ({ ...state }))

    //#endregion
);
