// Store
import { createFeatureSelector, createSelector } from '@ngrx/store';

// Intefaces
import { ILoadState } from '@pages/new-load/interfaces';

// It has to have same name as in StoreModule.forRoot inside app module
export const loadsFeatureKey: string = 'newLoad';

export const selectLoadState =
    createFeatureSelector<ILoadState>(loadsFeatureKey);

export const selectLoads = createSelector(
    selectLoadState,
    (state: ILoadState) => state.loads
);

//#region Tabs
export const toolbarTabsSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.toolbarTabs
);

export const selectedTabSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.selectedTab
);

//#endregion

//#region View: CARD | LIST
export const activeViewModeSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.activeViewMode
);

//#endregion

//#region Filters
export const filtersDropdownListSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.filtersDropdownList
);

//#endregion

//#region Table
export const tableColumnsSelector = createSelector(selectLoadState, (state) => {
    const { tableColumns } = state;
    return tableColumns;
});
//#endregion
