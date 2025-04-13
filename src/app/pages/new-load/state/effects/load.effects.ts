import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// rxjs
import { exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';

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

// Models
import { LoadTemplateListResponse, LoadListResponse } from 'appcoretruckassist';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eLoadRouting } from '@pages/new-load/enums';

// Interfaces
import { IStateFilters } from '@shared/interfaces';

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

    private getLoadData(
        mode: string,
        isFilterChange: boolean,
        filters: IStateFilters
    ): Observable<{
        loadResponse: LoadTemplateListResponse | LoadListResponse;
        dispatcherFilters: any[];
        statusFilters: any[];
    }> {
        const tabValue = eLoadStatusType[mode];
        const isTemplate = tabValue === eLoadStatusType.Template;

        const loadRequest$ = isTemplate
            ? this.loadService.getLoadTemplateList(filters)
            : this.loadService.getLoadList(tabValue, filters);

        // On filter change or on template we don't have to update filter dropdown list
        const dispatcherFilters$ =
            isTemplate || isFilterChange
                ? of([])
                : this.loadService.getDispatcherFilters(tabValue);

        const statusFilters$ =
            isTemplate || isFilterChange
                ? of([])
                : this.loadService.getStatusFilters(tabValue);

        return forkJoin({
            loadResponse: loadRequest$,
            dispatcherFilters: dispatcherFilters$,
            statusFilters: statusFilters$,
        });
    }

    public getLoadList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                LoadActions.getLoadsPayload,
                LoadActions.getLoadsPayloadOnTabTypeChange
            ),
            withLatestFrom(
                this.store.select(LoadSelectors.selectedTabSelector),
                this.store.select(LoadSelectors.filtersSelector)
            ),
            exhaustMap(([action, mode, filters]) =>
                this.getLoadData(mode, false, filters).pipe(
                    map(
                        ({
                            loadResponse,
                            dispatcherFilters,
                            statusFilters,
                        }) => {
                            this.store.dispatch(
                                LoadActions.setFilterDropdownList({
                                    dispatcherFilters,
                                    statusFilters,
                                })
                            );

                            return LoadActions.getLoadsPayloadSuccess({
                                payload: loadResponse,
                            });
                        }
                    )
                )
            )
        )
    );

    public getLoadsOnFilterChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                LoadActions.onFiltersChange,
                LoadActions.onSeachFilterChange
            ),
            withLatestFrom(
                this.store.select(LoadSelectors.selectedTabSelector),
                this.store.select(LoadSelectors.filtersSelector)
            ),
            exhaustMap(([action, mode, filters]) =>
                this.getLoadData(mode, true, filters).pipe(
                    map(({ loadResponse }) =>
                        LoadActions.getLoadsPayloadSuccess({
                            payload: loadResponse,
                        })
                    )
                )
            )
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
