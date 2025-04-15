import { createFeatureSelector, createSelector } from '@ngrx/store';

// Enums
import { eActiveViewMode, eCardFlipViewMode } from '@shared/enums';

// models
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

export const tableColumnsSelector = createSelector(
    selectMilesState,
    (state) => {
        const { columns } = state || {};
        return columns;
    }
);

export const detailsSelector = createSelector(selectMilesState, (state) => {
    const { details } = state || {};
    return details.data;
});

export const stopsSelector = createSelector(selectMilesState, (state) => {
    const { details } = state || {};
    return details.stops ?? [];
});

export const stopsSearchSelector = createSelector(selectMilesState, (state) => {
    const { details } = state || {};
    return details.searchString;
});

export const currentStopsPageSelector = createSelector(
    selectMilesState,
    (state) => {
        const { details } = state || {};
        return details.currentPage;
    }
);

export const activeUnitIdSelector = createSelector(
    selectMilesState,
    (state) => {
        const { details } = state || {};
        return details.activeUnitId;
    }
);

export const totalStopsCountSelector = createSelector(
    selectMilesState,
    (state) => {
        const { details } = state || {};
        return details.totalCount;
    }
);

export const pageSelector = createSelector(
    selectMilesState,
    (state: IMilesState) => state.page
);

export const tableSettingsSelector = createSelector(
    selectMilesState,
    (state: IMilesState) => state.tableSettings
);

export const tabResultsSelector = createSelector(
    selectMilesState,
    (state: IMilesState) => state.tabResults
);

export const toolbarDropdownMenuOptionsSelector = createSelector(
    selectMilesState,
    (state) => {
        const { toolbarDropdownMenuOptions } = state || {};
        return toolbarDropdownMenuOptions;
    }
);

export const cardFlipViewModeSelector = createSelector(
    selectMilesState,
    (state: IMilesState) => {
        const { cardFlipViewMode } = state || {};
        return eCardFlipViewMode[cardFlipViewMode];
    }
);

export const minimalListSelector = createSelector(
    selectMilesState,
    (state: IMilesState) => state.minimalList.data || []
);

export const currentPageSelector = createSelector(
    selectMilesState,
    (state: IMilesState) => state.minimalList.currentPage
);

export const searchTextSelector = createSelector(
    selectMilesState,
    (state: IMilesState) => state.minimalList.searchString
);

export const totalMinimalListCountSelector = createSelector(
    selectMilesState,
    (state: IMilesState) => state.minimalList.totalCount
);

export const minimalListFiltersSelector = createSelector(
    selectMilesState,
    (state: IMilesState) => state.minimalListFilters
);

export const detailsLoadingSelector = createSelector(
    selectMilesState,
    (state: IMilesState) => state.isDetailsLoading
);

export const milesUnitMapDataSelector = createSelector(
    selectMilesState,
    (state: IMilesState) => state.unitMapData
);
