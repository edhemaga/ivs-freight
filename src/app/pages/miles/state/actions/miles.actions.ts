// External Libraries
import { createAction, props } from '@ngrx/store';

// Constants 
import { MilesStoreConstants } from '@pages/miles/consts';

// Enums
import { eMileTabs } from '@pages/miles/enums';

// Models
import { MilesByUnitResponse } from 'appcoretruckassist';

export const getLoadsPayload = createAction(
  MilesStoreConstants.LOAD_MILES_INITAL,
);

export const getLoadsPayloadSuccess = createAction(
  MilesStoreConstants.LOAD_MILES_SUCCESS,
  props<{ params: any }>() 
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