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
        accountList: AccountHelper.accountsMapper(data.pagination.data),
    };
}

export function onLoadAccountsError(state: IAccountState): IAccountState {
    return {
        ...state,
        accountList: [],
        isLoading: false,
    };
}
