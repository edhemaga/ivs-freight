import { Injectable } from '@angular/core';

// NgRx Imports
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, exhaustMap, take } from 'rxjs/operators';

// Actions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';

// Services
import { MilesService } from 'appcoretruckassist';

// Enums and Selectors
import { eMileTabs } from '@pages/miles/enums';
import { selectSelectedTab } from '@pages/miles/state/selectors/miles.selector';

// Utils
import { MilesHelper } from '@pages/miles/utils/helpers';
import { of } from 'rxjs';

@Injectable()
export class MilesEffects {
    constructor(
        private actions$: Actions,
        private milesService: MilesService,
        private store: Store
    ) {}

    // Centralized method to fetch miles data based on the tab and filters
    private fetchMilesData(
        tab: eMileTabs,
        dateFrom: string | null,
        dateTo: string | null,
        revenueFrom?: number,
        revenueTo?: number,
        states?: string[]
    ) {
        const tabValue = tab === eMileTabs.ACTIVE ? 1 : 0;
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
    }

    // Effect to get initial miles data default to Active tab and no date filters
    public getInitalMilesList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.getLoadsPayload),
            exhaustMap(() => this.fetchMilesData(eMileTabs.ACTIVE, null, null))
        )
    );

    // Effect to fetch miles data on tab change
    public getMilesListOnTabChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.milesTabChange),
            exhaustMap((action) => {
                const tab = action.selectedTab;
                return this.fetchMilesData(tab, null, null);
            })
        )
    );

    // Effect to fetch miles data on filter change
    public getMilesListOnFilterChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.changeFilters),
            exhaustMap((action) => {
                const { filters } = action || {};
                const { dateFrom, dateTo, revenueFrom, revenueTo, states } =
                    filters;
                // TODO: Maybe this is not good, check
                return this.store.select(selectSelectedTab).pipe(
                    take(1), // Get the current selected tab only once
                    exhaustMap((selectedTab) => {
                        return this.fetchMilesData(
                            selectedTab,
                            dateFrom,
                            dateTo,
                            revenueFrom,
                            revenueTo,
                            states
                        );
                    })
                );
            })
        )
    );

    // Get active unit
    public getSelectedUnit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.getMilesDetails),
            exhaustMap((action) => {
                // TODO: Add dynamic unit params
                return this.milesService.apiMilesUnitGet(null, null, 368).pipe(
                    map((response) =>
                        MilesAction.getTotalMilesDetails({
                            milesDetails: response,
                        })
                    ),
                    catchError(() => of(MilesAction.getLoadsPayloadError()))
                );
            })
        )
    );
}
