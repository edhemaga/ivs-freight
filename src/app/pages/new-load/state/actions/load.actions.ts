import { createAction, props } from '@ngrx/store';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eCommonElement } from '@shared/enums';

// Const
import { LoadStoreConstants } from '@pages/new-load/utils/constants/load-store.constants';

// Interface
import {
    DispatcherFilterResponse,
    LoadListResponse,
    LoadStatusFilterResponse,
} from 'appcoretruckassist';

export const getLoadsPayload = createAction(
    LoadStoreConstants.ACTION_DISPATCH_LOAD_LIST
);

export const getLoadsPayloadSuccess = createAction(
    LoadStoreConstants.ACTION_LOAD_LIST_SUCCESS,
    props<{
        payload: LoadListResponse;
        dispatcherFilters: DispatcherFilterResponse[];
        statusFilters: LoadStatusFilterResponse[];
    }>()
);

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
