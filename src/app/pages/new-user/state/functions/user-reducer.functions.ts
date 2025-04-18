// Interfaces
import { IUserState } from '@pages/new-user/interfaces';

// Models
import { CompanyUserListResponse } from 'appcoretruckassist';

// Enums
import { eCommonElement } from 'ca-components';
import { eStatusTab } from '@shared/enums';

// Helpers
import { UsersHelper } from '@pages/new-user/utils/helpers';

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
export function onGetListSuccess(
    state: IUserState,
    payload: CompanyUserListResponse
): IUserState {
    return {
        ...state,
        users: UsersHelper.usersMapper(payload.pagination.data),
    };
}
