// ngrx
import { createAction, props } from '@ngrx/store';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eCommonElement } from '@shared/enums';

// Const
import { LoadStoreConstants } from '@pages/new-load/utils/constants';

// Models
import {
    DispatcherFilterResponse,
    LoadListResponse,
    LoadMinimalListResponse,
    LoadResponse,
    LoadStatusFilterResponse,
    RoutingResponse,
} from 'appcoretruckassist';

// Interface
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';

// Ca components
import { IFilterAction } from 'ca-components';
import { TemplateRef } from '@angular/core';

//#region List request
export const getLoadsPayload = createAction(
    LoadStoreConstants.ACTION_DISPATCH_LOAD_LIST
);

export const getLoadsPayloadSuccess = createAction(
    LoadStoreConstants.ACTION_LOAD_LIST_SUCCESS,
    props<{
        payload: LoadListResponse;
    }>()
);
//#endregion

//#region Tabs
export const getLoadsPayloadOnTabTypeChange = createAction(
    LoadStoreConstants.ACTION_DISPATCH_LOAD_TYPE_CHANGE,
    props<{
        mode: eLoadStatusType;
    }>()
);

export const getViewModeChange = createAction(
    LoadStoreConstants.ACTION_DISPATCH_VIEW_MODE_CHANGE,
    props<{
        viewMode: eCommonElement;
    }>()
);
//#endregion

//#region Filters
export const onFiltersChange = createAction(
    LoadStoreConstants.ACTION_FILTER_CHANGED,
    props<{
        filters: IFilterAction;
    }>()
);

export const setFilterDropdownList = createAction(
    LoadStoreConstants.ACTION_SET_FILTER_DROPDOPWN_LIST,
    props<{
        dispatcherFilters: DispatcherFilterResponse[];
        statusFilters: LoadStatusFilterResponse[];
    }>()
);

export const onSeachFilterChange = createAction(
    LoadStoreConstants.ACTION_SEARCH_FILTER_CHANGED,
    props<{
        query: string[];
    }>()
);
//#endregion

//#region Modal
export const onOpenLoadModal = createAction(
    LoadStoreConstants.ACTION_OPEN_LOAD_MODAL,
    props<{
        modal: ILoadModal;
    }>()
);
//#endregion

//#region Load details
export const onLoadDetailsAction = createAction(
    LoadStoreConstants.ACTION_GO_TO_LOAD_DETAILS,
    props<{
        id: number;
    }>()
);

export const onGetLoadById = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_BY_ID,
    props<{
        id: number;
    }>()
);

export const onGetLoadByIdSuccess = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_BY_ID_SUCCESS,
    props<{
        load: LoadResponse;
        minimalList: LoadMinimalListResponse;
        mapRoutes: RoutingResponse;
    }>()
);

export const onGetLoadByIdError = createAction(
    LoadStoreConstants.ACTION_GET_LOAD_BY_ID_ERROR
);

export const onMapVisiblityToggle = createAction(
    LoadStoreConstants.ACTION_TOGGLE_MAP
);
//#endregion

//#region Toolbar Hamburger Menu
export const setToolbarDropdownMenuColumnsActive = createAction(
    LoadStoreConstants.ACTION_SET_TOOLBAR_DROPDOWN_MENU_COLUMNS_ACTIVE,
    props<{ isActive: boolean }>()
);

export const toggleColumnVisibility = createAction(
    LoadStoreConstants.ACTION_TOGGLE_COLUMN_VISIBILITY,
    props<{ columnKey: string; isActive: boolean }>()
);

export const tableUnlockToggle = createAction(
    LoadStoreConstants.ACTION_TABLE_UNLOCK_TOGGLE
);

export const tableColumnReset = createAction(
    LoadStoreConstants.ACTION_RESET_COLUMNS
);

export const toggleCardFlipViewMode = createAction(
    LoadStoreConstants.ACTION_TOGGLE_CARD_FLIP_VIEW_MODE
);
//#endregion

//#region List
export const onSelectLoad = createAction(
    LoadStoreConstants.ACTION_ON_ONE_LOAD_SELECT,
    props<{
        id: number;
    }>()
);
//#endregion

//#region Delete actions
export const onDeleteLoadList = createAction(
    LoadStoreConstants.ACTION_ON_DELETE_LOAD_LIST,
    props<{
        count: number;
        isTemplate: boolean;
    }>()
);

export const onDeleteLoadListSuccess = createAction(
    LoadStoreConstants.ACTION_ON_DELETE_LOAD_LIST_SUCCESS
);
//#endregion
