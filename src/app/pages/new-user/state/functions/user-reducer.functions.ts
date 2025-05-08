// Models
import {
    CompanyUserListResponse,
    CompanyUserResponse,
    DepartmentFilterResponse,
} from 'appcoretruckassist';

import { eCardFlipViewMode, eStatusTab } from '@shared/enums';

import { ITableColumn } from '@shared/components/new-table/interfaces';
import { StoreFunctionsHelper } from '@shared/components/new-table/utils/helpers';
// Enums
import { eCommonElement, eGeneralActions, IFilterAction } from 'ca-components';

// Interfaces
import { IMappedUser, IUserState } from '@pages/new-user/interfaces';

// Helpers
import { UsersHelper } from '@pages/new-user/utils/helpers';
import {
    DropdownMenuToolbarContentHelper,
    DropdownMenuColumnsActionsHelper,
} from '@shared/utils/helpers/dropdown-menu-helpers';

//#region Tabs
export const onTabTypeChange = function (
    state: IUserState,
    selectedTab: eStatusTab
): IUserState {
    return {
        ...state,
        selectedTab,
        filters: {},
        tableSettings: {
            isTableLocked: true,
            sortKey: null,
            sortDirection: null,
            label: '',
        },
        currentPage: 1,
    };
};

export const onViewModeChange = function (
    state: IUserState,
    activeViewMode: eCommonElement
): IUserState {
    const { tableSettings, isToolbarDropdownMenuColumnsActive } = state;
    return {
        ...state,
        activeViewMode,
        toolbarDropdownMenuOptions:
            DropdownMenuToolbarContentHelper.getToolbarDropdownMenuContent(
                activeViewMode,
                tableSettings.isTableLocked,
                eCardFlipViewMode.FRONT, // hardcoded - remove this when somone will do cards for user
                isToolbarDropdownMenuColumnsActive
            ),
    };
};
//#endregion

//#region List
export function onGetListSuccess(
    state: IUserState,
    payload: CompanyUserListResponse,
    departmentList: DepartmentFilterResponse[]
): IUserState {
    return {
        ...state,
        searchResultsCount: payload.pagination.count,
        departmentList,
        users: UsersHelper.usersMapper(payload.pagination.data),
        toolbarTabs: UsersHelper.updateTabsCount(payload, state.toolbarTabs),
    };
}

export function onGetListOnPageChangeSuccess(
    state: IUserState,
    payload: CompanyUserListResponse
): IUserState {
    const users = [
        ...state.users,
        ...UsersHelper.usersMapper(payload.pagination.data),
    ];
    return {
        ...state,
        users,
        currentPage: state.currentPage + 1,
    };
}
//#endregion

//#region Selection
export const onUserSelection = function (
    state: IUserState,
    id: number
): IUserState {
    const users = state.users.map((user) =>
        user.id === id ? { ...user, isSelected: !user.isSelected } : user
    );
    const areAllUsersSelected = state.users.every((user) => user.isSelected);

    return {
        ...state,
        users,
        areAllUsersSelected,
    };
};

export function onSelectAll(state: IUserState, action: string): IUserState {
    const shouldSelectAll =
        action === eGeneralActions.SELECT_ALL ||
        action === eGeneralActions.CLEAR_SELECTED
            ? !state.areAllUsersSelected
            : true;

    const users = state.users.map((user) => ({
        ...user,
        isSelected: shouldSelectAll,
    }));

    return {
        ...state,
        users,
        areAllUsersSelected: shouldSelectAll,
    };
}
//#endregion

//#region Filters
export function onSeachFilterChange(
    state: IUserState,
    searchQuery: string[]
): IUserState {
    return {
        ...state,
        currentPage: 1,
        filters: {
            ...state.filters,
            searchQuery,
        },
    };
}

export function onFiltersChange(
    state: IUserState,
    filters: IFilterAction
): IUserState {
    return {
        ...state,
        filters: {
            ...state.filters,
            departmentIds: filters.selectedIds,
        },
        currentPage: 1,
    };
}

export function onTableSortingChange(
    state: IUserState,
    column: ITableColumn
): IUserState {
    const { columns, sortKey, sortDirection, label } =
        StoreFunctionsHelper.toggleSort(column, state.tableColumns);

    return {
        ...state,
        tableColumns: columns,
        tableSettings: {
            ...state.tableSettings,
            sortDirection,
            sortKey,
            label,
        },
    };
}
//#endregion

// #region Delete
export function onDeleteUsersSuccess(
    state: IUserState,
    usersToDelete: IMappedUser[],
    isIncreaseInOtherTab: boolean
): IUserState {
    const users = state.users.filter((user) => !usersToDelete.includes(user));

    return {
        ...state,
        users,
        searchResultsCount: state.searchResultsCount - usersToDelete.length,
        toolbarTabs: UsersHelper.updateTabsCountAfterDelete(
            state.selectedTab,
            usersToDelete.length,
            state.toolbarTabs,
            isIncreaseInOtherTab
        ),
    };
}
//#endregion

//#region Toolbar Hamburger Menu
export function setToolbarDropdownMenuColumnsActive(
    state: IUserState,
    isActive: boolean
): IUserState {
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
    state: IUserState,
    columnKey: string,
    isActive: boolean
): IUserState {
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

export function onUserEdit(
    state: IUserState,
    user: CompanyUserResponse
): IUserState {
    return {
        ...state,
        users: state.users.map((_user) =>
            _user.id === user.id
                ? { ..._user, ...UsersHelper.usersMapper([user])[0] }
                : _user
        ),
    };
}

export function onCreateNewUser(
    state: IUserState,
    user: CompanyUserResponse
): IUserState {
    const isActiveTab = state.selectedTab === eStatusTab.ACTIVE;

    const mappedUser = UsersHelper.usersMapper([user])[0];

    return {
        ...state,
        users: isActiveTab ? [...state.users, mappedUser] : state.users,
        toolbarTabs: UsersHelper.increaseActiveTabCount(state.toolbarTabs),
        searchResultsCount: isActiveTab
            ? state.searchResultsCount + 1
            : state.searchResultsCount,
    };
}
//#endregion
