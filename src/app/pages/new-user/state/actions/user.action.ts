// ngrx
import { createAction, props } from '@ngrx/store';

// Enums
import { eCommonElement, IFilterAction } from 'ca-components';
import { eStatusTab } from '@shared/enums';

// Const
import { UserStoreConstants } from '@pages/new-user/utils/constants';

// Models
import {
    CompanyUserListResponse,
    DepartmentFilterResponse,
} from 'appcoretruckassist';

// Interface
import { ITableColumn } from '@shared/components/new-table/interfaces';
import { IMappedUser } from '@pages/new-user/interfaces';

//#region List
export const onGetInitalList = createAction(
    UserStoreConstants.ACTION_DISPATCH_LOAD_USER_LIST
);

export const onGetListSuccess = createAction(
    UserStoreConstants.ACTION_DISPATCH_LOAD_USER_LIST_SUCCESS,
    props<{
        payload: CompanyUserListResponse;
        departmentList: DepartmentFilterResponse[];
    }>()
);

export const onGetListOnPageChangeSuccess = createAction(
    UserStoreConstants.ACTION_NEW_PAGE_LIST_SUCCESS,
    props<{
        payload: CompanyUserListResponse;
    }>()
);

export const onGetListError = createAction(
    UserStoreConstants.ACTION_DISPATCH_LOAD_USER_LIST_ERROR
);

export const getLoadsOnPageChange = createAction(
    UserStoreConstants.ACTION_GET_NEW_PAGE_RESULTS
);
//#endregion

//#region Toolbar Hamburger Menu
export const setToolbarDropdownMenuColumnsActive = createAction(
    UserStoreConstants.ACTION_SET_TOOLBAR_DROPDOWN_MENU_COLUMNS_ACTIVE,
    props<{ isActive: boolean }>()
);

export const toggleColumnVisibility = createAction(
    UserStoreConstants.ACTION_TOGGLE_COLUMN_VISIBILITY,
    props<{ columnKey: string; isActive: boolean }>()
);
//#endregion

//#region Tabs
export const onTabTypeChange = createAction(
    UserStoreConstants.ACTION_DISPATCH_USER_TYPE_CHANGE,
    props<{
        mode: eStatusTab;
    }>()
);

export const onViewModeChange = createAction(
    UserStoreConstants.ACTION_DISPATCH_VIEW_MODE_CHANGE,
    props<{
        viewMode: eCommonElement;
    }>()
);

//#endregion

//#region Selection
export const onUserSelection = createAction(
    UserStoreConstants.ACTION_DISPATCH_ON_USER_SELECTION,
    props<{
        id: number;
    }>()
);

export const onSelectAll = createAction(
    UserStoreConstants.ACTION_ON_SELECT_ALL,
    props<{ action: string }>()
);
//#endregion

// #region Filters
export const onSeachFilterChange = createAction(
    UserStoreConstants.ACTION_SEARCH_FILTER_CHANGED,
    props<{
        query: string[];
    }>()
);

export const onFiltersChange = createAction(
    UserStoreConstants.ACTION_FILTER_CHANGED,
    props<{
        filters: IFilterAction;
    }>()
);

export const tableSortingChange = createAction(
    UserStoreConstants.ACTION_SORTING_CHANGE,
    props<{ column: ITableColumn }>()
);
//#endregion

//#region Delete
export const onDeleteUsers = createAction(
    UserStoreConstants.ACTION_DISPATCH_DELETE_USERS,
    props<{
        users: IMappedUser[];
    }>()
);
export const onDeleteUsersSuccess = createAction(
    UserStoreConstants.ACTION_DISPATCH_DELETE_USERS_SUCCESS,
    props<{
        users: IMappedUser[];
        isIncreaseInOtherTab: boolean;
    }>()
);
export const onDeleteUsersError = createAction(
    UserStoreConstants.ACTION_DISPATCH_DELETE_USERS_ERROR
);
//#endregion

//#region Status
export const onUserStatusChange = createAction(
    UserStoreConstants.ACTION_DISPATCH_USER_STATUS_CHANGE,
    props<{
        users: IMappedUser[];
    }>()
);

export const onUserStatusChangeError = createAction(
    UserStoreConstants.ACTION_DISPATCH_USER_STATUS_CHANGE_ERROR
);
//#endregion

//#region Modal
export const onOpenUserModal = createAction(
    UserStoreConstants.ACTION_OPEN_USER_MODAL
);
//#endregion
