// Interfaces
import { IAccountState } from '@pages/new-account/interfaces';

import { createFeatureSelector, createSelector } from '@ngrx/store';

// Enums
import { eCardFlipViewMode } from '@shared/enums';

export const accountFeatureKey: string = 'account';

//#region List
export const selectAccountState =
    createFeatureSelector<IAccountState>(accountFeatureKey);

export const accountsListSelector = createSelector(
    selectAccountState,
    (state: IAccountState) => state.accountList
);

export const accountSelector = (id: number) =>
    createSelector(selectAccountState, (state: IAccountState) =>
        state.accountList.find((account) => account.id === id)
    );

export const tableColumnsSelector = createSelector(
    selectAccountState,
    (state) => {
        const { tableColumns } = state;
        return tableColumns;
    }
);

//#endregion

//#region Toolbar hamburger menu

export const toolbarDropdownMenuOptionsSelector = createSelector(
    selectAccountState,
    (state) => {
        const { toolbarDropdownMenuOptions } = state;
        return toolbarDropdownMenuOptions;
    }
);

//#endRegion

//#region Table
export const tableSettingsSelector = createSelector(
    selectAccountState,
    (state: IAccountState) => state.tableSettings
);

//#endregion

//#region Selection
export const selectedAccountSelector = createSelector(
    selectAccountState,
    (state: IAccountState) =>
        state.accountList.filter((account) => account.isSelected)
);

export const selectedCountSelector = createSelector(
    selectedAccountSelector,
    (selectAccountState) => selectAccountState.length
);

export const selectedTabCountSelector = createSelector(
    selectAccountState,
    (state: IAccountState) => state.searchResultsCount
);
//#endregion

//#region Tabs
//  View: CARD |LIST
export const activeViewModeSelector = createSelector(
    selectAccountState,
    (state: IAccountState) => state.activeViewMode
);
//#endregion

// #region Filters
export const pageSelector = createSelector(
    selectAccountState,
    (state: IAccountState) => state.currentPage
);

export const filterSelector = createSelector(
    selectAccountState,
    (state: IAccountState) => state.filters
);

export const searchStringsSelector = createSelector(
    selectAccountState,
    (state: IAccountState) => state.filters?.searchQuery
);
//#endregion

// #region Cards
export const cardFlipViewModeSelector = createSelector(
    selectAccountState,
    (state: IAccountState) => {
        const { cardFlipViewMode } = state || {};
        return eCardFlipViewMode[cardFlipViewMode];
    }
);

export const frontSideDataSelector = createSelector(
    selectAccountState,
    (state: IAccountState) => state.frontSideData
);

export const backSideDataSelector = createSelector(
    selectAccountState,
    (state: IAccountState) => state.backSideData
);
// #endregion
