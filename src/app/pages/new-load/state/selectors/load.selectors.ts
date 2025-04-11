// Store
import { createFeatureSelector, createSelector } from '@ngrx/store';

// Intefaces
import { ILoadState } from '@pages/new-load/interfaces';

// It has to have same name as in StoreModule.forRoot inside app module
export const loadsFeatureKey: string = 'newLoad';

export const selectMilesState =
    createFeatureSelector<ILoadState>(loadsFeatureKey);

export const selectLoads = createSelector(
    selectMilesState,
    (state: ILoadState) => state.loads
);

export const toolbarTabsSelector = createSelector(
    selectMilesState,
    (state: ILoadState) => state.toolbarTabs
);

export const selectedTabSelector = createSelector(
    selectMilesState,
    (state: ILoadState) => state.selectedTab
);

export const activeViewModeSelector = createSelector(
    selectMilesState,
    (state: ILoadState) => state.activeViewMode
);
