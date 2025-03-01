// External Libraries
import { createFeatureSelector, createSelector } from '@ngrx/store';

// Enums 
import { eActiveViewMode } from '@pages/load/pages/load-table/enums';

// Models
import { IMilesState } from '@pages/miles/models';

export const milesFeatureKey: string = 'miles';

export const selectMilesState = createFeatureSelector<IMilesState>(milesFeatureKey);

export const selectMilesItems = createSelector(
  selectMilesState,
  (state: IMilesState) => state.items  
)

export const selectTableViewData = createSelector(
  selectMilesState,
  (state: IMilesState) => state.tableViewData  
);

export const selectSelectedTab = createSelector(
  selectMilesState,
  (state: IMilesState) => state.selectedTab 
);

export const activeViewModeSelector = createSelector(selectMilesState, (state) => {
    const { activeViewMode } = state || {};
    return eActiveViewMode[activeViewMode];
});

export const filterSelector = createSelector(selectMilesState, (state) => {
  const { filters } = state || {};
  return filters;
});

export const statesSelector = createSelector(selectMilesState, (state) => {
  const { states } = state || {};
  return states;
});

export const selectedRowsSelector = createSelector(selectMilesState, (state) => {
  const { selectedRows } = state || {};
  return selectedRows;
});