import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// Store
import { Action, Store } from '@ngrx/store';

// Models
import { LoadListResponse, LoadTemplateListResponse } from 'appcoretruckassist';

// Actions
import * as LoadActions from '@pages/new-load/state/actions/load.actions';

// Service
import { LoadService } from '@pages/new-load/services/load.service';

// Selector
import * as LoadSelectors from '@pages/new-load/state/selectors/load.selectors';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';

@Injectable()
export class LoadEffect {
    constructor(
        private actions$: Actions,
        private loadService: LoadService,
        private store: Store
    ) {}

    public getLoadList$ = createEffect(
        (): Observable<Action> =>
            this.actions$.pipe(
                ofType(
                    LoadActions.getLoadsPayload,
                    LoadActions.getLoadsPayloadOnTabTypeChange
                ),
                withLatestFrom(
                    this.store.select(LoadSelectors.selectedTabSelector)
                ),
                exhaustMap(([action, mode]): Observable<Action> => {
                    console.log('Trying to update load list');
                    const tabValue = eLoadStatusType[mode];

                    const request$: Observable<
                        LoadTemplateListResponse | LoadListResponse
                    > =
                        tabValue === eLoadStatusType.Template
                            ? this.loadService.getLoadTemplateList()
                            : this.loadService.getLoadList(tabValue);

                    return request$.pipe(
                        map((response): Action => {
                            return LoadActions.getLoadsPayloadSuccess({
                                payload: response,
                            });
                        })
                    );
                })
            )
    );
}
