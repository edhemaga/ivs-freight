// Interfaces
import { IUserState } from '@pages/new-user/interfaces';

// Models
import { CompanyUserListResponse } from 'appcoretruckassist';

// Enums
import { eCommonElement, eGeneralActions } from 'ca-components';
import { eStatusTab } from '@shared/enums';

// Helpers
import { UsersHelper } from '@pages/new-user/utils/helpers';

//#region Tabs
export const onTabTypeChange = function (
    state: IUserState,
    selectedTab: eStatusTab
): IUserState {
    return {
        ...state,
        selectedTab,
        currentPage: 1,
    };
};

export const onViewModeChange = function (
    state: IUserState,
    activeViewMode: eCommonElement
): IUserState {
    return {
        ...state,
        activeViewMode,
    };
};
//#endregion

//#region List
export function onGetListSuccess(
    state: IUserState,
    payload: CompanyUserListResponse
): IUserState {
    return {
        ...state,
        searchResultsCount: payload.pagination.count,
        users: UsersHelper.usersMapper(payload.pagination.data),
        toolbarTabs: UsersHelper.updateTabsCount(payload, state.toolbarTabs),
    };
}

export function onGetListOnPageChangeSuccess(
    state: IUserState,
    payload: CompanyUserListResponse
): IUserState {
    const users = [
        ...state.users,
        ...UsersHelper.usersMapper(payload.pagination.data),
    ];
    return {
        ...state,
        users,
        currentPage: state.currentPage + 1,
    };
}
//#endregion

//#region Selection
export const onUserSelection = function (
    state: IUserState,
    id: number
): IUserState {
    const users = state.users.map((user) =>
        user.id === id ? { ...user, isSelected: !user.isSelected } : user
    );
    const areAllUsersSelected = state.users.every((user) => user.isSelected);

    return {
        ...state,
        users,
        areAllUsersSelected,
    };
};

export function onSelectAll(state: IUserState, action: string): IUserState {
    const shouldSelectAll =
        action === eGeneralActions.SELECT_ALL ||
        action === eGeneralActions.CLEAR_SELECTED
            ? !state.areAllUsersSelected
            : true;

    const users = state.users.map((user) => ({
        ...user,
        isSelected: shouldSelectAll,
    }));

    return {
        ...state,
        users,
        areAllUsersSelected: shouldSelectAll,
    };
}

//#endregion
