import { Injectable } from '@angular/core';

// NgRx Imports
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, exhaustMap, take } from 'rxjs/operators';

// Actions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';

// Services
import { MilesService } from 'appcoretruckassist';

// Enums and Selectors
import { eMileTabs } from '@pages/miles/enums';
import { selectSelectedTab } from '../selectors/miles.selectors';

// Utils
import { MilesMapper } from '@pages/miles/utils';

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
        revenueTo?: number
    ) {
        const tabValue = tab === eMileTabs.Active ? 1 : 0;
        return this.milesService
            .apiMilesListGet(
                null,
                tabValue,
                dateFrom,
                dateTo,
                [],
                revenueFrom,
                revenueTo
            )
            .pipe(
                map((response) =>
                    MilesAction.loadMilesSuccess({
                        miles: MilesMapper(response.pagination.data)
                    })
                ),
                catchError((error) =>
                    of(MilesAction.getLoadsPayloadError({ error }))
                )
            );
    }

    // Effect to get initial miles data default to Active tab and no date filters
    public getInitalMilesList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.getLoadsPayload),
            exhaustMap(() => this.fetchMilesData(eMileTabs.Active, null, null))
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
            ofType(MilesAction.filters),
            exhaustMap((action) => {
                const { filters } = action;
                const { dateFrom, dateTo, revenueFrom, revenueTo } = filters;
                
                // TODO: Maybe this is not good, check
                return this.store.select(selectSelectedTab).pipe(
                    take(1), // Get the current selected tab only once
                    exhaustMap((selectedTab) => {
                        return this.fetchMilesData(
                            selectedTab,
                            dateFrom,
                            dateTo,
                            revenueFrom,
                            revenueTo
                        );
                    })
                );
            })
        )
    );
}
