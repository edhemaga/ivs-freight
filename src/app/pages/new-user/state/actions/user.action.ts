// ngrx
import { createAction, props } from '@ngrx/store';

// Enums
import { eCommonElement } from 'ca-components';
import { eStatusTab } from '@shared/enums';

// Const
import { UserStoreConstants } from '@pages/new-user/utils/constants';
import { CompanyUserListResponse } from 'appcoretruckassist';

//#region List
export const onGetInitalList = createAction(
    UserStoreConstants.ACTION_DISPATCH_LOAD_USER_LIST
);

export const onGetListSuccess = createAction(
    UserStoreConstants.ACTION_DISPATCH_LOAD_USER_LIST_SUCCESS,
    props<{ payload: CompanyUserListResponse }>()
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
