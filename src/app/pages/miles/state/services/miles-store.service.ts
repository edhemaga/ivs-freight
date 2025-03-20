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
    areAllItemsSelectedSelector,
    milesDetailsSelector,
    isMilesDetailsLoadingSelector,
    stopsSelectors,
    isUserOnLastPageSelector,
    truckIdSelector,
} from '@pages/miles/state/selectors/miles.selector';

// Models
import { IMilesModel } from '@pages/miles/interface';
import {
    MilesByUnitListResponse,
    MilesByUnitPaginatedStopsResponse,
    MilesStateFilterResponse,
    MilesStopItemResponse,
} from 'appcoretruckassist';
import { IFilterAction } from 'ca-components';
import { ITableColumn, ITableData } from '@shared/models';
import { IStateFilters } from '@shared/interfaces';
// Enums
import { eMileTabs } from '@pages/miles/enums';
import { ArrowActionsStringEnum, eActiveViewMode } from '@shared/enums';

// Constants
import { MilesStoreConstants } from '@pages/miles/utils/constants';

// Helpers
import { FilterHelper } from '@shared/utils/helpers';
import { MilesHelper } from '@pages/miles/utils/helpers';

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

    public areAllItemsSelectedSelector$: Observable<boolean> = this.store.pipe(
        select(areAllItemsSelectedSelector)
    );

    public milesDetailsSelector$: Observable<MilesByUnitPaginatedStopsResponse> =
        this.store.pipe(select(milesDetailsSelector));

    public isMilesDetailsLoadingSelector$: Observable<boolean> =
        this.store.pipe(select(isMilesDetailsLoadingSelector));

    public isUserOnLastPageSelector$: Observable<boolean> = this.store.pipe(
        select(isUserOnLastPageSelector)
    );

    public truckIdSelector$: Observable<number> = this.store.pipe(
        select(truckIdSelector)
    );

    public stopsSelectors$: Observable<MilesStopItemResponse[]> =
        this.store.pipe(select(stopsSelectors));

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
            miles: MilesHelper.milesMapper(data.pagination.data),
        });
    }

    public dispatchSetActiveViewMode(activeViewMode: eActiveViewMode): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SET_ACTIVE_VIEW_MODE,
            activeViewMode,
        });

        if (activeViewMode === eActiveViewMode.Map) {
            this.store.dispatch({
                type: MilesStoreConstants.ACTION_GET_MILES_DETAILS,
            });
        }
    }

    public dispatchGetNewList(): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_GET_MILES_DETAILS_NEW_PAGE,
        });

        this.store.dispatch({
            type: MilesStoreConstants.ACTION_GET_MILES_DETAILS,
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

    public dispatchGetNextTruckUnit(
        truckId: number,
        direction: ArrowActionsStringEnum
    ): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_GET_NEXT_UNIT,
            truckId,
            direction,
        });
    }
}
