import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadMilesSuccess, milesTabChange, updateTruckCounts } from '../actions/miles.actions';
import { MilesByUnitListResponse, MilesService } from 'appcoretruckassist';
import { eMileTabs } from '@pages/miles/enums';

@Injectable({
    providedIn: 'root',
})
export class MilesStoreService {
    constructor(
        private store: Store,
        private milesStoreService: MilesService
    ) {}

    public listChange(selectedTab: eMileTabs): void { 
        this.store.dispatch(milesTabChange({ selectedTab }));
        const tab = selectedTab === eMileTabs.Active ? 1 : 0;
        this.milesStoreService
            .apiMilesListGet(null, tab)
            .subscribe((response) => this.getList(response));
    }

    public getList(data: MilesByUnitListResponse): void {
        const { activeTruckCount, inactiveTruckCount } = data;
        this.store.dispatch(updateTruckCounts({ activeTruckCount, inactiveTruckCount }));

        this.store.dispatch(loadMilesSuccess({ miles: data.pagination.data }));
    }
}
