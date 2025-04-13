// ngrx
import { createAction, props } from '@ngrx/store';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eCommonElement } from '@shared/enums';

// Const
import { LoadStoreConstants } from '@pages/new-load/utils/constants/load-store.constants';

// Models
import {
    DispatcherFilterResponse,
    LoadListResponse,
    LoadStatusFilterResponse,
} from 'appcoretruckassist';

// Interface
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';

// Ca components
import { IFilterAction } from 'ca-components';

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
    LoadStoreConstants.ACTION_GO_TO_LOAD_DETIALS,
    props<{
        id: number;
    }>()
);
//#endregion
