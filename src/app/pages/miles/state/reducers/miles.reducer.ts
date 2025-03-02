// External Libraries
import { createReducer, on } from '@ngrx/store';

// Feature Actions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';
import {
    activeViewMode,
    filters,
    milesTabChange,
    setStates,
    updateTruckCounts,
} from '@pages/miles/state/actions/miles.actions';

// Enums
import { eMileTabs } from '@pages/miles/enums';
import { eActiveViewMode } from '@pages/load/pages/load-table/enums';

// Constants
import { MilesTableColumns, MilesToolbarTabs } from '@pages/miles/consts';

// Models
import { IMilesState } from '@pages/miles/models';

export const initialState: IMilesState = {
    items: [],
    loading: false,
    error: null,
    tableViewData: MilesToolbarTabs,
    selectedTab: eMileTabs.Active,
    activeViewMode: eActiveViewMode.List,
    filters: {},
    states: [],
    selectedRows: 0,

    // Table
    columns: MilesTableColumns,
};

export const milesReducer = createReducer(
    initialState,
    on(MilesAction.getLoadsPayload, (state) => ({
        ...state,
        loading: true,
    })),
    on(MilesAction.getLoadsPayloadSuccess, (state, { miles }) => {
        return {
            ...state,
            items: miles,
            loading: false,
        };
    }),
    on(MilesAction.getLoadsPayloadError, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(MilesAction.loadMilesSuccess, (state, { miles }) => ({
        ...state,
        items: miles,
    })),
    on(milesTabChange, (state, { selectedTab }) => ({
        ...state,
        selectedTab: selectedTab,
    })),
    on(activeViewMode, (state, { activeViewMode }) => ({
        ...state,
        activeViewMode,
    })),
    on(filters, (state, { filters }) => ({
        ...state,
        filters,
    })),
    on(setStates, (state, { states }) => ({
        ...state,
        states,
    })),
    on(MilesAction.selectRow, (state, { mile }) => {
        // Update select one only
        const updatedItems = state.items.map((item) =>
            item.id === mile.id
                ? { ...item, selected: !item.selected }
                : item
        );
    
        // new selected count
        const newSelectedCount = updatedItems.filter(item => item.selected).length;
    
        return {
            ...state,
            items: updatedItems,
            selectedRows: newSelectedCount,
        };
    }),
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
