// External Libraries
import { createAction, props } from '@ngrx/store';

// Constants 
import { MilesStoreConstants } from '@pages/miles/consts';

// Enums
import { eMileTabs } from '@pages/miles/enums';
import { eActiveViewMode } from '@pages/load/pages/load-table/enums';

// Models
import { MilesByUnitResponse, MilesStateFilterResponse } from 'appcoretruckassist';
import { IStateFilters } from '@shared/models'; 

export const getLoadsPayload = createAction(
  MilesStoreConstants.LOAD_MILES_INITAL,
  props<{ filter: IStateFilters }>() 
);

export const getLoadsPayloadSuccess = createAction(
  MilesStoreConstants.LOAD_MILES_SUCCESS,
  props<{ miles: MilesByUnitResponse[] }>() 
);

export const getLoadsPayloadError = createAction(
  MilesStoreConstants.LOAD_MILES_FAILURE,
  props<{ error: any }>()
);

export const loadMilesSuccess = createAction(
  MilesStoreConstants.LOAD_MILES_SUCCESS,
  props<{ miles: MilesByUnitResponse[] }>() 
);

export const milesTabChange = createAction(
  MilesStoreConstants.MILES_TAB_CHANGE,
  props<{ selectedTab: eMileTabs }>() 
);

export const updateTruckCounts = createAction(
  MilesStoreConstants.UPDATE_TRUCK_COUNTS, 
  props<{ activeTruckCount: number, inactiveTruckCount: number }>()
);

export const activeViewMode = createAction(
  MilesStoreConstants.ACTION_SET_ACTIVE_VIEW_MODE,
    props<{ activeViewMode: eActiveViewMode }>()
);

export const filters = createAction(
  MilesStoreConstants.ACTION_SET_FILTERS,
    props<{ filters: IStateFilters }>()
);


export const setStates = createAction(
  MilesStoreConstants.SET_STATES,
    props<{ states: MilesStateFilterResponse[] }>()
);