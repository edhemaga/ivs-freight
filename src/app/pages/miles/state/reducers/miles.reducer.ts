import { createReducer, on } from '@ngrx/store';

// feature Actions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';

// enums
import { eMileTabs } from '@pages/miles/enums';
import { eActiveViewMode, eCardFlipViewMode } from '@shared/enums';

// constants
import { MilesToolbarTabs } from '@pages/miles/utils/constants';

// interface
import { IMilesState } from '@pages/miles/interface';

// functions
import * as Functions from '@pages/miles/state/functions/miles-reducer.functions';

// configs
import { MilesTableColumnsConfig } from '@pages/miles/utils/config';

// helpers
import { MilesDropdownMenuHelper } from '@pages/miles/utils/helpers';

export const initialState: IMilesState = {
    items: [],
    loading: false,
    tableViewData: MilesToolbarTabs,
    selectedTab: eMileTabs.ACTIVE,
    activeViewMode: eActiveViewMode.List,
    filters: {},
    states: [],
    cardFlipViewMode: eCardFlipViewMode.FRONT,
    isToolbarDropdownMenuColumnsActive: false,
    toolbarDropdownMenuOptions:
        MilesDropdownMenuHelper.getToolbarDropdownMenuContent(
            eActiveViewMode.List,
            true,
            eCardFlipViewMode.FRONT,
            false
        ),
    page: 1,
    tabResults: {
        activeTruckCount: 0,
        inactiveTruckCount: 0,
    },

    // Table
    columns: MilesTableColumnsConfig.columnsConfig,

    // Unit list
    details: {
        data: {},
        stops: [],
        currentPage: 1,
        totalCount: 1,
        searchString: '',
    },

    tableSettings: {
        isTableLocked: true,
        sortKey: null,
        sortDirection: null,
    },

    minimalList: {
        data: [],
        currentPage: 1,
        totalCount: 1,
        searchString: '',
    },
};

export const milesReducer = createReducer(
    initialState,
    // #region Get miles
    on(
        MilesAction.getLoadsPayloadSuccess,
        (state, { miles, totalResultsCount }) =>
            Functions.updateMilesData(state, miles, totalResultsCount)
    ),
    on(MilesAction.getLoadsPayloadError, (state) => ({
        ...state,
        loading: false,
    })),
    on(MilesAction.loadMilesSuccess, (state, { miles, totalResultsCount }) =>
        Functions.updateMilesData(state, miles, totalResultsCount)
    ),

    on(MilesAction.updateMilesList, (state, { miles }) =>
        Functions.updateMilesListData(state, miles)
    ),
    // #endregion

    // #region Table tab
    on(MilesAction.milesTabChange, (state, { selectedTab }) =>
        Functions.updateTabSelection(state, selectedTab)
    ),

    on(MilesAction.pageChanges, (state) => Functions.pageChanges(state)),

    on(
        MilesAction.updateTruckCounts,
        (state, { activeTruckCount, inactiveTruckCount }) =>
            Functions.updateTruckCounts(
                state,
                activeTruckCount,
                inactiveTruckCount
            )
    ),

    on(MilesAction.activeViewMode, (state, { activeViewMode }) =>
        Functions.changeViewMode(state, activeViewMode)
    ),
    // #endregion

    // #region Table filters
    on(MilesAction.changeFilters, (state, { filters }) =>
        Functions.updateFilters(state, filters)
    ),
    on(MilesAction.setStates, (state, { states }) => ({ ...state, states })),
    // #endregion

    // #region Unit detail
    on(MilesAction.setUnitDetails, (state, { details }) =>
        Functions.setUnitDetails(state, details)
    ),
    on(MilesAction.updateUnitDetails, (state, { details }) =>
        Functions.updateUnitDetails(state, details)
    ),
    // #endregion

    on(MilesAction.toggleTableLockingStatus, (state) =>
        Functions.toggleTableLockingStatus(state)
    ),

    on(MilesAction.pinTableColumn, (state, { column }) =>
        Functions.pinTableColumn(state, column)
    ),

    on(MilesAction.tableSortingChange, (state, { column }) =>
        Functions.tableSortingChange(state, column)
    ),

    on(MilesAction.toggleColumnVisibility, (state, { columnKey, isActive }) =>
        Functions.toggleColumnVisibility(state, columnKey, isActive)
    ),

    on(MilesAction.tableResizeChange, (state, { resizeAction }) =>
        Functions.tableResizeChange(state, resizeAction)
    ),

    on(MilesAction.onSearchChange, (state, { search }) =>
        Functions.onSearchChange(state, search)
    ),

    on(MilesAction.resetTable, (state) => Functions.resetTable(state)),

    on(MilesAction.toggleCardFlipViewMode, (state) =>
        Functions.toggleCardFlipViewMode(state)
    ),

    on(MilesAction.toggleToolbarDropdownMenuColumnsActive, (state) =>
        Functions.toggleToolbarDropdownMenuColumnsActive(state)
    ),

    // #region Miles minimal list
    on(MilesAction.setInitalMinimalList, (state, { list, text }) =>
        Functions.setInitalMinimalList(state, list, text)
    ),
    on(MilesAction.appendToMinimalList, (state, { list }) =>
        Functions.appendToMinimalList(state, list)
    ),
    on(MilesAction.getMinimalListError, (state) => ({
        ...state,
        isMinimalListLoading: false,
    }))
);
