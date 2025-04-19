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
    areAllUsersSelected: false,
    searchResultsCount: 0,

    filters: {},
    currentPage: 1,
    tableSettings: {
        isTableLocked: true,
        sortKey: null,
        sortDirection: null,
        label: '',
    },

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

    on(UserActions.onGetListOnPageChangeSuccess, (state, { payload }) =>
        Functions.onGetListOnPageChangeSuccess(state, payload)
    ),
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
    ),

    on(UserActions.onSelectAll, (state, { action }) =>
        Functions.onSelectAll(state, action)
    ),
    //#endregion

    // #region Filters
    on(UserActions.onSeachFilterChange, (state, { query }) =>
        Functions.onSeachFilterChange(state, query)
    )
    //#endregion
);
