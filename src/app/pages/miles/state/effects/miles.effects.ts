import { Injectable } from '@angular/core';
import { combineLatest, of } from 'rxjs';

// NgRx Imports
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, exhaustMap, take, switchMap } from 'rxjs/operators';

// Actions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';

// Services
import { MilesService } from 'appcoretruckassist';

// Enums and Selectors
import { eMileTabs } from '@pages/miles/enums';
import {
    filterSelector,
    selectActiveUnitIndex,
    selectMilesItems,
    selectSelectedTab,
} from '@pages/miles/state/selectors/miles.selector';

// Utils
import { MilesHelper } from '@pages/miles/utils/helpers';

@Injectable()
export class MilesEffects {
    constructor(
        private actions$: Actions,
        private milesService: MilesService,
        private store: Store
    ) {}

    private fetchMilesData() {
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
                        map((response) =>
                            MilesAction.loadMilesSuccess({
                                miles: MilesHelper.milesMapper(
                                    response.pagination.data
                                ),
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
            exhaustMap(() => this.fetchMilesData())
        )
    );

    public loadInitialUnitDetails = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.getInitalUnitDetails),
            exhaustMap(() =>
                this.store.select(selectMilesItems).pipe(
                    // Select items from the store
                    take(1), // Take only the first emission (to avoid subscribing to the store indefinitely)
                    switchMap((milesItems) => {
                        const firstItemId =
                            milesItems.length > 0
                                ? milesItems[0].truckId
                                : null; // Get the truckId of the first item

                        if (!firstItemId) {
                            return of(MilesAction.getLoadsPayloadError()); // Handle case where there are no items
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
                                catchError(() =>
                                    of(MilesAction.getLoadsPayloadError())
                                )
                            );
                    })
                )
            )
        )
    );

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
