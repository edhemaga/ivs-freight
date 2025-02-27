import { createSelector } from '@ngrx/store';
import { MilesState } from '../reducers/miles.reducer';
import { eActiveViewMode } from '@pages/load/pages/load-table/enums';

export const selectMilesState = (state: any) => state.miles;

export const getMilesListSelector = createSelector(
  selectMilesState,
  (state: MilesState) => state.items
);

export const selectMilesLoading = createSelector(
  selectMilesState,
  (state: MilesState) => state.loading
);

export const selectMilesItems = createSelector(
  selectMilesState,
  (state: MilesState) => state.items  
)

export const selectTableViewData = createSelector(
  selectMilesState,
  (state: MilesState) => state.tableViewData  
);

export const selectSelectedTab = createSelector(
  selectMilesState,
  (state: MilesState) => state.selectedTab 
);

export const activeViewModeSelector = createSelector(selectMilesState, (state) => {
    const { activeViewMode } = state || {};
    return eActiveViewMode[activeViewMode];
});