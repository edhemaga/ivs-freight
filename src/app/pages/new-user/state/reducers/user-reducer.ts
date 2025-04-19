// Store
import { createReducer, on } from '@ngrx/store';

// Interface
import { IUserState } from '@pages/new-user/interfaces';

// Constants
import { UserToolbarTabs } from '@pages/new-user/utils/constants';

// Actions
import * as UserActions from '@pages/new-user/state/actions/user.action';

// Functions
import * as Functions from '@pages/new-user/state/functions/user-reducer.functions';

// Config
import { UserTableColumnsConfig } from '@pages/new-user/utils/config';

// Enums
import { eCommonElement, eStatusTab } from '@shared/enums';

export const initialState: IUserState = {
    users: [],

    toolbarTabs: UserToolbarTabs,
    selectedTab: eStatusTab.ACTIVE,

    activeViewMode: eCommonElement.LIST,

    tableColumns: UserTableColumnsConfig.getTableColumns(),
};

export const userReducer = createReducer(
    initialState,
    //#region  List
    on(UserActions.onGetListSuccess, (state, { payload }) =>
        Functions.onGetListSuccess(state, payload)
    ),

    on(UserActions.onGetListError, (state) => ({ ...state })),
    //#endregion

    //#region Tabs
    on(UserActions.onTabTypeChange, (state, { mode }) =>
        Functions.onTabTypeChange(state, mode)
    ),

    on(UserActions.onViewModeChange, (state, { viewMode }) =>
        Functions.onViewModeChange(state, viewMode)
    ),
    //#endregion

    //#region Selection
    on(UserActions.onUserSelection, (state, { id }) =>
        Functions.onUserSelection(state, id)
    )
    //#endregion
);
