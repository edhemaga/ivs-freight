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

// functions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';

// services
import { MilesService } from 'appcoretruckassist';

// selectors
import {
    activeUnitIdSelector,
    activeViewModeSelector,
    currentPageSelector,
    currentStopsPageSelector,
    filterSelector,
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
import { eActiveViewMode } from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';

// intefaces
import { IMilesModel } from '@pages/miles/interface';
import { MilesStoreConstants } from '@pages/miles/utils/constants';

@Injectable()
export class MilesEffects {
    constructor(
        private actions$: Actions,
        private milesService: MilesService,
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
                        tableSettings.sortKey
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

    public loadMilesEffect$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                MilesAction.milesTabChange,
                MilesAction.changeFilters,
                MilesAction.tableSortingChange
            ),
            exhaustMap(() =>
                this.store.select(activeViewModeSelector).pipe(
                    take(1),
                    switchMap((activeViewMode) => this.fetchMilesData())
                )
            )
        )
    );

    public loadInitialUnitDetailsOnPageResolver$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.getInitalUnitDetailsOnRouteChange),
            exhaustMap((action) =>
                this.milesService
                    .apiMilesUnitGet(
                        action.unitId,
                        null,
                        null,
                        null,
                        1,
                        MilesStoreConstants.STOPS_LIST_RESULTS_PER_PAGE
                    )
                    .pipe(
                        map((unitResponse) =>
                            MilesAction.setUnitDetails({
                                details: unitResponse,
                            })
                        ),
                        catchError(() => {
                            this.router.navigate(['tools/miles/list']);
                            return of(MilesAction.getLoadsPayloadError());
                        })
                    )
            )
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
                                map((unitResponse) =>
                                    MilesAction.setUnitDetails({
                                        details: unitResponse,
                                    })
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
                                tableSettings.sortKey
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
}
