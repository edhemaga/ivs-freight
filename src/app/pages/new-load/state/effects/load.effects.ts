import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';

// Store
import { Store } from '@ngrx/store';

// Actions
import * as LoadActions from '@pages/new-load/state/actions/load.actions';

// Service
import { LoadService } from '@pages/new-load/services/load.service';

// Selector
import * as LoadSelectors from '@pages/new-load/state/selectors/load.selectors';

// Helpers
import { LoadHelper } from '@pages/new-load/utils/helpers';

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
                this.store.select(LoadSelectors.selectedTabValueSelector)
            ),
            exhaustMap(([action, mode]) => {
                console.log('Trying to update load list');

                const request$ =
                    mode === eLoadStatusType.Template
                        ? this.loadService.getLoadTemplateList()
                        : this.loadService.getLoadList(mode);

                // TODO: Use this request somehow
                if (mode === eLoadStatusType.Template) {
                    return this.loadService.getLoadTemplateList().pipe(
                        map((response) => {
                            const loads = LoadHelper.loadMapper(
                                response.pagination.data
                            );

                            return LoadActions.getLoadsPayloadSuccess({
                                payload: response,
                            });
                        })
                    );
                }

                return this.loadService.getLoadList(mode).pipe(
                    map((response) => {
                        const loads = LoadHelper.loadMapper(
                            response.pagination.data
                        );

                        return LoadActions.getLoadsPayloadSuccess({
                            payload: response,
                        });
                    })
                );
            })
        )
    );
}
