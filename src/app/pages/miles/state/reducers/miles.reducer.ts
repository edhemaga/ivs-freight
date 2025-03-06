// External Libraries
import { createReducer, on } from '@ngrx/store';

// Feature Actions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';

// Enums
import { eMileTabs } from '@pages/miles/enums';
import { eActiveViewMode } from '@shared/enums';

// Constants
import { MilesTableColumns, MilesToolbarTabs } from '@pages/miles/utils/constants';

// Models
import { IMilesState } from '@pages/miles/interface';

export const initialState: IMilesState = {
    items: [],
    loading: false, 
    tableViewData: MilesToolbarTabs,
    selectedTab: eMileTabs.ACTIVE,
    activeViewMode: eActiveViewMode.List,
    filters: {},
    states: [],
    selectedRows: 0,
    areAllItemsSelected: false,

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
    on(MilesAction.getLoadsPayloadError, (state) => ({
        ...state,
        loading: false
    })),
    on(MilesAction.loadMilesSuccess, (state, { miles }) => ({
        ...state,
        items: miles,
    })),

    // #region Table tab
    on(MilesAction.milesTabChange, (state, { selectedTab }) => ({
        ...state,
        selectedTab: selectedTab,
    })),

    on(
        MilesAction.updateTruckCounts,
        (state, { activeTruckCount, inactiveTruckCount }) => ({
            ...state,
            tableViewData: [
                { ...state.tableViewData[0], length: activeTruckCount },
                { ...state.tableViewData[1], length: inactiveTruckCount },
            ],
        })
    ),

    on(MilesAction.activeViewMode, (state, { activeViewMode }) => ({
        ...state,
        activeViewMode,
    })),
    // #endregion

    // #region Table filters
    on(MilesAction.changeFilters, (state, { filters }) => ({
        ...state,
        filters,
    })),
    on(MilesAction.setStates, (state, { states }) => ({
        ...state,
        states,
    })),
    // #endregion

    // #region Checkbox selection
    on(MilesAction.selectOneRow, (state, { mile }) => {
        // Update select one only
        const updatedItems = state.items.map((item) =>
            item.id === mile.id ? { ...item, selected: !item.selected } : item
        );

        // new selected count
        const newSelectedCount = updatedItems.filter(
            (item) => item.selected
        ).length;

        return {
            ...state,
            items: updatedItems,
            selectedRows: newSelectedCount,
        };
    }),

    on(MilesAction.selectAll, (state) => { 
        const areAllItemsSelected = !state.areAllItemsSelected;

        const updatedItems = state.items.map((item) =>{
            return {
                ...item,
                selected: areAllItemsSelected
            }
        }); 

        return {
            ...state,
            items: updatedItems,
            selectedRows: areAllItemsSelected ? updatedItems.length : 0,
            areAllItemsSelected
        };
    })
    // #endregion
);
