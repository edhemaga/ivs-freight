// Store
import { createFeatureSelector, createSelector } from '@ngrx/store';

// Interface
import { IUserState } from '@pages/new-user/interfaces';

export const userFeatureKey: string = 'user';

export const selectUserState =
    createFeatureSelector<IUserState>(userFeatureKey);

//#region List
export const userListSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.users
);
//#endregion

//#region Tabs
export const toolbarTabsSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.toolbarTabs
);

export const selectedTabSelector = createSelector(
    selectUserState,
    (state: IUserState) => state.selectedTab
);

//  View: CARD | LIST
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
//#endregion
