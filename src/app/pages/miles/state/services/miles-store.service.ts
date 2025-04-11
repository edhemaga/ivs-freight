import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';

// selectors
import {
    selectMilesItems,
    activeViewModeSelector,
    selectTableViewData,
    selectSelectedTab,
    statesSelector,
    tableColumnsSelector,
    filterSelector,
    detailsSelector,
    unitsPaginationSelector,
    tableSettingsSelector,
    toolbarDropdownMenuOptionsSelector,
    tabResultsSelector,
    cardFlipViewModeSelector,
    milesUnitMapDataSelector,
} from '@pages/miles/state/selectors/miles.selector';

// models
import {
    MilesByUnitListResponse,
    MilesByUnitPaginatedStopsResponse,
    MilesStateFilterResponse,
    MilesStopItemResponsePagination,
} from 'appcoretruckassist';
import { ITableData } from '@shared/models';

// enums
import { eMileTabs } from '@pages/miles/enums';
import { ArrowActionsStringEnum, eActiveViewMode } from '@shared/enums';

// constants
import { MilesStoreConstants } from '@pages/miles/utils/constants';

// helpers
import { FilterHelper } from '@shared/utils/helpers';
import { MilesHelper } from '@pages/miles/utils/helpers';

// interfaces
import {
    ITableColumn,
    ITableConfig,
    ITableResizeAction,
} from '@shared/components/new-table/interface';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { ICaMapProps, IFilterAction } from 'ca-components';
import { IStateFilters } from '@shared/interfaces';
import {
    IMilesDetailsFilters,
    IMilesModel,
    IMilesTabResults,
} from '@pages/miles/interface';

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

    public columns$: Observable<ITableColumn[]> = this.store.pipe(
        select(tableColumnsSelector)
    );

    public filter$: Observable<IStateFilters> = this.store.pipe(
        select(filterSelector)
    );

    public unitsPaginationSelector$: Observable<IMilesDetailsFilters> =
        this.store.pipe(select(unitsPaginationSelector));

    public detailsSelector$: Observable<MilesByUnitPaginatedStopsResponse> =
        this.store.pipe(select(detailsSelector));

    public tableSettingsSelector$: Observable<ITableConfig> = this.store.pipe(
        select(tableSettingsSelector)
    );

    public toolbarDropdownMenuOptionsSelector$: Observable<
        IDropdownMenuItem[]
    > = this.store.pipe(select(toolbarDropdownMenuOptionsSelector));

    public tabResultsSelector$: Observable<IMilesTabResults> = this.store.pipe(
        select(tabResultsSelector)
    );

    public cardFlipViewModeSelector$: Observable<string> = this.store.pipe(
        select(cardFlipViewModeSelector)
    );

    public unitMapDataSelector$: Observable<ICaMapProps> = this.store.pipe(
        select(milesUnitMapDataSelector)
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

    public dispatchToggleColumnsVisiblity(
        columnKey: string,
        isActive: boolean
    ) {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_TOGGLE_COLUMN_VISIBILITY,
            columnKey,
            isActive,
        });
    }

    public dispatchResizeColumn(resizeAction: ITableResizeAction): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_RESIZE_CHANGE,
            resizeAction,
        });
    }

    public dispatchSearchInputChanged(search: string): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SEARCH_CHANGED,
            search,
        });
    }

    public dispatchSelectUnit(unit: IMilesModel): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_UNIT_SELECTED,
            unit,
        });
    }

    public dispatchResetTable(): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_RESET_TABLE,
        });
    }

    public dispatchToggleCardFlipViewMode(): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_TOGGLE_CARD_FLIP_VIEW_MODE,
        });
    }

    public dispatchSetToolbarDropdownMenuColumnsActive(
        isActive: boolean
    ): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SET_TOOLBAR_DROPDOWN_MENU_COLUMNS_ACTIVE,
            isActive,
        });
    }
    public getNewPage(): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_GET_NEW_PAGE_RESULTS,
        });
    }

    public dispatchUnitMapData(
        unitMapLocations: MilesStopItemResponsePagination
    ): void {
        if (!unitMapLocations) return;

        this.store.dispatch({
            type: MilesStoreConstants.ACTION_GET_UNIT_MAP_DATA,
            unitMapLocations,
        });
    }

    public dispatchGetMapStopData(stopId: number): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_GET_MAP_STOP_DATA,
            stopId,
        });
    }
}
