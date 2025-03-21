import { Injectable } from '@angular/core';
import { combineLatest, of } from 'rxjs';

// NgRx Imports
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
    catchError,
    map,
    exhaustMap,
    take,
    switchMap,
    startWith,
} from 'rxjs/operators';

// Actions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';

// Services
import { MilesService } from 'appcoretruckassist';

// Enums and Selectors
import { eMileTabs } from '@pages/miles/enums';
import {
    activeViewModeSelector,
    filterSelector,
    selectActiveUnitIndex,
    selectMilesItems,
    selectSelectedTab,
} from '@pages/miles/state/selectors/miles.selector';

// Utils
import { MilesHelper } from '@pages/miles/utils/helpers';
import { eActiveViewMode } from '@shared/enums';

@Injectable()
export class MilesEffects {
    constructor(
        private actions$: Actions,
        private milesService: MilesService,
        private store: Store
    ) {}

    private fetchMilesData(fetchInitialUnitDetails: boolean = false) {
        return combineLatest([
            this.store.select(selectSelectedTab),
            this.store.select(filterSelector),
        ]).pipe(
            take(1),
            switchMap(([selectedTab, filters]) => {
                const { dateFrom, dateTo, revenueFrom, revenueTo, states } =
                    filters;
                const tabValue = selectedTab === eMileTabs.ACTIVE ? 1 : 0;

                return this.milesService
                    .apiMilesListGet(
                        null,
                        tabValue,
                        dateFrom,
                        dateTo,
                        states,
                        revenueFrom,
                        revenueTo
                    )
                    .pipe(
                        map((response) => {
                            const miles = MilesHelper.milesMapper(
                                response.pagination.data
                            );
                            return {
                                miles,
                                action: MilesAction.loadMilesSuccess({ miles }),
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

    private fetchInitialUnitDetails(milesItems: any[]) {
        return of(milesItems).pipe(
            take(1),
            switchMap((milesItems) => {
                // Take first item from list and get unit details for that id
                const firstItemId =
                    milesItems.length > 0 ? milesItems[0].truckId : null;

                if (!firstItemId) {
                    return of(MilesAction.getLoadsPayloadError());
                }

                return this.milesService
                    .apiMilesUnitGet(null, null, firstItemId)
                    .pipe(
                        map((unitResponse) =>
                            MilesAction.setUnitDetails({
                                details: unitResponse,
                                isLast: milesItems.length === 1,
                            })
                        ),
                        catchError(() => of(MilesAction.getLoadsPayloadError()))
                    );
            })
        );
    }

    public loadMilesEffect$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                MilesAction.getLoadsPayload,
                MilesAction.milesTabChange,
                MilesAction.changeFilters
            ),
            exhaustMap(() =>
                this.store.select(activeViewModeSelector).pipe(
                    take(1),
                    switchMap((activeViewMode) =>
                        // If we are on map view we need to get units again since list is changed
                        this.fetchMilesData(
                            activeViewMode ===
                                eActiveViewMode[eActiveViewMode.Map]
                        )
                    )
                )
            )
        )
    );

    // This is only for getting unit first time when user comes to map
    public loadInitialUnitDetails = createEffect(() =>
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

    // When the user navigates back and forth between units through the list, we need to fetch a new list to update the current items and refresh pagination.

    public getFollowingUnitDetails = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.getFollowingUnit),
            exhaustMap((action) =>
                combineLatest([
                    this.store.select(selectMilesItems),
                    this.store.select(selectActiveUnitIndex),
                ]).pipe(
                    take(1),
                    switchMap(([milesItems, activeUnitIndex]) => {
                        const { getFollowingUnitDirection } = action;

                        const { index, isFirst, isLast, truckId } =
                            MilesHelper.findAdjacentId(
                                milesItems,
                                activeUnitIndex,
                                getFollowingUnitDirection
                            );

                        return this.milesService
                            .apiMilesUnitGet(null, null, truckId)
                            .pipe(
                                map((unitResponse) =>
                                    MilesAction.setFollowingUnitDetails({
                                        unitResponse,
                                        index,
                                        isFirst,
                                        isLast,
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
}
