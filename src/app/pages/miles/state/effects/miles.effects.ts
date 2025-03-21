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
}
