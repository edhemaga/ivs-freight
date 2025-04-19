// Interfaces
import { IUserState } from '@pages/new-user/interfaces';

// Models
import { CompanyUserListResponse } from 'appcoretruckassist';

// Enums
import { eCommonElement } from 'ca-components';
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
        users: UsersHelper.usersMapper(payload.pagination.data),
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

    return {
        ...state,
        users,
    };
};
//#endregion
