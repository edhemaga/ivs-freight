// External Libraries
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

// Models
import { MilesByUnitListResponse, MilesService } from 'appcoretruckassist';

// Enums
import { eMileTabs } from '@pages/miles/enums';

// Constants
import { MilesStoreConstants } from '@pages/miles/consts';

@Injectable({
    providedIn: 'root',
})
export class MilesStoreService {
    constructor(
        private store: Store,
        private milesStoreService: MilesService
    ) {}

    public listChange(selectedTab: eMileTabs): void {
        this.store.dispatch({
            type: MilesStoreConstants.MILES_TAB_CHANGE,
            selectedTab,
        });
        const tab = selectedTab === eMileTabs.Active ? 1 : 0;
        this.milesStoreService
            .apiMilesListGet(null, tab)
            .subscribe((response) => this.getList(response));
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
}
