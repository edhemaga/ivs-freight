// ngrx
import { createAction, props } from '@ngrx/store';

// Constants
import { AccountStoreConstants } from '@pages/new-account/utils/constants';

// Models
import { GetCompanyAccountListResponse } from 'appcoretruckassist';

// Enums
import { IFilterAction } from 'ca-components';
import { eCommonElement } from '@shared/enums';

// Interface
import { ITableColumn } from '@shared/components/new-table/interfaces';

//#region List
export const loadAccounts = createAction(AccountStoreConstants.LOAD_ACCOUNTS);

export const loadAccountsSuccess = createAction(
    AccountStoreConstants.LOAD_ACCOUNTS_SUCCESS,
    props<{ data: GetCompanyAccountListResponse }>()
);

export const loadAccountsOnPageChangeSuccess = createAction(
    AccountStoreConstants.ACTION_NEW_PAGE_LIST_SUCCESS,
    props<{
        payload: GetCompanyAccountListResponse;
    }>()
);

export const loadAccountsFailure = createAction(
    AccountStoreConstants.LOAD_ACCOUNTS_FAILURE
);

export const getAccountsOnPageChange = createAction(
    AccountStoreConstants.ACTION_GET_NEW_PAGE_RESULTS
);
//#endregion

//#region Selection
export const onAccountSelection = createAction(
    AccountStoreConstants.ACTION_DISPATCH_ON_ACCOUNT_SELECTION,
    props<{
        id: number;
    }>()
);

export const onSelectAll = createAction(
    AccountStoreConstants.ACTION_ON_SELECT_ALL,
    props<{ action: string }>()
);
//#endregion

//#region Toolbar Hamburger Menu
export const setToolbarDropdownMenuColumnsActive = createAction(
    AccountStoreConstants.ACTION_SET_TOOLBAR_DROPDOWN_MENU_COLUMNS_ACTIVE,
    props<{ isActive: boolean }>()
);

export const toggleColumnVisibility = createAction(
    AccountStoreConstants.ACTION_TOGGLE_COLUMN_VISIBILITY,
    props<{ columnKey: string; isActive: boolean }>()
);
//#endregion

export const onViewModeChange = createAction(
    AccountStoreConstants.ACTION_DISPATCH_VIEW_MODE_CHANGE,
    props<{
        viewMode: eCommonElement;
    }>()
);

// #region Filters
export const onSearchFilterChange = createAction(
    AccountStoreConstants.ACTION_SEARCH_FILTER_CHANGED,
    props<{
        query: string[];
    }>()
);

export const onFiltersChange = createAction(
    AccountStoreConstants.ACTION_FILTER_CHANGED,
    props<{
        filters: IFilterAction;
    }>()
);

export const tableSortingChange = createAction(
    AccountStoreConstants.ACTION_SORTING_CHANGE,
    props<{ column: ITableColumn }>()
);
//#endregion
