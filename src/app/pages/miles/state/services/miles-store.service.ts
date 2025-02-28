// External Libraries
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

// Models
import { MilesByUnitListResponse } from 'appcoretruckassist';
import { IFilterAction } from 'ca-components';

// Enums
import { eMileTabs } from '@pages/miles/enums';
import { eActiveViewMode } from '@pages/load/pages/load-table/enums';

// Constants
import { MilesStoreConstants } from '@pages/miles/consts';
import { FilterHelper } from '@shared/utils/helpers';

@Injectable({
    providedIn: 'root',
})
export class MilesStoreService {
    constructor(
        private store: Store
    ) {}

    public listChange(selectedTab: eMileTabs): void {
        this.store.dispatch({
            type: MilesStoreConstants.MILES_TAB_CHANGE,
            selectedTab,
        });
    }

    public getList(data: MilesByUnitListResponse): void {
        const { activeTruckCount, inactiveTruckCount } = data;
        this.store.dispatch({
            type: MilesStoreConstants.UPDATE_TRUCK_COUNTS,
            activeTruckCount,
            inactiveTruckCount,
        });

        this.store.dispatch({
            type: MilesStoreConstants.LOAD_MILES_SUCCESS,
            miles: data.pagination.data,
        });
    }

    public dispatchSetActiveViewMode(activeViewMode: eActiveViewMode): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SET_ACTIVE_VIEW_MODE,
            activeViewMode,
        });
    }

    public dispatchFilters(filters: IFilterAction, oldFilter: {}, selectedTab: eMileTabs): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SET_FILTERS,
            filters: FilterHelper.mapFilters(filters, oldFilter),
            selectedTab
        });
    }
}
