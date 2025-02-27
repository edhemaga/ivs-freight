import { createAction, props } from '@ngrx/store';
import { MilesStoreConstants } from '@pages/miles/consts';
import { eMileTabs } from '@pages/miles/enums';
import {  MilesByUnitResponse, MilesByUnitResponsePagination } from 'appcoretruckassist';

export const getLoadsPayload = createAction(
  '[Miles] Get Miles List'
);

export const getLoadsPayloadSuccess = createAction(
  '[Miles] Get Miles List Success',
  props<{ params: any }>() 
);

export const getLoadsPayloadError = createAction(
  '[Miles] Get Miles List Error',
  props<{ error: any }>()
);

export const loadMilesSuccess = createAction(
  '[Miles] Load Miles Success',
  props<{ miles: MilesByUnitResponse[] }>() 
);


export const milesTabChange = createAction(
  MilesStoreConstants.MILES_TAB_CHANGE,
  props<{ selectedTab: eMileTabs }>() // Passing the selectedTab as a payload
);

export const updateTruckCounts = createAction(
  '[Miles] Update Truck Counts', 
  props<{ activeTruckCount: number, inactiveTruckCount: number }>()
);