// Interface
import { IUserState } from '@pages/new-user/interfaces';

// Store
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const userFeatureKey: string = 'user';

export const selectUserState =
    createFeatureSelector<IUserState>(userFeatureKey);

//#region List
export const userListSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.users
);

export const departmentListSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.departmentList
);

//#endregion

//#region Toolbar hamburger menu

export const toolbarDropdownMenuOptionsSelector = createSelector(
    selectUserState,
    (state) => {
        const { toolbarDropdownMenuOptions } = state;
        return toolbarDropdownMenuOptions;
    }
);

//#endRegion

//#region Tabs
export const toolbarTabsSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.toolbarTabs
);

export const selectedTabSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.selectedTab
);

//  View: CARD |LIST
export const activeViewModeSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.activeViewMode
);

//#endregion

// #region Table
export const tableColumnsSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.tableColumns
);

export const tableSettingsSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.tableSettings
);
//#endregion

//#region Selection
export const selectedUserSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.users.filter((user) => user.isSelected)
);

export const selectedCountSelector = createSelector(
    selectedUserSelector,
    (selectUserState) => selectUserState.length
);

export const selectedTabCountSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.searchResultsCount
);
//#endregion

// #region Filters
export const pageSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.currentPage
);

export const filterSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.filters
);

export const searchStringsSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.filters?.searchQuery
);

//#endregion
