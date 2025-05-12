// Models
import { GetCompanyAccountListResponse } from 'appcoretruckassist';

import {
    eCardFlipViewMode,
    eGeneralActions,
    eCommonElement,
} from '@shared/enums';

import { StoreFunctionsHelper } from '@shared/components/new-table/utils/helpers';

// Interfaces
import { IAccountState } from '@pages/new-account/interfaces';

// Helpers
import { AccountHelper } from '@pages/new-account/utils/helpers';
import { IMappedAccount } from '../../interfaces/mapped-account.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    DropdownMenuColumnsActionsHelper,
    DropdownMenuToolbarContentHelper,
} from '@shared/utils/helpers/dropdown-menu-helpers';

//#region List
export function onLoadAccountsSuccess(
    state: IAccountState,
    data: GetCompanyAccountListResponse
): IAccountState {
    const accountList = [
        ...state.accountList,
        ...AccountHelper.accountsMapper(data.pagination.data),
    ];
    return {
        ...state,
        accountList,
        searchResultsCount: data.count,
        currentPage: state.currentPage + 1,
    };
}

export function onLoadAccountsError(state: IAccountState): IAccountState {
    return {
        ...state,
        accountList: [],
        isLoading: false,
    };
}

//#endregion

//#region Tabs
export const onViewModeChange = function (
    state: IAccountState,
    activeViewMode: eCommonElement
): IAccountState {
    const { tableSettings, isToolbarDropdownMenuColumnsActive } = state;
    return {
        ...state,
        activeViewMode,
        toolbarDropdownMenuOptions:
            DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                eCardFlipViewMode.FRONT, // hardcoded - remove this when somone will do cards for account
                isToolbarDropdownMenuColumnsActive
            ),
    };
};
//#endregion

//#region Selection
export const onAccountSelection = function (
    state: IAccountState,
    id: number
): IAccountState {
    const accountList = state.accountList.map((user) =>
        user.id === id ? { ...user, isSelected: !user.isSelected } : user
    );
    const areAllUsersSelected = state.accountList.every(
        (account) => account.isSelected
    );

    return {
        ...state,
        accountList,
        areAllUsersSelected,
    };
};

export function onSelectAll(
    state: IAccountState,
    action: string
): IAccountState {
    const shouldSelectAll =
        action === eGeneralActions.SELECT_ALL ||
        action === eGeneralActions.CLEAR_SELECTED
            ? !state.areAllUsersSelected
            : true;

    const accountList = state.accountList.map((account) => ({
        ...account,
        isSelected: shouldSelectAll,
    }));

    return {
        ...state,
        accountList,
        areAllUsersSelected: shouldSelectAll,
    };
}
//#endregion

//#region Toolbar Hamburger Menu
export function setToolbarDropdownMenuColumnsActive(
    state: IAccountState,
    isActive: boolean
): IAccountState {
    const { activeViewMode, tableSettings, tableColumns } = state;
    const toolbarDropdownColumns =
        DropdownMenuColumnsActionsHelper.mapToolbarDropdownColumnsNew(
            tableColumns
        );
    return {
        ...state,
        isToolbarDropdownMenuColumnsActive: isActive,
        toolbarDropdownMenuOptions:
            DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                eCardFlipViewMode.FRONT, // hardcoded - remove this when somone will do cards for user
                isActive,
                toolbarDropdownColumns
            ),
    };
}

export function toggleColumnVisibility(
    state: IAccountState,
    columnKey: string,
    isActive: boolean
): IAccountState {
    const tableColumns = StoreFunctionsHelper.mapColumnsVisibility(
        state.tableColumns,
        columnKey,
        isActive
    );
    return {
        ...state,
        tableColumns,
    };
}
//#endregion
export function onAddCompanyAccount(
    state: IAccountState,
    account: IMappedAccount
): IAccountState {
    return {
        ...state,
        accountList: [account, ...state.accountList],
    };
}

export function onEditCompanyAccount(
    state: IAccountState,
    account: IMappedAccount
): IAccountState {
    const modifiedAccountList: IMappedAccount[] = state.accountList.map(
        (_account: IMappedAccount) => {
            if (_account.id === account.id) return account;
            return _account;
        }
    );

    return {
        ...state,
        accountList: [...modifiedAccountList],
    };
}

export function onDeleteCompanyAccount(
    state: IAccountState,
    id: number,
    activeModal: NgbActiveModal
): IAccountState {
    activeModal.close();

    return {
        ...state,
        accountList: [
            ...state.accountList.filter(
                (account: IMappedAccount) => account.id !== id
            ),
        ],
    };
}
