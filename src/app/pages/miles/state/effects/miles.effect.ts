import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import {
    combineLatest,
    Observable,
    of,
    catchError,
    map,
    exhaustMap,
    take,
    switchMap,
    startWith,
    distinctUntilChanged,
    merge,
    filter,
    withLatestFrom,
} from 'rxjs';

// functions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';

// services
import { MilesService } from 'appcoretruckassist';

// selectors
import {
    activeViewModeSelector,
    currentPageSelector,
    filterSelector,
    minimalListSelector,
    pageSelector,
    searchTextSelector,
    selectMilesItems,
    selectSelectedTab,
    tableSettingsSelector,
    totalMinimalListCountSelector,
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
        private store: Store
    ) {}

    private fetchMilesData(fetchInitialUnitDetails = false): Observable<
        | Action<string>
        | ({
              miles: IMilesModel[];
              totalResultsCount: number;
          } & Action<string>)
    > {
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
                        map((response) => {
                            const miles = MilesHelper.milesMapper(
                                response.pagination.data
                            );
                            return {
                                miles,
                                action: MilesAction.loadMilesSuccess({
                                    miles,
                                    totalResultsCount:
                                        response.pagination.count,
                                }),
                            };
                        }),
                        catchError(() =>
                            of({
                                miles: [],
                                action: MilesAction.getLoadsPayloadError(),
                            })
                        ),
                        switchMap(({ miles, action }) =>
                            fetchInitialUnitDetails
                                ? this.fetchInitialUnitDetails(miles).pipe(
                                      startWith(action)
                                  )
                                : of(action)
                        )
                    );
            })
        );
    }

    private fetchInitialUnitDetails(
        milesItems: IMilesModel[]
    ): Observable<Action<string>> {
        const firstItemId = milesItems?.[0]?.truckId;
        if (!firstItemId) return of(MilesAction.getLoadsPayloadError());

        return this.milesService
            .apiMilesUnitGet(firstItemId, null, null, null)
            .pipe(
                map((unitResponse) =>
                    MilesAction.setUnitDetails({
                        details: unitResponse,
                        isLast: milesItems.length === 1,
                    })
                ),
                catchError(() => of(MilesAction.getLoadsPayloadError()))
            );
    }

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
                    switchMap((activeViewMode) =>
                        this.fetchMilesData(
                            activeViewMode ===
                                eActiveViewMode[eActiveViewMode.Map]
                        )
                    )
                )
            )
        )
    );

    public loadInitialUnitDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.getInitalUnitDetails),
            exhaustMap(() =>
                this.store.select(selectMilesItems).pipe(
                    take(1),
                    switchMap((milesItems) =>
                        this.fetchInitialUnitDetails(milesItems)
                    )
                )
            )
        )
    );

    public getUnitOnSelection$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.onUnitSelection),
            exhaustMap((action) => {
                const { unit } = action;
                return this.fetchInitialUnitDetails([unit]);
            })
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
            filter(([_, __, ___, minimalList, totalCount]) => {
                return minimalList.length < totalCount;
            }),
            exhaustMap(([_, currentPage, searchText]) =>
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
