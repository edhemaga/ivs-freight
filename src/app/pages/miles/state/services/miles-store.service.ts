import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';

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
    tableSettingsSelector,
    toolbarDropdownMenuOptionsSelector,
    tabResultsSelector,
    cardFlipViewModeSelector,
    minimalListSelector,
    currentPageSelector,
    searchTextSelector,
    totalMinimalListCountSelector,
    stopsSelector,
    minimalListFiltersSelector,
    detailsLoadingSelector,
    milesUnitMapDataSelector,
    frontSideDataSelector,
    backSideDataSelector,
    getSortableColumn,
    isFilterEmptySelector,
} from '@pages/miles/state/selectors/miles.selector';

// models
import {
    MilesByUnitListResponse,
    MilesByUnitMinimalResponse,
    MilesByUnitPaginatedStopsResponse,
    MilesStateFilterResponse,
    MilesStopItemResponse,
} from 'appcoretruckassist';
import { ITableData } from '@shared/models';

// enums
import { eMileTabs, eMilesRouting } from '@pages/miles/enums';
import { eActiveViewMode } from '@shared/enums';

// constants
import { MilesStoreConstants } from '@pages/miles/utils/constants';

// helpers
import { FilterHelper } from '@shared/utils/helpers';
import { MilesHelper } from '@pages/miles/utils/helpers';

// interfaces
import {
    ITableColumn,
    ITableConfig,
    ITableReorderAction,
    ITableResizeAction,
} from '@shared/components/new-table/interfaces';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { ICaMapProps, IFilterAction } from 'ca-components';
import {
    ICardValueData,
    IMinimalListFilters,
    IStateFilters,
} from '@shared/interfaces';
import { IMilesModel, IMilesTabResults } from '@pages/miles/interface';

@Injectable({
    providedIn: 'root',
})
export class MilesStoreService {
    constructor(
        private store: Store,
        private router: Router
    ) {}

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

    public isFilterEmpty$: Observable<boolean> = this.store.pipe(
        select(isFilterEmptySelector)
    );

    public detailsSelector$: Observable<MilesByUnitPaginatedStopsResponse> =
        this.store.pipe(select(detailsSelector));

    public stopsSelector$: Observable<MilesStopItemResponse[]> =
        this.store.pipe(select(stopsSelector));

    public tableSettingsSelector$: Observable<ITableConfig> = this.store.pipe(
        select(tableSettingsSelector)
    );

    public toolbarDropdownMenuOptionsSelector$: Observable<
        IDropdownMenuItem[]
    > = this.store.pipe(select(toolbarDropdownMenuOptionsSelector));

    public tabResultsSelector$: Observable<IMilesTabResults> = this.store.pipe(
        select(tabResultsSelector)
    );

    public currentPageSelector$: Observable<number> = this.store.pipe(
        select(currentPageSelector)
    );

    public totalMinimalListCountSelector$: Observable<number> = this.store.pipe(
        select(totalMinimalListCountSelector)
    );
    public searchTextSelector$: Observable<string> = this.store.pipe(
        select(searchTextSelector)
    );

    public cardFlipViewModeSelector$: Observable<string> = this.store.pipe(
        select(cardFlipViewModeSelector)
    );

    public minimalListFiltersSelector$: Observable<IMinimalListFilters> =
        this.store.pipe(select(minimalListFiltersSelector));

    public minimalListSelector$: Observable<MilesByUnitMinimalResponse[]> =
        this.store.pipe(select(minimalListSelector));

    public detailsLoadingSelector$: Observable<boolean> = this.store.pipe(
        select(detailsLoadingSelector)
    );

    public unitMapDataSelector$: Observable<ICaMapProps> = this.store.pipe(
        select(milesUnitMapDataSelector)
    );

    public getSortableColumnSelector$: Observable<ITableColumn[]> =
        this.store.pipe(select(getSortableColumn));

    public frontSideDataSelector$: Observable<ICardValueData[]> =
        this.store.pipe(select(frontSideDataSelector));

    public backSideDataSelector$: Observable<ICardValueData[]> =
        this.store.pipe(select(backSideDataSelector));

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

    public toggleTableLockingStatus(isLocked?: boolean): void {
        this.store.dispatch({
            isLocked,
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

    public dispatchReorderColumn(reorderAction: ITableReorderAction): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_REORDER_CHANGE,
            reorderAction,
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

    public dispatchSearchMinimalUnitList(text: string): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SEARCH_MINIMAL_UNIT_LIST,
            text,
        });
    }

    public loadNextMinimalListPage(): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_FETCH_NEXT_MINIMAL_UNIT_LIST,
        });
    }

    public loadNextStopsPage(): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_FETCH_NEXT_STOPS_PAGE,
        });
    }

    public loadUnitsOnPageChange(unitId: string): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_GET_MILES_DETAILS_NEW_PAGE_ON_NEW_PAGE,
            unitId,
        });
    }

    public navigateToMilesDetails(unitId: string): void {
        this.router.navigate([
            `/${eMilesRouting.BASE}/${eMilesRouting.MAP}/${unitId}`,
        ]);
    }

    public dispatchUnitMapData(unitMapLocations: MilesStopItemResponse): void {
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

    public dispatchSearchChange(query: string[]): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_SEARCH_FILTER_CHANGED,
            query,
        });
    }

    public dispatchOpenColumnsModal(): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_OPEN_COLUMNS_MODAL,
        });
    }

    public dispatchResetFilters(): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_RESET_FILTERS,
        });
    }

    public dispatchGetMiles(): void {
        this.store.dispatch({
            type: MilesStoreConstants.ACTION_GET_MILES,
        });
    }
}
