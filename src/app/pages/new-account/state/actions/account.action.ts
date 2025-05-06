import { createAction, props } from '@ngrx/store';

// Models
import { GetCompanyAccountListResponse } from 'appcoretruckassist';

// Constants
import { AccountStoreConstants } from '@pages/new-account/utils/constants';

export const loadAccounts = createAction(AccountStoreConstants.LOAD_ACCOUNTS);

export const loadAccountsSuccess = createAction(
    AccountStoreConstants.LOAD_ACCOUNTS_SUCCESS,
    props<{ data: GetCompanyAccountListResponse }>()
);

export const loadAccountsFailure = createAction(
    AccountStoreConstants.LOAD_ACCOUNTS_FAILURE,
    props<{ error: any }>()
);
