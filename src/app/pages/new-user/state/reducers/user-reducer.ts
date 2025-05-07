// Actions
import * as UserActions from '@pages/new-user/state/actions/user.action';
// Config
import { UserTableColumnsConfig } from '@pages/new-user/utils/config';
// Constants
import { UserToolbarTabs } from '@pages/new-user/utils/constants';

// Enums
import { eCommonElement, eStatusTab, eCardFlipViewMode } from '@shared/enums';

// Interface
import { IUserState } from '@pages/new-user/interfaces';

// Helpers
import { DropdownMenuToolbarContentHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// Store
import { createReducer, on } from '@ngrx/store';
// Functions
import * as Functions from '@pages/new-user/state/functions/user-reducer.functions';

export const initialState: IUserState = {
    users: [],
    departmentList: [],
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

    toolbarDropdownMenuOptions:
        DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
            eCommonElement.LIST,
            true,
            eCardFlipViewMode.FRONT,
            false
        ),
    isToolbarDropdownMenuColumnsActive: false,
};

export const userReducer = createReducer(
    initialState,
    //#region  List
    on(UserActions.onGetListSuccess, (state, { payload, departmentList }) =>
        Functions.onGetListSuccess(state, payload, departmentList)
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
    ),

    on(UserActions.onFiltersChange, (state, { filters }) =>
        Functions.onFiltersChange(state, filters)
    ),

    on(UserActions.tableSortingChange, (state, { column }) =>
        Functions.onTableSortingChange(state, column)
    ),
    //#endregion

    // #region Delete
    on(
        UserActions.onDeleteUsersSuccess,
        (state, { users, isIncreaseInOtherTab }) =>
            Functions.onDeleteUsersSuccess(state, users, isIncreaseInOtherTab)
    ),
    //#endregion

    //#region Toolbar hamburger menu
    on(UserActions.setToolbarDropdownMenuColumnsActive, (state, { isActive }) =>
        Functions.setToolbarDropdownMenuColumnsActive(state, isActive)
    ),
    on(UserActions.toggleColumnVisibility, (state, { columnKey, isActive }) =>
        Functions.toggleColumnVisibility(state, columnKey, isActive)
    ),
    //#endregion

    // #region Modal actions
    on(UserActions.onUserEdit, (state, { user }) =>
        Functions.onUserEdit(state, user)
    )
    //#endregion
);
