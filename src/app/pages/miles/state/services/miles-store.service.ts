import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

// Selectors
import {
    selectMilesItems,
    activeViewModeSelector,
    selectTableViewData,
    selectSelectedTab,
    statesSelector,
    selectedRowsSelector,
    tableColumnsSelector,
    filterSelector,
    areAllItemsSelectedSelector
} from '@pages/miles/state/selectors/miles.selector';

// Models
import { IMilesModel } from '@pages/miles/interface';
import {
    MilesByUnitListResponse,
    MilesStateFilterResponse,
} from 'appcoretruckassist';
import { IFilterAction } from 'ca-components';
import { ITableColumn, ITableData } from '@shared/models';
import { IStateFilters } from '@shared/interfaces';
// Enums
import { eMileTabs } from '@pages/miles/enums';
import { eActiveViewMode } from '@shared/enums';

// Constants
import { MilesStoreConstants } from '@pages/miles/utils/constants';

// Helpers
import { FilterHelper } from '@shared/utils/helpers';
import { MilesMapper } from '@pages/miles/utils';

@Injectable({
    providedIn: 'root',
})
export class MilesStoreService {
    constructor(private store: Store) {}

    public miles$: Observable<IMilesModel[]> = this.store.pipe(
        select(selectMilesItems)
    );
    public activeViewMode$: Observable<string> = this.store.pipe(
        select(activeViewModeSelector)
    );
    public tableViewData$: Observable<ITableData[]> = this.store.pipe(
        select(selectTableViewData)
    );
    public selectedTab$: Observable<eMileTabs> = this.store.pipe(
        select(selectSelectedTab)
    );
    public statesSelector$: Observable<MilesStateFilterResponse[]> =
        this.store.pipe(select(statesSelector));

    public selectedRowsSelector$: Observable<number> = this.store.pipe(
        select(selectedRowsSelector)
    );
    public columns$: Observable<ITableColumn[]> = this.store.pipe(
        select(tableColumnsSelector)
    );

    public filter$: Observable<IStateFilters> = this.store.pipe(
        select(filterSelector)
    );

    public areAllItemsSelectedSelector$: Observable<boolean> = this.store.pipe(select(areAllItemsSelectedSelector))

    public dispatchStates(states: MilesStateFilterResponse[]) {
        this.store.dispatch({
            type: MilesStoreConstants.SET_STATES,
            states,
        });
    }

    public dispatchListChange(selectedTab: eMileTabs): void {
        this.store.dispatch({
            type: MilesStoreConstants.MILES_TAB_CHANGE,
            selectedTab,
        });
    }

    public dispatchInitalList(data: MilesByUnitListResponse): void {
        const { activeTruckCount, inactiveTruckCount } = data;
        this.store.dispatch({
            type: MilesStoreConstants.UPDATE_TRUCK_COUNTS,
            activeTruckCount,
            inactiveTruckCount,
        });

        this.store.dispatch({
            type: MilesStoreConstants.LOAD_MILES_SUCCESS,
            miles: MilesMapper(data.pagination.data),
        });
    }

    public dispatchSetActiveViewMode(activeViewMode: eActiveViewMode): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SET_ACTIVE_VIEW_MODE,
            activeViewMode,
        });
    }

    public dispatchFilters(
        filters: IFilterAction,
        currentFilter: IStateFilters
    ): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SET_FILTERS,
            filters: FilterHelper.mapFilters(filters, currentFilter),
        });
    }

    public dispatchSelectOneRow(mile: IMilesModel): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SELECT_ONE_ROW,
            mile,
        });
    }

    public dispatchSelectAll(): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SELECT_ALL_ROWS,
        });
    }
}
