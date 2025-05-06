import { createReducer, on } from '@ngrx/store';

// Config
import { AccountTableColumnsConfig } from '@pages/new-account/utils/config';

// Interfaces
import { IAccountState } from '@pages/new-account/interfaces';

// Actions
import * as AccountActions from '@pages/new-account/state/actions/account.action';

// Functions
import * as AccountFunctions from '@pages/new-account/state/functions/account-reducer.functions';

export const initialState: IAccountState = {
    accountList: [],
    isLoading: true,

    tableColumns: AccountTableColumnsConfig.getTableColumns(),
};

export const accountReducer = createReducer(
    initialState,

    //#region Load Account List
    on(AccountActions.loadAccounts, (state) => ({ ...state, loading: true })),
    on(AccountActions.loadAccountsSuccess, (state, { data }) =>
        AccountFunctions.onLoadAccountsSuccess(state, data)
    ),
    on(AccountActions.loadAccountsFailure, (state) =>
        AccountFunctions.onLoadAccountsError(state)
    )
    //#endregion
);
