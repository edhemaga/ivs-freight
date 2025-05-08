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
    LoadPossibleStatusesResponse,
    LoadResponse,
    LoadStatusFilterResponse,
    LoadStatusResponse,
    RoutingResponse,
    UpdateLoadStatusCommand,
} from 'appcoretruckassist';

// Interfaces
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';
import {
    ITableColumn,
    ITableReorderAction,
    ITableResizeAction,
} from '@shared/components/new-table/interfaces';

// Ca components
import { IFilterAction, IComment } from 'ca-components';

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

export const getLoadsPagePayloadSuccess = createAction(
    LoadStoreConstants.ACTION_LOAD_PAGE_LIST_SUCCESS,
    props<{
        payload: LoadListResponse;
    }>()
);

export const getLoadsOnPageChange = createAction(
    LoadStoreConstants.ACTION_GET_NEW_PAGE_RESULTS
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

export const onMapVisibilityToggle = createAction(
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

export const tableSortingChange = createAction(
    LoadStoreConstants.ACTION_SORTING_CHANGE,
    props<{ column: ITableColumn }>()
);

export const pinTableColumn = createAction(
    LoadStoreConstants.ACTION_TOGGLE_PIN_TABLE_COLUMN,
    props<{ column: ITableColumn }>()
);

export const tableResizeChange = createAction(
    LoadStoreConstants.ACTION_RESIZE_CHANGE,
    props<{ resizeAction: ITableResizeAction }>()
);

export const tableReorderChange = createAction(
    LoadStoreConstants.ACTION_REORDER_CHANGE,
    props<{ reorderAction: ITableReorderAction }>()
);
//#endregion

// #region updateLoadStatus
export const updateLoadStatus = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS,
    props<{ status: LoadStatusResponse }>()
);

export const updateLoadStatusRegular = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS_REGULAR,
    props<{
        status: LoadStatusResponse;
        updateLoadStatusCommand?: UpdateLoadStatusCommand;
    }>()
);

export const updateLoadStatusSuccess = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS_SUCCESS,
    props<{ status: LoadStatusResponse; load: LoadResponse }>()
);

export const updateLoadStatusError = createAction(
    LoadStoreConstants.ACTION_UPDATE_LOAD_STATUS_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region revertLoadStatus
export const revertLoadStatus = createAction(
    LoadStoreConstants.ACTION_REVERT_LOAD_STATUS,
    props<{ status: LoadStatusResponse }>()
);

export const revertLoadStatusSuccess = createAction(
    LoadStoreConstants.ACTION_REVERT_LOAD_STATUS_SUCCESS,
    props<{ status: LoadStatusResponse; load: LoadResponse }>()
);

export const revertLoadStatusError = createAction(
    LoadStoreConstants.ACTION_REVERT_LOAD_STATUS_ERROR,
    props<{ error: Error }>()
);
// #endregion

// #region openChangeStatusDropdown
export const openChangeStatusDropdown = createAction(
    LoadStoreConstants.ACTION_OPEN_CHANGE_STATUS_DROPDOWN,
    props<{ loadId: number }>()
);

export const openChangeStatusDropdownSuccess = createAction(
    LoadStoreConstants.ACTION_OPEN_CHANGE_STATUS_DROPDOWN_SUCCESS,
    props<{ possibleStatuses: LoadPossibleStatusesResponse; loadId: number }>()
);

export const openChangeStatusDropdownError = createAction(
    LoadStoreConstants.ACTION_OPEN_CHANGE_STATUS_DROPDOWN_ERROR,
    props<{ error: Error }>()
);
// #endregion
//#region List
export const onSelectLoad = createAction(
    LoadStoreConstants.ACTION_ON_ONE_LOAD_SELECT,
    props<{
        id: number;
    }>()
);

export const onSelectAllLoads = createAction(
    LoadStoreConstants.ACTION_ON_SELECT_LOAD_ALL,
    props<{ action: string }>()
);

//#endregion

//#region Delete actions
export const onDeleteLoadList = createAction(
    LoadStoreConstants.ACTION_ON_DELETE_LOAD_LIST,
    props<{
        count: number;
        isTemplate: boolean;
        selectedIds: number[];
    }>()
);

export const onDeleteLoadListSuccess = createAction(
    LoadStoreConstants.ACTION_ON_DELETE_LOAD_LIST_SUCCESS,
    props<{
        selectedIds: number[];
    }>()
);

export const onDeleteLoad = createAction(
    LoadStoreConstants.ACTION_ON_DELETE_LOAD,
    props<{
        id: number;
        isTemplate: boolean;
        isDetailsPage: boolean;
    }>()
);

export const onDeleteLoadSuccess = createAction(
    LoadStoreConstants.ACTION_ON_DELETE_LOAD_SUCCESS
);
//#endregion

//#region Comments
export const onAddLoadComment = createAction(
    LoadStoreConstants.ACTION_ON_COMMENT_ADD,
    props<{ comment: IComment; loadId: number }>()
);

export const onAddLoadCommentSuccess = createAction(
    LoadStoreConstants.ACTION_ON_COMMENT_ADD_SUCCESS,
    props<{ comment: IComment; loadId: number }>()
);

export const onAddLoadCommentError = createAction(
    LoadStoreConstants.ACTION_ON_COMMENT_ADD_ERROR
);

export const onDeleteLoadComment = createAction(
    LoadStoreConstants.ACTION_ON_COMMENT_DELETE,
    props<{ id: number; loadId: number }>()
);
export const onDeleteLoadCommentSuccess = createAction(
    LoadStoreConstants.ACTION_ON_COMMENT_DELETE_SUCCESS,
    props<{ id: number; loadId: number }>()
);
export const onDeleteLoadCommentError = createAction(
    LoadStoreConstants.ACTION_ON_COMMENT_DELETE_ERROR
);

export const onEditLoadComment = createAction(
    LoadStoreConstants.ACTION_ON_COMMENT_EDIT,
    props<{
        comment: IComment;
        loadId: number;
    }>()
);
export const onEditLoadCommentSuccess = createAction(
    LoadStoreConstants.ACTION_ON_COMMENT_EDIT_SUCCESS,
    props<{
        comment: IComment;
        loadId: number;
    }>()
);
export const onEditLoadCommentError = createAction(
    LoadStoreConstants.ACTION_ON_COMMENT_EDIT_ERROR
);
//#endregion
