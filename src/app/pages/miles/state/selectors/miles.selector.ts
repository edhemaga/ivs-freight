// External Libraries
import { createFeatureSelector, createSelector } from '@ngrx/store';

// Enums
import { eActiveViewMode } from '@shared/enums';

// Models
import { IMilesState } from '@pages/miles/interface';

export const milesFeatureKey: string = 'miles';

export const selectMilesState =
    createFeatureSelector<IMilesState>(milesFeatureKey);

export const selectMilesItems = createSelector(
    selectMilesState,
    (state: IMilesState) => state.items
);

export const selectTableViewData = createSelector(
    selectMilesState,
    (state: IMilesState) => state.tableViewData
);

export const selectSelectedTab = createSelector(
    selectMilesState,
    (state: IMilesState) => state.selectedTab
);

export const activeViewModeSelector = createSelector(
    selectMilesState,
    (state) => {
        const { activeViewMode } = state || {};
        return eActiveViewMode[activeViewMode];
    }
);

export const filterSelector = createSelector(selectMilesState, (state) => {
    const { filters } = state || {};
    return filters;
});

export const statesSelector = createSelector(selectMilesState, (state) => {
    const { states } = state || {};
    return states;
});

export const selectedRowsSelector = createSelector(
    selectMilesState,
    (state) => {
        const { selectedRows } = state || {};
        return selectedRows;
    }
);

export const tableColumnsSelector = createSelector(
    selectMilesState,
    (state) => {
        const { columns } = state || {};
        return columns;
    }
);

export const areAllItemsSelectedSelector = createSelector(
    selectMilesState,
    (state) => {
        const { areAllItemsSelected } = state || {};
        return areAllItemsSelected;
    }
);

export const detailsSelector = createSelector(selectMilesState, (state) => {
    const { details } = state || {};
    return details;
});

export const unitsPaginationSelector = createSelector(
    selectMilesState,
    (state: IMilesState) => state.unitsPagination
);
