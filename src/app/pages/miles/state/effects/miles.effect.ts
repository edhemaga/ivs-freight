import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
    catchError,
    map,
    exhaustMap,
    take,
    switchMap,
    startWith,
    mergeMap,
} from 'rxjs/operators';

// Actions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';

// Services
import { MilesService } from 'appcoretruckassist';

// Selectors & Helpers
import {
    activeViewModeSelector,
    detailsSelector,
    filterSelector,
    pageSelector,
    selectMilesItems,
    selectSelectedTab,
    tableSettingsSelector,
    unitsPaginationSelector,
} from '@pages/miles/state/selectors/miles.selector';

// Helpers
import { MilesHelper } from '@pages/miles/utils/helpers';

// Enums
import { ArrowActionsStringEnum, eActiveViewMode } from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';

// Inteface
import { IMilesModel } from '@pages/miles/interface';

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
                        tableSettings.sortKey,
                        tableSettings.sortDirection
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
            .apiMilesUnitGet(null, null, null, firstItemId)
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

    public getFollowingUnitDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.getFollowingUnit),
            exhaustMap(({ getFollowingUnitDirection }) =>
                combineLatest([
                    this.store.select(selectMilesItems),
                    this.store.select(unitsPaginationSelector),
                ]).pipe(
                    take(1),
                    switchMap(([milesItems, unitsPagination]) => {
                        // User reached last item in miles list, fetch new list
                        if (
                            unitsPagination.isLastInCurrentList &&
                            getFollowingUnitDirection ===
                                ArrowActionsStringEnum.NEXT
                        ) {
                            return this.loadMoreMiles(
                                unitsPagination.currentPage + 1,
                                milesItems.length
                            );
                        }

                        const {
                            index,
                            isFirst,
                            isLast,
                            truckId,
                            isLastInCurrentList,
                        } = MilesHelper.findAdjacentId(
                            milesItems,
                            unitsPagination.activeUnitIndex,
                            getFollowingUnitDirection,
                            unitsPagination.totalResultsCount
                        );

                        return this.milesService
                            .apiMilesUnitGet(null, null, null, truckId)
                            .pipe(
                                map((unitResponse) =>
                                    MilesAction.setFollowingUnitDetails({
                                        unitResponse,
                                        index,
                                        isFirst,
                                        isLast,
                                        isLastInCurrentList,
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

    public searchUnitStops$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.onSearchChange),
            exhaustMap(() =>
                combineLatest([
                    this.store.select(unitsPaginationSelector),
                    this.store.select(detailsSelector),
                ]).pipe(
                    take(1),
                    switchMap(([unitsPagination, details]) => {
                        return this.milesService
                            .apiMilesUnitGet(
                                null,
                                unitsPagination.search,
                                null,
                                details.id
                            )
                            .pipe(
                                map((unitResponse) =>
                                    MilesAction.setFollowingUnitDetails({
                                        unitResponse,
                                        index: unitsPagination.activeUnitIndex,
                                        isFirst:
                                            unitsPagination.activeUnitIndex ===
                                            0,
                                        isLast:
                                            unitsPagination.activeUnitIndex ===
                                            unitsPagination.totalResultsCount -
                                                1,
                                        isLastInCurrentList:
                                            unitsPagination.isLastInCurrentList,
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

    private loadMoreMiles(page: number, currentLength: number) {
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
                        page,
                        null,
                        null,
                        tableSettings.sortKey,
                        tableSettings.sortDirection
                    )
                    .pipe(
                        switchMap((response) => {
                            const miles = MilesHelper.milesMapper(
                                response.pagination.data
                            );
                            const newTruckId = miles[0]?.truckId;
                            const hasOnlyOneResult = miles.length === 1;

                            return this.milesService
                                .apiMilesUnitGet(null, null, null, newTruckId)
                                .pipe(
                                    mergeMap((unitResponse) => [
                                        MilesAction.updateMilesList({ miles }),
                                        MilesAction.setFollowingUnitDetails({
                                            unitResponse,
                                            index: currentLength,
                                            isFirst: true,
                                            isLast: hasOnlyOneResult,
                                            isLastInCurrentList:
                                                hasOnlyOneResult,
                                        }),
                                    ])
                                );
                        }),
                        catchError(() => of(MilesAction.getLoadsPayloadError()))
                    );
            })
        );
    }

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
                                2,
                                null,
                                tableSettings.sortKey,
                                tableSettings.sortDirection
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
}
