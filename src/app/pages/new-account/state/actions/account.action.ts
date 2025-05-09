// Constants
import { AccountStoreConstants } from '@pages/new-account/utils/constants';

// Models
import { GetCompanyAccountListResponse } from 'appcoretruckassist';
import { IMappedAccount } from '@pages/new-account/interfaces';

import { eCommonElement } from '@shared/enums';

import { createAction, props } from '@ngrx/store';

export const loadAccounts = createAction(AccountStoreConstants.LOAD_ACCOUNTS);

export const loadAccountsSuccess = createAction(
    AccountStoreConstants.LOAD_ACCOUNTS_SUCCESS,
    props<{ data: GetCompanyAccountListResponse }>()
);

export const loadAccountsFailure = createAction(
    AccountStoreConstants.LOAD_ACCOUNTS_FAILURE
);

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

export const onOpenModal = createAction(
    AccountStoreConstants.ACTION_OPEN_ACCOUNT_MODAL,
    props<{
        data;
        isEdit: boolean;
        id: number;
    }>()
);

export const onAddAccount = createAction(
    AccountStoreConstants.ACTION_ON_ADD_ACCOUNT,
    props<{ account: IMappedAccount }>()
);

export const onAddAccountSuccess = createAction(
    AccountStoreConstants.ACTION_ON_ADD_ACCOUNT_SUCCESS,
    props<{ account: IMappedAccount }>()
);

export const onAddAccountError = createAction(
    AccountStoreConstants.ACTION_ON_ADD_ACCOUNT_ERROR,
    props<{ error: Error }>()
);

export const onEditAccount = createAction(
    AccountStoreConstants.ACTION_ON_EDIT_ACCOUNT,
    props<{ account: IMappedAccount }>()
);

export const onEditAccountSuccess = createAction(
    AccountStoreConstants.ACTION_ON_EDIT_ACCOUNT_SUCCESS,
    props<{ account: IMappedAccount }>()
);

export const onEditAccountError = createAction(
    AccountStoreConstants.ACTION_ON_EDIT_ACCOUNT_ERROR,
    props<{ error: Error }>()
);
