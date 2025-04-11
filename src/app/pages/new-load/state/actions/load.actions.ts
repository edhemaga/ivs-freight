import { createAction, props } from '@ngrx/store';

// Const
import { LoadStoreConstants } from '@pages/new-load/utils/constants/load-store.constants';

// Interface
import { LoadListResponse } from 'appcoretruckassist';

export const getLoadsPayload = createAction(
    LoadStoreConstants.ACTION_DISPATCH_LOAD_LIST
);

export const getLoadsPayloadSuccess = createAction(
    LoadStoreConstants.ACTION_LOAD_LIST_SUCCESS,
    props<{
        payload: LoadListResponse;
    }>()
);
