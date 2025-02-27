import { createReducer, on } from '@ngrx/store';
import * as MilesAction from '../actions/miles.actions';
import {
    loadMilesSuccess,
    milesTabChange,
    updateTruckCounts,
} from '../actions/miles.actions';
import { MilesByUnitResponse } from 'appcoretruckassist';
import { eMileTabs } from '@pages/miles/enums';
import { eActiveViewMode } from '@pages/load/pages/load-table/enums';

export interface MilesState {
    items: MilesByUnitResponse[];
    loading: boolean;
    error: any;
    tableViewData: any[];
    selectedTab: eMileTabs;
    activeViewMode: eActiveViewMode, 
}

export const initialState: MilesState = {
    items: [],
    loading: false,
    error: null,
    tableViewData: [
        {
            title: eMileTabs.Active,
            value: eMileTabs.Active,
            length: 0,
        },
        {
            title: eMileTabs.Inactive,
            value: eMileTabs.Inactive,
            length: 0,
        },
    ],
    selectedTab: eMileTabs.Active,
    activeViewMode: eActiveViewMode.List
};

export const milesReducer = createReducer(
    initialState,
    on(MilesAction.getLoadsPayload, (state) => ({
        ...state,
        loading: true,
    })),
    on(MilesAction.getLoadsPayloadSuccess, (state, { params }) => ({
        ...state,
        items: params,
        loading: false,
    })),
    on(MilesAction.getLoadsPayloadError, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(loadMilesSuccess, (state, { miles }) => ({
        ...state,
        items: miles,
    })),
    on(milesTabChange, (state, { selectedTab }) => ({
        ...state,
        selectedTab: selectedTab,
    })),
    on(
        updateTruckCounts,
        (state, { activeTruckCount, inactiveTruckCount }) => ({
            ...state,
            tableViewData: [
                { ...state.tableViewData[0], length: activeTruckCount },
                { ...state.tableViewData[1], length: inactiveTruckCount },
            ],
        })
    )
);
