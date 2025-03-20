// External Libraries
import { createAction, props } from '@ngrx/store';

// Constants
import { MilesStoreConstants } from '@pages/miles/utils/constants';

// Enums
import { eMileTabs } from '@pages/miles/enums';
import { ArrowActionsStringEnum, eActiveViewMode } from '@shared/enums';

// Models
import {
    MilesByUnitPaginatedStopsResponse,
    MilesStateFilterResponse,
} from 'appcoretruckassist';
import { IMilesDetailsFilters, IMilesModel } from '@pages/miles/interface';

// Interface
import { IStateFilters } from '@shared/interfaces';

export const getLoadsPayload = createAction(
    MilesStoreConstants.LOAD_MILES_INITAL,
    props<{ filter: IStateFilters }>()
);

export const getLoadsPayloadSuccess = createAction(
    MilesStoreConstants.LOAD_MILES_SUCCESS,
    props<{ miles: IMilesModel[] }>()
);

export const getLoadsPayloadError = createAction(
    MilesStoreConstants.LOAD_MILES_FAILURE
);

export const loadMilesSuccess = createAction(
    MilesStoreConstants.LOAD_MILES_SUCCESS,
    props<{ miles: IMilesModel[] }>()
);

export const milesTabChange = createAction(
    MilesStoreConstants.MILES_TAB_CHANGE,
    props<{ selectedTab: eMileTabs }>()
);

export const updateTruckCounts = createAction(
    MilesStoreConstants.UPDATE_TRUCK_COUNTS,
    props<{ activeTruckCount: number; inactiveTruckCount: number }>()
);

export const activeViewMode = createAction(
    MilesStoreConstants.ACTION_SET_ACTIVE_VIEW_MODE,
    props<{ activeViewMode: eActiveViewMode }>()
);

export const changeFilters = createAction(
    MilesStoreConstants.ACTION_SET_FILTERS,
    props<{ filters: IStateFilters }>()
);

export const setStates = createAction(
    MilesStoreConstants.SET_STATES,
    props<{ states: MilesStateFilterResponse[] }>()
);

export const selectOneRow = createAction(
    MilesStoreConstants.ACTION_SELECT_ONE_ROW,
    props<{ mile: IMilesModel }>()
);

export const selectAll = createAction(
    MilesStoreConstants.ACTION_SELECT_ALL_ROWS
);

export const getTotalMilesDetails = createAction(
    MilesStoreConstants.ACTION_GET_TOTAL_MILES_DETAILS,
    props<{ milesDetails: MilesByUnitPaginatedStopsResponse }>()
);

export const getMilesDetails = createAction(
    MilesStoreConstants.ACTION_GET_MILES_DETAILS,
    props<{ milesDetailsFilters: IMilesDetailsFilters }>()
);

export const getMilesDetailsError = createAction(
    MilesStoreConstants.ACTION_GET_MILES_DETAILS_ERROR
);

export const getMilesDetailsNewPage = createAction(
    MilesStoreConstants.ACTION_GET_MILES_DETAILS_NEW_PAGE
);

export const getMilesDetailsNextPage = createAction(
    MilesStoreConstants.ACTION_GET_NEXT_UNIT,
    props<{ truckId: number; direction: ArrowActionsStringEnum }>()
);

export const setNewTotalMilesDetails = createAction(
    MilesStoreConstants.ACTION_SET_TOTAL_MILES_DETAILS,
    props<{
        milesDetails: MilesByUnitPaginatedStopsResponse;
        isFirst: boolean;
        isLast: boolean;
    }>()
);

export const setNewTotalMilesDetailsError = createAction(
    MilesStoreConstants.ACTION_SET_TOTAL_MILES_DETAILS_ERROR,
    props<{
        truckId: number;
    }>()
);
