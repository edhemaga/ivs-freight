import { createAction, props } from '@ngrx/store';

// constants
import { MilesStoreConstants } from '@pages/miles/utils/constants';

// enums
import { eMileTabs } from '@pages/miles/enums';
import { eActiveViewMode } from '@shared/enums';

// models
import {
    MilesByUnitMinimalListResponse,
    MilesByUnitPaginatedStopsResponse,
    MilesStateFilterResponse,
    MilesStopDetailsResponse,
    MilesStopItemResponse,
    RoutingResponse,
} from 'appcoretruckassist';
import { IMilesModel } from '@pages/miles/interface';

// interfaces
import { IStateFilters } from '@shared/interfaces';
import {
    ITableColumn,
    ITableReorderAction,
    ITableResizeAction,
} from '@shared/components/new-table/interface';

export const getLoadsPayloadSuccess = createAction(
    MilesStoreConstants.LOAD_MILES_SUCCESS,
    props<{ miles: IMilesModel[]; totalResultsCount: number }>()
);

export const getLoadsPayloadError = createAction(
    MilesStoreConstants.LOAD_MILES_FAILURE
);

export const loadMilesSuccess = createAction(
    MilesStoreConstants.LOAD_MILES_SUCCESS,
    props<{ miles: IMilesModel[]; totalResultsCount: number }>()
);

export const updateMilesList = createAction(
    MilesStoreConstants.UPDATE_MILES_LIST,
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

export const getInitalUnitDetailsOnRouteChange = createAction(
    MilesStoreConstants.ACTION_GET_MILES_DETAILS_NEW_PAGE_ON_NEW_PAGE,
    props<{ unitId: number }>()
);

export const setUnitDetails = createAction(
    MilesStoreConstants.ACTION_GET_MILES_DETAILS_SET_PAGE,
    props<{ details: MilesByUnitPaginatedStopsResponse }>()
);

export const updateUnitDetails = createAction(
    MilesStoreConstants.ACTION_UPDATE_UNIT_DETAILS_ON_SCROLL,
    props<{ details: MilesByUnitPaginatedStopsResponse }>()
);

export const getUnitMapData = createAction(
    MilesStoreConstants.ACTION_GET_UNIT_MAP_DATA,
    props<{ unitMapLocations: MilesStopItemResponse[] }>()
);

export const getUnitMapDataSuccess = createAction(
    MilesStoreConstants.ACTION_GET_UNIT_MAP_DATA_SUCCESS,
    props<{ unitMapRoutes: RoutingResponse }>()
);

export const setUnitMapData = createAction(
    MilesStoreConstants.ACTION_SET_UNIT_MAP_DATA
);

export const getMapStopData = createAction(
    MilesStoreConstants.ACTION_GET_MAP_STOP_DATA,
    props<{ stopId: number }>()
);

export const getMapStopDataSuccess = createAction(
    MilesStoreConstants.ACTION_GET_MAP_STOP_DATA_SUCCESS,
    props<{ unitStopData: MilesStopDetailsResponse }>()
);

export const toggleTableLockingStatus = createAction(
    MilesStoreConstants.ACTION_TOGGLE_TABLE_LOCK_STATUS,
    props<{ isLocked?: boolean }>()
);

export const pinTableColumn = createAction(
    MilesStoreConstants.ACTION_TOGGLE_PIN_TABLE_COLUMN,
    props<{ column: ITableColumn }>()
);

export const tableSortingChange = createAction(
    MilesStoreConstants.ACTION_SORTING_CHANGE,
    props<{ column: ITableColumn }>()
);

export const tableResizeChange = createAction(
    MilesStoreConstants.ACTION_RESIZE_CHANGE,
    props<{ resizeAction: ITableResizeAction }>()
);

export const tableReorderChange = createAction(
    MilesStoreConstants.ACTION_REORDER_CHANGE,
    props<{ reorderAction: ITableReorderAction }>()
);

export const pageChanges = createAction(
    MilesStoreConstants.ACTION_GET_NEW_PAGE_RESULTS
);

export const toggleColumnVisibility = createAction(
    MilesStoreConstants.ACTION_TOGGLE_COLUMN_VISIBILITY,
    props<{ columnKey: string; isActive: boolean }>()
);

export const onSearchChange = createAction(
    MilesStoreConstants.ACTION_SEARCH_CHANGED,
    props<{ search: string }>()
);

export const resetTable = createAction(MilesStoreConstants.ACTION_RESET_TABLE);

export const toggleCardFlipViewMode = createAction(
    MilesStoreConstants.ACTION_TOGGLE_CARD_FLIP_VIEW_MODE
);

export const setToolbarDropdownMenuColumnsActive = createAction(
    MilesStoreConstants.ACTION_SET_TOOLBAR_DROPDOWN_MENU_COLUMNS_ACTIVE,
    props<{ isActive: boolean }>()
);

// Minimal list
export const setInitalMinimalList = createAction(
    MilesStoreConstants.ACTION_SET_INITAL_MINIMAL_LIST,
    props<{ list: MilesByUnitMinimalListResponse; text: string }>()
);

export const searchMinimalUnitList = createAction(
    MilesStoreConstants.ACTION_SEARCH_MINIMAL_UNIT_LIST,
    props<{ text: string }>()
);

export const appendToMinimalList = createAction(
    MilesStoreConstants.ACTION_APPEND_TO_MINIMAL_LIST,
    props<{ list: MilesByUnitMinimalListResponse }>()
);

export const fetchMinimalList = createAction(
    MilesStoreConstants.ACTION_FETCH_NEXT_MINIMAL_UNIT_LIST
);

export const getMinimalListError = createAction(
    MilesStoreConstants.ACTION_MINIMAL_LIST_ERROR
);

export const fetchNextStopsPage = createAction(
    MilesStoreConstants.ACTION_FETCH_NEXT_STOPS_PAGE
);
