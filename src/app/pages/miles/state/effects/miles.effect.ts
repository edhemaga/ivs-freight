import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Router } from '@angular/router';

import {
    combineLatest,
    Observable,
    of,
    catchError,
    map,
    exhaustMap,
    take,
    switchMap,
    distinctUntilChanged,
    merge,
    filter,
    withLatestFrom,
    mergeMap,
    from,
} from 'rxjs';

// components
import { CardColumnsModalComponent } from '@shared/components/card-columns-modal/card-columns-modal.component';

// functions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';

// services
import {
    MilesService,
    MilesStopSortBy,
    RoutingService,
} from 'appcoretruckassist';
import { ModalService } from '@shared/services';

// selectors
import {
    activeUnitIdSelector,
    activeViewModeSelector,
    backSideDataSelector,
    currentPageSelector,
    currentStopsPageSelector,
    filterSelector,
    frontSideDataSelector,
    minimalListSelector,
    pageSelector,
    searchTextSelector,
    selectSelectedTab,
    stopsSearchSelector,
    stopsSelector,
    tableSettingsSelector,
    totalMinimalListCountSelector,
    totalStopsCountSelector,
} from '@pages/miles/state/selectors/miles.selector';

// helpers
import { MilesHelper } from '@pages/miles/utils/helpers';

// enums
import { eActiveViewMode, TableStringEnum } from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';
import { eMilesCardData } from '@pages/miles/pages/miles-card/enums';

// interfaces
import { ICardValueData } from '@shared/interfaces';

// constants
import { MilesStoreConstants } from '@pages/miles/utils/constants';

// configs
import { MilesCardDataConfig } from '@pages/miles/pages/miles-card/utils/configs/miles-card-data.config';

@Injectable()
export class MilesEffects {
    constructor(
        private actions$: Actions,
        private milesService: MilesService,
        private routingService: RoutingService,
        private modalService: ModalService,
        private store: Store,
        private router: Router
    ) {}

    private fetchMilesData(): Observable<Action<string>> {
        return combineLatest([
            this.store.select(selectSelectedTab),
            this.store.select(filterSelector),
            this.store.select(tableSettingsSelector),
        ]).pipe(
            take(1),
            switchMap(([selectedTab, filters, tableSettings]) => {
                const tabValue = Number(selectedTab === eMileTabs.ACTIVE);
                const searchQuery = filters.searchQuery ?? [];

                return this.milesService
                    .apiMilesListGet(
                        null,
                        tabValue,
                        filters.dateFrom,
                        filters.dateTo,
                        filters.states,
                        filters.revenueFrom,
                        filters.revenueTo,
                        null,
                        null,
                        null,
                        null,
                        tableSettings.sortDirection,
                        tableSettings.sortKey as MilesStopSortBy,
                        searchQuery[0],
                        searchQuery[1],
                        searchQuery[2]
                    )
                    .pipe(
                        switchMap((response) => {
                            const miles = MilesHelper.milesMapper(
                                response.pagination.data
                            );
                            const firstUnitId = miles?.[0]?.truckId;

                            const milesAction = MilesAction.loadMilesSuccess({
                                miles,
                                totalResultsCount: response.pagination.count,
                            });

                            if (!firstUnitId) {
                                return of(milesAction);
                            }

                            return this.milesService
                                .apiMilesUnitGet(
                                    firstUnitId,
                                    null,
                                    null,
                                    null,
                                    1,
                                    MilesStoreConstants.STOPS_LIST_RESULTS_PER_PAGE
                                )
                                .pipe(
                                    mergeMap((unitResponse) =>
                                        from([
                                            milesAction,
                                            MilesAction.setUnitDetails({
                                                details: unitResponse,
                                            }),
                                            MilesAction.getUnitMapData({
                                                unitMapLocations:
                                                    unitResponse.stops.data,
                                            }),
                                        ])
                                    ),
                                    catchError(() =>
                                        from([
                                            milesAction,
                                            MilesAction.getLoadsPayloadError(),
                                        ])
                                    )
                                );
                        }),
                        catchError(() => of(MilesAction.getLoadsPayloadError()))
                    );
            })
        );
    }

    public loadMilesEffect$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                MilesAction.milesTabChange,
                MilesAction.changeFilters,
                MilesAction.tableSortingChange,
                MilesAction.onSeachFilterChange
            ),
            exhaustMap(() =>
                this.store.select(activeViewModeSelector).pipe(
                    take(1),
                    switchMap((activeViewMode) => this.fetchMilesData())
                )
            )
        )
    );

    public getUnitMapData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.getUnitMapData),
            exhaustMap((action) => {
                const { unitMapLocations } = action || {};

                const mapLocations = JSON.stringify(
                    unitMapLocations.map(({ longitude, latitude }) => ({
                        longitude,
                        latitude,
                    }))
                );

                return this.routingService.apiRoutingGet(mapLocations).pipe(
                    map((unitMapRoutes) => {
                        return MilesAction.getUnitMapDataSuccess({
                            unitMapRoutes,
                        });
                    }),
                    catchError(() => of(MilesAction.getLoadsPayloadError()))
                );
            })
        )
    );

    public setUnitMapData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.getUnitMapDataSuccess),
            map(() => MilesAction.setUnitMapData())
        )
    );

    public getMapStopData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.getMapStopData),
            exhaustMap((action) => {
                const { stopId } = action || {};

                return this.milesService.apiMilesUnitStopIdGet(stopId).pipe(
                    map((unitStopData) => {
                        return MilesAction.getMapStopDataSuccess({
                            unitStopData,
                        });
                    }),
                    catchError(() => of(MilesAction.getLoadsPayloadError()))
                );
            })
        )
    );

    public updateUnitMapDataOnListScroll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.updateUnitDetails),
            withLatestFrom(this.store.select(stopsSelector)),
            map(([action, stops]) =>
                MilesAction.getUnitMapData({
                    unitMapLocations: stops,
                })
            )
        )
    );

    public fetchUnitStopsOnScroll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.fetchNextStopsPage),
            withLatestFrom(
                this.store.select(stopsSelector),
                this.store.select(totalStopsCountSelector),
                this.store.select(currentStopsPageSelector),
                this.store.select(stopsSearchSelector),
                this.store.select(activeUnitIdSelector)
            ),
            // Call API if we aren't on last page and there are more items to load
            filter(([action, stopsSelector, totalCount]) => {
                return stopsSelector.length < totalCount;
            }),
            exhaustMap(
                ([
                    action,
                    stopsSelector,
                    totalPage,
                    currentPage,
                    searchString,
                    activeUnitId,
                ]) => {
                    return this.milesService
                        .apiMilesUnitGet(
                            activeUnitId,
                            null,
                            null,
                            null,
                            currentPage + 1,
                            MilesStoreConstants.STOPS_LIST_RESULTS_PER_PAGE,
                            null,
                            null,
                            null,
                            null,
                            searchString
                        )
                        .pipe(
                            map((unitResponse) =>
                                MilesAction.updateUnitDetails({
                                    details: unitResponse,
                                })
                            ),
                            catchError(() =>
                                of(MilesAction.getLoadsPayloadError())
                            )
                        );
                }
            )
        )
    );

    public loadInitialUnitDetailsOnPageResolver$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.getInitalUnitDetailsOnRouteChange),
            exhaustMap((action) => {
                return this.milesService
                    .apiMilesUnitGet(
                        action.unitId,
                        null,
                        null,
                        null,
                        1,
                        MilesStoreConstants.STOPS_LIST_RESULTS_PER_PAGE
                    )
                    .pipe(
                        mergeMap((unitResponse) =>
                            from([
                                MilesAction.setUnitDetails({
                                    details: unitResponse,
                                }),
                                MilesAction.getUnitMapData({
                                    unitMapLocations: unitResponse.stops.data,
                                }),
                            ])
                        ),
                        catchError(() => {
                            this.router.navigate(['tools/miles']);

                            return of(MilesAction.getLoadsPayloadError());
                        })
                    );
            })
        )
    );

    public loadNextPageOnSearchChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.onSearchChange),
            switchMap((action) =>
                combineLatest([
                    this.store.select(activeUnitIdSelector).pipe(take(1)),
                ]).pipe(
                    switchMap(([activeUnitId]) => {
                        const searchText = action.search;

                        return this.milesService
                            .apiMilesUnitGet(
                                activeUnitId,
                                null,
                                null,
                                null,
                                1,
                                MilesStoreConstants.STOPS_LIST_RESULTS_PER_PAGE,
                                null,
                                null,
                                null,
                                null,
                                searchText
                            )
                            .pipe(
                                mergeMap((unitResponse) =>
                                    from([
                                        MilesAction.setUnitDetails({
                                            details: unitResponse,
                                        }),
                                        MilesAction.getUnitMapData({
                                            unitMapLocations:
                                                unitResponse.stops.data,
                                        }),
                                    ])
                                ),
                                catchError(() =>
                                    of(MilesAction.getLoadsPayloadError())
                                )
                            );
                    })
                )
            )
        )
    );

    public getMilesOnPageChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.pageChanges),
            exhaustMap(() => {
                return combineLatest([
                    this.store.select(selectSelectedTab),
                    this.store.select(filterSelector),
                    this.store.select(tableSettingsSelector),
                    this.store.select(pageSelector),
                ]).pipe(
                    take(1),
                    switchMap(([selectedTab, filters, tableSettings, page]) => {
                        const tabValue = Number(
                            selectedTab === eMileTabs.ACTIVE
                        );

                        return this.milesService
                            .apiMilesListGet(
                                null,
                                tabValue,
                                filters.dateFrom,
                                filters.dateTo,
                                filters.states,
                                filters.revenueFrom,
                                filters.revenueTo,
                                page,
                                null,
                                null,
                                null,
                                tableSettings.sortDirection,
                                tableSettings.sortKey as MilesStopSortBy
                            )
                            .pipe(
                                map((response) => {
                                    const miles = MilesHelper.milesMapper(
                                        response.pagination.data
                                    );
                                    return MilesAction.updateMilesList({
                                        miles,
                                    });
                                }),
                                catchError(() =>
                                    of(MilesAction.getLoadsPayloadError())
                                )
                            );
                    })
                );
            })
        )
    );

    // We will return only first page here once user switched to map view for the first time
    // From here we need to check if there are more pages to load them later on scroll
    // Or we will call this on search change
    public loadMinimalList$ = createEffect(() =>
        merge(
            this.store.select(activeViewModeSelector).pipe(
                distinctUntilChanged(),
                filter(
                    (selectedTab) =>
                        selectedTab === eActiveViewMode[eActiveViewMode.Map]
                ),
                map(() => MilesAction.searchMinimalUnitList({ text: null }))
            ),
            this.actions$.pipe(ofType(MilesAction.searchMinimalUnitList))
        ).pipe(
            exhaustMap(({ text }) =>
                this.milesService
                    .apiMilesListMinimalGet(
                        null,
                        MilesStoreConstants.MINIMAL_LIST_RESULTS_PER_PAGE,
                        null,
                        text
                    )
                    .pipe(
                        map((list) =>
                            MilesAction.setInitalMinimalList({ list, text })
                        ),
                        catchError(() => of(MilesAction.getMinimalListError()))
                    )
            )
        )
    );

    public loadNextMinimalListPageOnScroll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.fetchMinimalList),
            withLatestFrom(
                this.store.select(currentPageSelector),
                this.store.select(searchTextSelector),
                this.store.select(minimalListSelector),
                this.store.select(totalMinimalListCountSelector)
            ),
            // Call API if we aren't on last page and there are more items to load
            filter(([action, page, searchText, minimalList, totalCount]) => {
                return minimalList.length < totalCount;
            }),
            exhaustMap(([action, currentPage, searchText]) =>
                this.milesService
                    .apiMilesListMinimalGet(
                        currentPage + 1,
                        MilesStoreConstants.MINIMAL_LIST_RESULTS_PER_PAGE,
                        null,
                        searchText
                    )
                    .pipe(
                        map((list) =>
                            MilesAction.appendToMinimalList({ list })
                        ),
                        catchError(() => of(MilesAction.getLoadsPayloadError()))
                    )
            )
        )
    );

    public openColumnsModal$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.openColumnsModal),
            withLatestFrom(
                this.store.select(frontSideDataSelector),
                this.store.select(backSideDataSelector),
                this.store.select(selectSelectedTab)
            ),
            switchMap(([_, frontSideData, backSideData, selectSelectedTab]) => {
                const title =
                    selectSelectedTab === eMileTabs.ACTIVE
                        ? eMilesCardData.MILES_ACTIVE_TRUCK
                        : eMilesCardData.MILES_INACTIVE_TRUCK;

                const action = {
                    data: {
                        cardsAllData: MilesCardDataConfig.CARD_ALL_DATA,
                        front_side: frontSideData,
                        back_side: backSideData,
                        numberOfRows: frontSideData.length,
                        checked: true,
                    },
                    title,
                };

                return from(
                    this.modalService.openModal(
                        CardColumnsModalComponent,
                        { size: TableStringEnum.SMALL },
                        action
                    )
                ).pipe(
                    filter((result) => !!result),
                    map((result) =>
                        MilesAction.setColumnsModalResult({
                            frontSideData: result.selectedColumns.front_side
                                .slice(0, result.selectedColumns.numberOfRows)
                                .map(
                                    (front: ICardValueData) => front.inputItem
                                ),
                            backSideData: result.selectedColumns.back_side
                                .slice(0, result.selectedColumns.numberOfRows)
                                .map((back: ICardValueData) => back.inputItem),
                        })
                    )
                );
            })
        )
    );
}
