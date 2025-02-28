// External Libraries
import { createReducer, on } from '@ngrx/store';

// Feature Actions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';
import { loadMilesSuccess, milesTabChange, updateTruckCounts } from '@pages/miles/state/actions/miles.actions';

// Enums
import { eMileTabs } from '@pages/miles/enums';
import { eActiveViewMode } from '@pages/load/pages/load-table/enums';

// Constants
import { MilesToolbarTabs } from '@pages/miles/consts';

// Models
import { IMilesState } from '@pages/miles/models';

export const initialState: IMilesState = {
    items: [],
    loading: false,
    error: null,
    tableViewData: MilesToolbarTabs,
    selectedTab: eMileTabs.Active,
    activeViewMode: eActiveViewMode.List
};

export const milesReducer = createReducer(
    initialState,
    on(MilesAction.getLoadsPayload, (state) => ({
        ...state,
        loading: true,
    })),
    on(MilesAction.getLoadsPayloadSuccess, (state, { params }) => ({
        ...state,
        items: params,
        loading: false,
    })),
    on(MilesAction.getLoadsPayloadError, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(loadMilesSuccess, (state, { miles }) => ({
        ...state,
        items: miles,
    })),
    on(milesTabChange, (state, { selectedTab }) => ({
        ...state,
        selectedTab: selectedTab,
    })),
    on(
        updateTruckCounts,
        (state, { activeTruckCount, inactiveTruckCount }) => ({
            ...state,
            tableViewData: [
                { ...state.tableViewData[0], length: activeTruckCount },
                { ...state.tableViewData[1], length: inactiveTruckCount },
            ],
        })
    )
);
