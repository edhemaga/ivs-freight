// Store
import { createFeatureSelector, createSelector } from '@ngrx/store';

// Intefaces
import { ILoadState } from '@pages/new-load/interfaces';

// Helpers
import { LoadStoreHelper } from '@pages/new-load/utils/helpers';

// It has to have same name as in StoreModule.forRoot inside app module
export const loadsFeatureKey: string = 'newLoad';

//#region List
export const selectLoadState =
    createFeatureSelector<ILoadState>(loadsFeatureKey);

export const selectLoads = createSelector(
    selectLoadState,
    (state: ILoadState) => state.loads
);

export const selectedLoadsSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.loads.filter((load) => load.isSelected)
);

export const selectedCountSelector = createSelector(
    selectedLoadsSelector,
    (selectedLoads) => {
        console.log('selectedLoadsSelector');
        return selectedLoads.length;
    }
);

//#endregion

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

export const filtersSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.filters
);

//#endregion

//#region Table
export const tableColumnsSelector = createSelector(selectLoadState, (state) => {
    const { tableColumns } = state;
    return tableColumns;
});

export const totalSumSelector = createSelector(
    selectLoadState,
    selectedCountSelector,
    (state, selectedCount) => {
        console.log('totalSumSelector');
        const { loads } = state;

        if (!selectedCount) {
            return LoadStoreHelper.getTotalLoadSum(loads);
        }

        return loads
            .filter((item) => item.isSelected)
            .reduce((sum, item) => sum + (item.totalDue || 0), 0);
    }
);

export const tableSettingsSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.tableSettings
);
//#endregion

//#region Details
export const loadDetailsSelector = createSelector(selectLoadState, (state) => {
    const { details } = state;
    console.log('loadDetailsSelectorloadDetailsSelector');
    return details;
});

export const minimalListSelector = createSelector(selectLoadState, (state) => {
    const { minimalList } = state;
    console.log('minimalListSelector');
    return minimalList;
});

export const closedLoadStatusSelector = createSelector(
    selectLoadState,
    (state) => {
        const history = state.details?.data?.statusHistory;

        return Array.isArray(history) ? [...history].reverse() : [];
    }
);
//#endregion

//#region Toolbar hamburger menu

export const toolbarDropdownMenuOptionsSelector = createSelector(
    selectLoadState,
    (state) => {
        const { toolbarDropdownMenuOptions } = state;
        return toolbarDropdownMenuOptions;
    }
);

//#endRegion

//#region Change load status
export const changeDropdownpossibleStatusesSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.possibleStatuses
);

export const loadIdLoadStatusChangeSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.loadIdLoadStatusChange
);
//#endRegion
