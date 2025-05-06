// Helpers
import { AccountHelper } from '@pages/new-account/utils/helpers';

// Interfaces
import { IAccountState } from '@pages/new-account/interfaces';

// Models
import { GetCompanyAccountListResponse } from 'appcoretruckassist';

export function onLoadAccountsSuccess(
    state: IAccountState,
    data: GetCompanyAccountListResponse
): IAccountState {
    return {
        ...state,
        accountList: AccountHelper.accountMapper(data),
    };
}

export function onLoadAccountsError(
    state: IAccountState,
    error: any
): IAccountState {
    return {
        ...state,
        accountList: [],
        isLoading: false,
    };
}
