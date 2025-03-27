// External Libraries
import { createReducer, on } from '@ngrx/store';

// Feature Actions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';

// Enums
import { eMileTabs } from '@pages/miles/enums';
import { eActiveViewMode } from '@shared/enums';

// Constants
import {
    MilesTableColumns,
    MilesToolbarTabs,
} from '@pages/miles/utils/constants';

// interface
import { IMilesState } from '@pages/miles/interface';

// functions
import * as Functions from '@pages/miles/utils/functions/miles-reducer.functions';

export const initialState: IMilesState = {
    items: [],
    loading: false,
    tableViewData: MilesToolbarTabs,
    selectedTab: eMileTabs.ACTIVE,
    activeViewMode: eActiveViewMode.List,
    filters: {},
    states: [],
    selectedCount: 0,
    hasAllItemsSelected: false,

    // Table
    columns: MilesTableColumns,

    // Unit list
    details: {},
    unitsPagination: {
        activeUnitIndex: 0,
        currentPage: 1,
        totalPage: 0,
        isFirstUnit: true,
        isLastUnit: true,
        isLastInCurrentList: false,
    },
    tableSettings: {
        isTableLocked: false,
        sortKey: '',
        sortDirection: null,
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

    // #region Checkbox selection
    on(MilesAction.selectOneRow, (state, { mile }) =>
        Functions.toggleRowSelection(state, mile)
    ),

    on(MilesAction.selectAll, (state, { action }) =>
        Functions.toggleSelectAll(state, action)
    ),
    // #endregion

    // #region Unit detail
    on(MilesAction.setUnitDetails, (state, { details, isLast }) =>
        Functions.setUnitDetails(state, details, isLast)
    ),

    on(
        MilesAction.setFollowingUnitDetails,
        (
            state,
            { unitResponse, index, isFirst, isLast, isLastInCurrentList }
        ) =>
            Functions.setFollowingUnitDetails(
                state,
                unitResponse,
                index,
                isFirst,
                isLast,
                isLastInCurrentList
            )
    ),

    on(MilesAction.toggleTableLockingStatus, (state) =>
        Functions.toggleTableLockingStatus(state)
    ),

    on(MilesAction.pinTableColumn, (state, { column }) =>
        Functions.pinTableColumn(state, column)
    ),

    on(MilesAction.tableSortingChange, (state, { column }) =>
        Functions.tableSortingChange(state, column)
    ),

    on(MilesAction.onSearchChange, (state, { search }) =>
        Functions.onSearchChange(state, search)
    )
    // #endregion
);
