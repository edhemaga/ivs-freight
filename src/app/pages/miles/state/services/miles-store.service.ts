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
    selectedCountSelector,
    tableColumnsSelector,
    filterSelector,
    hasAllItemsSelectedSelector,
    detailsSelector,
    unitsPaginationSelector,
    tableSettingsSelector,
    unSelectedCountSelector,
} from '@pages/miles/state/selectors/miles.selector';

// Models
import { IMilesDetailsFilters, IMilesModel } from '@pages/miles/interface';
import {
    MilesByUnitListResponse,
    MilesByUnitPaginatedStopsResponse,
    MilesStateFilterResponse,
} from 'appcoretruckassist';
import { IFilterAction } from 'ca-components';
import { ITableData } from '@shared/models';
import { IStateFilters } from '@shared/interfaces';

// Enums
import { eMileTabs } from '@pages/miles/enums';
import { ArrowActionsStringEnum, eActiveViewMode } from '@shared/enums';

// Constants
import { MilesStoreConstants } from '@pages/miles/utils/constants';

// Helpers
import { FilterHelper } from '@shared/utils/helpers';
import { MilesHelper } from '@pages/miles/utils/helpers';

// interface
import {
    ITableColumn,
    ITableConfig,
} from '@shared/components/new-table/interface';

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

    public selectedCountSelector$: Observable<number> = this.store.pipe(
        select(selectedCountSelector)
    );
    public columns$: Observable<ITableColumn[]> = this.store.pipe(
        select(tableColumnsSelector)
    );

    public filter$: Observable<IStateFilters> = this.store.pipe(
        select(filterSelector)
    );

    public hasAllItemsSelectedSelector$: Observable<boolean> = this.store.pipe(
        select(hasAllItemsSelectedSelector)
    );

    public unitsPaginationSelector$: Observable<IMilesDetailsFilters> =
        this.store.pipe(select(unitsPaginationSelector));

    public detailsSelector$: Observable<MilesByUnitPaginatedStopsResponse> =
        this.store.pipe(select(detailsSelector));

    public tableSettingsSelector$: Observable<ITableConfig> = this.store.pipe(
        select(tableSettingsSelector)
    );
    public unSelectedCountSelector$: Observable<number> = this.store.pipe(
        select(unSelectedCountSelector)
    );

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
            totalResultsCount: data.pagination.count,
        });
    }

    public dispatchSetActiveViewMode(activeViewMode: eActiveViewMode): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SET_ACTIVE_VIEW_MODE,
            activeViewMode,
        });

        if (activeViewMode === eActiveViewMode.Map) {
            this.store.dispatch({
                type: MilesStoreConstants.ACTION_GET_MILES_DETAILS_NEW_PAGE,
            });
        }
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

    public dispatchFollowingUnit(
        getFollowingUnitDirection: ArrowActionsStringEnum
    ): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_GET_FOLLOWING_UNIT,
            getFollowingUnitDirection,
        });
    }

    public toggleTableLockingStatus(): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_TOGGLE_TABLE_LOCK_STATUS,
        });
    }

    public dispatchColumnPinnedAction(column: ITableColumn): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_TOGGLE_PIN_TABLE_COLUMN,
            column,
        });
    }

    public dispatchSortingChange(column: ITableColumn): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SORTING_CHANGE,
            column,
        });
    }

    public dispatchSearchInputChanged(search: string): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SEARCH_CHANGED,
            search,
        });
    }
}
