// Store
import { createFeatureSelector, createSelector } from '@ngrx/store';

// Enums
import { eCardFlipViewMode } from '@shared/enums';

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

export const selectedTabCountSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.searchResultsCount
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

export const searchStringsSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.filters.searchQuery
);

export const pageSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.currentPage
);

//#endregion

//#region Table
export const tableColumnsSelector = createSelector(selectLoadState, (state) => {
    const { tableColumns } = state;
    return tableColumns;
});

export const isTypeColumnCheckedSelector = createSelector(
    tableColumnsSelector,
    (columns) => {
        const typeColumn = columns.find((col) => col.key === 'loadType');
        return typeColumn?.isChecked ?? false;
    }
);

export const getSortableColumn = createSelector(
    tableColumnsSelector,
    (columns) => columns.filter((col) => col.hasSort)
);

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
    return details;
});

export const loadDetailsCommentsSelector = createSelector(
    selectLoadState,
    (state) => {
        return state.details.data.comments;
    }
);

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

export const selectedLoadForStatusChangeSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => {
        const loadForChange = state.loads.find(
            (load) => load.id === state.loadIdLoadStatusChange
        );
        return loadForChange;
    }
);
//#endRegion

export const cardFlipViewModeSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => {
        const { cardFlipViewMode } = state || {};
        return eCardFlipViewMode[cardFlipViewMode];
    }
);

export const loadPickupDeliveryDataSelector = createSelector(
    selectLoadState,
    (state: ILoadState) => state.loadPickupDeliveryData
);
