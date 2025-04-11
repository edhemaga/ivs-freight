import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

// Store
import { Store } from '@ngrx/store';

// Actions
import * as LoadActions from '@pages/new-load/state/actions/load.actions';

// Service
import { LoadService } from '@shared/services';

// Helpers
import { LoadHelper } from '@pages/new-load/utils/helpers';

@Injectable()
export class LoadEffect {
    constructor(
        private actions$: Actions,
        private loadService: LoadService,
        private store: Store
    ) {}

    public getLoadList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActions.getLoadsPayload),
            exhaustMap((action) =>
                // TODO: Should we use new load service maybe?
                this.loadService.getLoadList({}).pipe(
                    map((response) => {
                        const loads = LoadHelper.loadMapper(
                            response.pagination.data
                        );
                        return LoadActions.getLoadsPayloadSuccess({
                            payload: response,
                        });
                    })
                )
            )
        )
    );
}
