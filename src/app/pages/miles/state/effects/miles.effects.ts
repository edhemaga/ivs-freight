import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, exhaustMap } from 'rxjs/operators';

// Actions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';

// Services
import { MilesService } from 'appcoretruckassist';
import { eMileTabs } from '@pages/miles/enums';

@Injectable()
export class MilesEffects {
    constructor(
        private actions$: Actions,
        private milesService: MilesService
    ) {}

    public getInitalMilesList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.getLoadsPayload),
            exhaustMap(() => {
                return this.milesService.apiMilesListGet(null, 1).pipe(
                    map((response) => {
                        return MilesAction.getLoadsPayloadSuccess({
                            miles: response.pagination.data,
                        });
                    }),
                    catchError((error) => {
                        return of(MilesAction.getLoadsPayloadError({ error }));
                    })
                );
            })
        )
    );

    public getMilesListOnTabChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.milesTabChange),
            exhaustMap((tabs) => {
                const tab = tabs.selectedTab === eMileTabs.Active ? 1 : 0;

                return this.milesService
                    .apiMilesListGet(null, tab)
                    .pipe(
                        map((response) => {
                            return MilesAction.loadMilesSuccess({
                                miles: response.pagination.data,
                            });
                        }),
                        catchError((error) => {
                            console.error(error);
                            return of(
                                MilesAction.getLoadsPayloadError({ error })
                            );
                        })
                    );
            })
        )
    );

    public getMilesListOnFilterChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MilesAction.filters),
            exhaustMap((action) => {
                const { filters, selectedTab } = action;
                const { dateFrom, dateTo } = filters;
                const tab = selectedTab === eMileTabs.Active ? 1 : 0; 
                
                return this.milesService
                    .apiMilesListGet(null, tab, dateFrom, dateTo)
                    .pipe(
                        map((response) => {
                            return MilesAction.loadMilesSuccess({
                                miles: response.pagination.data,
                            });
                        }),
                        catchError((error) => {
                            console.error(error);
                            return of(
                                MilesAction.getLoadsPayloadError({ error })
                            );
                        })
                    );
            })
        )
    );
}
