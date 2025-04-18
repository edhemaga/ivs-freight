// Store
import { createReducer } from '@ngrx/store';

// Interface
import { IUserState } from '@pages/new-user/interfaces';

// Constants
import { UserToolbarTabs } from '@pages/new-user/utils/constants';

// Enums
import { eCommonElement, eStatusTab } from '@shared/enums';

export const initialState: IUserState = {
    users: [],

    toolbarTabs: UserToolbarTabs,
    selectedTab: eStatusTab.ACTIVE,

    activeViewMode: eCommonElement.LIST,
};

export const userReducer = createReducer(initialState);
