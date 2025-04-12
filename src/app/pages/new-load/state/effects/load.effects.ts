import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// rxjs
import { exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

// ngrx
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

// Actions
import * as LoadActions from '@pages/new-load/state/actions/load.actions';

// Service
import { LoadService } from '@pages/new-load/services/load.service';
import { ModalService } from '@shared/services';

// Selector
import * as LoadSelectors from '@pages/new-load/state/selectors/load.selectors';

// Components
import { NewLoadModalComponent } from '@pages/new-load/pages/new-load-modal/new-load-modal.component';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eLoadRouting } from '@pages/new-load/enums';

@Injectable()
export class LoadEffect {
    constructor(
        // Services
        private modalService: ModalService,
        private loadService: LoadService,

        // Store
        private actions$: Actions,
        private store: Store,

        private router: Router
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

    public onOpenLoadModal$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LoadActions.onOpenLoadModal),
                map(({ modal }) =>
                    this.modalService.openModal(
                        NewLoadModalComponent,
                        {},
                        modal
                    )
                )
            ),
        { dispatch: false }
    );

    public goToLoadDetails$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LoadActions.onLoadDetailsAction),
                map(({ id }) => {
                    this.router.navigate([
                        `/${eLoadRouting.LIST}/${id}/${eLoadRouting.DETAILS}`,
                    ]);
                })
            ),
        { dispatch: false }
    );
}
