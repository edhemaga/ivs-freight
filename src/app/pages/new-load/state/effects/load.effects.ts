import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { Injectable } from '@angular/core';

// Store
import { Store } from '@ngrx/store';

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

    public getLoadList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                LoadActions.getLoadsPayload,
                LoadActions.getLoadsPayloadOnTabTypeChange
            ),
            withLatestFrom(
                this.store.select(LoadSelectors.selectedTabSelector)
            ),
            exhaustMap(([action, mode]) => {
                const tabValue = eLoadStatusType[mode];
                const isTemplate = tabValue === eLoadStatusType.Template;

                const loadRequest$ = isTemplate
                    ? this.loadService.getLoadTemplateList()
                    : this.loadService.getLoadList(tabValue);

                const dispatcherFilters$ = isTemplate
                    ? of([])
                    : this.loadService.getDispatcherFilters(mode);

                const statusFilters$ = isTemplate
                    ? of([])
                    : this.loadService.getStatusFilters(mode);

                return forkJoin([
                    loadRequest$,
                    dispatcherFilters$,
                    statusFilters$,
                ]).pipe(
                    map(([loadResponse, dispatcherFilters, statusFilters]) =>
                        LoadActions.getLoadsPayloadSuccess({
                            payload: loadResponse,
                            dispatcherFilters,
                            statusFilters,
                        })
                    )
                );
            })
        )
    );
}
