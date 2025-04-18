// Interfaces
import { IUserState } from '@pages/new-user/interfaces';
import { eStatusTab } from '@shared/enums';

// Enums
import { eCommonElement } from 'ca-components';

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
