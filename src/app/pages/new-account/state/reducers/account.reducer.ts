// Actions
import * as AccountActions from '@pages/new-account/state/actions/account.action';

// Config
import { AccountTableColumnsConfig } from '@pages/new-account/utils/config';

// Enums
import {
    eCardFlipViewMode,
    eCommonElement,
    eStringPlaceholder,
} from '@shared/enums';

// Interfaces
import { IAccountState } from '@pages/new-account/interfaces';

// Helpers
import { DropdownMenuToolbarContentHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

import { createReducer, on } from '@ngrx/store';

// Functions
import * as AccountFunctions from '@pages/new-account/state/functions/account-reducer.functions';

// Configs
import { AccountCardDataConfig } from '@pages/new-account/pages/account-card/utils/configs/account-card-data.config';

export const initialState: IAccountState = {
    accountList: [],
    isLoading: true,
    areAllUsersSelected: false,
    searchResultsCount: 0,
    filters: {},
    currentPage: 1,
    tableSettings: {
        isTableLocked: true,
        sortKey: null,
        sortDirection: null,
        label: eStringPlaceholder.EMPTY,
    },
    activeViewMode: eCommonElement.LIST,

    tableColumns: AccountTableColumnsConfig.getTableColumns(),

    toolbarDropdownMenuOptions:
        DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
            eCommonElement.LIST,
            true,
            eCardFlipViewMode.FRONT,
            false
        ),
    isToolbarDropdownMenuColumnsActive: false,

    cardFlipViewMode: eCardFlipViewMode.FRONT,
    frontSideData: AccountCardDataConfig.FRONT_SIDE_DATA,
    backSideData: AccountCardDataConfig.BACK_SIDE_DATA,
};

export const accountReducer = createReducer(
    initialState,

    //#region Load Account List
    on(AccountActions.loadAccounts, (state) => ({ ...state, loading: true })),
    on(AccountActions.loadAccountsSuccess, (state, { data }) =>
        AccountFunctions.onLoadAccountsSuccess(state, data)
    ),
    on(AccountActions.loadAccountsOnPageChangeSuccess, (state, { payload }) =>
        AccountFunctions.loadAccountsOnPageChangeSuccess(state, payload)
    ),
    on(AccountActions.loadAccountsFailure, (state) =>
        AccountFunctions.onLoadAccountsError(state)
    ),
    //#endregion

    //#region Tabs
    on(AccountActions.onViewModeChange, (state, { viewMode }) =>
        AccountFunctions.onViewModeChange(state, viewMode)
    ),
    //#endregion

    // #region Filters
    on(AccountActions.onSearchFilterChange, (state, { query }) =>
        AccountFunctions.onSearchFilterChange(state, query)
    ),

    on(AccountActions.onFiltersChange, (state, { filters }) =>
        AccountFunctions.onFiltersChange(state, filters)
    ),

    on(AccountActions.tableSortingChange, (state, { column }) =>
        AccountFunctions.onTableSortingChange(state, column)
    ),
    //#endregion

    //#region Selection
    on(AccountActions.onAccountSelection, (state, { id }) =>
        AccountFunctions.onAccountSelection(state, id)
    ),

    on(AccountActions.onSelectAll, (state, { action }) =>
        AccountFunctions.onSelectAll(state, action)
    ),
    //#endregion

    //#region Toolbar hamburger menu
    on(
        AccountActions.setToolbarDropdownMenuColumnsActive,
        (state, { isActive }) =>
            AccountFunctions.setToolbarDropdownMenuColumnsActive(
                state,
                isActive
            )
    ),
    on(
        AccountActions.toggleColumnVisibility,
        (state, { columnKey, isActive }) =>
            AccountFunctions.toggleColumnVisibility(state, columnKey, isActive)
    ),
    on(AccountActions.onAddAccountSuccess, (state, { account }) =>
        AccountFunctions.onAddCompanyAccount(state, account)
    ),
    on(AccountActions.onAddAndSaveAccount, (state, { account }) =>
        AccountFunctions.onAddCompanyAccount(state, account)
    ),
    on(AccountActions.onEditAccountSuccess, (state, { account }) =>
        AccountFunctions.onEditCompanyAccount(state, account)
    ),
    on(AccountActions.onDeleteAccountSuccess, (state, { id, activeModal }) =>
        AccountFunctions.onDeleteCompanyAccount(state, id, activeModal)
    ),
    on(AccountActions.onOpenModal, (state) => state),
    on(AccountActions.toggleCardFlipViewMode, (state) =>
        AccountFunctions.toggleCardFlipViewMode(state)
    ),
    on(
        AccountActions.setColumnsModalResult,
        (state, { frontSideData, backSideData }) =>
            AccountFunctions.setColumnsModalResult(
                state,
                frontSideData,
                backSideData
            )
    )
    //#endregion
);
